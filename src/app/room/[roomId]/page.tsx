import RoomGuard from '@/components/Room/RoomGuard';
import PlayerGrid from '@/components/Room/PlayerGrid';
import RoomSidebar from '@/components/Room/RoomSidebar';
import RoomTopBar from '@/components/Room/RoomTopBar';
import RulesCard from '@/components/Room/RulesCard';
import RoomConnectionProvider from '@/components/Providers/RoomConnectionProvider';

// roomId читається лише на клієнті (useParams у PageProvider) —
// сторінка повністю статична, без доступу до params.
export default function RoomPage() {
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
