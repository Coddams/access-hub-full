// client/src/pages/admin/AdminDashboard.tsx (Update the component)

import { useEffect, useState } from 'react';
import { Users, Activity, Shield, Server } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddUserDialog } from '@/components/AddUserDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { userService, activityService } from '@/services';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch user stats
      const statsResponse = await userService.getUserStats();
      setStats(statsResponse.data);

      // Fetch recent users (all users, sorted by creation date)
      const usersResponse = await userService.getAllUsers({});
      // Take the 5 most recent
      const recent = usersResponse.data.slice(0, 5);
      setRecentUsers(recent);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to fetch dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate active sessions (for demo, use 60% of active users)
  const activeSessions = stats ? Math.floor(stats.active * 0.6) : 0;

  // Get role count
  const getRoleCount = (role: string) => {
    if (!stats?.byRole) return 0;
    const found = stats.byRole.find((r: any) => r._id === role);
    return found?.count || 0;
  };

  const statsCards = [
    { 
      title: 'Total Users', 
      value: stats?.total?.toString() || '0', 
      icon: Users, 
      trend: { value: 12, isPositive: true } 
    },
    { 
      title: 'Active Sessions', 
      value: activeSessions.toString(), 
      icon: Activity, 
      trend: { value: 8, isPositive: true } 
    },
    { 
      title: 'Active Roles', 
      value: stats?.byRole?.length?.toString() || '0', 
      icon: Shield, 
      description: `${getRoleCount('admin')} admins, ${getRoleCount('manager')} managers` 
    },
    { 
      title: 'System Health', 
      value: '99.9%', 
      icon: Server, 
      trend: { value: 0.1, isPositive: true } 
    },
  ];

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (user: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {user.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: any) => (
        <Badge variant="secondary" className="capitalize">
          {user.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: any) => (
        <Badge
          variant={user.status === 'active' ? 'default' : 'outline'}
          className={user.status === 'active' ? 'bg-accent text-accent-foreground' : ''}
        >
          {user.status}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (user: any) => {
        const now = new Date();
        const created = new Date(user.createdAt);
        const diffTime = Math.abs(now.getTime() - created.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 1) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return created.toLocaleDateString();
      },
      className: 'text-muted-foreground',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Admin Dashboard" description="Loading..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of system activity and user management"
      >
        <AddUserDialog />
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 100} />
        ))}
      </div>

      {/* Recent Users Table */}
      <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Signups</h2>
        <DataTable columns={columns} data={recentUsers} />
      </div>
    </div>
  );
}