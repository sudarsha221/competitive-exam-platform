import type { Metadata } from "next";
import { ExamManagement } from "@/components/admin/exam-management";

export const metadata: Metadata = {
  title: "Exam Management | Northstar",
  description: "Review and manage sample competitive examination records in the admin preview.",
};

export default function ExamManagementPage() {
  return <ExamManagement />;
}
