import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { FilePen, FolderPlus, Folder, Play, RefreshCw, Edit, Plus, Trash2, History } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface FileChange {
  type: 'added' | 'modified' | 'deleted';
  filePath: string;
  oldHash?: string;
  newHash?: string;
  size?: number;
  timestamp: string;
}

interface FileIntegrityResult {
  directory: string;
  totalFiles: number;
  changes: FileChange[];
  statistics: {
    modified: number;
    added: number;
    deleted: number;
    unchanged: number;
  };
  lastScan: string;
}

export function FileIntegrityMonitor() {
  const [directory, setDirectory] = useState('');
  const [recursive, setRecursive] = useState(true);
  const [integrityResult, setIntegrityResult] = useState<FileIntegrityResult | null>(null);

  const initBaselineMutation = useMutation({
    mutationFn: async ({ directory, recursive }: { directory: string; recursive: boolean }) => {
      const response = await apiRequest('POST', '/api/security/file-integrity-init', { directory, recursive });
      return response.json();
    },
    onSuccess: (data) => {
      // Baseline initialized successfully
    },
    onError: (error: any) => {
      console.error('Failed to initialize baseline:', error);
    },
  });

  const checkIntegrityMutation = useMutation({
    mutationFn: async ({ directory, recursive }: { directory: string; recursive: boolean }) => {
      const response = await apiRequest('POST', '/api/security/file-integrity-check', { directory, recursive });
      return response.json();
    },
    onSuccess: (data) => {
      setIntegrityResult(data);
    },
    onError: (error: any) => {
      console.error('Failed to check file integrity:', error);
    },
  });

  const updateBaselineMutation = useMutation({
    mutationFn: async ({ directory, recursive }: { directory: string; recursive: boolean }) => {
      const response = await apiRequest('POST', '/api/security/file-integrity-update', { directory, recursive });
      return response.json();
    },
    onSuccess: (data) => {
      // Baseline updated successfully
    },
    onError: (error: any) => {
      console.error('Failed to update baseline:', error);
    },
  });

  const handleInitBaseline = () => {
    if (directory.trim()) {
      initBaselineMutation.mutate({ directory: directory.trim(), recursive });
    }
  };

  const handleCheckIntegrity = () => {
    if (directory.trim()) {
      checkIntegrityMutation.mutate({ directory: directory.trim(), recursive });
    }
  };

  const handleUpdateBaseline = () => {
    if (directory.trim()) {
      updateBaselineMutation.mutate({ directory: directory.trim(), recursive });
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added': return <Plus className="h-4 w-4 text-accent" />;
      case 'modified': return <Edit className="h-4 w-4 text-chart-3" />;
      case 'deleted': return <Trash2 className="h-4 w-4 text-destructive" />;
      default: return <FilePen className="h-4 w-4" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'added': return 'bg-accent/10';
      case 'modified': return 'bg-chart-3/10';
      case 'deleted': return 'bg-destructive/10';
      default: return 'bg-muted';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
  };

  const formatFilePath = (filePath: string) => {
    const parts = filePath.split('/');
    if (parts.length > 3) {
      return `.../${parts.slice(-2).join('/')}`;
    }
    return filePath;
  };

  const isLoading = initBaselineMutation.isPending || checkIntegrityMutation.isPending || updateBaselineMutation.isPending;

  return (
    <Card className="bg-card border border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-chart-5/10 rounded-lg flex items-center justify-center">
              <FilePen className="text-chart-5 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">File Integrity Monitoring</h3>
              <p className="text-sm text-muted-foreground">Monitor file changes and detect unauthorized modifications</p>
            </div>
          </div>
          <Button
            onClick={handleInitBaseline}
            disabled={!directory.trim() || isLoading}
            className="bg-chart-5 hover:bg-chart-5/90 text-background"
            data-testid="button-add-directory"
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Add Directory
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monitoring Controls */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="directory-input" className="block text-sm font-medium mb-2">
                Monitor Directory
              </Label>
              <div className="relative">
                <Input
                  id="directory-input"
                  type="text"
                  placeholder="/path/to/directory"
                  value={directory}
                  onChange={(e) => setDirectory(e.target.value)}
                  className="w-full font-mono text-sm pr-10"
                  data-testid="input-directory"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  data-testid="button-browse-directory"
                >
                  <Folder className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recursive-checkbox"
                  checked={recursive}
                  onCheckedChange={(checked) => setRecursive(checked as boolean)}
                  data-testid="checkbox-recursive"
                />
                <Label htmlFor="recursive-checkbox" className="text-sm">
                  Monitor Subdirectories
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleCheckIntegrity}
                disabled={!directory.trim() || isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                data-testid="button-check-integrity"
              >
                <Play className="mr-2 h-4 w-4" />
                {checkIntegrityMutation.isPending ? "Checking..." : "Check Integrity"}
              </Button>
              <Button
                variant="secondary"
                onClick={handleUpdateBaseline}
                disabled={!directory.trim() || isLoading}
                className="w-full"
                data-testid="button-update-baseline"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {updateBaselineMutation.isPending ? "Updating..." : "Update Baseline"}
              </Button>
            </div>
          </div>

          {/* File Changes Log */}
          <div className="lg:col-span-2">
            <div className="bg-secondary rounded-lg">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center">
                    <History className="mr-2 h-4 w-4" />
                    Recent Changes
                  </h4>
                  {integrityResult && (
                    <Badge className="bg-chart-3/20 text-chart-3" data-testid="text-changes-count">
                      {integrityResult.changes.length} Changes
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {integrityResult?.changes.length ? (
                    integrityResult.changes.slice(0, 10).map((change, index) => (
                      <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${getChangeColor(change.type)}`}>
                        {getChangeIcon(change.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm truncate" title={change.filePath}>
                              {formatFilePath(change.filePath)}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {new Date(change.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            File {change.type}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs">
                            {change.newHash && (
                              <span>Hash: <code className="text-accent">{change.newHash.substring(0, 8)}...</code></span>
                            )}
                            {change.oldHash && (
                              <span>Previous Hash: <code className="text-muted-foreground">{change.oldHash.substring(0, 8)}...</code></span>
                            )}
                            {change.size && (
                              <span>Size: {formatFileSize(change.size)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : integrityResult ? (
                    <div className="text-center text-muted-foreground py-8">
                      <FilePen className="h-12 w-12 mx-auto mb-2 text-accent" />
                      <p>No file changes detected</p>
                      <p className="text-xs">All monitored files are intact</p>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <FilePen className="h-12 w-12 mx-auto mb-2" />
                      <p>No integrity checks performed yet</p>
                      <p className="text-xs">Set up a directory and run an integrity check</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-secondary p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-foreground" data-testid="text-monitored-files">
              {integrityResult?.totalFiles || 0}
            </div>
            <div className="text-xs text-muted-foreground">Files Monitored</div>
          </div>
          <div className="bg-secondary p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-chart-3" data-testid="text-changes-today">
              {integrityResult?.changes.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Changes Detected</div>
          </div>
          <div className="bg-secondary p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-accent" data-testid="text-integrity-score">
              {integrityResult ? 
                `${(((integrityResult.statistics.unchanged || 0) / integrityResult.totalFiles) * 100).toFixed(1)}%` 
                : '100%'}
            </div>
            <div className="text-xs text-muted-foreground">Integrity Score</div>
          </div>
          <div className="bg-secondary p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary" data-testid="text-last-scan">
              {integrityResult ? 
                `${Math.round((Date.now() - new Date(integrityResult.lastScan).getTime()) / 60000)}m`
                : '--'}
            </div>
            <div className="text-xs text-muted-foreground">Last Scan</div>
          </div>
        </div>

        {isLoading && (
          <div className="mt-4 bg-secondary p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-chart-5"></div>
              <span className="text-sm">
                {initBaselineMutation.isPending && "Initializing baseline..."}
                {checkIntegrityMutation.isPending && "Checking file integrity..."}
                {updateBaselineMutation.isPending && "Updating baseline..."}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
