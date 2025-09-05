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
  143: 'IMAP',
  443: 'HTTPS',
  993: 'IMAPS',
  995: 'POP3S',
  1433: 'MSSQL',
  3306: 'MySQL',
  3389: 'RDP',
  5432: 'PostgreSQL',
  5900: 'VNC',
  6379: 'Redis',
  8080: 'HTTP-Alt',
  8443: 'HTTPS-Alt',
  27017: 'MongoDB'
};

export class PortService {
  async scanPorts(target: string, portRange: string = '1-1000'): Promise<PortScanResult> {
    const startTime = Date.now();
    const ports = this.parsePortRange(portRange);
    const openPorts: OpenPort[] = [];

    // Validate target
    if (!this.isValidTarget(target)) {
      throw new Error('Invalid target address');
    }

    // Perform concurrent port scanning with limited concurrency
    const concurrencyLimit = 100;
    const chunks = this.chunkArray(ports, concurrencyLimit);

    for (const chunk of chunks) {
      const promises = chunk.map(port => this.scanPort(target, port));
      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          openPorts.push(result.value);
        }
      });
    }

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

  private async scanPort(target: string, port: number): Promise<OpenPort | null> {
    return new Promise((resolve) => {
      const socket = new Socket();
      const timeout = 2000; // 2 second timeout

      socket.setTimeout(timeout);

      socket.on('connect', async () => {
        socket.destroy();
        
        // Try to get banner information
        const banner = await this.getBanner(target, port);
        
        resolve({
          port,
          state: 'open',
          service: COMMON_SERVICES[port] || 'Unknown',
          banner
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
    return [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 1433, 3306, 3389, 5432, 5900, 6379, 8080, 8443, 27017];
  }

  async quickScan(target: string): Promise<PortScanResult> {
    const commonPorts = this.getCommonPorts();
    return this.scanPorts(target, commonPorts.join(','));
  }
}
