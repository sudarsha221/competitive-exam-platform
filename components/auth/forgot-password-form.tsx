"use client";

import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();

    if (!emailPattern.test(email)) {
      setError("Enter a valid email address.");
      setNotice("");
      return;
    }

    setError("");
    setNotice("Password reset is not connected in this preview, so no email was sent.");
  }

  return (
    <div>
      <div className="mb-6">
        <Badge variant="primary" className="gap-1.5">
          <Mail size={13} /> Account help
        </Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#142344]">
          Reset your password
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter the email address associated with your student account.
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
            error={error}
            onChange={() => {
              setError("");
              setNotice("");
            }}
          />
          <Button type="submit" size="lg" className="w-full">
            Submit <ArrowRight size={17} />
          </Button>
          {notice ? (
            <p role="status" className="rounded-xl border border-indigo-100 bg-indigo-50 px-3.5 py-3 text-sm leading-5 text-indigo-800">
              {notice}
            </p>
          ) : null}
        </form>
      </Card>

      <Link href="/login" className="mt-6 inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600">
        <ArrowLeft size={16} /> Back to login
      </Link>
    </div>
  );
}
