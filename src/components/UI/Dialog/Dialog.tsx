'use client';

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export function Dialog(
  delegated: React.ComponentProps<typeof DialogPrimitive.Root>,
) {
  return <DialogPrimitive.Root data-slot="dialog" {...delegated} />;
}

export function DialogTrigger(
  delegated: React.ComponentProps<typeof DialogPrimitive.Trigger>,
) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...delegated} />;
}

export function DialogPortal(
  delegated: React.ComponentProps<typeof DialogPrimitive.Portal>,
) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...delegated} />;
}

export function DialogClose(
  delegated: React.ComponentProps<typeof DialogPrimitive.Close>,
) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...delegated} />;
}

export function DialogOverlay({
  className,
  ...delegated
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className,
      )}
      {...delegated}
    />
  );
}

export function DialogContent({
  className,
  children,
  ...delegated
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border bg-card p-6 shadow-lg duration-200 sm:max-w-lg',
          className,
        )}
        {...delegated}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute top-4 right-4 rounded-md p-1 opacity-70 transition-opacity hover:bg-accent hover:opacity-100 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none"
          aria-label="Закрити"
        >
          <XIcon className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({
  className,
  ...delegated
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)}
      {...delegated}
    />
  );
}

export function DialogFooter({
  className,
  ...delegated
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...delegated}
    />
  );
}

export function DialogTitle({
  className,
  ...delegated
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg font-semibold leading-none', className)}
      {...delegated}
    />
  );
}

export function DialogDescription({
  className,
  ...delegated
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...delegated}
    />
  );
}
