export type ExamName = "CET" | "NEET" | "JEE";

export type ExamMetrics = {
  questions: number;
  correct: number;
  accuracy: number;
  weeklyAccuracy: number[];
};

export const examMetrics: Record<ExamName, ExamMetrics> = {
  CET: {
    questions: 428,
    correct: 347,
    accuracy: 81,
    weeklyAccuracy: [66, 72, 69, 78, 76, 83, 81],
  },
  NEET: {
    questions: 612,
    correct: 520,
    accuracy: 85,
    weeklyAccuracy: [72, 75, 74, 81, 79, 87, 85],
  },
  JEE: {
    questions: 382,
    correct: 302,
    accuracy: 79,
    weeklyAccuracy: [64, 69, 72, 68, 77, 81, 79],
  },
};

export const examStreaks: Record<ExamName, { days: number; best: number; activeDays: number[] }> = {
  CET: { days: 7, best: 15, activeDays: [1, 1, 1, 0, 1, 1, 1] },
  NEET: { days: 12, best: 18, activeDays: [1, 1, 1, 1, 1, 1, 1] },
  JEE: { days: 4, best: 9, activeDays: [0, 1, 1, 1, 1, 0, 0] },
};

export const recentPractice = [
  { id: 1, exam: "NEET" as const, subject: "Biology", topic: "Cell structure", questions: 20, accuracy: 90, time: "Today, 10:42 AM" },
  { id: 2, exam: "NEET" as const, subject: "Chemistry", topic: "Chemical bonding", questions: 15, accuracy: 80, time: "Yesterday, 6:18 PM" },
  { id: 3, exam: "CET" as const, subject: "Mathematics", topic: "Differentiation", questions: 25, accuracy: 84, time: "Yesterday, 4:05 PM" },
  { id: 4, exam: "JEE" as const, subject: "Physics", topic: "Laws of motion", questions: 18, accuracy: 72, time: "Mon, 7:30 PM" },
  { id: 5, exam: "NEET" as const, subject: "Physics", topic: "Work and energy", questions: 12, accuracy: 75, time: "Mon, 5:12 PM" },
  { id: 6, exam: "CET" as const, subject: "Chemistry", topic: "Organic reactions", questions: 16, accuracy: 88, time: "Sun, 11:20 AM" },
  { id: 7, exam: "JEE" as const, subject: "Mathematics", topic: "Sequences and series", questions: 22, accuracy: 82, time: "Sun, 9:40 AM" },
];

export const bookmarks = [
  { subject: "Biology", title: "Cell cycle — key checkpoints", tag: "NEET" },
  { subject: "Physics", title: "Work-energy theorem summary", tag: "All exams" },
  { subject: "Chemistry", title: "Periodic trends quick review", tag: "NEET" },
];

export const leaderboard = [
  { rank: 1, name: "Meera K.", points: 2480, initials: "M", tone: "bg-amber-100 text-amber-700" },
  { rank: 2, name: "Kabir S.", points: 2310, initials: "K", tone: "bg-slate-100 text-slate-700" },
  { rank: 3, name: "Aarav S.", points: 2160, initials: "A", tone: "bg-indigo-100 text-indigo-700" },
];

const examOffset: Record<ExamName, number> = { CET: 0, NEET: 5, JEE: 11 };

export function getActivityLevels(exam: ExamName) {
  return Array.from({ length: 84 }, (_, index) => {
    const seed = (index * 17 + Math.floor(index / 7) * 7 + examOffset[exam]) % 29;
    if (seed < 8) return 0;
    if (seed < 14) return 1;
    if (seed < 20) return 2;
    if (seed < 25) return 3;
    return 4;
  });
}
