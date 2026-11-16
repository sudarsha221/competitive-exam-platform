import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Northstar",
  description: "Sample administrative overview for the Northstar exam preparation platform.",
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
