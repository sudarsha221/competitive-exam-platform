import type { Metadata } from "next";
import { AdminSettings } from "@/components/admin/admin-settings";

export const metadata: Metadata = {
  title: "Admin Settings | Northstar",
  description: "Preview admin profile, workspace preferences, notifications, appearance, and security settings.",
};

export default function AdminSettingsPage() {
  return <AdminSettings />;
}
