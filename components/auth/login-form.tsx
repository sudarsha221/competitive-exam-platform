"use client";

import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PasswordInput } from "@/components/auth/password-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getLoginErrorMessage(message: string, code?: string) {
  const normalized = `${code ?? ""} ${message}`.toLowerCase();
  if (normalized.includes("email_not_confirmed") || normalized.includes("email not confirmed")) {
    return "Verify your email before signing in.";
  }
  if (
    normalized.includes("invalid_credentials") ||
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid email or password")
  ) {
    return "Email or password is incorrect.";
  }
  if (normalized.includes("failed to fetch") || normalized.includes("network")) {
    return "Could not reach Supabase. Check your connection and try again.";
  }
  return "Sign-in could not be completed. Please try again.";
}

export function LoginForm() {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const nextErrors: typeof errors = {};

    if (!emailPattern.test(email)) nextErrors.email = "Enter a valid email address.";
    if (password.length < 8) nextErrors.password = "Password must be at least 8 characters.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setNotice("");
      return;
    }

    setIsSubmitting(true);
    setNotice("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error || !data.session) {
        setNotice(
          getLoginErrorMessage(error?.message ?? "No session was returned.", error?.code),
        );
        return;
      }

      const response = await fetch("/api/auth/resolve-role", {
        method: "GET",
        headers: { Authorization: `Bearer ${data.session.access_token}` },
        cache: "no-store",
      });
      const result = (await response.json()) as { error?: string; redirectTo?: string };
      const redirectTo = result.redirectTo;

      if (
        !response.ok ||
        (redirectTo !== "/admin/dashboard" &&
          redirectTo !== "/teacher/dashboard" &&
          redirectTo !== "/student/dashboard")
      ) {
        await supabase.auth.signOut({ scope: "local" });
        setNotice(
          result.error ??
            "Your account access could not be verified. Please sign in again.",
        );
        return;
      }

      router.replace(redirectTo);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? getLoginErrorMessage(error.message)
          : "Sign-in could not be completed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Badge variant="primary" className="gap-1.5">
          <LockKeyhole size={13} /> Secure portal
        </Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#142344]">
          Welcome back
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sign in to continue building your study momentum.
        </p>
      </div>

      <Card className="border-white/80 p-5 shadow-[0_24px_70px_-35px_rgba(27,48,93,0.28)] sm:p-7">
        <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={isSubmitting}
            error={errors.email}
            onChange={() => {
              setErrors((current) => ({ ...current, email: undefined }));
              setNotice("");
            }}
          />
          <PasswordInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            minLength={8}
            required
            disabled={isSubmitting}
            error={errors.password}
            onChange={() => {
              setErrors((current) => ({ ...current, password: undefined }));
              setNotice("");
            }}
          />

          <div className="-mt-1 flex flex-wrap items-center justify-between gap-3 text-sm">
            <label htmlFor="remember-me" className="inline-flex cursor-pointer items-center gap-2 text-slate-600">
              <input
                id="remember-me"
                name="remember"
                type="checkbox"
                disabled={isSubmitting}
                className="size-4 rounded border-slate-300 accent-indigo-600"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoaderCircle size={17} className="animate-spin" /> Signing in...
              </>
            ) : (
              <>
                Login <ArrowRight size={17} />
              </>
            )}
          </Button>

          {notice ? (
            <p
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-5 text-rose-800"
            >
              {notice}
            </p>
          ) : null}
        </form>

        <div className="mt-5 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
          New to Northstar?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
            Create a student account
          </Link>
        </div>
      </Card>

      <p className="mt-5 text-center text-xs leading-5 text-slate-400">
        Staff accounts are provisioned by their institution.
      </p>
      <Link href="/" className="mt-5 inline-flex w-full items-center justify-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-indigo-600">
        <Mail size={15} /> Return to Northstar
      </Link>
    </div>
  );
}
