"use client";

import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { PasswordInput } from "@/components/auth/password-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

    setNotice("This UI preview does not connect to authentication, so no login was attempted.");
  }

  return (
    <div>
      <div className="mb-6">
        <Badge variant="primary" className="gap-1.5">
          <LockKeyhole size={13} /> Student portal
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
                className="size-4 rounded border-slate-300 accent-indigo-600"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" size="lg" className="mt-1 w-full">
            Login <ArrowRight size={17} />
          </Button>

          {notice ? (
            <p role="status" className="rounded-xl border border-indigo-100 bg-indigo-50 px-3.5 py-3 text-sm leading-5 text-indigo-800">
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
        Student access only. Staff accounts are managed by their institution.
      </p>
      <Link href="/" className="mt-5 inline-flex w-full items-center justify-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-indigo-600">
        <Mail size={15} /> Return to Northstar
      </Link>
    </div>
  );
}
