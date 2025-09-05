import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Filter, Search, Download, Eye, BarChart3 } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

interface ScanResult {
  id: string;
  type: string;
  target: string;
  result: string;
  score: number | null;
  timestamp: string;
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const { data: scanResults = [], isLoading } = useQuery<ScanResult[]>({
    queryKey: ['/api/security/scan-history'],
  });

  const filteredResults = scanResults.filter((result: ScanResult) => {
    const matchesSearch = !searchTerm || 
      result.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || result.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    const colors = {
      'password': 'bg-primary/10 text-primary',
      'phishing': 'bg-destructive/10 text-destructive',
      'port': 'bg-chart-3/10 text-chart-3',
      'keylogger': 'bg-chart-4/10 text-chart-4',
      'file_integrity': 'bg-chart-5/10 text-chart-5'
    };
    return colors[type as keyof typeof colors] || 'bg-muted/10 text-muted-foreground';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'password': '🔑',
      'phishing': '🎣', 
      'port': '🌐',
      'keylogger': '⌨️',
      'file_integrity': '📝'
    };
    return icons[type as keyof typeof icons] || '🔍';
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getResultSummary = (result: string, type: string) => {
    try {
      const parsed = JSON.parse(result);
      switch (type) {
        case 'password':
          return `Strength: ${parsed.strength || 'Unknown'}`;
        case 'phishing':
          return `Risk: ${parsed.risk || 'Unknown'}`;
        case 'port':
          return `${parsed.openPorts?.length || 0} open ports`;
        case 'keylogger':
          return `${parsed.suspiciousProcesses?.length || 0} suspicious processes`;
        case 'file_integrity':
          return `${parsed.changes?.length || 0} file changes`;
        default:
          return 'Scan completed';
      }
    } catch {
      return 'Scan completed';
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(filteredResults, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `cybersec-history-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const scanTypeStats = scanResults.reduce((acc: Record<string, number>, result) => {
    acc[result.type] = (acc[result.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
          <p className="text-muted-foreground mt-2">
            View and analyze all security scan results with detailed filtering and export options.
          </p>
        </div>
        <Button onClick={exportHistory} className="flex items-center space-x-2" data-testid="button-export-history">
          <Download className="h-4 w-4" />
          <span>Export History</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Scans</p>
                <p className="text-2xl font-bold" data-testid="text-total-scans">{scanResults.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        {Object.entries(scanTypeStats).map(([type, count]) => (
          <Card key={type}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground capitalize">
                    {type.replace('_', ' ')}
                  </p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                <span className="text-2xl">{getTypeIcon(type)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by target or scan type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-history"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-type">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="password">Password Analysis</SelectItem>
                <SelectItem value="phishing">Phishing Detection</SelectItem>
                <SelectItem value="port">Port Scanning</SelectItem>
                <SelectItem value="keylogger">Keylogger Detection</SelectItem>
                <SelectItem value="file_integrity">File Integrity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Scan Results ({filteredResults.length})</span>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading scan history...</span>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No scan results found</h3>
                <p>Try adjusting your search terms or filters, or run some security scans first.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                    data-testid={`scan-result-${result.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getTypeIcon(result.type)}</div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={getTypeColor(result.type)}>
                            {result.type.replace('_', ' ')}
                          </Badge>
                          <span className="font-medium">{result.target}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getResultSummary(result.result, result.type)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {formatDateTime(result.timestamp)}
                      </div>
                      {result.score !== null && (
                        <div className="text-sm font-medium mt-1">
                          Score: {result.score}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}