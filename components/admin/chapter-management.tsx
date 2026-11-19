"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Eye,
  Filter,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Power,
  Search,
  ShieldCheck,
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
  initialAdminChapters,
  type AdminChapter,
  type ChapterDraft,
} from "@/components/admin/chapter-data";
import {
  initialAdminSubjects,
  subjectExamOptions,
  type SubjectExam,
  type SubjectStatus,
} from "@/components/admin/subject-data";

type StatusFilter = "All" | SubjectStatus;
type ExamFilter = "All" | SubjectExam;
type SubjectFilter = "All" | string;

const navigationItems = [
  { label: "Admin overview", href: "/admin", icon: LayoutDashboard },
  { label: "Exam management", href: "/admin/exams", icon: GraduationCap },
  { label: "Subject management", href: "/admin/subjects", icon: BookOpen },
  { label: "Chapter management", href: "/admin/chapters", icon: Layers3 },
  { label: "Chapter list", href: "#chapter-list", icon: FileQuestion },
];

function getSubjectsForExam(exam: SubjectExam) {
  return initialAdminSubjects
    .filter((subject) => subject.exam === exam)
    .map((subject) => subject.name);
}

function ChapterSidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
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
      <nav aria-label="Admin chapter management" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Platform administration
        </p>
        <div className="grid gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/admin/chapters";
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`group flex min-h-10 items-center gap-3 rounded-xl px-3 text-[12px] font-medium transition ${
                  active ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-[#142344]"
                }`}
              >
                <Icon size={16} className={active ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"} />
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
            Sample chapter records · changes stay in this page.
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

function ChapterHeader({
  sidebarOpen,
  onOpenMenu,
  profileOpen,
  onToggleProfile,
  notificationsOpen,
  onToggleNotifications,
  onLogout,
}: {
  sidebarOpen: boolean;
  onOpenMenu: () => void;
  profileOpen: boolean;
  onToggleProfile: () => void;
  notificationsOpen: boolean;
  onToggleNotifications: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          size="icon"
          className="!size-9 !min-h-9 !min-w-9 !p-0 shrink-0 rounded-xl lg:hidden"
          aria-label={sidebarOpen ? "Admin navigation is open" : "Open admin navigation"}
          aria-expanded={sidebarOpen}
          onClick={onOpenMenu}
        >
          <Menu size={18} />
        </Button>
        <div className="min-w-0 max-[380px]:hidden">
          <p className="truncate text-[10px] text-slate-400">Admin workspace</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-[#142344]">Chapter Management</p>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="!size-9 !min-h-9 !min-w-9 !p-0 relative rounded-xl"
              aria-label="Admin notifications"
              aria-expanded={notificationsOpen}
              onClick={onToggleNotifications}
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-indigo-500 ring-2 ring-white" />
            </Button>
            <AnimatePresence>
              {notificationsOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute right-0 top-12 z-50 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold text-[#142344]">Notifications</h2>
                    <Badge variant="outline">Sample</Badge>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-[#142344]">Chapter records are ready to review</p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">This preview uses local sample data only.</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              className="!size-9 !min-h-9 !min-w-9 !p-0 rounded-xl sm:!w-auto sm:!px-2"
              aria-label="Admin profile menu"
              aria-expanded={profileOpen}
              onClick={onToggleProfile}
            >
              <span className="grid size-8 place-items-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">AM</span>
              <span className="hidden text-left sm:block">
                <span className="block text-[10px] font-semibold text-[#142344]">Aarav Mehta</span>
                <span className="block text-[9px] text-slate-400">Administrator · sample</span>
              </span>
              <ChevronDown size={13} className="hidden text-slate-400 sm:block" />
            </Button>
            <AnimatePresence>
              {profileOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"
                >
                  <p className="text-xs font-semibold text-[#142344]">Aarav Mehta</p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">Profile settings are not connected in this preview.</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <LogoutButton
            variant="outline"
            size="sm"
            className="hidden !size-9 !min-h-9 !min-w-9 !p-0 rounded-xl sm:inline-flex sm:!h-9 sm:!w-auto sm:!px-3 max-[380px]:!hidden"
            aria-label="Log out"
            title="Log out of your account"
            onLogout={onLogout}
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Log out</span>
          </LogoutButton>
        </div>
      </div>
    </header>
  );
}

function ChapterLoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading chapters" className="grid grid-cols-1 gap-3">
      {Array.from({ length: 5 }, (_, index) => (
        <Card key={index} className="flex items-center gap-4 p-4">
          <div className="size-10 shrink-0 animate-pulse rounded-xl bg-slate-100" />
          <div className="grid min-w-0 flex-1 gap-2">
            <div className="h-4 w-2/5 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="hidden h-8 w-20 animate-pulse rounded bg-slate-100 sm:block" />
        </Card>
      ))}
      <span className="sr-only">Loading sample chapters…</span>
    </div>
  );
}

function ChapterFormDialog({
  initialChapter,
  onClose,
  onSave,
}: {
  initialChapter: AdminChapter | null;
  onClose: () => void;
  onSave: (draft: ChapterDraft) => string | null;
}) {
  const [exam, setExam] = useState<SubjectExam>(initialChapter?.exam ?? "KCET");
  const [subject, setSubject] = useState(initialChapter?.subject ?? getSubjectsForExam("KCET")[0] ?? "");
  const [name, setName] = useState(initialChapter?.name ?? "");
  const [chapterNumber, setChapterNumber] = useState(String(initialChapter?.chapterNumber ?? ""));
  const [description, setDescription] = useState(initialChapter?.description ?? "");
  const [status, setStatus] = useState<SubjectStatus>(initialChapter?.status ?? "Active");
  const [errors, setErrors] = useState<{
    exam?: string;
    subject?: string;
    name?: string;
    chapterNumber?: string;
    description?: string;
    form?: string;
  }>({});
  const examSubjects = getSubjectsForExam(exam);

  function changeExam(nextExam: SubjectExam) {
    setExam(nextExam);
    setSubject(getSubjectsForExam(nextExam)[0] ?? "");
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const parsedChapterNumber = Number(chapterNumber);

    if (!subjectExamOptions.includes(exam)) nextErrors.exam = "Select an exam.";
    if (!examSubjects.includes(subject)) nextErrors.subject = "Select a subject for this exam.";
    if (trimmedName.length < 3) nextErrors.name = "Enter a chapter name with at least 3 characters.";
    if (!Number.isInteger(parsedChapterNumber) || parsedChapterNumber < 1 || parsedChapterNumber > 200) {
      nextErrors.chapterNumber = "Enter a whole chapter number from 1 to 200.";
    }
    if (trimmedDescription.length < 10) {
      nextErrors.description = "Enter a description with at least 10 characters.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const saveError = onSave({
      exam,
      subject,
      name: trimmedName,
      chapterNumber: parsedChapterNumber,
      description: trimmedDescription,
      status,
    });
    if (saveError) {
      setErrors({ form: saveError });
      return;
    }
    setErrors({});
  }

  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="chapter-form-title"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="primary">Sample chapter record</Badge>
            <h2 id="chapter-form-title" className="mt-3 text-lg font-semibold text-[#142344]">
              {initialChapter ? "Edit chapter" : "Add chapter"}
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">Changes are stored only in this page preview.</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close chapter form" onClick={onClose}>
            <X size={17} />
          </Button>
        </div>

        <form onSubmit={submitForm} noValidate className="mt-5 grid gap-4">
          {errors.form ? (
            <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {errors.form}
            </p>
          ) : null}
          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">Exam</span>
            <select
              aria-label="Chapter exam"
              aria-invalid={Boolean(errors.exam)}
              value={exam}
              onChange={(event) => changeExam(event.target.value as SubjectExam)}
              className={`h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15 ${errors.exam ? "border-danger" : ""}`}
            >
              {subjectExamOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            {errors.exam ? <span className="text-xs text-danger">{errors.exam}</span> : null}
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">Subject</span>
            <select
              aria-label="Chapter subject"
              aria-invalid={Boolean(errors.subject)}
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className={`h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15 ${errors.subject ? "border-danger" : ""}`}
            >
              {examSubjects.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            {errors.subject ? <span className="text-xs text-danger">{errors.subject}</span> : null}
          </label>
          <Input
            label="Chapter name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Laws of Motion"
            error={errors.name}
            autoFocus
          />
          <Input
            label="Chapter number"
            type="number"
            min={1}
            max={200}
            value={chapterNumber}
            onChange={(event) => setChapterNumber(event.target.value)}
            placeholder="e.g. 5"
            error={errors.chapterNumber}
          />
          <div className="grid gap-2">
            <label htmlFor="chapter-description" className="text-sm font-medium text-foreground">Description</label>
            <textarea
              id="chapter-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Briefly describe the chapter."
              rows={4}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "chapter-description-error" : undefined}
              className={`w-full resize-y rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted/80 focus:border-ring focus:ring-4 focus:ring-ring/15 ${errors.description ? "border-danger focus:border-danger focus:ring-danger/15" : ""}`}
            />
            {errors.description ? <p id="chapter-description-error" className="text-xs text-danger">{errors.description}</p> : null}
          </div>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">Status</span>
            <select
              aria-label="Chapter status"
              value={status}
              onChange={(event) => setStatus(event.target.value as SubjectStatus)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
          <div className="mt-1 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="gap-2">
              <CheckCircle2 size={15} /> {initialChapter ? "Save changes" : "Save chapter"}
            </Button>
          </div>
        </form>
      </motion.section>
    </motion.div>
  );
}

function ChapterDetailsDialog({ chapter, onClose }: { chapter: AdminChapter; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="chapter-details-title"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="outline">{chapter.exam} · {chapter.subject} · Chapter {chapter.chapterNumber}</Badge>
            <h2 id="chapter-details-title" className="mt-3 text-xl font-semibold text-[#142344]">{chapter.name}</h2>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close chapter details" onClick={onClose}>
            <X size={17} />
          </Button>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{chapter.description}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500"><Layers3 size={12} /> Subtopics</span>
            <p className="mt-1 text-xl font-semibold text-[#142344]">{chapter.subtopics}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500"><FileQuestion size={12} /> Questions</span>
            <p className="mt-1 text-xl font-semibold text-[#142344]">{chapter.questions.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-500">Created {chapter.createdDate}</span>
          <Badge variant={chapter.status === "Active" ? "success" : "outline"}>{chapter.status}</Badge>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </motion.section>
    </motion.div>
  );
}

function DeactivateConfirmation({
  chapter,
  onCancel,
  onConfirm,
}: {
  chapter: AdminChapter;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="deactivate-chapter-title"
        aria-describedby="deactivate-chapter-description"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
      >
        <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
          <Power size={18} />
        </span>
        <h2 id="deactivate-chapter-title" className="mt-4 text-lg font-semibold text-[#142344]">
          Deactivate {chapter.name}?
        </h2>
        <p id="deactivate-chapter-description" className="mt-2 text-sm leading-6 text-slate-500">
          {chapter.exam} · {chapter.subject} will be marked inactive in this local preview.
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm} className="gap-2">
            <Power size={14} /> Deactivate chapter
          </Button>
        </div>
      </motion.section>
    </motion.div>
  );
}

function ChapterActions({
  chapter,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
}: {
  chapter: AdminChapter;
  onView: () => void;
  onEdit: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Button variant="outline" size="sm" className="gap-1" aria-label={`View Details for ${chapter.name}`} onClick={onView}>
        <Eye size={13} /><span>View</span>
      </Button>
      <Button variant="ghost" size="sm" className="gap-1" aria-label={`Edit ${chapter.name}`} onClick={onEdit}>
        <Pencil size={13} /><span>Edit</span>
      </Button>
      {chapter.status === "Active" ? (
        <Button variant="outline" size="sm" className="gap-1" aria-label={`Deactivate ${chapter.name}`} onClick={onDeactivate}>
          <Power size={13} /><span>Deactivate</span>
        </Button>
      ) : (
        <Button size="sm" className="gap-1" aria-label={`Activate ${chapter.name}`} onClick={onActivate}>
          <Power size={13} /><span>Activate</span>
        </Button>
      )}
    </div>
  );
}

export function ChapterManagement() {
  const [chapters, setChapters] = useState<AdminChapter[]>(initialAdminChapters);
  const [searchValue, setSearchValue] = useState("");
  const [examFilter, setExamFilter] = useState<ExamFilter>("All");
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<AdminChapter | null>(null);
  const [detailsChapter, setDetailsChapter] = useState<AdminChapter | null>(null);
  const [deactivatingChapter, setDeactivatingChapter] = useState<AdminChapter | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 300);
    return () => window.clearTimeout(timeout);
  }, []);

  const availableFilterSubjects = useMemo(() => {
    const subjects = initialAdminSubjects
      .filter((subject) => examFilter === "All" || subject.exam === examFilter)
      .map((subject) => subject.name);
    return [...new Set(subjects)];
  }, [examFilter]);

  const filteredChapters = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return chapters.filter((chapter) => {
      if (examFilter !== "All" && chapter.exam !== examFilter) return false;
      if (subjectFilter !== "All" && chapter.subject !== subjectFilter) return false;
      if (statusFilter !== "All" && chapter.status !== statusFilter) return false;
      if (!query) return true;
      return [
        chapter.name,
        chapter.exam,
        chapter.subject,
        chapter.description,
        String(chapter.chapterNumber),
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [chapters, examFilter, searchValue, statusFilter, subjectFilter]);

  function setExamFilterValue(value: ExamFilter) {
    setExamFilter(value);
    if (value !== "All" && subjectFilter !== "All" && !getSubjectsForExam(value).includes(subjectFilter)) {
      setSubjectFilter("All");
    }
  }

  function openAddForm() {
    setEditingChapter(null);
    setFormOpen(true);
    setFeedback("");
  }

  function openEditForm(chapter: AdminChapter) {
    setEditingChapter(chapter);
    setFormOpen(true);
    setFeedback("");
  }

  function saveChapter(draft: ChapterDraft): string | null {
    const duplicate = chapters.some((chapter) =>
      chapter.id !== editingChapter?.id
      && chapter.exam === draft.exam
      && chapter.subject === draft.subject
      && (chapter.chapterNumber === draft.chapterNumber
        || chapter.name.toLowerCase() === draft.name.toLowerCase()),
    );
    if (duplicate) return "A chapter with this number or name already exists for the selected subject.";

    if (editingChapter) {
      setChapters((current) => current.map((chapter) => chapter.id === editingChapter.id
        ? { ...chapter, ...draft }
        : chapter));
      setFeedback(`${draft.name} updated in this preview.`);
    } else {
      const createdDate = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      setChapters((current) => [{
        id: `chapter-${Date.now()}`,
        ...draft,
        subtopics: 0,
        questions: 0,
        createdDate,
      }, ...current]);
      setFeedback(`${draft.name} added in this preview.`);
    }
    setFormOpen(false);
    return null;
  }

  function activateChapter(chapter: AdminChapter) {
    setChapters((current) => current.map((item) => item.id === chapter.id ? { ...item, status: "Active" } : item));
    setFeedback(`${chapter.name} activated in this preview.`);
  }

  function confirmDeactivation() {
    if (!deactivatingChapter) return;
    setChapters((current) => current.map((item) => item.id === deactivatingChapter.id
      ? { ...item, status: "Inactive" }
      : item));
    setFeedback(`${deactivatingChapter.name} deactivated in this preview.`);
    setDeactivatingChapter(null);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingChapter(null);
  }

  function renderActions(chapter: AdminChapter) {
    return (
      <ChapterActions
        chapter={chapter}
        onView={() => setDetailsChapter(chapter)}
        onEdit={() => openEditForm(chapter)}
        onActivate={() => activateChapter(chapter)}
        onDeactivate={() => setDeactivatingChapter(chapter)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#142344]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <ChapterSidebar />
      </aside>
      <AnimatePresence>
        {sidebarOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close admin navigation"
              className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[288px] max-w-[86vw] bg-white shadow-2xl lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              <ChapterSidebar mobile onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
      <div className="min-h-screen lg:pl-[252px]">
        <ChapterHeader
          sidebarOpen={sidebarOpen}
          onOpenMenu={() => setSidebarOpen(true)}
          profileOpen={profileOpen}
          onToggleProfile={() => {
            setProfileOpen((open) => !open);
            setNotificationsOpen(false);
          }}
          notificationsOpen={notificationsOpen}
          onToggleNotifications={() => {
            setNotificationsOpen((open) => !open);
            setProfileOpen(false);
          }}
          onLogout={() => {
            setFeedback("Signing out...");
            setNotificationsOpen(false);
            setProfileOpen(false);
          }}
        />
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto w-full min-w-0 max-w-[1600px] px-4 pb-12 pt-5 sm:px-6 sm:pt-7 lg:px-8"
        >
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Link href="/admin" className="transition hover:text-indigo-600">Admin dashboard</Link>
                <span>/</span>
                <span className="text-indigo-600">Chapter Management</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-3xl">Chapter Management</h1>
              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                Organize chapters and review subtopic and question coverage by subject.
              </p>
            </div>
            <Button onClick={openAddForm} className="gap-2">
              <Plus size={16} /> Add Chapter
            </Button>
          </div>

          <AnimatePresence>
            {feedback ? (
              <motion.div
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800"
              >
                {feedback}
                <Button variant="ghost" size="icon" aria-label="Dismiss message" onClick={() => setFeedback("")}>
                  <X size={15} />
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <Card className="mb-5 p-4 sm:p-5">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_170px_190px_170px_auto] md:items-end">
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Search chapters</span>
                <span className="relative">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    aria-label="Search chapters"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search name, subject, exam, or chapter number..."
                    className="!min-h-10 rounded-xl !pl-9 text-xs"
                  />
                </span>
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Exam</span>
                <span className="relative">
                  <select
                    aria-label="Filter chapters by exam"
                    value={examFilter}
                    onChange={(event) => setExamFilterValue(event.target.value as ExamFilter)}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="All">All exams</option>
                    {subjectExamOptions.map((exam) => <option key={exam} value={exam}>{exam}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Subject</span>
                <span className="relative">
                  <select
                    aria-label="Filter chapters by subject"
                    value={subjectFilter}
                    onChange={(event) => setSubjectFilter(event.target.value)}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="All">All subjects</option>
                    {availableFilterSubjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Status</span>
                <span className="relative">
                  <select
                    aria-label="Filter chapters by status"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    {(["All", "Active", "Inactive"] as const).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <Filter size={14} /> {filteredChapters.length} of {chapters.length} chapters
              </div>
            </div>
          </Card>

          <section id="chapter-list" aria-label="Chapter list" className="scroll-mt-24">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-[#142344]">Chapter catalog</h2>
                <p className="mt-1 text-[10px] text-slate-500">Sample chapter records · local preview only</p>
              </div>
              <Badge variant="outline" className="gap-1.5"><Eye size={12} /> Admin preview</Badge>
            </div>

            {loading ? (
              <ChapterLoadingSkeleton />
            ) : filteredChapters.length ? (
              <>
                <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
                  <table className="w-full min-w-[1050px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        <th scope="col" className="px-4 py-3">Chapter</th>
                        <th scope="col" className="px-4 py-3">Exam</th>
                        <th scope="col" className="px-4 py-3">Subject</th>
                        <th scope="col" className="px-4 py-3">Coverage</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3">Created</th>
                        <th scope="col" className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <AnimatePresence initial={false}>
                        {filteredChapters.map((chapter) => (
                          <motion.tr
                            key={chapter.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="align-top transition-colors hover:bg-slate-50/70"
                          >
                            <th scope="row" className="max-w-[260px] px-4 py-4 font-normal">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600">Chapter {chapter.chapterNumber}</p>
                              <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-[#142344]">{chapter.name}</p>
                              <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">{chapter.description}</p>
                            </th>
                            <td className="px-4 py-4 text-xs text-slate-600">{chapter.exam}</td>
                            <td className="px-4 py-4 text-xs font-medium text-[#142344]">{chapter.subject}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3 text-[10px] text-slate-500">
                                <span className="inline-flex items-center gap-1"><Layers3 size={12} /> {chapter.subtopics} subtopics</span>
                                <span className="inline-flex items-center gap-1"><FileQuestion size={12} /> {chapter.questions} questions</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <Badge variant={chapter.status === "Active" ? "success" : "outline"}>{chapter.status}</Badge>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-[10px] text-slate-500">{chapter.createdDate}</td>
                            <td className="px-4 py-4">{renderActions(chapter)}</td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                <motion.div layout className="grid min-w-0 grid-cols-1 gap-3 md:hidden">
                  <AnimatePresence mode="popLayout">
                    {filteredChapters.map((chapter) => (
                      <motion.div
                        key={chapter.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                      >
                        <Card className="min-w-0 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
                                {chapter.exam} · {chapter.subject} · Chapter {chapter.chapterNumber}
                              </p>
                              <h3 className="mt-1 text-sm font-semibold leading-5 text-[#142344]">{chapter.name}</h3>
                            </div>
                            <Badge variant={chapter.status === "Active" ? "success" : "outline"}>{chapter.status}</Badge>
                          </div>
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{chapter.description}</p>
                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-500">
                            <span className="inline-flex items-center gap-1"><Layers3 size={12} /> {chapter.subtopics} subtopics</span>
                            <span className="inline-flex items-center gap-1"><FileQuestion size={12} /> {chapter.questions} questions</span>
                            <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {chapter.createdDate}</span>
                          </div>
                          <div className="mt-4 border-t border-slate-100 pt-3">{renderActions(chapter)}</div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </>
            ) : (
              <Card className="grid min-h-64 place-items-center p-6 text-center">
                <div>
                  <CircleHelp size={25} className="mx-auto text-slate-300" />
                  <h3 className="mt-3 text-sm font-semibold text-[#142344]">No chapters found</h3>
                  <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                    No sample chapters match your search and filters.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-2"
                    onClick={() => {
                      setSearchValue("");
                      setExamFilter("All");
                      setSubjectFilter("All");
                      setStatusFilter("All");
                    }}
                  >
                    <X size={13} /> Clear filters
                  </Button>
                </div>
              </Card>
            )}
          </section>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[10px] text-slate-500">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={13} className="text-indigo-500" /> Chapter changes are held in local UI state only.</span>
            <span>No database or authentication is connected.</span>
          </div>
        </motion.main>
      </div>

      <AnimatePresence>
        {formOpen ? (
          <ChapterFormDialog
            key={editingChapter?.id ?? "new-chapter"}
            initialChapter={editingChapter}
            onClose={closeForm}
            onSave={saveChapter}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {detailsChapter ? (
          <ChapterDetailsDialog chapter={detailsChapter} onClose={() => setDetailsChapter(null)} />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {deactivatingChapter ? (
          <DeactivateConfirmation
            chapter={deactivatingChapter}
            onCancel={() => setDeactivatingChapter(null)}
            onConfirm={confirmDeactivation}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
