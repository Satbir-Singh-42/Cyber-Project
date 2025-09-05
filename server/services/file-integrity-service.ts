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
  lastScan: Date;
}

export interface FileChange {
  type: 'added' | 'modified' | 'deleted';
  filePath: string;
  oldHash?: string;
  newHash?: string;
  size?: number;
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
    for (const [filePath, baselineFile] of this.baseline) {
      const currentFile = currentFileMap.get(filePath);
      
      if (!currentFile) {
        // File was deleted
        changes.push({
          type: 'deleted',
          filePath,
          oldHash: baselineFile.hash,
          timestamp: new Date()
        });
        statistics.deleted++;
      } else if (currentFile.hash !== baselineFile.hash) {
        // File was modified
        changes.push({
          type: 'modified',
          filePath,
          oldHash: baselineFile.hash,
          newHash: currentFile.hash,
          size: currentFile.size,
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
        changes.push({
          type: 'added',
          filePath: currentFile.path,
          newHash: currentFile.hash,
          size: currentFile.size,
          timestamp: new Date()
        });
        statistics.added++;
      }
    }

    return {
      directory,
      totalFiles: currentFiles.length,
      changes: changes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      statistics,
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
    for (const filePath of this.baseline.keys()) {
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
}
