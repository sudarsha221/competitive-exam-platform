export type StudentExam = "KCET" | "NEET" | "JEE Main";
export type StudentStatus = "Active" | "Inactive";

export type StudentActivity = {
  exam: StudentExam;
  subject: string;
  topic: string;
  questions: number;
  accuracy: number;
  date: string;
};

export type StudentStreak = {
  current: number;
  best: number;
};

export type AdminStudent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  exams: StudentExam[];
  status: StudentStatus;
  registeredAt: string;
  practiceAttempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  dailyChallengesCompleted: number;
  dailyChallengesTotal: number;
  streaks: Partial<Record<StudentExam, StudentStreak>>;
  activity: StudentActivity[];
};

export type StudentDraft = Pick<AdminStudent, "name" | "email" | "phone" | "exams" | "status">;

export const studentExams: StudentExam[] = ["KCET", "NEET", "JEE Main"];

export const initialAdminStudents: AdminStudent[] = [
  {
    id: "STU-1042",
    name: "Ananya Desai",
    email: "ananya.desai@example.com",
    phone: "+91 98765 21034",
    exams: ["NEET", "KCET"],
    status: "Active",
    registeredAt: "2026-11-15",
    practiceAttempts: 38,
    correctAnswers: 842,
    incorrectAnswers: 176,
    dailyChallengesCompleted: 19,
    dailyChallengesTotal: 24,
    streaks: { NEET: { current: 12, best: 18 }, KCET: { current: 5, best: 11 } },
    activity: [
      { exam: "NEET", subject: "Biology", topic: "Cell structure", questions: 20, accuracy: 90, date: "Today · 10:42 AM" },
      { exam: "KCET", subject: "Mathematics", topic: "Differentiation", questions: 25, accuracy: 84, date: "Yesterday · 4:05 PM" },
      { exam: "NEET", subject: "Chemistry", topic: "Chemical bonding", questions: 15, accuracy: 80, date: "Nov 13 · 6:18 PM" },
    ],
  },
  {
    id: "STU-1041",
    name: "Kabir Shah",
    email: "kabir.shah@example.com",
    phone: "+91 98220 45831",
    exams: ["KCET", "JEE Main"],
    status: "Active",
    registeredAt: "2026-11-12",
    practiceAttempts: 31,
    correctAnswers: 716,
    incorrectAnswers: 194,
    dailyChallengesCompleted: 16,
    dailyChallengesTotal: 22,
    streaks: { KCET: { current: 8, best: 14 }, "JEE Main": { current: 4, best: 10 } },
    activity: [
      { exam: "JEE Main", subject: "Physics", topic: "Laws of motion", questions: 18, accuracy: 72, date: "Today · 9:18 AM" },
      { exam: "KCET", subject: "Chemistry", topic: "Organic reactions", questions: 16, accuracy: 88, date: "Yesterday · 11:20 AM" },
      { exam: "JEE Main", subject: "Mathematics", topic: "Sequences and series", questions: 22, accuracy: 82, date: "Nov 10 · 7:30 PM" },
    ],
  },
  {
    id: "STU-1040",
    name: "Isha Kulkarni",
    email: "isha.kulkarni@example.com",
    phone: "+91 98450 26781",
    exams: ["NEET"],
    status: "Active",
    registeredAt: "2026-11-09",
    practiceAttempts: 24,
    correctAnswers: 634,
    incorrectAnswers: 121,
    dailyChallengesCompleted: 21,
    dailyChallengesTotal: 24,
    streaks: { NEET: { current: 16, best: 21 } },
    activity: [
      { exam: "NEET", subject: "Biology", topic: "Principles of inheritance", questions: 30, accuracy: 93, date: "Today · 8:55 AM" },
      { exam: "NEET", subject: "Physics", topic: "Work and energy", questions: 12, accuracy: 75, date: "Nov 15 · 5:12 PM" },
      { exam: "NEET", subject: "Chemistry", topic: "Equilibrium", questions: 20, accuracy: 85, date: "Nov 14 · 12:08 PM" },
    ],
  },
  {
    id: "STU-1039",
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    phone: "+91 99090 11843",
    exams: ["NEET", "JEE Main"],
    status: "Active",
    registeredAt: "2026-11-05",
    practiceAttempts: 29,
    correctAnswers: 589,
    incorrectAnswers: 207,
    dailyChallengesCompleted: 13,
    dailyChallengesTotal: 20,
    streaks: { NEET: { current: 6, best: 13 }, "JEE Main": { current: 9, best: 12 } },
    activity: [
      { exam: "JEE Main", subject: "Mathematics", topic: "Differential calculus", questions: 25, accuracy: 80, date: "Yesterday · 7:15 PM" },
      { exam: "NEET", subject: "Biology", topic: "Plant physiology", questions: 18, accuracy: 83, date: "Nov 15 · 3:40 PM" },
      { exam: "JEE Main", subject: "Physics", topic: "Current electricity", questions: 20, accuracy: 70, date: "Nov 12 · 6:05 PM" },
    ],
  },
  {
    id: "STU-1038",
    name: "Sana Khan",
    email: "sana.khan@example.com",
    phone: "+91 98900 32164",
    exams: ["KCET"],
    status: "Active",
    registeredAt: "2026-10-29",
    practiceAttempts: 18,
    correctAnswers: 412,
    incorrectAnswers: 88,
    dailyChallengesCompleted: 11,
    dailyChallengesTotal: 16,
    streaks: { KCET: { current: 7, best: 9 } },
    activity: [
      { exam: "KCET", subject: "Mathematics", topic: "Probability", questions: 24, accuracy: 88, date: "Today · 7:25 AM" },
      { exam: "KCET", subject: "Physics", topic: "Motion in a plane", questions: 18, accuracy: 78, date: "Nov 14 · 6:45 PM" },
      { exam: "KCET", subject: "Chemistry", topic: "Chemical equilibrium", questions: 15, accuracy: 80, date: "Nov 12 · 2:30 PM" },
    ],
  },
  {
    id: "STU-1037",
    name: "Dev Patel",
    email: "dev.patel@example.com",
    phone: "+91 98701 55028",
    exams: ["NEET", "JEE Main"],
    status: "Active",
    registeredAt: "2026-10-23",
    practiceAttempts: 34,
    correctAnswers: 901,
    incorrectAnswers: 231,
    dailyChallengesCompleted: 20,
    dailyChallengesTotal: 24,
    streaks: { NEET: { current: 14, best: 20 }, "JEE Main": { current: 10, best: 16 } },
    activity: [
      { exam: "NEET", subject: "Chemistry", topic: "Chemical bonding", questions: 22, accuracy: 91, date: "Today · 11:10 AM" },
      { exam: "JEE Main", subject: "Physics", topic: "Laws of motion", questions: 18, accuracy: 78, date: "Yesterday · 8:22 PM" },
      { exam: "NEET", subject: "Biology", topic: "Cell cycle", questions: 20, accuracy: 95, date: "Nov 13 · 9:40 AM" },
    ],
  },
  {
    id: "STU-1036",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91 98470 55216",
    exams: ["KCET", "NEET"],
    status: "Active",
    registeredAt: "2026-10-18",
    practiceAttempts: 27,
    correctAnswers: 548,
    incorrectAnswers: 155,
    dailyChallengesCompleted: 15,
    dailyChallengesTotal: 22,
    streaks: { KCET: { current: 3, best: 9 }, NEET: { current: 11, best: 14 } },
    activity: [
      { exam: "NEET", subject: "Biology", topic: "Human physiology", questions: 25, accuracy: 88, date: "Yesterday · 1:15 PM" },
      { exam: "KCET", subject: "Mathematics", topic: "Integral calculus", questions: 20, accuracy: 75, date: "Nov 14 · 4:50 PM" },
      { exam: "NEET", subject: "Physics", topic: "Ray optics", questions: 16, accuracy: 81, date: "Nov 11 · 3:20 PM" },
    ],
  },
  {
    id: "STU-1035",
    name: "Vikram Joshi",
    email: "vikram.joshi@example.com",
    phone: "+91 98230 73392",
    exams: ["JEE Main"],
    status: "Inactive",
    registeredAt: "2026-10-10",
    practiceAttempts: 15,
    correctAnswers: 284,
    incorrectAnswers: 126,
    dailyChallengesCompleted: 7,
    dailyChallengesTotal: 16,
    streaks: { "JEE Main": { current: 0, best: 8 } },
    activity: [
      { exam: "JEE Main", subject: "Mathematics", topic: "Quadratic equations", questions: 20, accuracy: 70, date: "Oct 9 · 3:25 PM" },
      { exam: "JEE Main", subject: "Physics", topic: "Electrostatics", questions: 16, accuracy: 63, date: "Oct 7 · 2:12 PM" },
      { exam: "JEE Main", subject: "Chemistry", topic: "Chemical kinetics", questions: 18, accuracy: 72, date: "Oct 4 · 10:35 AM" },
    ],
  },
  {
    id: "STU-1034",
    name: "Nisha Rao",
    email: "nisha.rao@example.com",
    phone: "+91 98451 62007",
    exams: ["NEET", "KCET"],
    status: "Active",
    registeredAt: "2026-10-03",
    practiceAttempts: 22,
    correctAnswers: 477,
    incorrectAnswers: 113,
    dailyChallengesCompleted: 18,
    dailyChallengesTotal: 24,
    streaks: { NEET: { current: 9, best: 15 }, KCET: { current: 4, best: 8 } },
    activity: [
      { exam: "NEET", subject: "Biology", topic: "Genetics", questions: 30, accuracy: 90, date: "Today · 9:02 AM" },
      { exam: "KCET", subject: "Chemistry", topic: "Organic chemistry", questions: 15, accuracy: 80, date: "Nov 12 · 1:18 PM" },
      { exam: "NEET", subject: "Physics", topic: "Thermodynamics", questions: 18, accuracy: 78, date: "Nov 10 · 5:44 PM" },
    ],
  },
  {
    id: "STU-1033",
    name: "Rohan Kulkarni",
    email: "rohan.kulkarni@example.com",
    phone: "+91 98220 15432",
    exams: ["KCET", "JEE Main"],
    status: "Active",
    registeredAt: "2026-09-24",
    practiceAttempts: 19,
    correctAnswers: 391,
    incorrectAnswers: 139,
    dailyChallengesCompleted: 10,
    dailyChallengesTotal: 18,
    streaks: { KCET: { current: 2, best: 7 }, "JEE Main": { current: 5, best: 11 } },
    activity: [
      { exam: "JEE Main", subject: "Mathematics", topic: "Sequences and series", questions: 22, accuracy: 82, date: "Yesterday · 7:30 PM" },
      { exam: "KCET", subject: "Physics", topic: "Work and energy", questions: 18, accuracy: 72, date: "Nov 11 · 4:40 PM" },
      { exam: "JEE Main", subject: "Chemistry", topic: "Atomic structure", questions: 20, accuracy: 75, date: "Nov 8 · 8:14 AM" },
    ],
  },
  {
    id: "STU-1032",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 99090 44712",
    exams: ["KCET", "NEET", "JEE Main"],
    status: "Active",
    registeredAt: "2026-09-16",
    practiceAttempts: 46,
    correctAnswers: 1120,
    incorrectAnswers: 288,
    dailyChallengesCompleted: 22,
    dailyChallengesTotal: 26,
    streaks: {
      KCET: { current: 7, best: 15 },
      NEET: { current: 12, best: 18 },
      "JEE Main": { current: 4, best: 9 },
    },
    activity: [
      { exam: "NEET", subject: "Physics", topic: "Current electricity", questions: 20, accuracy: 85, date: "Today · 10:25 AM" },
      { exam: "JEE Main", subject: "Mathematics", topic: "Differential calculus", questions: 25, accuracy: 84, date: "Yesterday · 7:40 PM" },
      { exam: "KCET", subject: "Chemistry", topic: "Chemical bonding", questions: 18, accuracy: 89, date: "Nov 13 · 3:11 PM" },
    ],
  },
  {
    id: "STU-1031",
    name: "Meera Shah",
    email: "meera.shah@example.com",
    phone: "+91 98765 43210",
    exams: ["NEET"],
    status: "Inactive",
    registeredAt: "2026-08-29",
    practiceAttempts: 12,
    correctAnswers: 231,
    incorrectAnswers: 119,
    dailyChallengesCompleted: 5,
    dailyChallengesTotal: 14,
    streaks: { NEET: { current: 0, best: 6 } },
    activity: [
      { exam: "NEET", subject: "Biology", topic: "Cell: the unit of life", questions: 15, accuracy: 80, date: "Aug 28 · 10:22 AM" },
      { exam: "NEET", subject: "Chemistry", topic: "Periodic table", questions: 18, accuracy: 67, date: "Aug 26 · 9:40 AM" },
      { exam: "NEET", subject: "Physics", topic: "Motion in a plane", questions: 12, accuracy: 75, date: "Aug 24 · 2:15 PM" },
    ],
  },
  {
    id: "STU-1030",
    name: "Karan Malhotra",
    email: "karan.malhotra@example.com",
    phone: "+91 98100 63425",
    exams: ["JEE Main"],
    status: "Active",
    registeredAt: "2026-08-13",
    practiceAttempts: 17,
    correctAnswers: 368,
    incorrectAnswers: 152,
    dailyChallengesCompleted: 8,
    dailyChallengesTotal: 16,
    streaks: { "JEE Main": { current: 3, best: 10 } },
    activity: [
      { exam: "JEE Main", subject: "Physics", topic: "Laws of motion", questions: 18, accuracy: 78, date: "Yesterday · 8:22 PM" },
      { exam: "JEE Main", subject: "Mathematics", topic: "Probability", questions: 20, accuracy: 70, date: "Nov 11 · 9:05 AM" },
      { exam: "JEE Main", subject: "Chemistry", topic: "Chemical equilibrium", questions: 16, accuracy: 75, date: "Nov 8 · 6:50 PM" },
    ],
  },
  {
    id: "STU-1029",
    name: "Siddhi Patil",
    email: "siddhi.patil@example.com",
    phone: "+91 98901 72944",
    exams: ["KCET", "NEET"],
    status: "Active",
    registeredAt: "2026-07-30",
    practiceAttempts: 21,
    correctAnswers: 522,
    incorrectAnswers: 108,
    dailyChallengesCompleted: 17,
    dailyChallengesTotal: 24,
    streaks: { KCET: { current: 10, best: 12 }, NEET: { current: 6, best: 10 } },
    activity: [
      { exam: "KCET", subject: "Mathematics", topic: "Differential calculus", questions: 25, accuracy: 92, date: "Today · 8:10 AM" },
      { exam: "NEET", subject: "Biology", topic: "Human physiology", questions: 20, accuracy: 90, date: "Nov 12 · 4:02 PM" },
      { exam: "KCET", subject: "Physics", topic: "Current electricity", questions: 16, accuracy: 81, date: "Nov 9 · 12:36 PM" },
    ],
  },
  {
    id: "STU-1028",
    name: "Neil Fernandes",
    email: "neil.fernandes@example.com",
    phone: "+91 98201 88219",
    exams: ["NEET", "JEE Main"],
    status: "Inactive",
    registeredAt: "2026-06-22",
    practiceAttempts: 9,
    correctAnswers: 149,
    incorrectAnswers: 101,
    dailyChallengesCompleted: 3,
    dailyChallengesTotal: 12,
    streaks: { NEET: { current: 0, best: 4 }, "JEE Main": { current: 0, best: 3 } },
    activity: [
      { exam: "NEET", subject: "Chemistry", topic: "Atomic structure", questions: 14, accuracy: 64, date: "Jun 20 · 12:45 PM" },
      { exam: "JEE Main", subject: "Physics", topic: "Work and energy", questions: 12, accuracy: 58, date: "Jun 18 · 5:30 PM" },
      { exam: "NEET", subject: "Biology", topic: "Biomolecules", questions: 16, accuracy: 69, date: "Jun 15 · 10:20 AM" },
    ],
  },
];
