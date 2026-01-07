import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hexagon, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: 'Welcome back!',
          description: 'You have been logged in successfully.',
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (role: string) => {
    setEmail(`${role}@accesshub.com`);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
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

          {/* Quick Login Buttons (Demo) */}
          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              Quick demo login:
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => quickLogin('admin')}
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => quickLogin('manager')}
              >
                Manager
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => quickLogin('user')}
              >
                User
              </Button>
            </div>
          </div>

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
              Manage Your Operations
            </h2>
            <p className="text-muted-foreground">
              A powerful role-based dashboard for managing users, content, and system settings with enterprise-grade security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
