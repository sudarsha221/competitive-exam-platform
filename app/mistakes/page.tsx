import type { Metadata } from "next";
import { StudentInsights } from "@/components/insights/student-insights";

export const metadata: Metadata = {
  title: "Mistake Notebook | Northstar",
  description: "Review sample incorrect answers, explanations, and retry questions.",
};

export default function MistakesPage() {
  return <StudentInsights page="mistakes" />;
}
