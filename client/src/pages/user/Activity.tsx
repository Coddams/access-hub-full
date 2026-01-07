import { Activity, FileText, Calendar, CheckCircle2, Download, Eye } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const activityHistory = [
  { id: 1, action: 'Viewed quarterly report', target: 'Q4 2024 Report', time: '10 min ago', type: 'view', icon: Eye },
  { id: 2, action: 'Updated profile settings', target: 'Account Settings', time: '1 hour ago', type: 'update', icon: Activity },
  { id: 3, action: 'Downloaded resource', target: 'Training Guide v2.pdf', time: '3 hours ago', type: 'download', icon: Download },
  { id: 4, action: 'Completed training', target: 'Security Basics', time: 'Yesterday', type: 'complete', icon: CheckCircle2 },
  { id: 5, action: 'Joined meeting', target: 'Team Standup', time: 'Yesterday', type: 'event', icon: Calendar },
  { id: 6, action: 'Viewed document', target: 'Company Policies', time: '2 days ago', type: 'view', icon: Eye },
  { id: 7, action: 'Downloaded resource', target: 'Employee Handbook.pdf', time: '2 days ago', type: 'download', icon: Download },
  { id: 8, action: 'Completed training', target: 'Onboarding Module', time: '3 days ago', type: 'complete', icon: CheckCircle2 },
];

const typeStyles = {
  view: 'bg-primary/20 text-primary',
  update: 'bg-chart-2/20 text-chart-2',
  download: 'bg-chart-3/20 text-chart-3',
  complete: 'bg-accent/20 text-accent',
  event: 'bg-chart-4/20 text-chart-4',
};

const activityStats = [
  { label: 'Total Activities', value: '156' },
  { label: 'This Week', value: '23' },
  { label: 'Documents Viewed', value: '45' },
  { label: 'Tasks Completed', value: '42' },
];

export default function UserActivity() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Activity"
        description="Your recent actions and engagement history"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {activityStats.map((stat, index) => (
          <Card key={stat.label} className="shadow-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Timeline */}
      <Card className="shadow-card animate-fade-in" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Activity History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {activityHistory.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="relative pl-10 animate-fade-in"
                    style={{ animationDelay: `${500 + index * 100}ms` }}
                  >
                    <div className={`absolute left-0 h-8 w-8 rounded-full flex items-center justify-center ${typeStyles[activity.type as keyof typeof typeStyles]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-foreground">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.target}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {activity.time}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
