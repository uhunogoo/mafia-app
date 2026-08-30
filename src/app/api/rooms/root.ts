'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const COLYSEUS_URL = process.env.COLYSEUS_URL ?? 'http://localhost:2567';

export async function createRoom() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect('/login');
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
