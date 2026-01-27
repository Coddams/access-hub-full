import { ExternalLink } from 'lucide-react';

export function SimpleFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="absolute bottom-0 left-0 right-0 py-4 text-center text-xs text-muted-foreground bg-background/50 backdrop-blur-sm border-t border-border/50">
      <p>
        © {currentYear} Built by{' '}
        <a
          href="https://yourwebsite.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          Your Name
          <ExternalLink className="h-3 w-3" />
        </a>
        {' '}• Portfolio Demo
      </p>
    </footer>
  );
}