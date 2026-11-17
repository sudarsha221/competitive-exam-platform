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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  initialAdminSubtopics,
  type AdminSubtopic,
  type SubtopicDraft,
} from "@/components/admin/subtopic-data";
import { initialAdminChapters } from "@/components/admin/chapter-data";
import {
  initialAdminSubjects,
  subjectExamOptions,
  type SubjectExam,
  type SubjectStatus,
} from "@/components/admin/subject-data";

type StatusFilter = "All" | SubjectStatus;
type ExamFilter = "All" | SubjectExam;
type SubjectFilter = "All" | string;
type ChapterFilter = "All" | string;

const navigationItems = [
  { label: "Admin overview", href: "/admin", icon: LayoutDashboard },
  { label: "Exam management", href: "/admin/exams", icon: GraduationCap },
  { label: "Subject management", href: "/admin/subjects", icon: BookOpen },
  { label: "Chapter management", href: "/admin/chapters", icon: Layers3 },
  { label: "Subtopic management", href: "/admin/subtopics", icon: FileQuestion },
  { label: "Subtopic list", href: "#subtopic-list", icon: FileQuestion },
];

function getSubjectsForExam(exam: SubjectExam) {
  const subjects = initialAdminSubjects
    .filter((subject) => subject.exam === exam)
    .map((subject) => subject.name);
  return [...new Set(subjects)];
}

function getChaptersForSubject(exam: SubjectExam, subject: string) {
  return initialAdminChapters
    .filter((chapter) => chapter.exam === exam && chapter.subject === subject)
    .map((chapter) => chapter.name);
}

function SubtopicSidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
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
      <nav aria-label="Admin subtopic management" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Platform administration
        </p>
        <div className="grid gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/admin/subtopics";
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
            Sample subtopic records · changes stay in this page.
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

function SubtopicHeader({
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
          <p className="mt-0.5 truncate text-sm font-semibold text-[#142344]">Subtopic Management</p>
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
                  <p className="mt-3 text-xs font-semibold text-[#142344]">Subtopic records are ready to review</p>
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
          <Button
            variant="outline"
            size="sm"
            className="hidden !size-9 !min-h-9 !min-w-9 !p-0 rounded-xl sm:inline-flex sm:!h-9 sm:!w-auto sm:!px-3 max-[380px]:!hidden"
            aria-label="Log out"
            title="Sign-out is not connected in this preview"
            onClick={onLogout}
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function SubtopicLoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading subtopics" className="grid grid-cols-1 gap-3">
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
      <span className="sr-only">Loading sample subtopics…</span>
    </div>
  );
}

