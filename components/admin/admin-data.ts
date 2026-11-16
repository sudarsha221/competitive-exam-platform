import type { PracticeExam } from "@/components/practice/practice-data";
import {
  getTeacherQuestion,
  teacherQuestions,
  teacherRecentPublishedIds,
} from "@/components/teacher/teacher-data";

export const adminSampleMetrics = [
  { label: "Total Students", value: 2840, note: "+8.4% this month" },
  { label: "Total Teachers", value: 42, note: "Across all exam programs" },
  { label: "Total Questions", value: 1248, note: "Sample platform total" },
  { label: "Published Questions", value: 986, note: "Available to students" },
  { label: "Scheduled Daily Challenges", value: 72, note: "Across CET, NEET, and JEE" },
  { label: "Active Exams", value: 3, note: "CET, NEET, and JEE" },
] as const;

export const adminRecentStudents = [
  { name: "Ananya Desai", initials: "AD", exam: "NEET", registered: "12 min ago", status: "Active" },
  { name: "Kabir Shah", initials: "KS", exam: "CET", registered: "38 min ago", status: "Active" },
  { name: "Isha Kulkarni", initials: "IK", exam: "JEE", registered: "1 hour ago", status: "New" },
  { name: "Arjun Mehta", initials: "AM", exam: "NEET", registered: "2 hours ago", status: "New" },
] satisfies Array<{
  name: string;
  initials: string;
  exam: PracticeExam;
  registered: string;
  status: "Active" | "New";
}>;

export const adminTeacherActivity = [
  { name: "Meera Shah", initials: "MS", activity: "Reviewed a NEET Biology question set", time: "15 min ago", type: "Review" },
  { name: "Rohan Kulkarni", initials: "RK", activity: "Added a CET Mathematics question", time: "42 min ago", type: "Question" },
  { name: "Aditi Rao", initials: "AR", activity: "Updated JEE chapter coverage", time: "1 hour ago", type: "Catalog" },
  { name: "Dev Patel", initials: "DP", activity: "Reviewed a Physics explanation", time: "3 hours ago", type: "Review" },
] as const;

export const adminRecentQuestions = teacherRecentPublishedIds
  .map(getTeacherQuestion)
  .filter((question) => question !== undefined);

export const adminUpcomingChallenges = [
  { day: "Today", exam: "CET", topic: "Differential Calculus", questions: 10, status: "Scheduled" },
  { day: "Tomorrow", exam: "NEET", topic: "Cell Biology", questions: 10, status: "Scheduled" },
  { day: "In 2 days", exam: "JEE", topic: "Sequences and Series", questions: 10, status: "Scheduled" },
] satisfies Array<{
  day: string;
  exam: PracticeExam;
  topic: string;
  questions: number;
  status: "Scheduled";
}>;

export const adminExamQuestionStats: Array<{
  exam: PracticeExam;
  questions: number;
  published: number;
}> = (["CET", "NEET", "JEE"] satisfies PracticeExam[]).map((exam) => {
  const questions = teacherQuestions.filter((question) => question.exam === exam);
  return {
    exam,
    questions: questions.length,
    published: questions.length,
  };
});

export const adminCatalogCounts = {
  subjects: new Set(teacherQuestions.map((question) => question.subject)).size,
  chapters: new Set(teacherQuestions.map((question) => question.chapter)).size,
};
