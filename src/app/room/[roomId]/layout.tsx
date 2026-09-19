import React from 'react';

import PageProvider from '@/components/Providers/PageProvider';
import RoomMembershipProvider from '@/components/Providers/RoomMembershipProvider';

export default function RoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageProvider>
      <RoomMembershipProvider>
        {children}
      </RoomMembershipProvider>
    </PageProvider>
  );
}
