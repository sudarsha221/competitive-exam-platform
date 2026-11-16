"use client";

import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { PasswordInput } from "@/components/auth/password-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^\+?[0-9\s()-]{8,18}$/;

type RegisterErrors = Partial<
  Record<"name" | "email" | "mobile" | "password" | "confirmPassword" | "exam", string>
>;

export function RegisterForm() {
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const mobile = String(formData.get("mobile") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const exam = String(formData.get("exam") ?? "");
    const nextErrors: RegisterErrors = {};

    if (name.length < 2) nextErrors.name = "Enter your full name.";
    if (!emailPattern.test(email)) nextErrors.email = "Enter a valid email address.";
    if (!mobilePattern.test(mobile)) nextErrors.mobile = "Enter a valid mobile number.";
    if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (!confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
    else if (confirmPassword !== password) nextErrors.confirmPassword = "Passwords do not match.";
    if (!["CET", "NEET", "JEE"].includes(exam)) nextErrors.exam = "Choose an exam.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setNotice("");
      return;
    }

    setNotice("Validation looks good. Account creation is disabled in this preview; no account was created.");
  }

  function clearError(field: keyof RegisterErrors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setNotice("");
  }

  return (
    <div>
      <div className="mb-6">
        <Badge variant="primary" className="gap-1.5">
          <GraduationCap size={14} /> Student registration
        </Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#142344]">
          Start your journey
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Create a student profile for focused exam preparation.
        </p>
      </div>

      <Card className="border-white/80 p-5 shadow-[0_24px_70px_-35px_rgba(27,48,93,0.28)] sm:p-7">
        <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
          <Input
            label="Full name"
            name="fullName"
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            minLength={2}
            required
            error={errors.name}
            onChange={() => clearError("name")}
          />
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            error={errors.email}
            onChange={() => clearError("email")}
          />
          <Input
            label="Mobile number"
            name="mobile"
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            inputMode="tel"
            required
            error={errors.mobile}
            onChange={() => clearError("mobile")}
          />
          <div className="grid gap-2">
            <label htmlFor="exam" className="text-sm font-medium text-foreground">Exam preparation</label>
            <select
              id="exam"
              name="exam"
              defaultValue=""
              required
              aria-invalid={Boolean(errors.exam)}
              aria-describedby={errors.exam ? "exam-error" : undefined}
              onChange={() => clearError("exam")}
              className={`min-h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-foreground shadow-sm outline-none transition-[border-color,box-shadow] focus:border-ring focus:ring-4 focus:ring-ring/15 ${
                errors.exam ? "border-danger" : "border-border"
              }`}
            >
              <option value="" disabled>Select an exam</option>
              <option value="CET">CET</option>
              <option value="NEET">NEET</option>
              <option value="JEE">JEE</option>
            </select>
            {errors.exam ? <p id="exam-error" className="text-xs text-danger">{errors.exam}</p> : null}
          </div>
          <div className="sm:col-span-2">
            <PasswordInput
              label="Password"
              name="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
              error={errors.password}
              onChange={() => clearError("password")}
            />
          </div>
          <div className="sm:col-span-2">
            <PasswordInput
              label="Confirm password"
              name="confirmPassword"
              placeholder="Enter your password again"
              autoComplete="new-password"
              minLength={8}
              required
              error={errors.confirmPassword}
              onChange={() => clearError("confirmPassword")}
            />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" size="lg" className="mt-1 w-full">
              Create student account <ArrowRight size={17} />
            </Button>
          </div>
          {notice ? (
            <p role="status" className="rounded-xl border border-indigo-100 bg-indigo-50 px-3.5 py-3 text-sm leading-5 text-indigo-800 sm:col-span-2">
              {notice}
            </p>
          ) : null}
        </form>

        <div className="mt-5 flex items-start gap-2 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-indigo-500" />
          <p>Student sign-up only. Admin and teacher accounts are provisioned separately.</p>
        </div>
        <div className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
