import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export interface FileIntegrityResult {
  directory: string;
  totalFiles: number;
  changes: FileChange[];
  statistics: {
    modified: number;
    added: number;
    deleted: number;
    unchanged: number;
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    criticalChanges: number;
    suspiciousPatterns: string[];
  };
  lastScan: Date;
}

export interface FileChange {
  type: 'added' | 'modified' | 'deleted';
  filePath: string;
  oldHash?: string;
  newHash?: string;
  size?: number;
  permissions?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons?: string[];
  timestamp: Date;
}

export interface MonitoredFileInfo {
  path: string;
  hash: string;
  size: number;
  lastModified: Date;
}

export class FileIntegrityService {
  private baseline: Map<string, MonitoredFileInfo> = new Map();

  async initializeBaseline(directory: string, recursive: boolean = true): Promise<void> {
    const files = await this.scanDirectory(directory, recursive);
    this.baseline.clear();
    
    for (const file of files) {
      this.baseline.set(file.path, file);
    }
  }

  async checkIntegrity(directory: string, recursive: boolean = true): Promise<FileIntegrityResult> {
    const currentFiles = await this.scanDirectory(directory, recursive);
    const changes: FileChange[] = [];
    const statistics = {
      modified: 0,
      added: 0,
      deleted: 0,
      unchanged: 0
    };

    // Create a map of current files for easier lookup
    const currentFileMap = new Map<string, MonitoredFileInfo>();
    currentFiles.forEach(file => currentFileMap.set(file.path, file));

    // Check for modifications and deletions
    for (const [filePath, baselineFile] of Array.from(this.baseline.entries())) {
      const currentFile = currentFileMap.get(filePath);
      
      if (!currentFile) {
        // File was deleted
        const riskLevel = this.assessFileRisk(filePath, 'deleted');
        changes.push({
          type: 'deleted',
          filePath,
          oldHash: baselineFile.hash,
          riskLevel,
          reasons: this.getChangeReasons(filePath, 'deleted'),
          timestamp: new Date()
        });
        statistics.deleted++;
      } else if (currentFile.hash !== baselineFile.hash) {
        // File was modified
        const riskLevel = this.assessFileRisk(filePath, 'modified');
        changes.push({
          type: 'modified',
          filePath,
          oldHash: baselineFile.hash,
          newHash: currentFile.hash,
          size: currentFile.size,
          riskLevel,
          reasons: this.getChangeReasons(filePath, 'modified'),
          timestamp: new Date()
        });
        statistics.modified++;
      } else {
        statistics.unchanged++;
      }
    }

    // Check for new files
    for (const currentFile of currentFiles) {
      if (!this.baseline.has(currentFile.path)) {
        const riskLevel = this.assessFileRisk(currentFile.path, 'added');
        changes.push({
          type: 'added',
          filePath: currentFile.path,
          newHash: currentFile.hash,
          size: currentFile.size,
          riskLevel,
          reasons: this.getChangeReasons(currentFile.path, 'added'),
          timestamp: new Date()
        });
        statistics.added++;
      }
    }

    // Assess risk level of changes
    const riskAssessment = this.assessRisk(changes);

    return {
      directory,
      totalFiles: currentFiles.length,
      changes: changes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      statistics,
      riskAssessment,
      lastScan: new Date()
    };
  }

  async updateBaseline(directory: string, recursive: boolean = true): Promise<void> {
    await this.initializeBaseline(directory, recursive);
  }

