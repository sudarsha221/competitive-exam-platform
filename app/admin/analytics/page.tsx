import type { Metadata } from "next";
import { AdminAnalytics } from "@/components/admin/admin-analytics";

export const metadata: Metadata = {
  title: "Analytics & Leaderboard | Northstar",
  description: "Explore illustrative sample student engagement, exam performance, and leaderboard analytics.",
};

export default function AdminAnalyticsPage() {
  return <AdminAnalytics />;
}
