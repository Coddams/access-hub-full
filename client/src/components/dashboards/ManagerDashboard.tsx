import { Users2, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const stats = [
  { title: 'Team Size', value: '24', icon: Users2, description: 'Across 3 departments' },
  { title: 'Active Today', value: '18', icon: CheckCircle2, trend: { value: 5, isPositive: true } },
  { title: 'Pending Tasks', value: '7', icon: Clock, trend: { value: -12, isPositive: true } },
  { title: 'Issues', value: '2', icon: AlertCircle, description: 'Requires attention' },
];

const teamActivity = [
  { id: 1, user: 'Sarah Chen', action: 'Completed project review', time: '5 min ago', type: 'success' },
  { id: 2, user: 'Mike Johnson', action: 'Updated documentation', time: '12 min ago', type: 'info' },
  { id: 3, user: 'Emily Davis', action: 'Submitted report', time: '1 hour ago', type: 'success' },
  { id: 4, user: 'Alex Rivera', action: 'Started new task', time: '2 hours ago', type: 'info' },
  { id: 5, user: 'Jordan Lee', action: 'Flagged an issue', time: '3 hours ago', type: 'warning' },
];

const projectProgress = [
  { name: 'Q4 Planning', progress: 85, status: 'on-track' },
  { name: 'Client Onboarding', progress: 62, status: 'on-track' },
  { name: 'System Migration', progress: 45, status: 'at-risk' },
  { name: 'Documentation Update', progress: 90, status: 'on-track' },
];

const typeStyles = {
  success: 'bg-accent/20 text-accent',
  info: 'bg-primary/20 text-primary',
  warning: 'bg-chart-4/20 text-chart-4',
};

export function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manager Dashboard"
        description="Monitor team activity and project progress"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 100} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Activity Feed */}
        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="h-5 w-5 text-primary" />
              Team Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 animate-fade-in"
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground text-sm">{activity.user}</p>
                      <Badge
                        variant="secondary"
                        className={typeStyles[activity.type as keyof typeof typeStyles]}
                      >
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Progress */}
        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Project Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {projectProgress.map((project, index) => (
                <div
                  key={project.name}
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground text-sm">{project.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      <Badge
                        variant="secondary"
                        className={project.status === 'on-track' ? 'bg-accent/20 text-accent' : 'bg-chart-4/20 text-chart-4'}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
