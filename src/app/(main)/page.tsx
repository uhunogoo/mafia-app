import Link from 'next/link';

import { Button } from '@/components/UI/Button';
import { getCurrentUser } from '@/lib/supabase/auth';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-5 py-24 text-center">
      <h1 className="text-5xl font-bold tracking-tight">Мафія</h1>
      <p className="max-w-xl text-balance text-muted-foreground">
        Класична гра компанією онлайн: створи кімнату, поділись посиланням
        з друзями та грай у мафію — ніч, день, голосування. Без реєстрації:
        достатньо нікнейма.
      </p>
      <div className="flex gap-3">
        {user ? (
          <Button asChild size="lg">
            <Link href="/dashboard">Створити кімнату</Link>
          </Button>
        ) : (
          <>
            <Button asChild size="lg">
              <Link href="/sign-up">Почати грати</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Увійти</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
