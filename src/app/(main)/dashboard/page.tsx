import { requireUser } from '@/lib/supabase/auth';
import CreateGame from '@/components/create-game';

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Дашборд</h1>
          <p className="text-sm text-muted-foreground">
            Ви ввійшли як <span className="font-medium">{user.email}</span>
          </p>
        </div>

        <div className="flex max-w-sm flex-col gap-4">
          <h2 className="text-xl font-semibold">Почати гру</h2>
          <p className="text-sm text-muted-foreground">
            Створіть кімнату та поділіться посиланням-запрошенням з іншими
            гравцями.
          </p>
          <CreateGame user={user} />
        </div>
      </div>
    </div>
  );
}