function SubtopicFormDialog({
  initialSubtopic,
  onClose,
  onSave,
}: {
  initialSubtopic: AdminSubtopic | null;
  onClose: () => void;
  onSave: (draft: SubtopicDraft) => string | null;
}) {
  const [exam, setExam] = useState<SubjectExam>(initialSubtopic?.exam ?? "KCET");
  const [subject, setSubject] = useState(initialSubtopic?.subject ?? getSubjectsForExam("KCET")[0] ?? "");
  const [chapter, setChapter] = useState(
    initialSubtopic?.chapter ?? getChaptersForSubject("KCET", getSubjectsForExam("KCET")[0] ?? "")[0] ?? "",
  );
  const [name, setName] = useState(initialSubtopic?.name ?? "");
  const [description, setDescription] = useState(initialSubtopic?.description ?? "");
  const [status, setStatus] = useState<SubjectStatus>(initialSubtopic?.status ?? "Active");
  const [errors, setErrors] = useState<{
    exam?: string;
    subject?: string;
    chapter?: string;
    name?: string;
    description?: string;
    form?: string;
  }>({});
  const examSubjects = getSubjectsForExam(exam);
  const subjectChapters = getChaptersForSubject(exam, subject);

  function changeExam(nextExam: SubjectExam) {
    const nextSubjects = getSubjectsForExam(nextExam);
    const nextSubject = nextSubjects[0] ?? "";
    setExam(nextExam);
    setSubject(nextSubject);
    setChapter(getChaptersForSubject(nextExam, nextSubject)[0] ?? "");
  }

  function changeSubject(nextSubject: string) {
    setSubject(nextSubject);
    setChapter(getChaptersForSubject(exam, nextSubject)[0] ?? "");
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!subjectExamOptions.includes(exam)) nextErrors.exam = "Select an exam.";
    if (!examSubjects.includes(subject)) nextErrors.subject = "Select a subject for this exam.";
    if (!subjectChapters.includes(chapter)) nextErrors.chapter = "Select a chapter for this subject.";
    if (trimmedName.length < 3) nextErrors.name = "Enter a subtopic name with at least 3 characters.";
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
      chapter,
      name: trimmedName,
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
        aria-labelledby="subtopic-form-title"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="primary">Sample subtopic record</Badge>
            <h2 id="subtopic-form-title" className="mt-3 text-lg font-semibold text-[#142344]">
              {initialSubtopic ? "Edit subtopic" : "Add subtopic"}
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">Changes are stored only in this page preview.</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close subtopic form" onClick={onClose}>
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
              aria-label="Subtopic exam"
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
              aria-label="Subtopic subject"
              aria-invalid={Boolean(errors.subject)}
              value={subject}
              onChange={(event) => changeSubject(event.target.value)}
              className={`h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15 ${errors.subject ? "border-danger" : ""}`}
            >
              {examSubjects.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            {errors.subject ? <span className="text-xs text-danger">{errors.subject}</span> : null}
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">Chapter</span>
            <select
              aria-label="Subtopic chapter"
              aria-invalid={Boolean(errors.chapter)}
              value={chapter}
              onChange={(event) => setChapter(event.target.value)}
              className={`h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15 ${errors.chapter ? "border-danger" : ""}`}
            >
              {subjectChapters.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            {errors.chapter ? <span className="text-xs text-danger">{errors.chapter}</span> : null}
          </label>
          <Input
            label="Subtopic name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Newton's First Law"
            error={errors.name}
            autoFocus
          />
          <div className="grid gap-2">
            <label htmlFor="subtopic-description" className="text-sm font-medium text-foreground">Description</label>
            <textarea
              id="subtopic-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Briefly describe the subtopic."
              rows={4}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "subtopic-description-error" : undefined}
              className={`w-full resize-y rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted/80 focus:border-ring focus:ring-4 focus:ring-ring/15 ${errors.description ? "border-danger focus:border-danger focus:ring-danger/15" : ""}`}
            />
            {errors.description ? <p id="subtopic-description-error" className="text-xs text-danger">{errors.description}</p> : null}
          </div>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">Status</span>
            <select
              aria-label="Subtopic status"
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
              <CheckCircle2 size={15} /> {initialSubtopic ? "Save changes" : "Save subtopic"}
            </Button>
          </div>
        </form>
      </motion.section>
    </motion.div>
  );
}

function SubtopicDetailsDialog({ subtopic, onClose }: { subtopic: AdminSubtopic; onClose: () => void }) {
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
        aria-labelledby="subtopic-details-title"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="outline">{subtopic.exam} · {subtopic.subject}</Badge>
            <h2 id="subtopic-details-title" className="mt-3 text-xl font-semibold text-[#142344]">{subtopic.name}</h2>
            <p className="mt-1 text-xs text-slate-500">{subtopic.chapter}</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close subtopic details" onClick={onClose}>
            <X size={17} />
          </Button>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{subtopic.description}</p>
        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <span className="flex items-center gap-1.5 text-[10px] text-slate-500"><FileQuestion size={12} /> Questions</span>
          <p className="mt-1 text-xl font-semibold text-[#142344]">{subtopic.questions.toLocaleString()}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-500">Created {subtopic.createdDate}</span>
          <Badge variant={subtopic.status === "Active" ? "success" : "outline"}>{subtopic.status}</Badge>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </motion.section>
    </motion.div>
  );
}

