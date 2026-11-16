import {
  examMetrics,
  recentPractice,
  type ExamName,
} from "@/components/dashboard/dashboard-data";
import {
  practiceQuestions,
  type PracticeQuestion,
} from "@/components/practice/practice-data";

export type PerformanceSubject = {
  name: string;
  attempted: number;
  correct: number;
};

export type PerformanceChapter = PerformanceSubject & {
  subject: string;
};

export type ExamPerformance = {
  subjects: PerformanceSubject[];
  chapters: PerformanceChapter[];
  difficulty: Array<{
    name: string;
    attempted: number;
    correct: number;
  }>;
  weekly: number[];
  monthly: number[];
};

export const performanceData: Record<ExamName, ExamPerformance> = {
  CET: {
    subjects: [
      { name: "Mathematics", attempted: 178, correct: 145 },
      { name: "Physics", attempted: 140, correct: 110 },
      { name: "Chemistry", attempted: 110, correct: 92 },
    ],
    chapters: [
      { name: "Differential Calculus", subject: "Mathematics", attempted: 48, correct: 42 },
      { name: "Probability", subject: "Mathematics", attempted: 36, correct: 27 },
      { name: "Current Electricity", subject: "Physics", attempted: 44, correct: 35 },
      { name: "Laws of Motion", subject: "Physics", attempted: 39, correct: 29 },
      { name: "Organic Chemistry", subject: "Chemistry", attempted: 33, correct: 28 },
    ],
    difficulty: [
      { name: "Basic", attempted: 162, correct: 142 },
      { name: "Medium", attempted: 191, correct: 154 },
      { name: "Advanced", attempted: 75, correct: 51 },
    ],
    weekly: [66, 72, 69, 78, 76, 83, 81],
    monthly: [63, 67, 65, 72, 69, 75, 74, 79, 76, 82, 78, 81],
  },
  NEET: {
    subjects: [
      { name: "Biology", attempted: 280, correct: 249 },
      { name: "Chemistry", attempted: 172, correct: 143 },
      { name: "Physics", attempted: 160, correct: 128 },
    ],
    chapters: [
      { name: "Cell: The Unit of Life", subject: "Biology", attempted: 54, correct: 49 },
      { name: "Principles of Inheritance", subject: "Biology", attempted: 47, correct: 40 },
      { name: "Chemical Bonding", subject: "Chemistry", attempted: 42, correct: 36 },
      { name: "Laws of Motion", subject: "Physics", attempted: 38, correct: 30 },
      { name: "Work, Energy and Power", subject: "Physics", attempted: 35, correct: 27 },
    ],
    difficulty: [
      { name: "Basic", attempted: 218, correct: 198 },
      { name: "Medium", attempted: 267, correct: 226 },
      { name: "Advanced", attempted: 127, correct: 96 },
    ],
    weekly: examMetrics.NEET.weeklyAccuracy,
    monthly: [68, 71, 72, 70, 76, 74, 79, 77, 82, 80, 87, 85],
  },
  JEE: {
    subjects: [
      { name: "Mathematics", attempted: 130, correct: 98 },
      { name: "Physics", attempted: 142, correct: 111 },
      { name: "Chemistry", attempted: 110, correct: 93 },
    ],
    chapters: [
      { name: "Sequences and Series", subject: "Mathematics", attempted: 42, correct: 33 },
      { name: "Differential Calculus", subject: "Mathematics", attempted: 39, correct: 28 },
      { name: "Motion in a Plane", subject: "Physics", attempted: 44, correct: 36 },
      { name: "Chemical Equilibrium", subject: "Chemistry", attempted: 38, correct: 31 },
      { name: "Chemical Bonding", subject: "Chemistry", attempted: 34, correct: 29 },
    ],
    difficulty: [
      { name: "Basic", attempted: 102, correct: 88 },
      { name: "Medium", attempted: 184, correct: 147 },
      { name: "Advanced", attempted: 96, correct: 67 },
    ],
    weekly: examMetrics.JEE.weeklyAccuracy,
    monthly: [61, 64, 69, 66, 71, 68, 74, 73, 78, 76, 81, 79],
  },
};

