import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Shield,
  ScrollText,
  Settings,
  Users2,
  BarChart3,
  Activity,
  FolderOpen,
  User,
  X,
  Hexagon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  // Shared
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'user'] },
  
  // Admin only
  { title: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
  { title: 'Roles', href: '/admin/roles', icon: Shield, roles: ['admin'] },
  { title: 'Logs', href: '/admin/logs', icon: ScrollText, roles: ['admin'] },
  { title: 'System', href: '/admin/system', icon: Settings, roles: ['admin'] },
  
  // Manager only
  { title: 'Team', href: '/manager/team', icon: Users2, roles: ['manager'] },
  { title: 'Reports', href: '/manager/reports', icon: BarChart3, roles: ['manager'] },
  { title: 'Activity', href: '/manager/activity', icon: Activity, roles: ['manager'] },
  
  // User only
  { title: 'My Activity', href: '/user/activity', icon: Activity, roles: ['user'] },
  { title: 'Resources', href: '/user/resources', icon: FolderOpen, roles: ['user'] },
  
  // Shared bottom
  { title: 'Profile', href: '/profile', icon: User, roles: ['admin', 'manager', 'user'] },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const filteredItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                <Hexagon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">AccessHub</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => onClose()}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                        active
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <Icon className={cn('h-5 w-5', active && 'animate-scale-in')} />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="rounded-lg bg-sidebar-accent/50 p-3">
              <p className="text-xs text-sidebar-foreground">
                Logged in as
              </p>
              <p className="text-sm font-medium text-foreground truncate">
                {user?.email}
              </p>
              <p className="text-xs text-sidebar-foreground capitalize mt-1">
                {user?.role} Account
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
