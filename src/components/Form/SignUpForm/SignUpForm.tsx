'use client';

import React from 'react';
import Form from 'next/form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AUTH_ACTION_INITIAL_STATE } from '@/constants';
import { signupAction } from '@/lib/actions/auth';
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

function SignUpForm({
  className,
  ...delegated
}: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();

  const [state, formAction, isPending] = React.useActionState(
    handleSignUp,
    AUTH_ACTION_INITIAL_STATE,
  );

  React.useEffect(() => {
    if (state.success) {
      router.push('/sign-up-success');
    }
  }, [state.success, router]);

  async function handleSignUp(
    _prevState: AuthActionResult,
    formData: FormData,
  ): Promise<AuthActionResult> {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : '';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const repeatPassword = formData.get('repeatPassword') as string;

    return signupAction({ email, password, repeatPassword }, origin);
  }

  return (
    <Card className={className} {...delegated}>
      <CardHeader>
        <CardTitle className="text-2xl">Реєстрація</CardTitle>
        <CardDescription>Створіть новий акаунт</CardDescription>
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
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" name="password" type="password" required />
              {state.errors?.password && (
                <p role="alert" className="text-xs text-destructive">
                  {state.errors.password.join(', ')}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="repeatPassword">Повторіть пароль</Label>
              <Input
                id="repeatPassword"
                name="repeatPassword"
                type="password"
                required
              />
              {state.errors?.repeatPassword && (
                <p role="alert" className="text-xs text-destructive">
                  {state.errors.repeatPassword.join(', ')}
                </p>
              )}
            </div>
            {state.message && (
              <p role="alert" className="text-sm text-destructive">
                {state.message}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Створення акаунта…' : 'Зареєструватися'}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Вже є акаунт?{' '}
            <Link href="/login" className="underline underline-offset-4">
              Увійти
            </Link>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

export default SignUpForm;
