import React from 'react';

import { cn } from '@/lib/utils';

export function Card({
  children,
  className,
  ref,
  ...delegated
}: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border bg-card text-card-foreground shadow-sm',
        className,
      )}
      {...delegated}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ref,
  ...delegated
}: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...delegated}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ref,
  ...delegated
}: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...delegated}
    >
      {children}
    </div>
  );
}

export function CardDescription({
  children,
  className,
  ref,
  ...delegated
}: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...delegated}
    >
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
  ref,
  ...delegated
}: React.ComponentProps<'div'>) {
  return (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...delegated}>
      {children}
    </div>
  );
}
