'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/UI/Button';

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  function handleToggleTheme() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Переключити тему"
      onClick={handleToggleTheme}
    >
      {!mounted ? (
        <Sun className="opacity-0" aria-hidden />
      ) : resolvedTheme === 'dark' ? (
        <Sun />
      ) : (
        <Moon />
      )}
    </Button>
  );
}

export default ThemeToggle;
