import type { Metadata } from "next";
import { StudentManagement } from "@/components/admin/student-management";

export const metadata: Metadata = {
  title: "Student Management | Northstar",
  description: "Manage student profiles, exam registrations, and practice activity in the Northstar admin preview.",
};

export default function StudentManagementPage() {
  return <StudentManagement />;
}