function DeactivateConfirmation({
  subtopic,
  onCancel,
  onConfirm,
}: {
  subtopic: AdminSubtopic;
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
        aria-labelledby="deactivate-subtopic-title"
        aria-describedby="deactivate-subtopic-description"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
      >
        <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
          <Power size={18} />
        </span>
        <h2 id="deactivate-subtopic-title" className="mt-4 text-lg font-semibold text-[#142344]">
          Deactivate {subtopic.name}?
        </h2>
        <p id="deactivate-subtopic-description" className="mt-2 text-sm leading-6 text-slate-500">
          {subtopic.exam} · {subtopic.subject} · {subtopic.chapter} will be marked inactive in this local preview.
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm} className="gap-2">
            <Power size={14} /> Deactivate subtopic
          </Button>
        </div>
      </motion.section>
    </motion.div>
  );
}

function SubtopicActions({
  subtopic,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
}: {
  subtopic: AdminSubtopic;
  onView: () => void;
  onEdit: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Button variant="outline" size="sm" className="gap-1" aria-label={`View Details for ${subtopic.name}`} onClick={onView}>
        <Eye size={13} /><span>View</span>
      </Button>
      <Button variant="ghost" size="sm" className="gap-1" aria-label={`Edit ${subtopic.name}`} onClick={onEdit}>
        <Pencil size={13} /><span>Edit</span>
      </Button>
      {subtopic.status === "Active" ? (
        <Button variant="outline" size="sm" className="gap-1" aria-label={`Deactivate ${subtopic.name}`} onClick={onDeactivate}>
          <Power size={13} /><span>Deactivate</span>
        </Button>
      ) : (
        <Button size="sm" className="gap-1" aria-label={`Activate ${subtopic.name}`} onClick={onActivate}>
          <Power size={13} /><span>Activate</span>
        </Button>
      )}
    </div>
  );
}

