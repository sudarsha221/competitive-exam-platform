import { Suspense } from "react";
import type { Metadata } from "next";
import type { PracticeExam } from "@/components/practice/practice-data";
import { TeacherWorkspace } from "@/components/teacher/teacher-workspace";

export const metadata: Metadata = {
  title: "Published Question Bank | Northstar",
  description: "Search and review sample published questions and explanations as a teacher.",
};

type TeacherQuestionBankPageProps = {
  searchParams: Promise<{
    search?: string;
    exam?: string;
    question?: string;
  }>;
};

export default function TeacherQuestionBankPage({ searchParams }: TeacherQuestionBankPageProps) {
  return (
    <Suspense fallback={<TeacherWorkspace view="question-bank" />}>
      <QuestionBankContent searchParams={searchParams} />
    </Suspense>
  );
}

async function QuestionBankContent({ searchParams }: TeacherQuestionBankPageProps) {
  const params = await searchParams;
  const exam = params.exam;
  const initialExam: PracticeExam | "All exams" =
    exam === "CET" || exam === "NEET" || exam === "JEE"
    ? exam
    : "All exams";

  return (
    <TeacherWorkspace
      view="question-bank"
      initialSearch={params.search ?? ""}
      initialExam={initialExam}
      initialQuestionId={params.question}
    />
  );
}
