import type { Metadata } from "next";
import { TeacherWorkspace } from "@/components/teacher/teacher-workspace";

export const metadata: Metadata = {
  title: "Teacher Dashboard | Northstar",
  description: "Teacher workspace for the Northstar exam preparation platform.",
};

export default function TeacherDashboardRoute() {
  return <TeacherWorkspace view="overview" />;
}
