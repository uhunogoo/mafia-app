import React from 'react';

import { cn } from '@/lib/utils';

export type TitleLevel = 'h1' | 'h2' | 'h3';

/** Типові стилі за семантичним рівнем; className викликача перекриває їх через twMerge. */
const LEVEL_CLASSES: Record<TitleLevel, string> = {
  h1: 'text-3xl font-bold',
  h2: 'text-xl font-semibold',
  h3: 'text-sm font-semibold',
};

interface TitleProps extends React.ComponentProps<'h1'> {
  as?: TitleLevel;
}

function Title({
  as: Level = 'h1',
  className,
  children,
  ref,
  ...delegated
}: TitleProps) {
  return (
    <Level
      ref={ref}
      className={cn(LEVEL_CLASSES[Level], className)}
      {...delegated}
    >
      {children}
    </Level>
  );
}

export default Title;
