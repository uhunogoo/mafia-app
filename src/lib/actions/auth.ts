'use server';

import { z } from 'zod';

import type { AuthActionResult } from '@/lib/types/auth';
import { createClient } from '@/lib/supabase/server';
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
} from '@/lib/validations/auth';

function validateData<T>(
  schema: z.ZodType<T>,
  data: unknown,
): { success: true; data: T } | { success: false; result: AuthActionResult } {
  const validation = schema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      result: {
        success: false,
        errors: z.flattenError(validation.error).fieldErrors,
        message: 'Виправте помилки валідації.',
      },
    };
  }
  return { success: true, data: validation.data };
}

export async function signupAction(
  data: SignupInput,
  redirectToOrigin?: string,
): Promise<AuthActionResult> {
  const validated = validateData(signupSchema, data);
  if (!validated.success) return validated.result;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      emailRedirectTo: redirectToOrigin
        ? `${redirectToOrigin}/dashboard`
        : undefined,
    },
  });

  if (error) {
    return { success: false, message: translateAuthError(error.message) };
  }

  return { success: true };
}

export async function loginAction(
  data: LoginInput,
): Promise<AuthActionResult> {
  const validated = validateData(loginSchema, data);
  if (!validated.success) return validated.result;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return { success: false, message: 'Невірний email або пароль.' };
  }

  return { success: true };
}

/** Часті повідомлення Supabase українською; решта — як є. */
function translateAuthError(message: string): string {
  if (/already registered/i.test(message)) {
    return 'Користувач з таким email вже зареєстрований.';
  }
  if (/password/i.test(message) && /should be at least/i.test(message)) {
    return 'Пароль закороткий.';
  }
  if (/invalid email/i.test(message)) {
    return 'Некоректний email.';
  }
  if (/rate limit/i.test(message)) {
    return 'Занадто багато спроб. Спробуйте пізніше.';
  }
  return message;
}
