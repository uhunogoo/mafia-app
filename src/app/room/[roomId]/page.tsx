import JoinGate from '@/components/join-gate';

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div>
        <h1 className="font-bold text-3xl mb-1">Room</h1>
        <p className="text-muted-foreground text-sm font-mono">{roomId}</p>
      </div>
      <JoinGate roomId={roomId} />
    </div>
  );
}
