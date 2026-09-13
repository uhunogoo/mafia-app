'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/UI/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/UI/Card';
import { Input } from '@/components/UI/Input';
import { Label } from '@/components/UI/Label';

function UpdatePasswordForm({
  className,
  ...delegated
}: React.ComponentPropsWithoutRef<'div'>) {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // Сесія вже активна — ведемо на дашборд
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Сталася помилка');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...delegated}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Новий пароль</CardTitle>
          <CardDescription>Уведіть новий пароль нижче.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">Новий пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Новий пароль"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Збереження…' : 'Зберегти пароль'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default UpdatePasswordForm;
