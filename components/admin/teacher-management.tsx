"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Bell,
  BookOpenCheck,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Mail,
  Menu,
  Pencil,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  fetchAdminTeachers,
  inviteAdminTeacher,
  teacherExams,
} from "@/components/admin/teacher-data";
import type {
  AdminTeacher,
  TeacherActivity,
  TeacherDraft,
  TeacherExam,
  TeacherStatus,
} from "@/components/admin/teacher-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type TeacherFormErrors = Partial<Record<keyof TeacherDraft, string>>;
type FilterStatus = "All statuses" | TeacherStatus;
type FilterExam = "All exams" | TeacherExam;
type Overlay =
  | { type: "form"; teacherId?: string }
  | { type: "details"; teacherId: string }
  | { type: "deactivate"; teacherId: string; pendingDraft?: TeacherDraft }
  | null;

const emptyDraft: TeacherDraft = {
  name: "",
  email: "",
  phone: "",
  exams: [],
  status: "Active",
};

const navigationItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Exam management", href: "/admin/exams", icon: GraduationCap },
  { label: "Teacher management", href: "/admin/teachers", icon: Users, active: true },
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

function formatJoinedDate(date: string) {
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
            Teacher invitations are sent by email.
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

function TeacherHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
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
          <p className="mt-0.5 truncate text-sm font-semibold text-[#142344]">Teacher Management</p>
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
          <LogoutButton
            variant="outline"
            size="sm"
            className="!size-9 !min-h-9 !min-w-9 !p-0 rounded-xl sm:!h-9 sm:!w-auto sm:!px-3"
            aria-label="Log out"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Log out</span>
          </LogoutButton>
        </div>
      </div>
    </header>
  );
}

