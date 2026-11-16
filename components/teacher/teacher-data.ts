import {
  practiceQuestions,
  type PracticeExam,
  type PracticeQuestion,
} from "@/components/practice/practice-data";

export type PublishedTeacherQuestion = PracticeQuestion & {
  publishedLabel: string;
  publishedAgeDays: number;
  views: number;
};

const publishedLabels: Record<string, string> = {
  "neet-bio-cell": "Today",
  "neet-bio-genetics": "Yesterday",
  "neet-chem-bonding": "Today",
  "neet-physics-motion": "2 days ago",
  "neet-physics-energy": "Yesterday",
  "cet-math-derivative": "Today",
  "cet-math-probability": "Yesterday",
  "cet-physics-current": "2 days ago",
  "cet-chem-organic": "Today",
  "jee-physics-projectile": "Yesterday",
  "jee-math-sequence": "Today",
  "jee-chem-equilibrium": "Today",
};

export const teacherQuestions: PublishedTeacherQuestion[] = practiceQuestions.map(
  (question, index) => ({
    ...question,
    publishedLabel: publishedLabels[question.id] ?? "Recently",
    publishedAgeDays: {
      Today: 0,
      Yesterday: 1,
      "2 days ago": 2,
    }[publishedLabels[question.id] ?? "Recently"] ?? 3,
    views: 128 + ((index * 47) % 310),
  }),
);

export const teacherExams: PracticeExam[] = ["CET", "NEET", "JEE"];

export const teacherRecentViewedIds = [
  "neet-bio-cell",
  "jee-physics-projectile",
  "cet-math-derivative",
];

export const teacherRecentPublishedIds = [
  "neet-chem-bonding",
  "cet-math-derivative",
  "jee-math-sequence",
  "jee-chem-equilibrium",
];

export const teacherNotifications = [
  {
    title: "New questions are ready",
    description: "Sample questions were recently added to the published bank.",
    time: "Today",
    icon: "book",
  },
  {
    title: "Question bank updated",
    description: "CET, NEET, and JEE sample sets are available to browse.",
    time: "Yesterday",
    icon: "sparkle",
  },
];

export function getTeacherQuestion(id: string): PublishedTeacherQuestion | undefined {
  return teacherQuestions.find((question) => question.id === id);
}
