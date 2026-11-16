import type { Metadata } from "next";
import { QuestionBankManagement } from "@/components/admin/question-bank-management";

export const metadata: Metadata = {
  title: "Question Bank | Northstar",
  description: "Manage sample exam questions in the Northstar admin preview.",
};

export default function QuestionBankManagementPage() {
  return <QuestionBankManagement />;
}
