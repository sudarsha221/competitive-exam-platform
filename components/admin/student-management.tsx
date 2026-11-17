"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowUpDown,
  BookOpenCheck,
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Pencil,
  Phone,
  Search,
  ShieldCheck,
  Target,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { initialAdminStudents, studentExams } from "@/components/admin/student-data";
import type {
  AdminStudent,
  StudentDraft,
  StudentExam,
  StudentStatus,
} from "@/components/admin/student-data";

type StatusFilter = "All statuses" | StudentStatus;
type ExamFilter = "All exams" | StudentExam;
type SortOrder = "newest" | "oldest" | "name-asc" | "name-desc";
type PageSize = 5 | 10 | 20;
type FormErrors = Partial<Record<keyof StudentDraft, string>>;
type Overlay =
  | { type: "details"; studentId: string }
  | { type: "edit"; studentId: string }
  | { type: "deactivate"; studentId: string; pendingDraft?: StudentDraft }
  | null;

const navigationItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Exam management", href: "/admin/exams", icon: GraduationCap },
  { label: "Teacher management", href: "/admin/teachers", icon: UserRound },
  { label: "Student management", href: "/admin/students", icon: Users, active: true },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Northstar home">
          <span className="grid size-9 place-items-center rounded-xl bg-[#15264b] text-white">
            <BookOpenCheck size={18} />
          </span>
          <span className="text-base font-bold tracking-tight text-[#142344]">
            northstar<span className="text-indigo-600">.</span>
          </span>
        </Link>
        {mobile ? (
          <Button variant="ghost" size="icon" aria-label="Close admin navigation" onClick={onClose}>
            <X size={18} />
          </Button>
        ) : null}
      </div>
      <nav aria-label="Admin dashboard" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Platform administration
        </p>
        <div className="grid gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                aria-current={item.active ? "page" : undefined}
                className={`group flex min-h-10 items-center gap-3 rounded-xl px-3 text-[12px] font-medium transition ${
                  item.active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[#142344]"
                }`}
              >
                <Icon size={16} className={item.active ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="shrink-0 border-t border-slate-100 p-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#142344] to-[#263d70] p-4 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-indigo-200" />
            <span className="text-xs font-semibold">Admin workspace</span>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-indigo-100/70">
            Sample student records · changes stay in this page.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2.5 px-1">
          <span className="grid size-9 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">AM</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-[#142344]">Aarav Mehta</span>
            <span className="mt-0.5 block text-[10px] text-slate-400">Platform admin · sample</span>
          </span>
          <ShieldCheck size={16} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}

function StudentHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          size="icon"
          className="!size-9 !min-h-9 !min-w-9 !p-0 shrink-0 rounded-xl lg:hidden"
          aria-label="Open admin navigation"
          onClick={onOpenMenu}
        >
          <Menu size={18} />
        </Button>
        <div className="min-w-0">
          <p className="truncate text-[10px] text-slate-400">Platform administration</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-[#142344]">Student Management</p>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button variant="ghost" size="icon" className="!size-9 !min-h-9 !min-w-9 !p-0 rounded-xl" aria-label="Help">
            <CircleHelp size={17} />
          </Button>
          <span className="mx-1 hidden h-7 w-px bg-slate-200 sm:block" />
          <div className="hidden items-center gap-2 sm:flex">
            <span className="grid size-8 place-items-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">AM</span>
            <span>
              <span className="block text-[10px] font-semibold text-[#142344]">Aarav Mehta</span>
              <span className="block text-[9px] text-slate-400">Administrator · sample</span>
            </span>
            <ChevronDown size={13} className="text-slate-400" />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="!size-9 !min-h-9 !min-w-9 !p-0 rounded-xl sm:!h-9 sm:!w-auto sm:!px-3"
            aria-label="Log out"
            title="Sign-out is not connected in this preview"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function StudentStatusBadge({ status }: { status: StudentStatus }) {
  return (
    <Badge variant={status === "Active" ? "success" : "default"} className="gap-1.5 px-2.5 py-1.5">
      <span className={`size-1.5 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
      {status}
    </Badge>
  );
}

function StatCard({
  label,
  value,
  note,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number | string;
  note: string;
  icon: typeof Users;
  tone: string;
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#142344]">{value}</p>
        </div>
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-[11px] leading-4 text-slate-400">{note}</p>
    </Card>
  );
}

function StudentForm({
  student,
  existingStudents,
  onCancel,
  onSave,
}: {
  student: AdminStudent;
  existingStudents: AdminStudent[];
  onCancel: () => void;
  onSave: (draft: StudentDraft) => void;
}) {
  const [draft, setDraft] = useState<StudentDraft>({
    name: student.name,
    email: student.email,
    phone: student.phone,
    exams: [...student.exams],
    status: student.status,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function updateDraft<Key extends keyof StudentDraft>(key: Key, value: StudentDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function toggleExam(exam: StudentExam) {
    updateDraft(
      "exams",
      draft.exams.includes(exam)
        ? draft.exams.filter((assignedExam) => assignedExam !== exam)
        : [...draft.exams, exam],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    const normalizedEmail = draft.email.trim().toLowerCase();

    if (draft.name.trim().length < 2) nextErrors.name = "Enter the student's full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    } else if (
      existingStudents.some(
        (existing) => existing.id !== student.id && existing.email.toLowerCase() === normalizedEmail,
      )
    ) {
      nextErrors.email = "A student with this email address already exists.";
    }
    if (!/^[+]?[\d\s()-]{7,20}$/.test(draft.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number.";
    }
    if (draft.exams.length === 0) nextErrors.exams = "Select at least one registered examination.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave({
      ...draft,
      name: draft.name.trim(),
      email: normalizedEmail,
      phone: draft.phone.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Full name"
          placeholder="e.g. Ananya Desai"
          autoComplete="name"
          value={draft.name}
          onChange={(event) => updateDraft("name", event.target.value)}
          error={errors.name}
          required
        />
        <Input
          label="Email address"
          placeholder="name@example.com"
          type="email"
          autoComplete="email"
          value={draft.email}
          onChange={(event) => updateDraft("email", event.target.value)}
          error={errors.email}
          required
        />
        <Input
          label="Phone number"
          placeholder="+91 98765 43210"
          type="tel"
          autoComplete="tel"
          value={draft.phone}
          onChange={(event) => updateDraft("phone", event.target.value)}
          error={errors.phone}
          required
        />
        <div className="grid gap-2">
          <label htmlFor="student-status" className="text-sm font-medium text-foreground">Account status</label>
          <select
            id="student-status"
            value={draft.status}
            onChange={(event) => updateDraft("status", event.target.value as StudentStatus)}
            className="min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-foreground">Registered examinations</legend>
        <p className="text-xs text-slate-500">Choose all exams this student is preparing for.</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {studentExams.map((exam) => {
            const checked = draft.exams.includes(exam);
            return (
              <label
                key={exam}
                className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-3 text-sm transition ${
                  checked ? "border-indigo-200 bg-indigo-50/70 text-indigo-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleExam(exam)}
                  className="size-4 accent-indigo-600"
                />
                <span className="font-medium">{exam}</span>
              </label>
            );
          })}
        </div>
        {errors.exams ? <p className="text-xs text-danger">{errors.exams}</p> : null}
      </fieldset>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit"><Check size={16} /> Save changes</Button>
      </div>
    </form>
  );
}

function DialogFrame({
  title,
  eyebrow,
  onClose,
  children,
  width = "max-w-xl",
}: {
  title: string;
  eyebrow: string;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-[#101b33]/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-dialog-title"
        initial={{ opacity: 0, y: 18, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.99 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-[24px] border border-slate-200 bg-white shadow-2xl sm:rounded-[24px] ${width}`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-600">{eyebrow}</p>
            <h2 id="student-dialog-title" className="mt-1 text-lg font-bold tracking-tight text-[#142344]">{title}</h2>
          </div>
          <Button variant="ghost" size="icon" className="!size-9 !min-h-9 !min-w-9 !p-0 rounded-xl" aria-label="Close dialog" onClick={onClose}>
            <X size={17} />
          </Button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </motion.section>
    </motion.div>
  );
}

function StudentDetails({ student }: { student: AdminStudent }) {
  const totalQuestions = student.correctAnswers + student.incorrectAnswers;
  const accuracy = totalQuestions ? Math.round((student.correctAnswers / totalQuestions) * 100) : 0;
  const challengeCompletion = student.dailyChallengesTotal
    ? Math.round((student.dailyChallengesCompleted / student.dailyChallengesTotal) * 100)
    : 0;

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-indigo-100 text-lg font-bold text-indigo-700">
          {initials(student.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-[#142344]">{student.name}</h3>
          <p className="mt-1 text-xs text-slate-500">{student.id} · Registered {formatDate(student.registeredAt)}</p>
        </div>
        <StudentStatusBadge status={student.status} />
      </div>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Personal information</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3">
            <Mail size={16} className="shrink-0 text-indigo-500" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400">Email address</p>
              <p className="mt-0.5 truncate text-xs font-medium text-[#142344]">{student.email}</p>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3">
            <Phone size={16} className="shrink-0 text-indigo-500" />
            <div>
              <p className="text-[10px] text-slate-400">Phone number</p>
              <p className="mt-0.5 text-xs font-medium text-[#142344]">{student.phone}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <GraduationCap size={15} className="text-indigo-500" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Registered examinations</h3>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {student.exams.map((exam) => (
            <span key={exam} className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-xs font-semibold text-indigo-800">
              <BookOpenCheck size={13} /> {exam}
            </span>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-indigo-500" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Practice performance</h3>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400">Questions attempted</p>
            <p className="mt-1.5 text-lg font-bold text-[#142344]">{totalQuestions.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400">Correct answers</p>
            <p className="mt-1.5 text-lg font-bold text-emerald-700">{student.correctAnswers.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400">Incorrect answers</p>
            <p className="mt-1.5 text-lg font-bold text-rose-600">{student.incorrectAnswers.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400">Overall accuracy</p>
            <p className="mt-1.5 text-lg font-bold text-indigo-700">{accuracy}%</p>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`Overall accuracy ${accuracy}%`}>
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width]" style={{ width: `${accuracy}%` }} />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
        <div className="rounded-xl border border-slate-100 p-3.5">
          <div className="flex items-center gap-2 text-slate-400">
            <CalendarCheck size={15} />
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.1em]">Daily challenges</h3>
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <p className="text-sm font-semibold text-[#142344]">
              {student.dailyChallengesCompleted} <span className="font-normal text-slate-400">/ {student.dailyChallengesTotal}</span>
            </p>
            <p className="text-xs font-semibold text-indigo-700">{challengeCompletion}%</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${challengeCompletion}%` }} />
          </div>
          <p className="mt-2 text-[10px] text-slate-400">Challenges completed</p>
        </div>
        <div className="rounded-xl border border-slate-100 p-3.5">
          <div className="flex items-center gap-2 text-slate-400">
            <Flame size={15} className="text-amber-500" />
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.1em]">Exam-wise streaks</h3>
          </div>
          <div className="mt-3 grid gap-2">
            {student.exams.map((exam) => {
              const streak = student.streaks[exam] ?? { current: 0, best: 0 };
              return (
                <div key={exam} className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-[#142344]">{exam}</span>
                  <span className="text-slate-500">
                    <strong className="font-semibold text-amber-700">{streak.current} day{streak.current === 1 ? "" : "s"}</strong>
                    <span className="text-slate-400"> · best {streak.best}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <Clock3 size={15} className="text-indigo-500" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Recent practice activity</h3>
        </div>
        <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100">
          {student.activity.map((activity, index) => (
            <div key={`${activity.exam}-${activity.topic}-${index}`} className="flex items-start gap-3 p-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                <Target size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#142344]">{activity.topic}</p>
                <p className="mt-1 text-[10px] text-slate-500">{activity.exam} · {activity.subject} · {activity.questions} questions</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-semibold text-emerald-700">{activity.accuracy}%</p>
                <p className="mt-1 text-[9px] text-slate-400">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function LoadingRows() {
  return (
    <div role="status" aria-label="Loading students" className="space-y-3 p-5">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="grid grid-cols-4 gap-4">
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ))}
      <span className="sr-only">Loading sample student records…</span>
    </div>
  );
}

export function StudentManagement() {
  const [students, setStudents] = useState<AdminStudent[]>(initialAdminStudents);
  const [loading, setLoading] = useState(true);
  const [recentCutoff, setRecentCutoff] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterExam, setFilterExam] = useState<ExamFilter>("All exams");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("All statuses");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [pageSize, setPageSize] = useState<PageSize>(5);
  const [page, setPage] = useState(1);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setLoading(false), 420);
    const cutoffTimer = window.setTimeout(() => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      setRecentCutoff(cutoff.getTime());
    }, 0);
    return () => {
      window.clearTimeout(loadingTimer);
      window.clearTimeout(cutoffTimer);
    };
  }, []);

  useEffect(() => {
    if (!overlay && !mobileMenuOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOverlay(null);
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [overlay, mobileMenuOpen]);

  const sortedStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = students.filter((student) => {
      const matchesSearch =
        !query ||
        [student.name, student.email, student.id].some((value) => value.toLowerCase().includes(query));
      const matchesExam = filterExam === "All exams" || student.exams.includes(filterExam);
      const matchesStatus = filterStatus === "All statuses" || student.status === filterStatus;
      return matchesSearch && matchesExam && matchesStatus;
    });

    return filtered.sort((first, second) => {
      if (sortOrder === "newest") return second.registeredAt.localeCompare(first.registeredAt);
      if (sortOrder === "oldest") return first.registeredAt.localeCompare(second.registeredAt);
      const nameComparison = first.name.localeCompare(second.name);
      return sortOrder === "name-asc" ? nameComparison : -nameComparison;
    });
  }, [students, search, filterExam, filterStatus, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(sortedStudents.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleStudents = sortedStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeStudents = students.filter((student) => student.status === "Active").length;
  const inactiveStudents = students.length - activeStudents;
  const newRegistrations =
    recentCutoff === null
      ? "—"
      : students.filter((student) => new Date(`${student.registeredAt}T00:00:00`).getTime() >= recentCutoff).length;
  const totalPracticeAttempts = students.reduce((total, student) => total + student.practiceAttempts, 0);
  const selectedStudent =
    overlay && "studentId" in overlay
      ? students.find((student) => student.id === overlay.studentId)
      : undefined;
  const hasFilters = search.length > 0 || filterExam !== "All exams" || filterStatus !== "All statuses";

  function resetPage() {
    setPage(1);
  }

  function saveStudent(draft: StudentDraft) {
    try {
      if (overlay?.type !== "edit") throw new Error("The student form is no longer available.");
      const existing = students.find((student) => student.id === overlay.studentId);
      if (!existing) throw new Error("This student could not be found. Refresh the page and try again.");
      if (existing.status === "Active" && draft.status === "Inactive") {
        setOverlay({ type: "deactivate", studentId: existing.id, pendingDraft: draft });
        return;
      }

      setStudents((current) =>
        current.map((student) => (student.id === existing.id ? { ...student, ...draft } : student)),
      );
      setOverlay(null);
      setNotice({ type: "success", message: `${draft.name}’s profile has been updated.` });
    } catch (error) {
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "The student profile could not be saved.",
      });
    }
  }

  function updateStudentStatus(student: AdminStudent, status: StudentStatus, pendingDraft?: StudentDraft) {
    const verb = status === "Active" ? "activated" : "deactivated";
    setStudents((current) =>
      current.map((currentStudent) =>
        currentStudent.id === student.id
          ? { ...currentStudent, ...pendingDraft, status }
          : currentStudent,
      ),
    );
    setOverlay(null);
    setNotice({
      type: "success",
      message: pendingDraft
        ? `${pendingDraft.name}’s profile has been updated and their account deactivated.`
        : `${student.name}’s account has been ${verb}.`,
    });
  }

  function openEdit(student: AdminStudent) {
    setNotice(null);
    setOverlay({ type: "edit", studentId: student.id });
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[252px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close admin navigation"
              className="fixed inset-0 z-40 bg-[#101b33]/40 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[min(84vw,300px)] border-r border-slate-200 bg-white lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <Sidebar mobile onClose={() => setMobileMenuOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="min-h-screen lg:pl-[252px]">
        <StudentHeader onOpenMenu={() => setMobileMenuOpen(true)} />
        <main className="mx-auto max-w-[1600px] px-4 pb-10 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <div className="mb-2 flex items-center gap-2 text-[11px] text-slate-400">
                  <Link href="/admin" className="transition hover:text-indigo-600">Admin dashboard</Link>
                  <span aria-hidden="true">/</span>
                  <span aria-current="page" className="text-indigo-600">Student Management</span>
                </div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/70 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">
                  <Users size={12} /> LEARNER OPERATIONS
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#142344] sm:text-[30px]">Student Management</h1>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  Review registrations, learning activity, and student account access.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-500 sm:self-auto">
                <ShieldCheck size={14} className="text-emerald-600" />
                Sample data only
              </div>
            </div>

            {notice ? (
              <div
                role={notice.type === "error" ? "alert" : "status"}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                  notice.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }`}
              >
                <span className="flex items-center gap-2">
                  {notice.type === "success" ? <Check size={16} /> : <CircleHelp size={16} />}
                  {notice.message}
                </span>
                <button type="button" aria-label="Dismiss message" onClick={() => setNotice(null)} className="rounded-md p-1 hover:bg-black/5">
                  <X size={15} />
                </button>
              </div>
            ) : null}

            <section aria-label="Student statistics" className="grid grid-cols-2 gap-3 xl:grid-cols-5 xl:gap-4">
              <StatCard label="Total students" value={students.length} note="Sample student profiles" icon={Users} tone="bg-indigo-50 text-indigo-600" />
              <StatCard label="Active students" value={activeStudents} note="Accounts with active access" icon={Check} tone="bg-emerald-50 text-emerald-600" />
              <StatCard label="Inactive students" value={inactiveStudents} note="Accounts currently paused" icon={ShieldCheck} tone="bg-amber-50 text-amber-600" />
              <StatCard label="New registrations" value={newRegistrations} note="Joined in the last 30 days" icon={TrendingUp} tone="bg-sky-50 text-sky-600" />
              <StatCard label="Practice attempts" value={totalPracticeAttempts.toLocaleString()} note="Across these sample profiles" icon={Target} tone="bg-violet-50 text-violet-600" />
            </section>

            <Card className="overflow-hidden">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-[#142344]">All students</h2>
                      <Badge variant="outline">{sortedStudents.length} records</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Search and organize student profiles and registrations.</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <ArrowUpDown size={13} />
                    <span>Sort by registration date or name</span>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_160px_160px_190px]">
                  <label className="relative block">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      aria-label="Search students by name, email, or ID"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        resetPage();
                      }}
                      placeholder="Search name, email, ID..."
                      className="min-h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-[#142344] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>
                  <label className="sr-only" htmlFor="student-filter-exam">Filter by examination</label>
                  <select
                    id="student-filter-exam"
                    value={filterExam}
                    onChange={(event) => {
                      setFilterExam(event.target.value as ExamFilter);
                      resetPage();
                    }}
                    className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option>All exams</option>
                    {studentExams.map((exam) => <option key={exam}>{exam}</option>)}
                  </select>
                  <label className="sr-only" htmlFor="student-filter-status">Filter by account status</label>
                  <select
                    id="student-filter-status"
                    value={filterStatus}
                    onChange={(event) => {
                      setFilterStatus(event.target.value as StatusFilter);
                      resetPage();
                    }}
                    className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option>All statuses</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  <label className="sr-only" htmlFor="student-sort-order">Sort students</label>
                  <select
                    id="student-sort-order"
                    value={sortOrder}
                    onChange={(event) => {
                      setSortOrder(event.target.value as SortOrder);
                      resetPage();
                    }}
                    className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="newest">Registration: newest first</option>
                    <option value="oldest">Registration: oldest first</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <LoadingRows />
              ) : sortedStudents.length === 0 ? (
                <div className="flex flex-col items-center px-5 py-14 text-center">
                  <span className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500"><Search size={20} /></span>
                  <h3 className="mt-4 text-sm font-bold text-[#142344]">
                    {hasFilters ? "No students match these filters" : "No student records"}
                  </h3>
                  <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                    {hasFilters
                      ? "Try another search term or update your filters to see matching student profiles."
                      : "There are no student profiles to show right now."}
                  </p>
                  {hasFilters ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setSearch("");
                        setFilterExam("All exams");
                        setFilterStatus("All statuses");
                        resetPage();
                      }}
                    >
                      Clear filters
                    </Button>
                  ) : null}
                </div>
              ) : (
                <>
                  <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-[1280px] text-left">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/70">
                          <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Student ID</th>
                          <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Student name</th>
                          <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Email</th>
                          <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Phone number</th>
                          <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Registered exams</th>
                          <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Account status</th>
                          <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Registration date</th>
                          <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {visibleStudents.map((student) => (
                          <tr key={student.id} className="group transition-colors hover:bg-indigo-50/30">
                            <td className="px-5 py-3.5 font-mono text-[11px] font-medium text-slate-500">{student.id}</td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-100 text-[10px] font-bold text-indigo-700">{initials(student.name)}</span>
                                <span className="text-xs font-semibold text-[#142344]">{student.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-[#142344]">{student.email}</td>
                            <td className="px-4 py-3.5 text-xs text-slate-500">{student.phone}</td>
                            <td className="px-4 py-3.5">
                              <div className="flex max-w-[185px] flex-wrap gap-1">
                                {student.exams.map((exam) => (
                                  <span key={exam} className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600">{exam}</span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3.5"><StudentStatusBadge status={student.status} /></td>
                            <td className="px-4 py-3.5 text-xs text-slate-500">{formatDate(student.registeredAt)}</td>
                            <td className="px-4 py-3.5">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="!min-h-8 !px-2.5 text-[10px]"
                                  aria-label={`View details for ${student.name}`}
                                  onClick={() => setOverlay({ type: "details", studentId: student.id })}
                                >
                                  <UserRound size={14} /><span className="hidden 2xl:inline">View</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="!min-h-8 !px-2.5 text-[10px]"
                                  aria-label={`Edit ${student.name}`}
                                  onClick={() => openEdit(student)}
                                >
                                  <Pencil size={14} /><span className="hidden 2xl:inline">Edit</span>
                                </Button>
                                <Button
                                  variant={student.status === "Active" ? "outline" : "secondary"}
                                  size="sm"
                                  className={`!min-h-8 !px-2.5 text-[10px] ${student.status === "Active" ? "text-rose-600 hover:!border-rose-200 hover:!bg-rose-50" : "text-emerald-700"}`}
                                  aria-label={`${student.status === "Active" ? "Deactivate" : "Activate"} ${student.name}`}
                                  onClick={() =>
                                    student.status === "Active"
                                      ? setOverlay({ type: "deactivate", studentId: student.id })
                                      : updateStudentStatus(student, "Active")
                                  }
                                >
                                  <ShieldCheck size={14} /><span className="hidden 2xl:inline">{student.status === "Active" ? "Deactivate" : "Activate"}</span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="divide-y divide-slate-100 lg:hidden">
                    {visibleStudents.map((student) => (
                      <article key={student.id} className="p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-100 text-[10px] font-bold text-indigo-700">{initials(student.name)}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-semibold text-[#142344]">{student.name}</h3>
                              <StudentStatusBadge status={student.status} />
                            </div>
                            <p className="mt-1 font-mono text-[10px] text-slate-400">{student.id}</p>
                          </div>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="min-w-0">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Email</p>
                            <p className="mt-1 break-all text-xs text-[#142344]">{student.email}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Phone number</p>
                            <p className="mt-1 text-xs text-[#142344]">{student.phone}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                          <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Registered exams</p>
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {student.exams.map((exam) => <span key={exam} className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600">{exam}</span>)}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Registration date</p>
                            <p className="mt-1 text-xs text-slate-600">{formatDate(student.registeredAt)}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                          <Button variant="outline" size="sm" className="!min-h-9 flex-1" onClick={() => setOverlay({ type: "details", studentId: student.id })}>
                            <UserRound size={14} /> View
                          </Button>
                          <Button variant="outline" size="sm" className="!min-h-9 flex-1" onClick={() => openEdit(student)}>
                            <Pencil size={14} /> Edit
                          </Button>
                          <Button
                            variant={student.status === "Active" ? "outline" : "secondary"}
                            size="sm"
                            className={`!min-h-9 flex-1 ${student.status === "Active" ? "text-rose-600 hover:!border-rose-200 hover:!bg-rose-50" : "text-emerald-700"}`}
                            onClick={() =>
                              student.status === "Active"
                                ? setOverlay({ type: "deactivate", studentId: student.id })
                                : updateStudentStatus(student, "Active")
                            }
                          >
                            <ShieldCheck size={14} /> {student.status === "Active" ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}

              {!loading && sortedStudents.length > 0 ? (
                <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-slate-400">
                    <span>
                      Showing {sortedStudents.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, sortedStudents.length)} of {sortedStudents.length}
                    </span>
                    <label className="flex items-center gap-1.5">
                      Rows per page
                      <select
                        aria-label="Rows per page"
                        value={pageSize}
                        onChange={(event) => {
                          setPageSize(Number(event.target.value) as PageSize);
                          resetPage();
                        }}
                        className="min-h-8 rounded-lg border border-slate-200 bg-white px-2 text-[10px] text-slate-600 outline-none focus:border-indigo-400"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                    </label>
                  </div>
                  <div className="flex items-center justify-between gap-2 sm:justify-end">
                    <span className="mr-1 text-[10px] text-slate-400">Page {currentPage} of {pageCount}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="!min-h-8 !px-2.5 text-[10px]"
                      aria-label="Previous page"
                      disabled={currentPage <= 1}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                    >
                      <ChevronLeft size={14} /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="!min-h-8 !px-2.5 text-[10px]"
                      aria-label="Next page"
                      disabled={currentPage >= pageCount}
                      onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                    >
                      Next <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              ) : null}
            </Card>

            <div className="flex flex-col gap-2 rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/80 via-white to-sky-50/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm"><ShieldCheck size={17} /></span>
                <div>
                  <p className="text-xs font-semibold text-[#142344]">Student privacy matters</p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">This preview contains profile and learning data only; no passwords or sensitive credentials are displayed.</p>
                </div>
              </div>
              <Link href="/admin" className="inline-flex items-center gap-1 self-start text-[11px] font-semibold text-indigo-700 transition hover:text-indigo-900 sm:self-center">
                Back to overview <TrendingUp size={13} />
              </Link>
            </div>
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {overlay?.type === "edit" && selectedStudent ? (
          <DialogFrame
            eyebrow="Update student profile"
            title="Edit student"
            onClose={() => setOverlay(null)}
          >
            <StudentForm
              key={selectedStudent.id}
              student={selectedStudent}
              existingStudents={students}
              onCancel={() => setOverlay(null)}
              onSave={saveStudent}
            />
          </DialogFrame>
        ) : null}
        {overlay?.type === "details" && selectedStudent ? (
          <DialogFrame
            eyebrow="Student profile"
            title="Student details"
            onClose={() => setOverlay(null)}
            width="max-w-3xl"
          >
            <StudentDetails student={selectedStudent} />
            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setOverlay(null)}>Close</Button>
              <Button onClick={() => openEdit(selectedStudent)}><Pencil size={15} /> Edit profile</Button>
            </div>
          </DialogFrame>
        ) : null}
        {overlay?.type === "deactivate" && selectedStudent ? (
          <DialogFrame
            eyebrow="Confirm account change"
            title="Deactivate this student?"
            onClose={() => setOverlay(null)}
            width="max-w-md"
          >
            <div className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <ShieldCheck size={19} />
              </span>
              <p className="text-sm leading-6 text-slate-600">
                <span className="font-semibold text-[#142344]">{selectedStudent.name}</span> will lose active account access. This action only changes the local sample record.
              </p>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setOverlay(null)}>Keep active</Button>
              <Button
                variant="danger"
                onClick={() => updateStudentStatus(selectedStudent, "Inactive", overlay.pendingDraft)}
              >
                Deactivate account
              </Button>
            </div>
          </DialogFrame>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
