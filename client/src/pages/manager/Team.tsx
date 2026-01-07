import { Users2, Mail, MoreHorizontal, UserPlus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const teamMembers = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.c@company.com', role: 'Senior Developer', status: 'online', department: 'Engineering', projects: 4 },
  { id: '2', name: 'Mike Johnson', email: 'mike.j@company.com', role: 'Designer', status: 'online', department: 'Design', projects: 3 },
  { id: '3', name: 'Emily Davis', email: 'emily.d@company.com', role: 'Product Manager', status: 'away', department: 'Product', projects: 5 },
  { id: '4', name: 'Alex Rivera', email: 'alex.r@company.com', role: 'Developer', status: 'online', department: 'Engineering', projects: 2 },
  { id: '5', name: 'Jordan Lee', email: 'jordan.l@company.com', role: 'QA Engineer', status: 'offline', department: 'Engineering', projects: 3 },
  { id: '6', name: 'Casey Morgan', email: 'casey.m@company.com', role: 'Data Analyst', status: 'online', department: 'Analytics', projects: 2 },
];

const statusColors = {
  online: 'bg-accent',
  away: 'bg-chart-4',
  offline: 'bg-muted-foreground',
};

export default function ManagerTeam() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Management"
        description="View and manage your team members"
      >
        <Button className="gradient-primary">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member, index) => (
          <Card
            key={member.id}
            className="shadow-card animate-fade-in hover:shadow-elegant transition-shadow"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${statusColors[member.status as keyof typeof statusColors]}`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Assign Task</DropdownMenuItem>
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{member.department}</Badge>
                  <span className="text-sm text-muted-foreground">{member.projects} projects</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
