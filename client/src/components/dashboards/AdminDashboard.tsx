import { Users, Activity, Shield, Server, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddUserDialog } from '@/components/AddUserDialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const stats = [
  { title: 'Total Users', value: '2,847', icon: Users, trend: { value: 12, isPositive: true } },
  { title: 'Active Sessions', value: '423', icon: Activity, trend: { value: 8, isPositive: true } },
  { title: 'Active Roles', value: '5', icon: Shield, description: 'Across 3 departments' },
  { title: 'System Health', value: '99.9%', icon: Server, trend: { value: 0.1, isPositive: true } },
];

const recentUsers = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'manager', status: 'active', joined: '2 hours ago' },
  { id: '2', name: 'Mike Johnson', email: 'mike.j@company.com', role: 'user', status: 'active', joined: '5 hours ago' },
  { id: '3', name: 'Emily Davis', email: 'emily.d@company.com', role: 'user', status: 'pending', joined: '1 day ago' },
  { id: '4', name: 'Alex Rivera', email: 'alex.r@company.com', role: 'manager', status: 'active', joined: '2 days ago' },
];

const roleDistribution = [
  { name: 'Users', value: 2200, color: 'hsl(var(--chart-1))' },
  { name: 'Managers', value: 520, color: 'hsl(var(--chart-2))' },
  { name: 'Admins', value: 127, color: 'hsl(var(--chart-3))' },
];

const activityData = [
  { name: 'Mon', users: 340, actions: 890 },
  { name: 'Tue', users: 420, actions: 1200 },
  { name: 'Wed', users: 380, actions: 980 },
  { name: 'Thu', users: 510, actions: 1400 },
  { name: 'Fri', users: 480, actions: 1100 },
  { name: 'Sat', users: 220, actions: 450 },
  { name: 'Sun', users: 180, actions: 320 },
];

const columns = [
  {
    key: 'name',
    header: 'User',
    render: (user: typeof recentUsers[0]) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/20 text-primary text-xs">
            {user.name.split(' ').map(n => n[0]).join('')}
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
    render: (user: typeof recentUsers[0]) => (
      <Badge variant="secondary" className="capitalize">
        {user.role}
      </Badge>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (user: typeof recentUsers[0]) => (
      <Badge
        variant={user.status === 'active' ? 'default' : 'outline'}
        className={user.status === 'active' ? 'bg-accent text-accent-foreground' : ''}
      >
        {user.status}
      </Badge>
    ),
  },
  {
    key: 'joined',
    header: 'Joined',
    className: 'text-muted-foreground',
  },
];

export function AdminDashboard() {
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
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 100} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <Card className="lg:col-span-2 shadow-card animate-fade-in" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actions" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Role Distribution */}
        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {roleDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users Table */}
      <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Signups</h2>
        <DataTable columns={columns} data={recentUsers} />
      </div>
    </div>
  );
}
