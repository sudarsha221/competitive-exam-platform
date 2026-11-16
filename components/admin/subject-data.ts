export const subjectExamOptions = ["KCET", "NEET", "JEE Main"] as const;

export type SubjectExam = (typeof subjectExamOptions)[number];
export type SubjectStatus = "Active" | "Inactive";

export type AdminSubject = {
  id: string;
  exam: SubjectExam;
  name: string;
  code: string;
  description: string;
  chapters: number;
  questions: number;
  status: SubjectStatus;
  createdDate: string;
};

export type SubjectDraft = Pick<
  AdminSubject,
  "exam" | "name" | "code" | "description" | "status"
>;

export const initialAdminSubjects: AdminSubject[] = [
  {
    id: "kcet-physics",
    exam: "KCET",
    name: "Physics",
    code: "KCET-PHY",
    description: "Core mechanics, electricity, optics, and modern physics for KCET preparation.",
    chapters: 15,
    questions: 420,
    status: "Active",
    createdDate: "Jan 12, 2024",
  },
  {
    id: "kcet-chemistry",
    exam: "KCET",
    name: "Chemistry",
    code: "KCET-CHEM",
    description: "Physical, organic, and inorganic chemistry topics aligned with the KCET syllabus.",
    chapters: 16,
    questions: 380,
    status: "Active",
    createdDate: "Jan 12, 2024",
  },
  {
    id: "kcet-mathematics",
    exam: "KCET",
    name: "Mathematics",
    code: "KCET-MATH",
    description: "Algebra, calculus, coordinate geometry, and other KCET mathematics topics.",
    chapters: 16,
    questions: 460,
    status: "Active",
    createdDate: "Jan 12, 2024",
  },
  {
    id: "kcet-biology",
    exam: "KCET",
    name: "Biology",
    code: "KCET-BIO",
    description: "Botany and zoology topics for students preparing for the KCET medical stream.",
    chapters: 22,
    questions: 520,
    status: "Active",
    createdDate: "Jan 12, 2024",
  },
  {
    id: "neet-physics",
    exam: "NEET",
    name: "Physics",
    code: "NEET-PHY",
    description: "NEET physics topics with emphasis on concepts, numericals, and application.",
    chapters: 19,
    questions: 650,
    status: "Active",
    createdDate: "Feb 03, 2024",
  },
  {
    id: "neet-chemistry",
    exam: "NEET",
    name: "Chemistry",
    code: "NEET-CHEM",
    description: "NEET chemistry coverage across physical, organic, and inorganic topics.",
    chapters: 20,
    questions: 720,
    status: "Active",
    createdDate: "Feb 03, 2024",
  },
  {
    id: "neet-biology",
    exam: "NEET",
    name: "Biology",
    code: "NEET-BIO",
    description: "Botany and zoology concepts mapped to the NEET preparation syllabus.",
    chapters: 38,
    questions: 1240,
    status: "Active",
    createdDate: "Feb 03, 2024",
  },
  {
    id: "jee-physics",
    exam: "JEE Main",
    name: "Physics",
    code: "JEE-PHY",
    description: "JEE Main physics concepts covering mechanics, electromagnetism, and more.",
    chapters: 21,
    questions: 710,
    status: "Active",
    createdDate: "Feb 18, 2024",
  },
  {
    id: "jee-chemistry",
    exam: "JEE Main",
    name: "Chemistry",
    code: "JEE-CHEM",
    description: "JEE Main chemistry practice across core physical, organic, and inorganic areas.",
    chapters: 22,
    questions: 760,
    status: "Active",
    createdDate: "Feb 18, 2024",
  },
  {
    id: "jee-mathematics",
    exam: "JEE Main",
    name: "Mathematics",
    code: "JEE-MATH",
    description: "JEE Main mathematics topics including calculus, algebra, and coordinate geometry.",
    chapters: 25,
    questions: 880,
    status: "Active",
    createdDate: "Feb 18, 2024",
  },
];