export function SubtopicManagement() {
  const [subtopics, setSubtopics] = useState<AdminSubtopic[]>(initialAdminSubtopics);
  const [searchValue, setSearchValue] = useState("");
  const [examFilter, setExamFilter] = useState<ExamFilter>("All");
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("All");
  const [chapterFilter, setChapterFilter] = useState<ChapterFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSubtopic, setEditingSubtopic] = useState<AdminSubtopic | null>(null);
  const [detailsSubtopic, setDetailsSubtopic] = useState<AdminSubtopic | null>(null);
  const [deactivatingSubtopic, setDeactivatingSubtopic] = useState<AdminSubtopic | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 300);
    return () => window.clearTimeout(timeout);
  }, []);

  const availableSubjects = useMemo(() => {
    const subjects = initialAdminSubjects
      .filter((subject) => examFilter === "All" || subject.exam === examFilter)
      .map((subject) => subject.name);
    return [...new Set(subjects)];
  }, [examFilter]);

  const availableChapters = useMemo(() => {
    const chapters = initialAdminChapters.filter((chapter) =>
      (examFilter === "All" || chapter.exam === examFilter)
      && (subjectFilter === "All" || chapter.subject === subjectFilter),
    );
    return [...new Set(chapters.map((chapter) => chapter.name))];
  }, [examFilter, subjectFilter]);

  const filteredSubtopics = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return subtopics.filter((subtopic) => {
      if (examFilter !== "All" && subtopic.exam !== examFilter) return false;
      if (subjectFilter !== "All" && subtopic.subject !== subjectFilter) return false;
      if (chapterFilter !== "All" && subtopic.chapter !== chapterFilter) return false;
      if (statusFilter !== "All" && subtopic.status !== statusFilter) return false;
      if (!query) return true;
      return [
        subtopic.name,
        subtopic.exam,
        subtopic.subject,
        subtopic.chapter,
        subtopic.description,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [chapterFilter, examFilter, searchValue, statusFilter, subjectFilter, subtopics]);

  function setExamFilterValue(value: ExamFilter) {
    setExamFilter(value);
    setSubjectFilter("All");
    setChapterFilter("All");
  }

  function setSubjectFilterValue(value: SubjectFilter) {
    setSubjectFilter(value);
    setChapterFilter("All");
  }

  function openAddForm() {
    setEditingSubtopic(null);
    setFormOpen(true);
    setFeedback("");
  }

  function openEditForm(subtopic: AdminSubtopic) {
    setEditingSubtopic(subtopic);
    setFormOpen(true);
    setFeedback("");
  }

  function saveSubtopic(draft: SubtopicDraft): string | null {
    const duplicate = subtopics.some((subtopic) =>
      subtopic.id !== editingSubtopic?.id
      && subtopic.exam === draft.exam
      && subtopic.subject === draft.subject
      && subtopic.chapter === draft.chapter
      && subtopic.name.toLowerCase() === draft.name.toLowerCase(),
    );
    if (duplicate) return "This subtopic already exists in the selected chapter.";

    if (editingSubtopic) {
      setSubtopics((current) => current.map((subtopic) => subtopic.id === editingSubtopic.id
        ? { ...subtopic, ...draft }
        : subtopic));
      setFeedback(`${draft.name} updated in this preview.`);
    } else {
      const createdDate = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      setSubtopics((current) => [{
        id: `subtopic-${Date.now()}`,
        ...draft,
        questions: 0,
        createdDate,
      }, ...current]);
      setFeedback(`${draft.name} added in this preview.`);
    }
    setFormOpen(false);
    return null;
  }

  function activateSubtopic(subtopic: AdminSubtopic) {
    setSubtopics((current) => current.map((item) => item.id === subtopic.id ? { ...item, status: "Active" } : item));
    setFeedback(`${subtopic.name} activated in this preview.`);
  }

  function confirmDeactivation() {
    if (!deactivatingSubtopic) return;
    setSubtopics((current) => current.map((item) => item.id === deactivatingSubtopic.id
      ? { ...item, status: "Inactive" }
      : item));
    setFeedback(`${deactivatingSubtopic.name} deactivated in this preview.`);
    setDeactivatingSubtopic(null);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingSubtopic(null);
  }

  function renderActions(subtopic: AdminSubtopic) {
    return (
      <SubtopicActions
        subtopic={subtopic}
        onView={() => setDetailsSubtopic(subtopic)}
        onEdit={() => openEditForm(subtopic)}
        onActivate={() => activateSubtopic(subtopic)}
        onDeactivate={() => setDeactivatingSubtopic(subtopic)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#142344]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <SubtopicSidebar />
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
              <SubtopicSidebar mobile onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
      <div className="min-h-screen lg:pl-[252px]">
        <SubtopicHeader
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
            setFeedback("Sign-out is not connected in this frontend preview.");
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
                <span className="text-indigo-600">Subtopic Management</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-3xl">Subtopic Management</h1>
              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                Organize subtopics and review question coverage across the exam catalog.
              </p>
            </div>
            <Button onClick={openAddForm} className="gap-2">
              <Plus size={16} /> Add Subtopic
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
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[minmax(0,1fr)_150px_170px_190px_150px_auto] xl:items-end">
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Search subtopics</span>
                <span className="relative">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    aria-label="Search subtopics"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search name, exam, subject, or chapter..."
                    className="!min-h-10 rounded-xl !pl-9 text-xs"
                  />
                </span>
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Exam</span>
                <span className="relative">
                  <select
                    aria-label="Filter subtopics by exam"
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
                    aria-label="Filter subtopics by subject"
                    value={subjectFilter}
                    onChange={(event) => setSubjectFilterValue(event.target.value)}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="All">All subjects</option>
                    {availableSubjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Chapter</span>
                <span className="relative">
                  <select
                    aria-label="Filter subtopics by chapter"
                    value={chapterFilter}
                    onChange={(event) => setChapterFilter(event.target.value)}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="All">All chapters</option>
                    {availableChapters.map((chapter) => <option key={chapter} value={chapter}>{chapter}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Status</span>
                <span className="relative">
                  <select
                    aria-label="Filter subtopics by status"
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
                <Filter size={14} /> {filteredSubtopics.length} of {subtopics.length} subtopics
              </div>
            </div>
          </Card>

          <section id="subtopic-list" aria-label="Subtopic list" className="scroll-mt-24">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-[#142344]">Subtopic catalog</h2>
                <p className="mt-1 text-[10px] text-slate-500">Sample subtopic records · local preview only</p>
              </div>
              <Badge variant="outline" className="gap-1.5"><Eye size={12} /> Admin preview</Badge>
            </div>

            {loading ? (
              <SubtopicLoadingSkeleton />
            ) : filteredSubtopics.length ? (
              <>
                <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
                  <table className="w-full min-w-[1100px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        <th scope="col" className="px-4 py-3">Subtopic</th>
                        <th scope="col" className="px-4 py-3">Exam</th>
                        <th scope="col" className="px-4 py-3">Subject</th>
                        <th scope="col" className="px-4 py-3">Chapter</th>
                        <th scope="col" className="px-4 py-3">Questions</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3">Created</th>
                        <th scope="col" className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <AnimatePresence initial={false}>
                        {filteredSubtopics.map((subtopic) => (
                          <motion.tr
                            key={subtopic.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="align-top transition-colors hover:bg-slate-50/70"
                          >
                            <th scope="row" className="max-w-[250px] px-4 py-4 font-normal">
                              <p className="line-clamp-2 text-xs font-semibold leading-5 text-[#142344]">{subtopic.name}</p>
                              <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">{subtopic.description}</p>
                            </th>
                            <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">{subtopic.exam}</td>
                            <td className="px-4 py-4 text-xs font-medium text-[#142344]">{subtopic.subject}</td>
                            <td className="max-w-[190px] px-4 py-4 text-xs text-slate-600">{subtopic.chapter}</td>
                            <td className="px-4 py-4 text-xs text-slate-600">{subtopic.questions.toLocaleString()}</td>
                            <td className="px-4 py-4">
                              <Badge variant={subtopic.status === "Active" ? "success" : "outline"}>{subtopic.status}</Badge>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-[10px] text-slate-500">{subtopic.createdDate}</td>
                            <td className="px-4 py-4">{renderActions(subtopic)}</td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                <motion.div layout className="grid min-w-0 grid-cols-1 gap-3 md:hidden">
                  <AnimatePresence mode="popLayout">
                    {filteredSubtopics.map((subtopic) => (
                      <motion.div
                        key={subtopic.id}
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
                                {subtopic.exam} · {subtopic.subject}
                              </p>
                              <h3 className="mt-1 text-sm font-semibold leading-5 text-[#142344]">{subtopic.name}</h3>
                            </div>
                            <Badge variant={subtopic.status === "Active" ? "success" : "outline"}>{subtopic.status}</Badge>
                          </div>
                          <p className="mt-2 text-[10px] font-medium text-slate-500">{subtopic.chapter}</p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{subtopic.description}</p>
                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-500">
                            <span className="inline-flex items-center gap-1"><FileQuestion size={12} /> {subtopic.questions} questions</span>
                            <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {subtopic.createdDate}</span>
                          </div>
                          <div className="mt-4 border-t border-slate-100 pt-3">{renderActions(subtopic)}</div>
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
                  <h3 className="mt-3 text-sm font-semibold text-[#142344]">No subtopics found</h3>
                  <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                    No sample subtopics match your search and filters.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-2"
                    onClick={() => {
                      setSearchValue("");
                      setExamFilter("All");
                      setSubjectFilter("All");
                      setChapterFilter("All");
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
            <span className="inline-flex items-center gap-2"><ShieldCheck size={13} className="text-indigo-500" /> Subtopic changes are held in local UI state only.</span>
            <span>No database or authentication is connected.</span>
          </div>
        </motion.main>
      </div>

      <AnimatePresence>
        {formOpen ? (
          <SubtopicFormDialog
            key={editingSubtopic?.id ?? "new-subtopic"}
            initialSubtopic={editingSubtopic}
            onClose={closeForm}
            onSave={saveSubtopic}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {detailsSubtopic ? (
          <SubtopicDetailsDialog subtopic={detailsSubtopic} onClose={() => setDetailsSubtopic(null)} />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {deactivatingSubtopic ? (
          <DeactivateConfirmation
            subtopic={deactivatingSubtopic}
            onCancel={() => setDeactivatingSubtopic(null)}
            onConfirm={confirmDeactivation}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
