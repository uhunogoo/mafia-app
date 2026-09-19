import React from 'react';

import RoomMembershipProvider from '@/components/Providers/RoomMembershipProvider';

export default function RoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoomMembershipProvider>
      {children}
    </RoomMembershipProvider>
  );
}
