import React from 'react';

import PageProvider from '@/components/Providers/PageProvider';

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
