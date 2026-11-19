import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Northstar",
  description: "Administrative overview for the Northstar exam preparation platform.",
};

export default function AdminDashboardRoute() {
  return <AdminDashboard />;
}
