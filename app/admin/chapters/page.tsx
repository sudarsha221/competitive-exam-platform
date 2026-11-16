import type { Metadata } from "next";
import { ChapterManagement } from "@/components/admin/chapter-management";

export const metadata: Metadata = {
  title: "Chapter Management | Northstar",
  description: "Review and manage sample competitive exam chapters in the admin preview.",
};

export default function ChapterManagementPage() {
  return <ChapterManagement />;
}
