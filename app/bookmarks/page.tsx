import type { Metadata } from "next";
import { StudentInsights } from "@/components/insights/student-insights";

export const metadata: Metadata = {
  title: "Bookmarks | Northstar",
  description: "Review sample saved practice questions and explanations.",
};

export default function BookmarksPage() {
  return <StudentInsights page="bookmarks" />;
}
