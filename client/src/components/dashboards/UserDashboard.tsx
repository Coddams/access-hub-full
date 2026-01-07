import { useAuth } from '@/contexts/AuthContext';
import { Activity, Clock, CheckCircle2, Bell, FileText, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const stats = [
  { title: 'Last Login', value: 'Today', icon: Clock, description: '2 hours ago' },
  { title: 'Total Activities', value: '156', icon: Activity, trend: { value: 8, isPositive: true } },
  { title: 'Completed Tasks', value: '42', icon: CheckCircle2, description: 'This month' },
];

const recentActivity = [
  { id: 1, action: 'Viewed quarterly report', time: '10 min ago', type: 'view' },
  { id: 2, action: 'Updated profile settings', time: '1 hour ago', type: 'update' },
  { id: 3, action: 'Downloaded resource pack', time: '3 hours ago', type: 'download' },
  { id: 4, action: 'Completed training module', time: 'Yesterday', type: 'complete' },
  { id: 5, action: 'Joined team meeting', time: 'Yesterday', type: 'event' },
];

const notifications = [
  { id: 1, title: 'System Maintenance', message: 'Scheduled for this weekend', type: 'info', time: '1 hour ago' },
  { id: 2, title: 'New Resource Available', message: 'Q4 Planning Guide is now available', type: 'success', time: '2 hours ago' },
  { id: 3, title: 'Task Reminder', message: 'Complete training by end of week', type: 'warning', time: '1 day ago' },
];

const typeIcons = {
  view: FileText,
  update: Activity,
  download: FileText,
  complete: CheckCircle2,
  event: Calendar,
};

const notificationStyles = {
  info: 'bg-primary/20 text-primary border-primary/30',
  success: 'bg-accent/20 text-accent border-accent/30',
  warning: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
};

export function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name.split(' ')[0]}`}
        description={`Last login: ${format(user?.lastLogin || new Date(), 'PPp')}`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 100} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = typeIcons[activity.type as keyof typeof typeIcons];
                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 animate-fade-in"
                    style={{ animationDelay: `${400 + index * 100}ms` }}
                  >
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border animate-fade-in ${notificationStyles[notification.type as keyof typeof notificationStyles]}`}
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm opacity-80 mt-1">{notification.message}</p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {notification.time}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
