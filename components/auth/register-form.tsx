"use client";

import { ArrowRight, GraduationCap, LoaderCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { PasswordInput } from "@/components/auth/password-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { normalizeRegistrationPhone } from "@/lib/auth/registration-validation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RegisterErrors = Partial<
  Record<"name" | "email" | "mobile" | "password" | "confirmPassword" | "exam", string>
>;

type NoticeTone = "error" | "info" | "success";

async function completeStudentRegistration(accessToken: string) {
  const response = await fetch("/api/auth/complete-student-registration", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const result = (await response.json()) as { error?: string };

  if (!response.ok) {
    throw new Error(result.error ?? "Student account setup could not be completed.");
  }
}

function getRegistrationErrorMessage(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("already registered") || normalized.includes("user_already_exists")) {
    return "An account with this email already exists.";
  }
  if (normalized.includes("weak password") || normalized.includes("password should")) {
    return "Choose a stronger password that meets the account requirements.";
  }
  if (normalized.includes("failed to fetch") || normalized.includes("network")) {
    return "Could not reach Supabase. Check your connection and try again.";
  }
  return message;
}

export function RegisterForm() {
  const [notice, setNotice] = useState("");
  const [noticeTone, setNoticeTone] = useState<NoticeTone>("info");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAccessToken, setPendingAccessToken] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const mobile = String(formData.get("mobile") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const exam = String(formData.get("exam") ?? "");
    const normalizedPhone = normalizeRegistrationPhone(mobile);
    const nextErrors: RegisterErrors = {};

    if (name.length < 2 || name.length > 100) nextErrors.name = "Enter a name between 2 and 100 characters.";
    if (!emailPattern.test(email)) nextErrors.email = "Enter a valid email address.";
    if (!normalizedPhone) nextErrors.mobile = "Enter a valid phone number, including its country code if needed.";
    if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (!confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
    else if (confirmPassword !== password) nextErrors.confirmPassword = "Passwords do not match.";
    if (!["CET", "NEET", "JEE"].includes(exam)) nextErrors.exam = "Choose an exam.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setNotice("");
      setPendingAccessToken("");
      return;
    }

    setIsSubmitting(true);
    setNotice("");
    setPendingAccessToken("");

    try {
      const configResponse = await fetch("/api/auth/registration-config", { cache: "no-store" });
      if (!configResponse.ok) {
        throw new Error("Registration configuration could not be checked. No account was created.");
      }

      const config = (await configResponse.json()) as { configured?: boolean };
      if (!config.configured) {
        setNotice("Supabase registration is not configured. No account was created.");
        setNoticeTone("error");
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
            phone_e164: normalizedPhone,
            registration_exam: exam,
          },
          emailRedirectTo: `${window.location.origin}/register/confirm`,
        },
      });

      if (error) {
        setNotice(getRegistrationErrorMessage(error.message));
        setNoticeTone("error");
        return;
      }

      if (data.session) {
        setPendingAccessToken(data.session.access_token);
        await completeStudentRegistration(data.session.access_token);
        setPendingAccessToken("");
        setNotice("Your student account is ready. You can now sign in.");
        setNoticeTone("success");
      } else {
        setNotice("Check your inbox and follow the confirmation link. Your student profile will be activated after email verification.");
        setNoticeTone("info");
      }
    } catch (error) {
      setNotice(
        error instanceof Error
          ? getRegistrationErrorMessage(error.message)
          : "Registration could not be completed. Please try again.",
      );
      setNoticeTone("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function retryStudentSetup() {
    if (!pendingAccessToken || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await completeStudentRegistration(pendingAccessToken);
      setPendingAccessToken("");
      setNotice("Your student account is ready. You can now sign in.");
      setNoticeTone("success");
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Student account setup could not be completed. Please try again.",
      );
      setNoticeTone("error");
    } finally {
      setIsSubmitting(false);
    }
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
            maxLength={100}
            required
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              error={errors.confirmPassword}
              onChange={() => clearError("confirmPassword")}
            />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" /> Creating account...
                </>
              ) : (
                <>
                  Create student account <ArrowRight size={17} />
                </>
              )}
            </Button>
          </div>
          {notice ? (
            <div
              role={noticeTone === "error" ? "alert" : "status"}
              className={`rounded-xl border px-3.5 py-3 text-sm leading-5 sm:col-span-2 ${
                noticeTone === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-800"
                  : noticeTone === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-indigo-100 bg-indigo-50 text-indigo-800"
              }`}
            >
              {notice}
              {pendingAccessToken ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  disabled={isSubmitting}
                  onClick={retryStudentSetup}
                >
                  Retry student setup
                </Button>
              ) : null}
            </div>
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
