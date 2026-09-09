import Link from 'next/link';
import { Suspense } from 'react';
import { EnvVarWarning } from '@/components/env-var-warning';
import { AuthButton } from '@/components/auth-button';
import { hasEnvVars } from '@/lib/utils';

interface AppNavProps {
  navLink?: { label: string; href: string };
}

function AppNav({ navLink }: AppNavProps) {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          {navLink && <Link href={navLink.href}>{navLink.label}</Link>}
        </div>
        {!hasEnvVars ? (
          <EnvVarWarning />
        ) : (
          <Suspense>
            <AuthButton />
          </Suspense>
        )}
      </div>
    </nav>
  );
}

export default AppNav;
