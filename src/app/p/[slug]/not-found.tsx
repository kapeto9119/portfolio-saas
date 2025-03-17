import { ButtonLink } from '@/components/ui/button-link';
import { ArrowLeft } from 'lucide-react';

export default function PortfolioNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Portfolio Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The portfolio you're looking for doesn't exist or has been removed.
        </p>
        <ButtonLink href="/" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </ButtonLink>
      </div>
    </div>
  );
} 