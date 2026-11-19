import { AuthShell } from "@/components/auth/auth-shell";
import { RegistrationConfirmation } from "@/components/auth/registration-confirmation";

export default function RegistrationConfirmationPage() {
  return (
    <AuthShell footerNote="Student registration uses Supabase when configured.">
      <RegistrationConfirmation />
    </AuthShell>
  );
}
