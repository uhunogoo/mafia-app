'use client';

import React from 'react';
import Form from 'next/form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AUTH_ACTION_INITIAL_STATE } from '@/constants';
import { loginAction } from '@/lib/actions/auth';
import { AuthActionResult } from '@/lib/types/auth';
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

function LoginForm({
  className,
  ...delegated
}: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();

  const [state, formAction, isPending] = React.useActionState(
    handleLogin,
    AUTH_ACTION_INITIAL_STATE,
  );

  React.useEffect(() => {
    if (state.success) {
      router.push('/dashboard');
    }
  }, [state.success, router]);

  async function handleLogin(
    _prevState: AuthActionResult,
    formData: FormData,
  ): Promise<AuthActionResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    return loginAction({ email, password });
  }

  return (
    <Card className={className} {...delegated}>
      <CardHeader>
        <CardTitle className="text-2xl">Вхід</CardTitle>
        <CardDescription>
          Уведіть email, щоб увійти у свій акаунт
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              {state.errors?.email && (
                <p role="alert" className="text-xs text-destructive">
                  {state.errors.email.join(', ')}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Пароль</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Забули пароль?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required />
              {state.errors?.password && (
                <p role="alert" className="text-xs text-destructive">
                  {state.errors.password.join(', ')}
                </p>
              )}
            </div>
            {state.message && (
              <p role="alert" className="text-sm text-destructive">
                {state.message}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Вхід…' : 'Увійти'}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Немає акаунта?{' '}
            <Link href="/sign-up" className="underline underline-offset-4">
              Зареєструватися
            </Link>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
