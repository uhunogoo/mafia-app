'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const COLYSEUS_URL = process.env.COLYSEUS_URL ?? 'http://localhost:2567';

export async function createRoom() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  const res = await fetch(`${COLYSEUS_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'mafia_room' }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create room: ${res.statusText}`);
  }

  const room = await res.json();
  redirect(`/room/${room.roomId}`);
}

// 'use server';

// import { redirect } from 'next/navigation';
// import { createClient } from '@/lib/supabase/server';

// const COLYSEUS_URL = process.env.COLYSEUS_URL ?? 'http://localhost:2567';

// export async function createRoom() {
//   const supabase = await createClient();
//   const { data, error } = await supabase.auth.getClaims();

//   if (error || !data?.claims) {
//     redirect('/auth/login');
//   }

//   const userId = data.claims.sub;
//   const userName = data.claims.user_metadata?.user_name || data.claims.email?.split('@')[0] || 'Host';

//   try {
//     const res = await fetch(`${COLYSEUS_URL}/matchmake/mafia_room`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         // 'Authorization': `Bearer ${process.env.COLYSEUS_SECRET || ''}`
//       },
//       body: JSON.stringify({
//         hostId: userId,
//         hostName: userName
//       }),
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error('Colyseus API Error:', res.status, errorText);
//       throw new Error(`Failed to create room: ${res.status} ${res.statusText}`);
//     }

//     const roomData = await res.json();
//     if (!roomData.roomId) {
//       throw new Error('Invalid response from Colyseus: missing roomId');
//     }

//     redirect(`/room/${roomData.roomId}`);

//   } catch (err) {
//     console.error('Server Action Error:', err);
//     throw new Error('Не вдалося створити ігрову кімнату. Спробуйте пізніше.');
//   }
// }
