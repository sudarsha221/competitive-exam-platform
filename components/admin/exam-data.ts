export type ExamStatus = "Active" | "Inactive";

export type AdminExam = {
  id: string;
  name: string;
  code: string;
  description: string;
  subjects: number;
  questions: number;
  status: ExamStatus;
  createdDate: string;
};

export type ExamDraft = Pick<AdminExam, "name" | "code" | "description" | "status">;

export const initialAdminExams: AdminExam[] = [
  {
    id: "kcet",
    name: "KCET",
    code: "KCET",
    description: "Karnataka state entrance examination for engineering, pharmacy, and related programs.",
    subjects: 4,
    questions: 1560,
    status: "Active",
    createdDate: "Jan 12, 2024",
  },
  {
    id: "neet",
    name: "NEET",
    code: "NEET",
    description: "National medical entrance examination covering Physics, Chemistry, and Biology.",
    subjects: 3,
    questions: 6800,
    status: "Active",
    createdDate: "Feb 03, 2024",
  },
  {
    id: "jee-main",
    name: "JEE Main",
    code: "JEE-MAIN",
    description: "National engineering entrance examination across Mathematics, Physics, and Chemistry.",
    subjects: 3,
    questions: 7200,
    status: "Active",
    createdDate: "Feb 18, 2024",
  },
];
