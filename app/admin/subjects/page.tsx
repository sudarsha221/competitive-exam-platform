import type { Metadata } from "next";
import { SubjectManagement } from "@/components/admin/subject-management";

export const metadata: Metadata = {
  title: "Subject Management | Northstar",
  description: "Review and manage sample competitive exam subjects in the admin preview.",
};

export default function SubjectManagementPage() {
  return <SubjectManagement />;
}
