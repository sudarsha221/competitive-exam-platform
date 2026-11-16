import type { Metadata } from "next";
import { TeacherWorkspace } from "@/components/teacher/teacher-workspace";

export const metadata: Metadata = {
  title: "Teacher Dashboard | Northstar",
  description: "Browse sample published CET, NEET, and JEE questions in the teacher workspace.",
};

export default function TeacherDashboardPage() {
  return <TeacherWorkspace view="overview" />;
}
