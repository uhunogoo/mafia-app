import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import JoinForm from '@/components/form/join-form';
import RoomLobby from '@/components/room/room-lobby';
import RoomGuard from '@/components/room/room-guard';

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
    <RoomGuard>
      <div className="room-layout-grid">
        <div className="col-span-2">
          <h1 className="font-bold text-3xl mb-1">Room</h1>
          <p className="text-muted-foreground text-sm font-mono">{roomId}</p>
        </div>

        {/* Body */}
        <RoomLobby />

        <aside className="w-80">
          sidebar
        </aside>

        {/* show for new player */}
        <JoinForm />
      </div>
    </RoomGuard>
  );
}
