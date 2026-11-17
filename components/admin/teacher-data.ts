export type TeacherExam = "KCET" | "NEET" | "JEE Main";
export type TeacherStatus = "Active" | "Inactive";

export type TeacherActivity = {
  label: string;
  date: string;
};

export type AdminTeacher = {
  id: string;
  name: string;
  email: string;
  phone: string;
  exams: TeacherExam[];
  status: TeacherStatus;
  joinedAt: string;
  activity: TeacherActivity[];
};

export const teacherExams: TeacherExam[] = ["KCET", "NEET", "JEE Main"];

export const initialAdminTeachers: AdminTeacher[] = [
  {
    id: "TCH-024",
    name: "Meera Shah",
    email: "meera.shah@northstar.edu",
    phone: "+91 98765 43210",
    exams: ["NEET", "JEE Main"],
    status: "Active",
    joinedAt: "2026-11-12",
    activity: [
      { label: "Reviewed a NEET Biology question set", date: "Today · 10:42 AM" },
      { label: "Published a new question set", date: "Nov 15, 2026 · 4:18 PM" },
      { label: "Updated profile information", date: "Nov 12, 2026 · 9:05 AM" },
    ],
  },
  {
    id: "TCH-023",
    name: "Rohan Kulkarni",
    email: "rohan.kulkarni@northstar.edu",
    phone: "+91 98220 15432",
    exams: ["KCET", "JEE Main"],
    status: "Active",
    joinedAt: "2026-11-09",
    activity: [
      { label: "Added a KCET Mathematics question", date: "Today · 9:16 AM" },
      { label: "Reviewed chapter coverage", date: "Nov 14, 2026 · 2:30 PM" },
      { label: "Joined the Northstar teaching team", date: "Nov 9, 2026 · 11:20 AM" },
    ],
  },
  {
    id: "TCH-022",
    name: "Aditi Rao",
    email: "aditi.rao@northstar.edu",
    phone: "+91 98450 26781",
    exams: ["JEE Main"],
    status: "Active",
    joinedAt: "2026-11-03",
    activity: [
      { label: "Updated JEE Main chapter coverage", date: "Yesterday · 3:25 PM" },
      { label: "Reviewed a Physics explanation", date: "Nov 13, 2026 · 12:14 PM" },
      { label: "Joined the Northstar teaching team", date: "Nov 3, 2026 · 10:00 AM" },
    ],
  },
  {
    id: "TCH-021",
    name: "Dev Patel",
    email: "dev.patel@northstar.edu",
    phone: "+91 99090 11843",
    exams: ["NEET"],
    status: "Active",
    joinedAt: "2026-10-28",
    activity: [
      { label: "Reviewed a NEET Chemistry explanation", date: "Nov 16, 2026 · 1:05 PM" },
      { label: "Added a new practice question", date: "Nov 10, 2026 · 11:48 AM" },
      { label: "Joined the Northstar teaching team", date: "Oct 28, 2026 · 9:30 AM" },
    ],
  },
  {
    id: "TCH-020",
    name: "Priya Nair",
    email: "priya.nair@northstar.edu",
    phone: "+91 98470 55216",
    exams: ["KCET", "NEET"],
    status: "Active",
    joinedAt: "2026-10-20",
    activity: [
      { label: "Reviewed a KCET Mathematics question set", date: "Nov 14, 2026 · 5:32 PM" },
      { label: "Updated assigned exam subjects", date: "Nov 6, 2026 · 10:25 AM" },
      { label: "Joined the Northstar teaching team", date: "Oct 20, 2026 · 8:45 AM" },
    ],
  },
  {
    id: "TCH-019",
    name: "Arjun Deshmukh",
    email: "arjun.deshmukh@northstar.edu",
    phone: "+91 98230 73392",
    exams: ["KCET"],
    status: "Inactive",
    joinedAt: "2026-09-16",
    activity: [
      { label: "Account deactivated by an administrator", date: "Nov 2, 2026 · 4:10 PM" },
      { label: "Reviewed a KCET Physics question", date: "Oct 29, 2026 · 11:30 AM" },
      { label: "Joined the Northstar teaching team", date: "Sep 16, 2026 · 9:15 AM" },
    ],
  },
  {
    id: "TCH-018",
    name: "Kavya Iyer",
    email: "kavya.iyer@northstar.edu",
    phone: "+91 98451 62007",
    exams: ["NEET", "JEE Main"],
    status: "Inactive",
    joinedAt: "2026-08-27",
    activity: [
      { label: "Account deactivated by an administrator", date: "Oct 18, 2026 · 2:40 PM" },
      { label: "Updated a Biology question set", date: "Oct 16, 2026 · 12:06 PM" },
      { label: "Joined the Northstar teaching team", date: "Aug 27, 2026 · 10:05 AM" },
    ],
  },
];
