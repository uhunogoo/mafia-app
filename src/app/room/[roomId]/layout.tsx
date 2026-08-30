import { AppLayout } from '@/components/app-layout';

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout navLink={{ label: '← Dashboard', href: '/dashboard' }}>
      {children}
    </AppLayout>
  );
}
