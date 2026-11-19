import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create a student account | Northstar",
  description: "Create a student account for Northstar exam preparation.",
};

export default function RegisterPage() {
  return (
    <AuthShell footerNote="Student registration uses Supabase when configured.">
      <RegisterForm />
    </AuthShell>
  );
}
