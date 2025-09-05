import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface KeyloggerDetectionResult {
  processesScanned: number;
  suspiciousProcesses: SuspiciousProcess[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  timestamp: Date;
}

export interface SuspiciousProcess {
  pid: number;
  name: string;
  command: string;
  riskScore: number;
  reasons: string[];
  user?: string;
  cpuUsage?: number;
  memoryUsage?: number;
}

const SUSPICIOUS_KEYWORDS = [
  'keylog', 'keystroke', 'capture', 'hook', 'monitor', 'record',
  'spy', 'stealth', 'hidden', 'invisible', 'backdoor', 'trojan'
];

const SUSPICIOUS_PROCESSES = [
  'keylogger', 'spyware', 'malware', 'rootkit', 'backdoor',
  'remote_access', 'rat', 'trojan', 'virus', 'worm'
];

const LEGITIMATE_PROCESSES = [
  'explorer.exe', 'chrome.exe', 'firefox.exe', 'notepad.exe',
  'code.exe', 'powershell.exe', 'cmd.exe', 'taskmgr.exe',
  'winlogon.exe', 'csrss.exe', 'lsass.exe', 'services.exe'
];

export class KeyloggerService {
  async detectKeyloggers(): Promise<KeyloggerDetectionResult> {
    const processes = await this.getRunningProcesses();
    const suspiciousProcesses: SuspiciousProcess[] = [];

    for (const process of processes) {
      const analysis = this.analyzeProcess(process);
      if (analysis.riskScore > 30) {
        suspiciousProcesses.push(analysis);
      }
    }

    const riskLevel = this.calculateOverallRisk(suspiciousProcesses);
    const recommendations = this.generateRecommendations(suspiciousProcesses, riskLevel);

    return {
      processesScanned: processes.length,
      suspiciousProcesses: suspiciousProcesses.sort((a, b) => b.riskScore - a.riskScore),
      riskLevel,
      recommendations,
      timestamp: new Date()
    };
  }

  private async getRunningProcesses(): Promise<any[]> {
    try {
      let command: string;
      const platform = process.platform;

      if (platform === 'win32') {
        command = 'wmic process get Name,ProcessId,CommandLine,PageFileUsage,WorkingSetSize /format:csv';
      } else if (platform === 'darwin' || platform === 'linux') {
        command = 'ps aux';
      } else {
        throw new Error('Unsupported platform for process monitoring');
      }

      const { stdout } = await execAsync(command);
      return this.parseProcessOutput(stdout, platform);
    } catch (error) {
      console.error('Error getting processes:', error);
      return [];
    }
  }

  private parseProcessOutput(output: string, platform: string): any[] {
    const processes: any[] = [];
    const lines = output.split('\n').filter(line => line.trim());

    if (platform === 'win32') {
      // Parse Windows WMIC output
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 4 && parts[1] && parts[2]) {
          processes.push({
            pid: parseInt(parts[2]) || 0,
            name: parts[1].trim(),
            command: parts[0] || '',
            memoryUsage: parseInt(parts[4]) || 0,
            user: 'unknown'
          });
        }
      }
    } else {
      // Parse Unix ps output
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].trim().split(/\s+/);
        if (parts.length >= 11) {
          processes.push({
            pid: parseInt(parts[1]) || 0,
            name: parts[10] || 'unknown',
            command: parts.slice(10).join(' '),
            cpuUsage: parseFloat(parts[2]) || 0,
            memoryUsage: parseFloat(parts[3]) || 0,
            user: parts[0]
          });
        }
      }
    }

    return processes;
  }

  private analyzeProcess(process: any): SuspiciousProcess {
    let riskScore = 0;
    const reasons: string[] = [];

    const processName = process.name.toLowerCase();
    const command = process.command.toLowerCase();

    // Check for suspicious keywords
    for (const keyword of SUSPICIOUS_KEYWORDS) {
      if (processName.includes(keyword) || command.includes(keyword)) {
        riskScore += 25;
        reasons.push(`Contains suspicious keyword: ${keyword}`);
      }
    }

    // Check for known suspicious process names
    for (const suspiciousName of SUSPICIOUS_PROCESSES) {
      if (processName.includes(suspiciousName)) {
        riskScore += 40;
        reasons.push(`Matches known suspicious process pattern: ${suspiciousName}`);
      }
    }

    // Check for hidden or system-like names
    if (this.looksLikeSystemProcess(processName) && !this.isLegitimateSystemProcess(processName)) {
      riskScore += 20;
      reasons.push('Mimics system process name');
    }

    // Check for unusual file extensions
    if (processName.endsWith('.tmp') || processName.endsWith('.dll') || 
        processName.includes('temp') || processName.includes('cache')) {
      riskScore += 15;
      reasons.push('Unusual process location or extension');
    }

    // Check for processes without proper paths
    if (!command.includes('\\') && !command.includes('/') && command.length > 0) {
      riskScore += 10;
      reasons.push('Process running without full path');
    }

    // Check for high resource usage (potential sign of monitoring activity)
    if (process.cpuUsage > 50) {
      riskScore += 10;
      reasons.push('High CPU usage');
    }

    // Check for random-looking names
    if (this.hasRandomName(processName)) {
      riskScore += 15;
      reasons.push('Random or obfuscated process name');
    }

    return {
      pid: process.pid,
      name: process.name,
      command: process.command,
      riskScore,
      reasons,
      user: process.user,
      cpuUsage: process.cpuUsage,
      memoryUsage: process.memoryUsage
    };
  }

  private looksLikeSystemProcess(name: string): boolean {
    const systemPatterns = [
      /^sys/, /^win/, /^microsoft/, /^windows/, /^service/,
      /\.exe$/, /^lsass/, /^csrss/, /^winlogon/
    ];
    return systemPatterns.some(pattern => pattern.test(name));
  }

  private isLegitimateSystemProcess(name: string): boolean {
    return LEGITIMATE_PROCESSES.some(legit => 
      name.toLowerCase().includes(legit.toLowerCase())
    );
  }

  private hasRandomName(name: string): boolean {
    // Check for patterns that suggest random generation
    const randomPatterns = [
      /^[a-z]{8,}\.exe$/, // Long random lowercase
      /^[A-Z]{5,}\.exe$/, // Long random uppercase
      /^[a-zA-Z0-9]{12,}\.exe$/, // Very long alphanumeric
      /^[a-f0-9]{8,}\.exe$/, // Hex-like names
    ];
    
    return randomPatterns.some(pattern => pattern.test(name));
  }

  private calculateOverallRisk(suspiciousProcesses: SuspiciousProcess[]): KeyloggerDetectionResult['riskLevel'] {
    if (suspiciousProcesses.length === 0) return 'low';

    const maxRiskScore = Math.max(...suspiciousProcesses.map(p => p.riskScore));
    const totalRiskScore = suspiciousProcesses.reduce((sum, p) => sum + p.riskScore, 0);

    if (maxRiskScore >= 80 || totalRiskScore >= 150) return 'critical';
    if (maxRiskScore >= 60 || totalRiskScore >= 100) return 'high';
    if (maxRiskScore >= 40 || totalRiskScore >= 60) return 'medium';
    return 'low';
  }

  private generateRecommendations(
    suspiciousProcesses: SuspiciousProcess[], 
    riskLevel: KeyloggerDetectionResult['riskLevel']
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'critical') {
      recommendations.push('URGENT: Immediately terminate suspicious processes');
      recommendations.push('Disconnect from network to prevent data exfiltration');
      recommendations.push('Run full system antivirus scan');
      recommendations.push('Contact your security team immediately');
    }

    if (riskLevel === 'high') {
      recommendations.push('Investigate suspicious processes immediately');
      recommendations.push('Consider isolating the system');
      recommendations.push('Run comprehensive malware scan');
    }

    if (suspiciousProcesses.length > 0) {
      recommendations.push('Monitor process activity closely');
      recommendations.push('Check process digital signatures');
      recommendations.push('Verify process locations and origins');
    }

    recommendations.push('Keep antivirus software updated');
    recommendations.push('Enable real-time protection');
    recommendations.push('Regularly monitor running processes');
    recommendations.push('Use application whitelisting if possible');

    return recommendations;
  }

  async terminateProcess(pid: number): Promise<boolean> {
    try {
      const command = process.platform === 'win32' 
        ? `taskkill /F /PID ${pid}`
        : `kill -9 ${pid}`;
        
      await execAsync(command);
      return true;
    } catch (error) {
      console.error('Error terminating process:', error);
      return false;
    }
  }
}
