import { useState } from 'react';
import { Search, Filter, MoreHorizontal, Mail, Shield, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AddUserDialog } from '@/components/AddUserDialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const users = [
  { id: '1', name: 'Alex Thompson', email: 'alex.t@company.com', role: 'admin', status: 'active', department: 'Engineering', joined: 'Jan 15, 2024' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.c@company.com', role: 'manager', status: 'active', department: 'Marketing', joined: 'Mar 20, 2024' },
  { id: '3', name: 'Mike Johnson', email: 'mike.j@company.com', role: 'user', status: 'active', department: 'Sales', joined: 'Apr 5, 2024' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@company.com', role: 'user', status: 'pending', department: 'HR', joined: 'Jun 10, 2024' },
  { id: '5', name: 'Jordan Lee', email: 'jordan.l@company.com', role: 'manager', status: 'active', department: 'Engineering', joined: 'Jul 22, 2024' },
  { id: '6', name: 'Casey Morgan', email: 'casey.m@company.com', role: 'user', status: 'inactive', department: 'Finance', joined: 'Aug 1, 2024' },
  { id: '7', name: 'Taylor Swift', email: 'taylor.s@company.com', role: 'user', status: 'active', department: 'Legal', joined: 'Sep 15, 2024' },
  { id: '8', name: 'Riley Anderson', email: 'riley.a@company.com', role: 'user', status: 'active', department: 'Operations', joined: 'Oct 3, 2024' },
];

const roleColors = {
  admin: 'bg-primary text-primary-foreground',
  manager: 'bg-accent text-accent-foreground',
  user: 'bg-secondary text-secondary-foreground',
};

const statusColors = {
  active: 'bg-accent/20 text-accent border-accent/30',
  pending: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
  inactive: 'bg-muted text-muted-foreground border-border',
};

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (user: typeof users[0]) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/20 text-primary text-sm">
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
      render: (user: typeof users[0]) => (
        <Badge className={`capitalize ${roleColors[user.role as keyof typeof roleColors]}`}>
          {user.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: typeof users[0]) => (
        <Badge
          variant="outline"
          className={`capitalize ${statusColors[user.status as keyof typeof statusColors]}`}
        >
          {user.status}
        </Badge>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      className: 'text-muted-foreground',
    },
    {
      key: 'joined',
      header: 'Joined',
      className: 'text-muted-foreground',
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      render: (user: typeof users[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              Change Role
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage and monitor all users in the system"
      >
        <AddUserDialog />
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border"
          />
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32 bg-muted/50">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-muted/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <DataTable columns={columns} data={filteredUsers} />

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground animate-fade-in">
        <p>Showing {filteredUsers.length} of {users.length} users</p>
      </div>
    </div>
  );
}
