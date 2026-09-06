import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import JoinForm from '@/components/form/join-form';
import RoomLobby from '@/components/room-lobby';

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect('/login');
  return data.claims;
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  await requireUser();

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div>
        <h1 className="font-bold text-3xl mb-1">Room</h1>
        <p className="text-muted-foreground text-sm font-mono">{roomId}</p>
      </div>
      <JoinForm />
      <RoomLobby />
    </div>
  );
}
