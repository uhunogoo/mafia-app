import { redirect } from 'next/navigation';

import type { JwtPayload } from '@supabase/auth-js';

import { createClient } from '@/lib/supabase/server';

/** Поточний користувач або null (для серверних компонентів без редіректу). */
export async function getCurrentUser(): Promise<JwtPayload | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;
  return data.claims;
}

/** Гарантований користувач: неавторизованих веде на /login. */
export async function requireUser(): Promise<JwtPayload> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}
