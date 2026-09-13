'use client';

import React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/UI/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/UI/Card';
import Input from '@/components/UI/Input';
import Label from '@/components/UI/Label';

function ForgotPasswordForm({
  className,
  ...delegated
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // Ця URL-адреса має бути в списку redirect URLs у налаштуваннях
      // Supabase (Authentication → URL Configuration)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Сталася помилка');
    } finally {
      setIsLoading(false);
    }
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...delegated}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Перевірте пошту</CardTitle>
            <CardDescription>Інструкції з відновлення надіслано</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Якщо ви реєструвалися з цим email і паролем, то отримаєте лист
              для відновлення пароля.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Відновлення пароля</CardTitle>
            <CardDescription>
              Уведіть email — ми надішлемо посилання для скидання пароля
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Надсилання…' : 'Надіслати лист'}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Вже є акаунт?{' '}
                <Link href="/login" className="underline underline-offset-4">
                  Увійти
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ForgotPasswordForm;
