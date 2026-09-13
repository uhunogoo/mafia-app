import Link from 'next/link';

import { getCurrentUser } from '@/lib/supabase/auth';
import Button from '@/components/UI/Button';
import ThemeToggle from '@/components/ThemeToggle';
import LogoutButton from '@/components/LogoutButton';

async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5">
        <Link href="/" className="text-base font-semibold tracking-wide">
          Мафія
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <span className="hidden max-w-52 truncate text-sm text-muted-foreground sm:inline">
                {user.email}
              </span>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard">Дашборд</Link>
              </Button>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="outline">
                <Link href="/login">Увійти</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Реєстрація</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
