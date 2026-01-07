import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 animate-fade-in-up">
        <div className="relative inline-block">
          <div className="h-24 w-24 rounded-2xl bg-destructive/20 flex items-center justify-center mx-auto">
            <ShieldX className="h-12 w-12 text-destructive" />
          </div>
          <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground font-bold animate-scale-in" style={{ animationDelay: '200ms' }}>
            !
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">403</h1>
          <h2 className="text-2xl font-semibold text-foreground">Access Forbidden</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Link>
          </Button>
          <Button asChild className="gradient-primary">
            <Link to="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
