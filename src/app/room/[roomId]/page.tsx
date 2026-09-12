import RoomGuard from '@/components/room/room-guard';
import PlayerGrid from '@/components/room/player-grid';
import RoomSidebar from '@/components/room/room-sidebar';
import RoomTopBar from '@/components/room/room-top-bar';
import RulesCard from '@/components/room/rules-card';
import { RoomConnectionProvider } from '@/components/room/room-context';

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  await params;

  return (
    <RoomGuard>
      <RoomConnectionProvider>
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-4 p-4 md:p-6">
          <RoomTopBar />

          <div className="room-body-grid flex-1 items-start">
            <PlayerGrid />

            <aside className="flex w-full flex-col gap-4">
              <RoomSidebar />
              <RulesCard />
            </aside>
          </div>
        </div>
      </RoomConnectionProvider>
    </RoomGuard>
  );
}
