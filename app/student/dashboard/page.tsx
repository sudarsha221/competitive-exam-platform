import type { Metadata } from "next";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";

export const metadata: Metadata = {
  title: "Student Dashboard | Northstar",
  description: "Student preparation dashboard for Northstar.",
};

export default function StudentDashboardRoute() {
  return <StudentDashboard />;
}
