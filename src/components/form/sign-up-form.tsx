"use client";

import React from "react";
import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signupAction } from "@/app/(auth)/actions";
import { AuthActionResult } from "@/lib/types/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionResult = {
  success: false,
  message: undefined,
  errors: undefined,
};

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const [state, formAction, isPending] = React.useActionState(
    async (prevState: AuthActionResult, formData: FormData) => {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      // Зверніть увагу: name має співпадати з ключем у signupSchema (repeatPassword)
      const repeatPassword = formData.get("repeatPassword") as string;

      return signupAction({ email, password, repeatPassword }, origin);
    },
    initialState
  );

  React.useEffect(() => {
    if (state.success) {
      router.push("/sign-up-success");
    }
  }, [state.success, router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
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
                  <p className="text-xs text-red-500">{state.errors.email.join(", ")}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
                {state.errors?.password && (
                  <p className="text-xs text-red-500">{state.errors.password.join(", ")}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeatPassword">Repeat Password</Label>
                <Input
                  id="repeatPassword"
                  name="repeatPassword"
                  type="password"
                  required
                />
                {state.errors?.repeatPassword && (
                  <p className="text-xs text-destructive">{state.errors.repeatPassword.join(", ")}</p>
                )}
              </div>
              {state.message && (
                <p className="text-sm text-destructive">{state.message}</p>
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating an account..." : "Sign up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
