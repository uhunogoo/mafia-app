import React from 'react';
import { Slot } from '@radix-ui/react-slot';

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
  asChild,
  children,
  className,
  ref,
  ...delegated
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cn('leading-none tracking-tight', className)}
      {...delegated}
    >
      {children}
    </Comp>
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
