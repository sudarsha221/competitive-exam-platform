import type { Metadata } from "next";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";

export const metadata: Metadata = {
  title: "Student Dashboard | Northstar",
  description: "Student preparation dashboard UI preview for Northstar.",
};

export default function DashboardPage() {
  return <StudentDashboard />;
}
