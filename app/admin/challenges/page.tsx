import type { Metadata } from "next";
import { AdminDailyChallengeManagement } from "@/components/admin/daily-challenge-management";

export const metadata: Metadata = {
  title: "Daily Challenge Management | Northstar",
  description: "Manage sample 30-day daily challenge cycles in the Northstar admin preview.",
};

export default function DailyChallengeManagementPage() {
  return <AdminDailyChallengeManagement />;
}