function TeacherStatusBadge({ status }: { status: TeacherStatus }) {
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
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#142344]">{value}</p>
        </div>
        <span className={`grid size-10 place-items-center rounded-xl ${tone}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-[11px] leading-4 text-slate-400">{note}</p>
    </Card>
  );
}

function TeacherForm({
  teacher,
  existingTeachers,
  isSubmitting,
  onCancel,
  onSave,
}: {
  teacher?: AdminTeacher;
  existingTeachers: AdminTeacher[];
  isSubmitting: boolean;
  onCancel: () => void;
  onSave: (draft: TeacherDraft) => void;
}) {
  const [draft, setDraft] = useState<TeacherDraft>(
    teacher
      ? {
          name: teacher.name,
          email: teacher.email,
          phone: teacher.phone,
          exams: [...teacher.exams],
          status: teacher.status,
        }
      : emptyDraft,
  );
  const [errors, setErrors] = useState<TeacherFormErrors>({});

  function updateDraft<Key extends keyof TeacherDraft>(key: Key, value: TeacherDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function toggleExam(exam: TeacherExam) {
    updateDraft(
      "exams",
      draft.exams.includes(exam)
        ? draft.exams.filter((assignedExam) => assignedExam !== exam)
        : [...draft.exams, exam],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: TeacherFormErrors = {};
    const normalizedEmail = draft.email.trim().toLowerCase();

    if (draft.name.trim().length < 2) nextErrors.name = "Enter a full name (at least 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    } else if (
      existingTeachers.some(
        (existing) => existing.id !== teacher?.id && existing.email.toLowerCase() === normalizedEmail,
      )
    ) {
      nextErrors.email = "A teacher with this email address already exists.";
    }
    if (!/^[+]?[\d\s()-]{7,20}$/.test(draft.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number.";
    }
    if (draft.exams.length === 0) nextErrors.exams = "Assign at least one examination.";

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
          placeholder="e.g. Meera Shah"
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
          <label htmlFor="teacher-status" className="text-sm font-medium text-foreground">Account status</label>
          <select
            id="teacher-status"
            value={draft.status}
            onChange={(event) => updateDraft("status", event.target.value as TeacherStatus)}
            className="min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-foreground">Assigned examinations</legend>
        <p className="text-xs text-slate-500">Choose every exam this teacher supports.</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {teacherExams.map((exam) => {
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
        <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}
          {isSubmitting ? "Sending invitation..." : teacher ? "Save changes" : "Add teacher"}
        </Button>
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
  children: React.ReactNode;
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
        aria-labelledby="teacher-dialog-title"
        initial={{ opacity: 0, y: 18, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.99 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-[24px] border border-slate-200 bg-white shadow-2xl sm:rounded-[24px] ${width}`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-600">{eyebrow}</p>
            <h2 id="teacher-dialog-title" className="mt-1 text-lg font-bold tracking-tight text-[#142344]">{title}</h2>
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

function TeacherDetails({ teacher }: { teacher: AdminTeacher }) {
  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-indigo-100 text-lg font-bold text-indigo-700">
          {initials(teacher.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-[#142344]">{teacher.name}</h3>
          <p className="mt-1 text-xs text-slate-500">{teacher.id}</p>
        </div>
        <TeacherStatusBadge status={teacher.status} />
      </div>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Personal information</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3">
            <Mail size={16} className="shrink-0 text-indigo-500" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400">Email address</p>
              <p className="mt-0.5 truncate text-xs font-medium text-[#142344]">{teacher.email}</p>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3">
            <Phone size={16} className="shrink-0 text-indigo-500" />
            <div>
              <p className="text-[10px] text-slate-400">Phone number</p>
              <p className="mt-0.5 text-xs font-medium text-[#142344]">{teacher.phone}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-100 p-3.5">
          <div className="flex items-center gap-2 text-slate-400">
            <GraduationCap size={15} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em]">Assigned examinations</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {teacher.exams.map((exam) => <Badge variant="primary" key={exam}>{exam}</Badge>)}
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 p-3.5">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock3 size={15} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em]">Registration date</p>
          </div>
          <p className="mt-3 text-sm font-semibold text-[#142344]">{formatJoinedDate(teacher.joinedAt)}</p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-indigo-500" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Recent activity</h3>
        </div>
        <div className="mt-3 space-y-0">
          {teacher.activity.map((activity, index) => (
            <div key={`${activity.label}-${index}`} className="relative flex gap-3 pb-4 last:pb-0">
              <span className="relative mt-1.5 flex size-2.5 shrink-0 items-center justify-center">
                <span className={`size-2 rounded-full ${index === 0 ? "bg-indigo-500" : "bg-slate-300"}`} />
                {index < teacher.activity.length - 1 ? <span className="absolute top-3 h-full w-px bg-slate-200" /> : null}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#142344]">{activity.label}</p>
                <p className="mt-1 text-[10px] text-slate-400">{activity.date}</p>
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
    <div role="status" aria-label="Loading teachers" className="space-y-3 p-5">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="grid grid-cols-4 gap-4">
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ))}
      <span className="sr-only">Loading teacher records…</span>
    </div>
  );
}

export function TeacherManagement() {
  const [teachers, setTeachers] = useState<AdminTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentCutoff, setRecentCutoff] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterExam, setFilterExam] = useState<FilterExam>("All exams");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All statuses");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTeachers() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) throw new Error("Sign in as an active Admin to load teacher records.");
        const records = await fetchAdminTeachers(data.session.access_token);
        if (active) {
          setTeachers(records);
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - 30);
          setRecentCutoff(cutoff.getTime());
        }
      } catch (error) {
        if (active) {
          setNotice({
            type: "error",
            message: error instanceof Error ? error.message : "Teacher records could not be loaded.",
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadTeachers();
    return () => {
      active = false;
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

  const filteredTeachers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return teachers.filter((teacher) => {
      const matchesSearch =
        !query ||
        [teacher.name, teacher.email, teacher.id, teacher.phone].some((value) =>
          value.toLowerCase().includes(query),
        );
      const matchesExam = filterExam === "All exams" || teacher.exams.includes(filterExam);
      const matchesStatus = filterStatus === "All statuses" || teacher.status === filterStatus;
      return matchesSearch && matchesExam && matchesStatus;
    });
  }, [teachers, search, filterExam, filterStatus]);

  const activeTeachers = teachers.filter((teacher) => teacher.status === "Active").length;
  const inactiveTeachers = teachers.length - activeTeachers;
  const recentlyAdded =
    recentCutoff === null
      ? "—"
      : teachers.filter(
          (teacher) => new Date(`${teacher.joinedAt}T00:00:00`).getTime() >= recentCutoff,
        ).length;
  const selectedTeacher =
    overlay && "teacherId" in overlay
      ? teachers.find((teacher) => teacher.id === overlay.teacherId)
      : undefined;

  async function saveTeacher(draft: TeacherDraft) {
    if (overlay?.type !== "form") {
      setNotice({ type: "error", message: "The teacher form is no longer available." });
      return;
    }

    if (!overlay.teacherId) {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) throw new Error("Sign in as an active Admin before inviting a teacher.");

        const invitation = await inviteAdminTeacher(data.session.access_token, draft);
        setOverlay(null);

        try {
          const records = await fetchAdminTeachers(data.session.access_token);
          setTeachers(records);
        } catch {
          setNotice({
            type: "error",
            message: `${invitation.message} The teacher list could not be refreshed; reload this page to update it.`,
          });
          return;
        }

        setNotice({
          type: "success",
          message: invitation.alreadyInvited
            ? invitation.message
            : `${draft.name} has been invited. Ask them to follow the email link to set a password.`,
        });
      } catch (error) {
        setNotice({
          type: "error",
          message: error instanceof Error ? error.message : "The teacher invitation could not be sent.",
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const existing = teachers.find((teacher) => teacher.id === overlay.teacherId);
    if (!existing) {
      setNotice({ type: "error", message: "This teacher could not be found. Refresh the page and try again." });
      return;
    }
    if (existing.status === "Active" && draft.status === "Inactive") {
      setOverlay({ type: "deactivate", teacherId: existing.id, pendingDraft: draft });
      return;
    }
    const activity: TeacherActivity[] = [
      { label: "Teacher profile updated", date: "Just now" },
      ...existing.activity,
    ].slice(0, 5);
    setTeachers((current) =>
      current.map((teacher) =>
        teacher.id === existing.id ? { ...teacher, ...draft, activity } : teacher,
      ),
    );
    setNotice({ type: "success", message: `${draft.name}’s profile has been updated.` });
    setOverlay(null);
  }

  function updateTeacherStatus(teacher: AdminTeacher, status: TeacherStatus, pendingDraft?: TeacherDraft) {
    const action = status === "Active" ? "activated" : "deactivated";
    const activity: TeacherActivity[] = [
      {
        label: pendingDraft ? "Teacher profile updated and account deactivated" : `Account ${action} by an administrator`,
        date: "Just now",
      },
      ...teacher.activity,
    ].slice(0, 5);
    setTeachers((current) =>
      current.map((currentTeacher) =>
        currentTeacher.id === teacher.id
          ? { ...currentTeacher, ...pendingDraft, status, activity }
          : currentTeacher,
      ),
    );
    setOverlay(null);
    setNotice({
      type: "success",
      message: pendingDraft
        ? `${pendingDraft.name}’s profile has been updated and their account deactivated.`
        : `${teacher.name}’s account has been ${action}.`,
    });
  }

  function openForm(teacher?: AdminTeacher) {
    setNotice(null);
    setOverlay(teacher ? { type: "form", teacherId: teacher.id } : { type: "form" });
  }

  const hasFilters = search.length > 0 || filterExam !== "All exams" || filterStatus !== "All statuses";

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
        <TeacherHeader onOpenMenu={() => setMobileMenuOpen(true)} />
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
                  <span aria-current="page" className="text-indigo-600">Teacher Management</span>
                </div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/70 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">
                  <Users size={12} /> PEOPLE & ACCESS
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#142344] sm:text-[30px]">Teacher Management</h1>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  Manage your teaching team, exam assignments, and account access.
                </p>
              </div>
              <Button onClick={() => openForm()} className="w-full sm:w-auto">
                <Plus size={17} /> Add teacher
              </Button>
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

            <section aria-label="Teacher statistics" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              <StatCard label="Total teachers" value={teachers.length} note="Across all exam programs" icon={Users} tone="bg-indigo-50 text-indigo-600" />
              <StatCard label="Active teachers" value={activeTeachers} note="Accounts with active access" icon={Check} tone="bg-emerald-50 text-emerald-600" />
              <StatCard label="Inactive teachers" value={inactiveTeachers} note="Accounts currently paused" icon={ShieldCheck} tone="bg-amber-50 text-amber-600" />
              <StatCard label="Recently added" value={recentlyAdded} note="Joined in the last 30 days" icon={ArrowUpRight} tone="bg-sky-50 text-sky-600" />
            </section>

            <Card className="overflow-hidden">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#142344]">All teachers</h2>
                    <Badge variant="outline">{filteredTeachers.length} records</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Search, filter, and manage teacher accounts.</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_160px_160px] lg:w-auto lg:flex">
                  <label className="relative block sm:min-w-[220px]">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      aria-label="Search teachers"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search name, email, ID..."
                      className="min-h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-[#142344] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>
                  <label className="sr-only" htmlFor="filter-exam">Filter by examination</label>
                  <select
                    id="filter-exam"
                    value={filterExam}
                    onChange={(event) => setFilterExam(event.target.value as FilterExam)}
                    className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option>All exams</option>
                    {teacherExams.map((exam) => <option key={exam}>{exam}</option>)}
                  </select>
                  <label className="sr-only" htmlFor="filter-status">Filter by status</label>
                  <select
                    id="filter-status"
                    value={filterStatus}
                    onChange={(event) => setFilterStatus(event.target.value as FilterStatus)}
                    className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option>All statuses</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <LoadingRows />
              ) : filteredTeachers.length === 0 ? (
                <div className="flex flex-col items-center px-5 py-14 text-center">
                  <span className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                    <Search size={20} />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-[#142344]">
                    {hasFilters ? "No teachers match these filters" : "No teachers yet"}
                  </h3>
                  <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                    {hasFilters
                      ? "Try a different search term or clear your filters to see all teacher records."
                      : "Add your first teacher to start managing exam assignments and account access."}
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
                      }}
                    >
                      Clear filters
                    </Button>
                  ) : (
                    <Button size="sm" className="mt-4" onClick={() => openForm()}><Plus size={15} />Add teacher</Button>
                  )}
                </div>
              ) : (
                <>
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[1240px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70">
                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Teacher ID</th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Teacher name</th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Email</th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Phone number</th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Assigned exams</th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Account status</th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Joined date</th>
                        <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTeachers.map((teacher) => (
                        <tr key={teacher.id} className="group transition-colors hover:bg-indigo-50/30">
                          <td className="px-5 py-3.5">
                            <span className="font-mono text-[11px] font-medium text-slate-500">{teacher.id}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-100 text-[10px] font-bold text-indigo-700">
                                {initials(teacher.name)}
                              </span>
                              <span className="block text-xs font-semibold text-[#142344]">{teacher.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-[#142344]">{teacher.email}</td>
                          <td className="px-4 py-3.5 text-xs text-slate-500">{teacher.phone}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex max-w-[210px] flex-wrap gap-1">
                              {teacher.exams.map((exam) => (
                                <span key={exam} className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600">{exam}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3.5"><TeacherStatusBadge status={teacher.status} /></td>
                          <td className="px-4 py-3.5 text-xs text-slate-500">{formatJoinedDate(teacher.joinedAt)}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="!min-h-8 !px-2.5 text-[10px]"
                                aria-label={`View details for ${teacher.name}`}
                                onClick={() => setOverlay({ type: "details", teacherId: teacher.id })}
                              >
                                <UserRound size={14} /> <span className="hidden xl:inline">View</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="!min-h-8 !px-2.5 text-[10px]"
                                aria-label={`Edit ${teacher.name}`}
                                onClick={() => openForm(teacher)}
                              >
                                <Pencil size={14} /> <span className="hidden xl:inline">Edit</span>
                              </Button>
                              <Button
                                variant={teacher.status === "Active" ? "outline" : "secondary"}
                                size="sm"
                                className={`!min-h-8 !px-2.5 text-[10px] ${teacher.status === "Active" ? "text-rose-600 hover:!border-rose-200 hover:!bg-rose-50" : "text-emerald-700"}`}
                                aria-label={`${teacher.status === "Active" ? "Deactivate" : "Activate"} ${teacher.name}`}
                                onClick={() =>
                                  teacher.status === "Active"
                                    ? setOverlay({ type: "deactivate", teacherId: teacher.id })
                                    : updateTeacherStatus(teacher, "Active")
                                }
                              >
                                <ShieldCheck size={14} /> <span className="hidden xl:inline">{teacher.status === "Active" ? "Deactivate" : "Activate"}</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="divide-y divide-slate-100 lg:hidden">
                  {filteredTeachers.map((teacher) => (
                    <article key={teacher.id} className="p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-100 text-[10px] font-bold text-indigo-700">
                          {initials(teacher.name)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-[#142344]">{teacher.name}</h3>
                            <TeacherStatusBadge status={teacher.status} />
                          </div>
                          <p className="mt-1 font-mono text-[10px] text-slate-400">{teacher.id}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Email</p>
                          <p className="mt-1 break-all text-xs text-[#142344]">{teacher.email}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Phone number</p>
                          <p className="mt-1 text-xs text-[#142344]">{teacher.phone}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Assigned exams</p>
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {teacher.exams.map((exam) => (
                              <span key={exam} className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600">{exam}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Joined date</p>
                          <p className="mt-1 text-xs text-slate-600">{formatJoinedDate(teacher.joinedAt)}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="!min-h-9 flex-1"
                          onClick={() => setOverlay({ type: "details", teacherId: teacher.id })}
                        >
                          <UserRound size={14} /> View details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="!min-h-9 flex-1"
                          onClick={() => openForm(teacher)}
                        >
                          <Pencil size={14} /> Edit
                        </Button>
                        <Button
                          variant={teacher.status === "Active" ? "outline" : "secondary"}
                          size="sm"
                          className={`!min-h-9 flex-1 ${teacher.status === "Active" ? "text-rose-600 hover:!border-rose-200 hover:!bg-rose-50" : "text-emerald-700"}`}
                          onClick={() =>
                            teacher.status === "Active"
                              ? setOverlay({ type: "deactivate", teacherId: teacher.id })
                              : updateTeacherStatus(teacher, "Active")
                          }
                        >
                          <ShieldCheck size={14} /> {teacher.status === "Active" ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
                </>
              )}
              {!loading && filteredTeachers.length > 0 ? (
                <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <span>Showing {filteredTeachers.length} of {teachers.length} teachers</span>
                  <span className="inline-flex items-center gap-1"><Bell size={12} /> Invitations persist; profile edits and status changes remain local.</span>
                </div>
              ) : null}
            </Card>

            <div className="flex flex-col gap-2 rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/80 via-white to-sky-50/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm"><ShieldCheck size={17} /></span>
                <div>
                  <p className="text-xs font-semibold text-[#142344]">Teacher access at a glance</p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">Inactive accounts are blocked from teacher sign-in workflows.</p>
                </div>
              </div>
              <Link href="/admin" className="inline-flex items-center gap-1 self-start text-[11px] font-semibold text-indigo-700 transition hover:text-indigo-900 sm:self-center">
                Back to overview <ArrowUpRight size={13} />
              </Link>
            </div>
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {overlay?.type === "form" ? (
          <DialogFrame
            eyebrow={overlay.teacherId ? "Update profile" : "New team member"}
            title={overlay.teacherId ? "Edit teacher" : "Add a teacher"}
            onClose={() => setOverlay(null)}
          >
            <TeacherForm
              key={overlay.teacherId ?? "new"}
              teacher={selectedTeacher}
              existingTeachers={teachers}
              isSubmitting={isSubmitting}
              onCancel={() => setOverlay(null)}
              onSave={saveTeacher}
            />
          </DialogFrame>
        ) : null}
        {overlay?.type === "details" && selectedTeacher ? (
          <DialogFrame
            eyebrow="Teacher profile"
            title="Teacher details"
            onClose={() => setOverlay(null)}
            width="max-w-2xl"
          >
            <TeacherDetails teacher={selectedTeacher} />
            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setOverlay(null)}>Close</Button>
              <Button onClick={() => openForm(selectedTeacher)}><Pencil size={15} /> Edit profile</Button>
            </div>
          </DialogFrame>
        ) : null}
        {overlay?.type === "deactivate" && selectedTeacher ? (
          <DialogFrame
            eyebrow="Confirm account change"
            title="Deactivate this teacher?"
            onClose={() => setOverlay(null)}
            width="max-w-md"
          >
            <div className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <ShieldCheck size={19} />
              </span>
              <p className="text-sm leading-6 text-slate-600">
                <span className="font-semibold text-[#142344]">{selectedTeacher.name}</span> will lose active account access. You can reactivate this account at any time.
              </p>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setOverlay(null)}>Keep active</Button>
              <Button
                variant="danger"
                onClick={() =>
                  updateTeacherStatus(selectedTeacher, "Inactive", overlay.pendingDraft)
                }
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