export const rankingPeriods = [
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "all", label: "All time" },
] as const;

export type RankingPeriod = (typeof rankingPeriods)[number]["id"];

export type SampleLeaderboardStudent = {
  id: string;
  name: string;
  points: Record<RankingPeriod, number>;
};

const sampleStudentNames = [
  "Anaya Kapoor",
  "Kabir Mehta",
  "Mira Shah",
  "Aarav Sharma",
  "Dev Malhotra",
  "Ira Desai",
  "Reyansh Nair",
  "Tara Iyer",
  "Vivaan Rao",
  "Sana Khanna",
];

export const sampleLeaderboards: Record<ExamName, SampleLeaderboardStudent[]> = {
  CET: sampleStudentNames.map((name, index) => ({
    id: name === "Aarav Sharma" ? "current-student" : `cet-student-${index + 1}`,
    name,
    points: {
      week: 640 - index * 38 + ((index * 31) % 55),
      month: 1880 - index * 112 + ((index * 53) % 95),
      all: 5840 - index * 340 + ((index * 79) % 180),
    },
  })),
  NEET: sampleStudentNames.map((name, index) => ({
    id: name === "Aarav Sharma" ? "current-student" : `neet-student-${index + 1}`,
    name,
    points: {
      week: 710 - index * 42 + ((index * 47) % 70),
      month: 2160 - index * 128 + ((index * 37) % 105),
      all: 6420 - index * 372 + ((index * 67) % 190),
    },
  })),
  JEE: sampleStudentNames.map((name, index) => ({
    id: name === "Aarav Sharma" ? "current-student" : `jee-student-${index + 1}`,
    name,
    points: {
      week: 590 - index * 35 + ((index * 59) % 58),
      month: 1740 - index * 105 + ((index * 41) % 90),
      all: 5230 - index * 318 + ((index * 71) % 175),
    },
  })),
};

export const sampleBookmarkIds = [
  "neet-bio-cell",
  "neet-chem-bonding",
  "neet-physics-energy",
  "cet-math-derivative",
  "cet-physics-current",
  "jee-physics-projectile",
  "jee-chem-equilibrium",
];

export type SampleMistake = {
  id: string;
  question: PracticeQuestion;
  selectedIndex: number;
  date: string;
};

const mistakeSeeds: Array<[questionId: string, selectedIndex: number, date: string]> = [
  ["neet-bio-cell", 0, "Today, 10:42 AM"],
  ["neet-bio-genetics", 1, "Yesterday, 6:18 PM"],
  ["neet-physics-energy", 0, "Yesterday, 4:05 PM"],
  ["cet-math-derivative", 1, "Mon, 7:30 PM"],
  ["cet-math-probability", 0, "Mon, 5:12 PM"],
  ["jee-physics-projectile", 0, "Sun, 11:20 AM"],
  ["jee-math-sequence", 1, "Sun, 9:40 AM"],
  ["jee-chem-equilibrium", 0, "Sat, 3:15 PM"],
];

function findPracticeQuestion(id: string) {
  const question = practiceQuestions.find((item) => item.id === id);
  if (!question) {
    throw new Error(`Unknown sample practice question: ${id}`);
  }
  return question;
}

export const sampleMistakes: SampleMistake[] = mistakeSeeds.map(
  ([questionId, selectedIndex, date]) => ({
    id: questionId,
    question: findPracticeQuestion(questionId),
    selectedIndex,
    date,
  }),
);

export const sampleHistory = recentPractice;

export function getAccuracy(correct: number, attempted: number) {
  return attempted === 0 ? 0 : Math.round((correct / attempted) * 100);
}
