"use server";

import { z } from "zod";
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
} from "@/lib/validations/auth";
import type { AuthActionResult } from "@/lib/types/auth";
import { createClient } from "@/lib/supabase/server";

function validateData<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; result: AuthActionResult } {
  const validation = schema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      result: {
        success: false,
        errors: z.flattenError(validation.error).fieldErrors as Record<string, string[]>,
        message: "Please fix the validation errors.",
      },
    };
  }
  return { success: true, data: validation.data };
}

export async function signupAction(
  data: SignupInput,
  redirectToOrigin?: string
): Promise<AuthActionResult> {
  const validated = validateData(signupSchema, data);
  if (!validated.success) return validated.result;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      emailRedirectTo: redirectToOrigin ? `${redirectToOrigin}/dashboard` : undefined,
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

export async function loginAction(data: LoginInput): Promise<AuthActionResult> {
  const validated = validateData(loginSchema, data);
  if (!validated.success) return validated.result;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return { success: false, message: "Invalid email or password." };
  }

  return { success: true };
}
