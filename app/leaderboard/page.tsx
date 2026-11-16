import type { Metadata } from "next";
import { StudentInsights } from "@/components/insights/student-insights";

export const metadata: Metadata = {
  title: "Leaderboard | Northstar",
  description: "Explore fictional sample CET, NEET, and JEE leaderboard rankings.",
};

export default function LeaderboardPage() {
  return <StudentInsights page="leaderboard" />;
}
