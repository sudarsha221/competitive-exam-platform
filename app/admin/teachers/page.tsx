import type { Metadata } from "next";
import { TeacherManagement } from "@/components/admin/teacher-management";

export const metadata: Metadata = {
  title: "Teacher Management | Northstar",
  description: "Manage teacher profiles, exam assignments, and account access in the Northstar admin preview.",
};

export default function TeacherManagementPage() {
  return <TeacherManagement />;
}
