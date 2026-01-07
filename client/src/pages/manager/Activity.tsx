import { useState } from 'react';
import { Activity, Search, Filter, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const activities = [
  { id: 1, user: 'Sarah Chen', action: 'Completed task', target: 'API Integration', time: '5 min ago', type: 'complete' },
  { id: 2, user: 'Mike Johnson', action: 'Updated design', target: 'Dashboard UI', time: '15 min ago', type: 'update' },
  { id: 3, user: 'Emily Davis', action: 'Created document', target: 'Q4 Strategy', time: '32 min ago', type: 'create' },
  { id: 4, user: 'Alex Rivera', action: 'Started task', target: 'Bug Fixes', time: '1 hour ago', type: 'start' },
  { id: 5, user: 'Jordan Lee', action: 'Submitted review', target: 'Code Review #234', time: '2 hours ago', type: 'complete' },
  { id: 6, user: 'Casey Morgan', action: 'Flagged issue', target: 'Performance Bug', time: '3 hours ago', type: 'alert' },
  { id: 7, user: 'Sarah Chen', action: 'Commented on', target: 'Sprint Planning', time: '4 hours ago', type: 'update' },
  { id: 8, user: 'Mike Johnson', action: 'Completed task', target: 'Icon Set', time: '5 hours ago', type: 'complete' },
];

const typeIcons = {
  complete: CheckCircle,
  update: FileText,
  create: FileText,
  start: Clock,
  alert: AlertCircle,
};

const typeStyles = {
  complete: 'bg-accent/20 text-accent',
  update: 'bg-primary/20 text-primary',
  create: 'bg-chart-2/20 text-chart-2',
  start: 'bg-chart-3/20 text-chart-3',
  alert: 'bg-chart-4/20 text-chart-4',
};

export default function ManagerActivity() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Activity"
        description="Real-time feed of team actions and updates"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 bg-muted/50">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="complete">Completed</SelectItem>
            <SelectItem value="update">Updated</SelectItem>
            <SelectItem value="create">Created</SelectItem>
            <SelectItem value="start">Started</SelectItem>
            <SelectItem value="alert">Alerts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activity Feed */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredActivities.map((activity, index) => {
              const Icon = typeIcons[activity.type as keyof typeof typeIcons];
              return (
                <div
                  key={activity.id}
                  className="p-4 hover:bg-muted/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{activity.user}</span>
                        <span className="text-muted-foreground">{activity.action}</span>
                        <span className="font-medium text-foreground">{activity.target}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{activity.time}</p>
                    </div>
                    <Badge variant="secondary" className={typeStyles[activity.type as keyof typeof typeStyles]}>
                      <Icon className="h-3 w-3 mr-1" />
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
