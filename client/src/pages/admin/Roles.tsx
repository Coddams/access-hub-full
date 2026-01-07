import { Shield, Plus, MoreHorizontal, Users, Lock, Unlock } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const roles = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access with all permissions',
    userCount: 127,
    permissions: ['users.manage', 'roles.manage', 'logs.view', 'system.manage'],
    isSystem: true,
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Team management and reporting access',
    userCount: 520,
    permissions: ['team.view', 'reports.manage', 'activity.view'],
    isSystem: true,
  },
  {
    id: '3',
    name: 'User',
    description: 'Basic access to personal resources',
    userCount: 2200,
    permissions: ['profile.edit', 'resources.view', 'activity.view'],
    isSystem: true,
  },
  {
    id: '4',
    name: 'Viewer',
    description: 'Read-only access across the system',
    userCount: 45,
    permissions: ['*.view'],
    isSystem: false,
  },
  {
    id: '5',
    name: 'Auditor',
    description: 'Access to logs and audit trails',
    userCount: 12,
    permissions: ['logs.view', 'audit.view'],
    isSystem: false,
  },
];

export default function AdminRoles() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Role Management"
        description="Configure roles and permissions for your organization"
      >
        <Button className="gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role, index) => (
          <Card
            key={role.id}
            className="shadow-card animate-fade-in hover:shadow-elegant transition-shadow"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {role.name}
                      {role.isSystem && (
                        <Badge variant="outline" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          System
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {role.description}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Role</DropdownMenuItem>
                    <DropdownMenuItem>View Users</DropdownMenuItem>
                    {!role.isSystem && (
                      <DropdownMenuItem className="text-destructive">
                        Delete Role
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{role.userCount.toLocaleString()} users</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.slice(0, 3).map((perm) => (
                    <Badge key={perm} variant="secondary" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                  {role.permissions.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.permissions.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
