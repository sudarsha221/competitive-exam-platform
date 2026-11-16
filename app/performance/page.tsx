import type { Metadata } from "next";
import { StudentInsights } from "@/components/insights/student-insights";

export const metadata: Metadata = {
  title: "My Performance | Northstar",
  description: "Review sample exam performance analytics for CET, NEET, and JEE.",
};

export default function PerformancePage() {
  return <StudentInsights page="performance" />;
}
