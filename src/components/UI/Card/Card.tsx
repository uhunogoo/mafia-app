import React from 'react';

import { cn } from '@/lib/utils';

export function Card({
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
    />
  );
}

export function CardHeader({
  className,
  ref,
  ...delegated
}: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...delegated}
    />
  );
}

export function CardTitle({
  className,
  ref,
  ...delegated
}: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...delegated}
    />
  );
}

export function CardDescription({
  className,
  ref,
  ...delegated
}: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...delegated}
    />
  );
}

export function CardContent({
  className,
  ref,
  ...delegated
}: React.ComponentProps<'div'>) {
  return (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...delegated} />
  );
}

export function CardFooter({
  className,
  ref,
  ...delegated
}: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...delegated}
    />
  );
}
