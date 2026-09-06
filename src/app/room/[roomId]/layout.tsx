import { AppLayout } from '@/components/app-layout';
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
    <AppLayout navLink={{ label: '← Dashboard', href: '/dashboard' }}>
      <PageProvider roomId={roomId}>
        {children}
      </PageProvider>
    </AppLayout>
  );
}