  private async scanDirectory(directory: string, recursive: boolean): Promise<MonitoredFileInfo[]> {
    const files: MonitoredFileInfo[] = [];

    try {
      const entries = await fs.readdir(directory, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isFile()) {
          try {
            const fileInfo = await this.getFileInfo(fullPath);
            files.push(fileInfo);
          } catch (error) {
            console.warn(`Skipping file ${fullPath}: ${error}`);
          }
        } else if (entry.isDirectory() && recursive) {
          // Skip hidden directories and common system directories
          if (!entry.name.startsWith('.') && 
              !['node_modules', '__pycache__', '.git', '.svn'].includes(entry.name)) {
            const subdirFiles = await this.scanDirectory(fullPath, recursive);
            files.push(...subdirFiles);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${directory}:`, error);
    }

    return files;
  }

  private async getFileInfo(filePath: string): Promise<MonitoredFileInfo> {
    const stats = await fs.stat(filePath);
    const hash = await this.calculateFileHash(filePath);

    return {
      path: filePath,
      hash,
      size: stats.size,
      lastModified: stats.mtime
    };
  }

  private async calculateFileHash(filePath: string): Promise<string> {
    const data = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async getFileContent(filePath: string): Promise<string> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return data;
    } catch (error) {
      throw new Error(`Cannot read file: ${error}`);
    }
  }

  async isFileText(filePath: string): Promise<boolean> {
    try {
      const buffer = await fs.readFile(filePath);
      const sample = buffer.slice(0, 1024);
      
      // Check for null bytes (common in binary files)
      for (let i = 0; i < sample.length; i++) {
        if (sample[i] === 0) return false;
      }
      
      // Check if most characters are printable ASCII
      let printableCount = 0;
      for (let i = 0; i < sample.length; i++) {
        const char = sample[i];
        if ((char >= 32 && char <= 126) || char === 9 || char === 10 || char === 13) {
          printableCount++;
        }
      }
      
      return printableCount / sample.length > 0.7;
    } catch {
      return false;
    }
  }

  getBaselineInfo(): { totalFiles: number; directories: string[] } {
    const directories = new Set<string>();
    for (const filePath of Array.from(this.baseline.keys())) {
      directories.add(path.dirname(filePath));
    }

    return {
      totalFiles: this.baseline.size,
      directories: Array.from(directories).sort()
    };
  }

  exportBaseline(): MonitoredFileInfo[] {
    return Array.from(this.baseline.values());
  }

  importBaseline(baseline: MonitoredFileInfo[]): void {
    this.baseline.clear();
    baseline.forEach(file => this.baseline.set(file.path, file));
  }

  private assessFileRisk(filePath: string, changeType: 'added' | 'modified' | 'deleted'): 'low' | 'medium' | 'high' | 'critical' {
    const fileName = path.basename(filePath).toLowerCase();
    const fileExt = path.extname(filePath).toLowerCase();
    const dirPath = path.dirname(filePath).toLowerCase();

    // Critical risk files
    if (fileName.includes('password') || fileName.includes('secret') || fileName.includes('key')) {
      return 'critical';
    }
    if (['.exe', '.dll', '.bat', '.cmd', '.ps1', '.sh'].includes(fileExt)) {
      return 'critical';
    }
    if (dirPath.includes('system32') || dirPath.includes('windows') || dirPath.includes('/etc/') || dirPath.includes('/bin/')) {
      return 'critical';
    }

    // High risk files
    if (['.config', '.ini', '.cfg', '.conf'].includes(fileExt)) {
      return 'high';
    }
    if (fileName.includes('config') || fileName.includes('setting')) {
      return 'high';
    }

    // Medium risk files
    if (['.js', '.py', '.php', '.sql', '.json'].includes(fileExt)) {
      return 'medium';
    }

    // Low risk for common file types
    if (['.txt', '.log', '.tmp', '.cache'].includes(fileExt)) {
      return 'low';
    }

    return 'medium';
  }

  private getChangeReasons(filePath: string, changeType: 'added' | 'modified' | 'deleted'): string[] {
    const reasons: string[] = [];
    const fileName = path.basename(filePath).toLowerCase();
    const fileExt = path.extname(filePath).toLowerCase();
    const dirPath = path.dirname(filePath).toLowerCase();

    if (changeType === 'added') {
      reasons.push('New file detected');
      if (['.exe', '.dll'].includes(fileExt)) {
        reasons.push('Executable file added - potential security risk');
      }
    } else if (changeType === 'modified') {
      if (fileName.includes('config')) {
        reasons.push('Configuration file modified');
      }
      if (fileName.includes('log')) {
        reasons.push('Log file updated');
      }
    } else if (changeType === 'deleted') {
      reasons.push('File removed from system');
      if (['.exe', '.dll'].includes(fileExt)) {
        reasons.push('System file deleted - potential integrity issue');
      }
    }

    return reasons;
  }

  private assessRisk(changes: FileChange[]): FileIntegrityResult['riskAssessment'] {
    const criticalChanges = changes.filter(c => c.riskLevel === 'critical').length;
    const highChanges = changes.filter(c => c.riskLevel === 'high').length;
    
    const suspiciousPatterns: string[] = [];
    
    // Detect mass file operations
    if (changes.length > 50) {
      suspiciousPatterns.push('Mass file operation detected');
    }
    
    // Detect executable changes
    const executableChanges = changes.filter(c => 
      path.extname(c.filePath).toLowerCase() === '.exe' ||
      path.extname(c.filePath).toLowerCase() === '.dll'
    ).length;
    
    if (executableChanges > 0) {
      suspiciousPatterns.push(`${executableChanges} executable file(s) modified`);
    }
    
    // Detect system file changes
    const systemFileChanges = changes.filter(c => 
      c.filePath.toLowerCase().includes('system32') ||
      c.filePath.toLowerCase().includes('windows') ||
      c.filePath.toLowerCase().includes('/etc/') ||
      c.filePath.toLowerCase().includes('/bin/')
    ).length;
    
    if (systemFileChanges > 0) {
      suspiciousPatterns.push(`${systemFileChanges} system file(s) affected`);
    }

    // Determine overall risk level
    let level: 'low' | 'medium' | 'high' | 'critical';
    if (criticalChanges > 5 || systemFileChanges > 10) {
      level = 'critical';
    } else if (criticalChanges > 0 || highChanges > 10 || executableChanges > 5) {
      level = 'high';
    } else if (highChanges > 0 || changes.length > 20) {
      level = 'medium';
    } else {
      level = 'low';
    }

    return {
      level,
      criticalChanges,
      suspiciousPatterns
    };
  }
}
