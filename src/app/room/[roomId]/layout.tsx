import PageProvider from '@/components/providers/page-provider';

export default function RoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageProvider>
      {children}
    </PageProvider>
  );
}
