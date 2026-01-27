// client/src/pages/Login.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SimpleFooter } from '@/components/layout/SimpleFooter';
import { Hexagon, ArrowRight, Loader2, ShieldCheck, Users2, User, Copy, CheckCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DEMO_ACCOUNTS = [
  {
    role: 'admin',
    name: 'Admin Demo',
    email: 'admin@accesshub.com',
    password: 'admin123',
    icon: ShieldCheck,
    color: 'from-primary/20 to-primary/5 border-primary/20',
    iconColor: 'text-primary',
    description: 'Full system access, user management, and analytics'
  },
  {
    role: 'manager',
    name: 'Manager Demo',
    email: 'manager@accesshub.com',
    password: 'manager123',
    icon: Users2,
    color: 'from-accent/20 to-accent/5 border-accent/20',
    iconColor: 'text-accent',
    description: 'Team oversight, reports, and activity monitoring'
  },
  {
    role: 'user',
    name: 'User Demo',
    email: 'user@accesshub.com',
    password: 'user123',
    icon: User,
    color: 'from-muted to-muted/50 border-border',
    iconColor: 'text-muted-foreground',
    description: 'Personal dashboard and resource access'
  }
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      
      toast({
        title: 'Welcome back!',
        description: 'You have been logged in successfully.',
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsLoading(true);

    try {
      await login(demoEmail, demoPassword);
      
      toast({
        title: 'Demo Login Successful!',
        description: 'Exploring as demo user.',
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Demo Login Failed',
        description: 'Demo account not found. Please create it first.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'email' | 'password') => {
    await navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
    
    toast({
      title: 'Copied!',
      description: `${type === 'email' ? 'Email' : 'Password'} copied to clipboard`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background pb-20">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
                <Hexagon className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">AccessHub</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your account to continue
            </p>
          </div>

          {/* Demo Banner */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <p className="text-sm text-center">
              <span className="font-semibold text-primary">🎯 Portfolio Demo</span>
              <br />
              <span className="text-muted-foreground">Try different roles using the demo accounts below</span>
            </p>
          </div>

          {/* Demo Account Cards */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <p className="text-sm font-medium text-center text-muted-foreground mb-3">Quick Demo Login</p>
            {DEMO_ACCOUNTS.map((account) => {
              const Icon = account.icon;
              return (
                <Card 
                  key={account.role} 
                  className={`cursor-pointer transition-all hover:shadow-lg border bg-gradient-to-br ${account.color}`}
                  onClick={() => handleDemoLogin(account.email, account.password)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-lg bg-background/50 flex items-center justify-center shrink-0 ${account.iconColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-foreground capitalize">{account.role}</h3>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{account.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <code className="text-xs bg-background/50 px-2 py-1 rounded">{account.email}</code>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(account.email, 'email');
                            }}
                          >
                            {copiedEmail === account.email ? (
                              <CheckCheck className="h-3 w-3 text-accent" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with credentials</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 bg-muted/50 border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 bg-muted/50 border-border focus:border-primary"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 gradient-primary hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.1),transparent_50%)]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="max-w-md text-center space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 w-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 animate-fade-in"
                  style={{ animationDelay: `${300 + i * 100}ms` }}
                />
              ))}
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Role-Based Access Control
            </h2>
            <p className="text-muted-foreground">
              A powerful dashboard for managing users, content, and system settings with enterprise-grade security and role-based permissions.
            </p>
            <div className="pt-4 space-y-2 text-sm text-muted-foreground">
              <p>✨ Three user roles with distinct permissions</p>
              <p>🔐 Secure authentication & authorization</p>
              <p>📊 Real-time analytics & activity tracking</p>
            </div>
          </div>
        </div>
      </div>

      <SimpleFooter />
    </div>
  );
}