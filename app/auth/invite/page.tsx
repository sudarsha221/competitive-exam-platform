import { AuthShell } from "@/components/auth/auth-shell";
import { TeacherInvitationAcceptance } from "@/components/auth/teacher-invitation-acceptance";

export default function TeacherInvitationPage() {
  return (
    <AuthShell footerNote="Teacher accounts are provisioned by an administrator.">
      <TeacherInvitationAcceptance />
    </AuthShell>
  );
}
