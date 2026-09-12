import RoomLobby from '@/components/room/room-lobby';
import RoomGuard from '@/components/room/room-guard';

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

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
      </div>
    </RoomGuard>
  );
}
