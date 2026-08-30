import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CreateGame from '@/components/create-game';

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect('/login');
  return data.claims;
}

export default async function DashboardPage() {
  const user = await requireUser();
  console.log(user)
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div>
        <h1 className="font-bold text-3xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Logged in as <span className="font-medium">{user.email}</span>
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-sm">
        <h2 className="font-semibold text-xl">Start a game</h2>
        <p className="text-sm text-muted-foreground">
          Create a new room and share the invite link with other players.
        </p>
        <CreateGame>
          Create Room
        </CreateGame>
      </div>
    </div>
  );
}
