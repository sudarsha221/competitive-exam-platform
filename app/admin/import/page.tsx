import type { Metadata } from "next";
import { BulkQuestionImport } from "@/components/admin/bulk-question-import";

export const metadata: Metadata = {
  title: "Bulk Question Import | Northstar",
  description: "Preview a frontend-only bulk question import workflow.",
};

export default function BulkQuestionImportPage() {
  return <BulkQuestionImport />;
}
