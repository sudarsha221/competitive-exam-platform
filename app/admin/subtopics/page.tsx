import type { Metadata } from "next";
import { SubtopicManagement } from "@/components/admin/subtopic-management";

export const metadata: Metadata = {
  title: "Subtopic Management | Northstar",
  description: "Review and manage sample competitive exam subtopics in the admin preview.",
};

export default function SubtopicManagementPage() {
  return <SubtopicManagement />;
}
