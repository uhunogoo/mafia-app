import PageProvider from '@/components/providers/page-provider';

type LayaoutTypes = {
  children: React.ReactNode;
};

function RoomLayout({ children }: LayaoutTypes) {
  return (
    <PageProvider>
      {children}
    </PageProvider>
  );
}

export default RoomLayout;
