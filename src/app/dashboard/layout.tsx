import { AppLayout } from '@/components/app-layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout navLink={{ label: 'Mafia', href: '/' }}>
      {children}
    </AppLayout>
  );
}
