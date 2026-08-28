import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatusMessageProps {
  children: ReactNode;
  isError?: boolean;
  className?: string;
}

function StatusMessage({
  children,
  isError = false,
  className
}: StatusMessageProps) {
  return (
    <div className={cn("flex items-center justify-center min-h-[200px]", className)}>
      <p className={isError ? "text-destructive font-medium" : "text-muted-foreground"}>
        { children }
      </p>
    </div>
  );
}

export default StatusMessage;
