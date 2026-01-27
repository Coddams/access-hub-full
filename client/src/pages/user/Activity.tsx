// client/src/pages/user/Activity.tsx

import { useEffect, useState } from 'react';
import { Activity, FileText, Calendar, CheckCircle2, Download, Eye } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { activityService } from '@/services';

const typeIcons = {
  view: Eye,
  update: Activity,
  download: Download,
  complete: CheckCircle2,
  event: Calendar,
  create: FileText,
  delete: FileText,
  start: Activity,
  alert: Activity,
};

const typeStyles = {
  view: 'bg-primary/20 text-primary',
  update: 'bg-chart-2/20 text-chart-2',
  download: 'bg-chart-3/20 text-chart-3',
  complete: 'bg-accent/20 text-accent',
  event: 'bg-chart-4/20 text-chart-4',
  create: 'bg-chart-2/20 text-chart-2',
  delete: 'bg-destructive/20 text-destructive',
  start: 'bg-chart-3/20 text-chart-3',
  alert: 'bg-chart-4/20 text-chart-4',
};

export default function UserActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await activityService.getMyActivities({ limit: 50 });
      setActivities(response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to fetch activities',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await activityService.getActivityStats();
      setStats(response.data);
    } catch (error: any) {
      console.error('Failed to fetch activity stats:', error);
    }
  };

  // Calculate stats from activities
  const calculateStats = () => {
    const thisWeek = activities.filter((a) => {
      const activityDate = new Date(a.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return activityDate >= weekAgo;
    }).length;

    const documentsViewed = activities.filter((a) => a.type === 'view').length;
    const tasksCompleted = activities.filter((a) => a.type === 'complete').length;

    return {
      total: activities.length,
      thisWeek,
      documentsViewed,
      tasksCompleted,
    };
  };

  const activityStats = calculateStats();

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now.getTime() - activityDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return activityDate.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Activity" description="Loading your activity..." />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Activity"
        description="Your recent actions and engagement history"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card animate-fade-in">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{activityStats.total}</p>
            <p className="text-sm text-muted-foreground">Total Activities</p>
          </CardContent>
        </Card>
        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{activityStats.thisWeek}</p>
            <p className="text-sm text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{activityStats.documentsViewed}</p>
            <p className="text-sm text-muted-foreground">Documents Viewed</p>
          </CardContent>
        </Card>
        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{activityStats.tasksCompleted}</p>
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card animate-fade-in" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Activity History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activities yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your activities will appear here as you use the system
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-6">
                {activities.map((activity, index) => {
                  const Icon = typeIcons[activity.type as keyof typeof typeIcons] || Activity;
                  return (
                    <div
                      key={activity._id}
                      className="relative pl-10 animate-fade-in"
                      style={{ animationDelay: `${500 + index * 50}ms` }}
                    >
                      <div
                        className={`absolute left-0 h-8 w-8 rounded-full flex items-center justify-center ${typeStyles[activity.type as keyof typeof typeStyles]
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-foreground capitalize">
                              {activity.action.replace(/_/g, ' ')}
                            </p>
                            <p className="text-sm text-muted-foreground">{activity.target}</p>
                            {activity.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {activity.description}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="shrink-0 text-xs">
                            {formatTimeAgo(activity.createdAt)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}