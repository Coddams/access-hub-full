import { useState } from 'react';
import { ScrollText, Search, Filter, Download, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const logs = [
  { id: 1, timestamp: '2024-01-03 14:32:15', user: 'admin@accesshub.com', action: 'User role updated', target: 'mike.j@company.com', level: 'info', ip: '192.168.1.45' },
  { id: 2, timestamp: '2024-01-03 14:28:42', user: 'system', action: 'Backup completed', target: 'database', level: 'success', ip: 'localhost' },
  { id: 3, timestamp: '2024-01-03 14:15:33', user: 'sarah.c@company.com', action: 'Failed login attempt', target: 'auth', level: 'warning', ip: '10.0.0.122' },
  { id: 4, timestamp: '2024-01-03 13:58:21', user: 'admin@accesshub.com', action: 'New user created', target: 'emily.d@company.com', level: 'info', ip: '192.168.1.45' },
  { id: 5, timestamp: '2024-01-03 13:45:10', user: 'system', action: 'Scheduled maintenance', target: 'cache', level: 'info', ip: 'localhost' },
  { id: 6, timestamp: '2024-01-03 13:30:55', user: 'jordan.l@company.com', action: 'Permission denied', target: '/admin/system', level: 'warning', ip: '10.0.0.88' },
  { id: 7, timestamp: '2024-01-03 12:22:18', user: 'admin@accesshub.com', action: 'System settings updated', target: 'config', level: 'info', ip: '192.168.1.45' },
  { id: 8, timestamp: '2024-01-03 11:15:44', user: 'system', action: 'Security scan completed', target: 'all', level: 'success', ip: 'localhost' },
];

const levelIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
};

const levelStyles = {
  info: 'bg-primary/20 text-primary border-primary/30',
  success: 'bg-accent/20 text-accent border-accent/30',
  warning: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
};

export default function AdminLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Logs"
        description="Monitor and audit all system activities"
      >
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border"
          />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-40 bg-muted/50">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredLogs.map((log, index) => {
              const Icon = levelIcons[log.level as keyof typeof levelIcons];
              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-muted/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${levelStyles[log.level as keyof typeof levelStyles]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground">{log.action}</p>
                        <Badge variant="outline" className={levelStyles[log.level as keyof typeof levelStyles]}>
                          {log.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{log.user}</span>
                        <span>→</span>
                        <span>{log.target}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground shrink-0">
                      <p>{log.timestamp}</p>
                      <p className="text-xs">{log.ip}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground animate-fade-in">
        <p>Showing {filteredLogs.length} of {logs.length} logs</p>
      </div>
    </div>
  );
}
