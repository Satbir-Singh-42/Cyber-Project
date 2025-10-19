import { createConnection, Socket } from 'net';

export interface PortScanResult {
  target: string;
  totalPorts: number;
  openPorts: OpenPort[];
  scanDuration: number;
  timestamp: Date;
}

export interface OpenPort {
  port: number;
  state: 'open' | 'closed' | 'filtered';
  service: string;
  version?: string;
  banner?: string;
}

const COMMON_SERVICES: { [key: number]: string } = {
  21: 'FTP',
  22: 'SSH',
  23: 'Telnet',
  25: 'SMTP',
  53: 'DNS',
  80: 'HTTP',
  110: 'POP3',
  135: 'RPC Endpoint Mapper',
  139: 'NetBIOS',
  143: 'IMAP',
  161: 'SNMP',
  389: 'LDAP',
  443: 'HTTPS',
  445: 'SMB',
  993: 'IMAPS',
  995: 'POP3S',
  1433: 'MSSQL',
  1521: 'Oracle',
  2049: 'NFS',
  3306: 'MySQL',
  3389: 'RDP',
  5432: 'PostgreSQL',
  5800: 'VNC HTTP',
  5900: 'VNC',
  6379: 'Redis',
  8080: 'HTTP-Alt',
  8443: 'HTTPS-Alt',
  9200: 'Elasticsearch',
  11211: 'Memcached',
  27017: 'MongoDB',
  50070: 'Hadoop'
};

export class PortService {
  private readonly MAX_SCAN_DURATION = 10000; // 10 seconds max
  private readonly DEFAULT_PORT_TIMEOUT = 1000; // 1 second per port (reduced from 2)

