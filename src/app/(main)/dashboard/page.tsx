import { requireUser } from '@/lib/supabase/auth';
import CreateGame from '@/components/CreateGame';
import Title from '@/components/UI/Title';

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-8">
      <div>
          <Title as="h1" className="mb-2">Дашборд</Title>
        <p className="text-sm text-muted-foreground">
          Ви ввійшли як <span className="font-medium">{user.email}</span>
        </p>
      </div>

      <div className="flex max-w-sm flex-col gap-4">
        <Title as="h2">Почати гру</Title>
        <p className="text-sm text-muted-foreground">
          Створіть кімнату та поділіться посиланням-запрошенням з іншими
          гравцями.
        </p>
        <CreateGame user={user} />
      </div>
    </div>
  );
}
