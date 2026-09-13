import React from 'react';

import { cn } from '@/lib/utils';

type StatusVariant = 'idle' | 'loading' | 'error';

const STATUS_CLASSES: Record<StatusVariant, string> = {
  idle: 'text-muted-foreground',
  loading: 'text-muted-foreground',
  error: 'text-destructive font-medium',
};

interface StatusMessageProps {
  children: React.ReactNode;
  variant?: StatusVariant;
  className?: string;
}

function StatusMessage({
  children,
  variant = 'idle',
  className,
}: StatusMessageProps) {
  return (
    <div className={cn('flex items-center justify-center min-h-50', className)}>
      <p className={cn(STATUS_CLASSES[variant])}>{children}</p>
    </div>
  );
}

export default StatusMessage;