  async scanPorts(target: string, portRange: string = '1-1000', maxDuration?: number): Promise<PortScanResult> {
    const startTime = Date.now();
    const scanDeadline = startTime + (maxDuration || this.MAX_SCAN_DURATION);
    const ports = this.parsePortRange(portRange);
    const openPorts: OpenPort[] = [];

    // Validate target
    if (!this.isValidTarget(target)) {
      throw new Error('Invalid target address');
    }

    // Security check for localhost/private ranges
    if (this.isPrivateOrLocalhost(target)) {
      console.warn(`Scanning private/localhost target: ${target}`);
    }

    // Adaptive concurrency based on port count
    const concurrencyLimit = Math.min(50, Math.max(10, Math.floor(ports.length / 10)));
    const chunks = this.chunkArray(ports, concurrencyLimit);

    for (const chunk of chunks) {
      // Check if we've exceeded the scan deadline
      if (Date.now() >= scanDeadline) {
        console.warn(`Scan timeout reached after ${Date.now() - startTime}ms`);
        break;
      }

      const promises = chunk.map(port => this.scanPort(target, port, this.DEFAULT_PORT_TIMEOUT));
      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          openPorts.push(result.value);
        }
      });
      
      // Add small delay between chunks to be respectful
      if (chunks.indexOf(chunk) < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 50)); // Reduced from 100ms
      }
    }

    // Enhanced analysis of open ports
    this.analyzePortSecurity(openPorts);

    const scanDuration = Date.now() - startTime;

    return {
      target,
      totalPorts: ports.length,
      openPorts: openPorts.sort((a, b) => a.port - b.port),
      scanDuration,
      timestamp: new Date()
    };
  }

  private parsePortRange(portRange: string): number[] {
    const ports: number[] = [];
    
    if (portRange.includes(',')) {
      // Handle comma-separated ports: "80,443,8080"
      const portList = portRange.split(',');
      for (const port of portList) {
        const portNum = parseInt(port.trim());
        if (portNum >= 1 && portNum <= 65535) {
          ports.push(portNum);
        }
      }
    } else if (portRange.includes('-')) {
      // Handle port ranges: "1-1000"
      const [start, end] = portRange.split('-');
      const startPort = parseInt(start.trim());
      const endPort = parseInt(end.trim());
      
      if (startPort >= 1 && endPort <= 65535 && startPort <= endPort) {
        for (let port = startPort; port <= endPort; port++) {
          ports.push(port);
        }
      }
    } else {
      // Single port
      const portNum = parseInt(portRange.trim());
      if (portNum >= 1 && portNum <= 65535) {
        ports.push(portNum);
      }
    }

    return ports;
  }

  private isValidTarget(target: string): boolean {
    // Basic validation for IP addresses and hostnames
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    const hostnameRegex = /^[a-zA-Z0-9.-]+$/;
    
    return ipv4Regex.test(target) || hostnameRegex.test(target);
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private async scanPort(target: string, port: number, timeout: number = 1000): Promise<OpenPort | null> {
    return new Promise((resolve) => {
      const socket = new Socket();

      socket.setTimeout(timeout);

      socket.on('connect', async () => {
        socket.destroy();
        
        // Skip banner grabbing for faster results
        // (Banner grabbing can add 3+ seconds per port)
        
        resolve({
          port,
          state: 'open',
          service: COMMON_SERVICES[port] || 'Unknown',
        });
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(null);
      });

      socket.on('error', () => {
        socket.destroy();
        resolve(null);
      });

      socket.connect(port, target);
    });
  }

  private async getBanner(target: string, port: number): Promise<string | undefined> {
    return new Promise((resolve) => {
      const socket = new Socket();
      let banner = '';

      socket.setTimeout(3000);

      socket.on('connect', () => {
        // Send appropriate probe based on service
        const probe = this.getServiceProbe(port);
        if (probe) {
          socket.write(probe);
        }
      });

      socket.on('data', (data) => {
        banner += data.toString().trim();
        socket.destroy();
        resolve(banner || undefined);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(banner || undefined);
      });

      socket.on('error', () => {
        socket.destroy();
        resolve(undefined);
      });

      socket.connect(port, target);
    });
  }

  private getServiceProbe(port: number): string | null {
    switch (port) {
      case 21: // FTP
        return 'HELP\r\n';
      case 22: // SSH
        return 'SSH-2.0-Scanner\r\n';
      case 25: // SMTP
        return 'EHLO scanner\r\n';
      case 80: // HTTP
      case 8080:
        return 'GET / HTTP/1.0\r\n\r\n';
      case 443: // HTTPS
      case 8443:
        return 'GET / HTTP/1.0\r\n\r\n';
      case 110: // POP3
        return 'USER scanner\r\n';
      case 143: // IMAP
        return 'A001 CAPABILITY\r\n';
      default:
        return null;
    }
  }

  getCommonPorts(): number[] {
    return [21, 22, 23, 25, 53, 80, 110, 135, 139, 143, 161, 389, 443, 445, 993, 995, 1433, 1521, 2049, 3306, 3389, 5432, 5800, 5900, 6379, 8080, 8443, 9200, 11211, 27017, 50070];
  }

  private isPrivateOrLocalhost(target: string): boolean {
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipv4Regex.test(target)) {
      const parts = target.split('.').map(Number);
      // Check for private IP ranges
      return (parts[0] === 10) ||
             (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
             (parts[0] === 192 && parts[1] === 168) ||
             (parts[0] === 127) || // Localhost
             (parts[0] === 169 && parts[1] === 254); // Link-local
    }
    return target === 'localhost' || target.endsWith('.local');
  }

  private analyzePortSecurity(openPorts: OpenPort[]): void {
    openPorts.forEach(port => {
      // Mark potentially dangerous services
      const dangerousPorts = [21, 23, 135, 139, 445, 1433, 3306, 3389, 5432, 5900];
      if (dangerousPorts.includes(port.port)) {
        port.version = (port.version || '') + ' [HIGH RISK]';
      }
      
      // Add security notes for specific services
      if (port.port === 22 && port.banner?.includes('SSH-1')) {
        port.version = (port.version || '') + ' [VULNERABLE SSH VERSION]';
      }
      if (port.port === 21 && port.banner?.toLowerCase().includes('anonymous')) {
        port.version = (port.version || '') + ' [ANONYMOUS FTP]';
      }
    });
  }

  async quickScan(target: string): Promise<PortScanResult> {
    const commonPorts = this.getCommonPorts();
    // Quick scan with shorter timeout (5 seconds max)
    return this.scanPorts(target, commonPorts.join(','), 5000);
  }
}
