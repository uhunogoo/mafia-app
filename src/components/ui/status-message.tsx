import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type StatusVariant = 'idle' | 'loading' | 'error';

interface StatusMessageProps {
  children: ReactNode;
  variant?: StatusVariant;
  className?: string;
}

export function StatusMessage({
  children,
  variant = 'idle',
  className,
}: StatusMessageProps) {
  return (
    <div className={cn('flex items-center justify-center min-h-[200px]', className)}>
      <p
        className={cn(
          variant === 'error' && 'text-destructive font-medium',
          variant !== 'error' && 'text-muted-foreground',
        )}
      >
        {children}
      </p>
    </div>
  );
}
