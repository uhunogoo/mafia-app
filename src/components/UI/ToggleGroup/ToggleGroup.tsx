'use client';

import React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-transparent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
        outline:
          'border border-input bg-transparent shadow-xs data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
      },
      size: {
        default: 'h-9 px-3',
        sm: 'h-8 px-2',
        lg: 'h-10 px-4',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ToggleGroupSingleProps
  extends Omit<
    React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
    'type' | 'value' | 'onValueChange' | 'defaultValue'
  > {
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export interface ToggleGroupMultipleProps
  extends Omit<
    React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
    'type' | 'value' | 'onValueChange' | 'defaultValue'
  > {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

function ToggleGroup({ className, children, ...delegated }: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root className={cn(className)} {...delegated}>
      {children}
    </ToggleGroupPrimitive.Root>
  );
}

export interface ToggleGroupItemProps
  extends React.ComponentProps<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof toggleVariants> {}

function ToggleGroupItem({
  children,
  className,
  variant,
  size,
  ref,
  ...delegated
}: ToggleGroupItemProps) {
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(toggleVariants({ variant, size, className }))}
      {...delegated}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
