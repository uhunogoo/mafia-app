import PageProvider from '@/components/providers/page-provider';

export default async function RoomLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  return (
    <PageProvider roomId={roomId}>
      {children}
    </PageProvider>
  );
}
