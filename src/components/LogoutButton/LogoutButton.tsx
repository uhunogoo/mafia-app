'use client';

import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/UI/Button';

function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <Button onClick={handleLogout} size="sm" variant="ghost">
      Вийти
    </Button>
  );
}

export default LogoutButton;
