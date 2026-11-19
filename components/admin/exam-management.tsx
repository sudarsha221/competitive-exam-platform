"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Eye,
  FileQuestion,
  Filter,
  LayoutDashboard,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Power,
  Search,
  ShieldCheck,
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
  initialAdminExams,
  type AdminExam,
  type ExamDraft,
  type ExamStatus,
} from "@/components/admin/exam-data";

type StatusFilter = "All" | ExamStatus;

const navigationItems = [
  { label: "Admin overview", href: "/admin", icon: LayoutDashboard },
  { label: "Exam management", href: "/admin/exams", icon: BookOpenCheck },
  { label: "Exam list", href: "#exam-list", icon: FileQuestion },
];

function ExamSidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
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
      <nav aria-label="Admin exam management" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Platform administration
        </p>
        <div className="grid gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/admin/exams";
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
            Sample exam records · changes stay in this page.
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

function ExamHeader({
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
        <div className="min-w-0">
          <p className="truncate text-[10px] text-slate-400">Admin workspace</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-[#142344]">Exam Management</p>
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
                  <p className="mt-3 text-xs font-semibold text-[#142344]">Exam records are ready to review</p>
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
            className="!size-9 !min-h-9 !min-w-9 !p-0 rounded-xl sm:!h-9 sm:!w-auto sm:!px-3"
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

function ExamLoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading exams" className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <Card key={index} className="space-y-4 p-5">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
          <div className="h-6 w-3/4 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
          </div>
          <div className="h-9 w-full animate-pulse rounded-xl bg-slate-100" />
        </Card>
      ))}
      <span className="sr-only">Loading sample exams…</span>
    </div>
  );
}

function ExamFormDialog({
  initialExam,
  onClose,
  onSave,
}: {
  initialExam: AdminExam | null;
  onClose: () => void;
  onSave: (draft: ExamDraft) => string | null;
}) {
  const [name, setName] = useState(initialExam?.name ?? "");
  const [code, setCode] = useState(initialExam?.code ?? "");
  const [description, setDescription] = useState(initialExam?.description ?? "");
  const [status, setStatus] = useState<ExamStatus>(initialExam?.status ?? "Active");
  const [errors, setErrors] = useState<{
    name?: string;
    code?: string;
    description?: string;
    form?: string;
  }>({});

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    const trimmedName = name.trim();
    const normalizedCode = code.trim().toUpperCase();
    const trimmedDescription = description.trim();

    if (trimmedName.length < 3) nextErrors.name = "Enter an exam name with at least 3 characters.";
    if (!/^[A-Z0-9-]{2,16}$/.test(normalizedCode)) {
      nextErrors.code = "Use 2–16 letters, numbers, or hyphens.";
    }
    if (trimmedDescription.length < 10) {
      nextErrors.description = "Enter a description with at least 10 characters.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const saveError = onSave({
      name: trimmedName,
      code: normalizedCode,
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
    <AnimatePresence>
      <motion.div
        key="exam-form-backdrop"
        className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.section
          role="dialog"
          aria-modal="true"
          aria-labelledby="exam-form-title"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge variant="primary">Sample exam record</Badge>
              <h2 id="exam-form-title" className="mt-3 text-lg font-semibold text-[#142344]">
                {initialExam ? "Edit exam" : "Add exam"}
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">Changes are stored only in this page preview.</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Close exam form" onClick={onClose}>
              <X size={17} />
            </Button>
          </div>

          <form onSubmit={submitForm} noValidate className="mt-5 grid gap-4">
            {errors.form ? (
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {errors.form}
              </p>
            ) : null}
            <Input
              label="Exam name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Karnataka Common Entrance Test"
              error={errors.name}
              autoFocus
            />
            <Input
              label="Exam code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="e.g. KCET"
              hint={errors.code ? undefined : "Use 2–16 letters, numbers, or hyphens."}
              error={errors.code}
            />
            <div className="grid gap-2">
              <label htmlFor="exam-description" className="text-sm font-medium text-foreground">Description</label>
              <textarea
                id="exam-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Briefly describe this examination."
                rows={4}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? "exam-description-error" : undefined}
                className={`w-full resize-y rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted/80 focus:border-ring focus:ring-4 focus:ring-ring/15 ${errors.description ? "border-danger focus:border-danger focus:ring-danger/15" : ""}`}
              />
              {errors.description ? <p id="exam-description-error" className="text-xs text-danger">{errors.description}</p> : null}
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-foreground">Status</span>
              <select
                aria-label="Exam status"
                value={status}
                onChange={(event) => setStatus(event.target.value as ExamStatus)}
                className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            <div className="mt-1 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="gap-2">
                <CheckCircle2 size={15} /> {initialExam ? "Save changes" : "Save exam"}
              </Button>
            </div>
          </form>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}

function ExamDetailsDialog({ exam, onClose }: { exam: AdminExam; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key="exam-details-backdrop"
        className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.section
          role="dialog"
          aria-modal="true"
          aria-labelledby="exam-details-title"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge variant="outline">Exam details</Badge>
              <h2 id="exam-details-title" className="mt-3 text-xl font-semibold text-[#142344]">{exam.name}</h2>
              <p className="mt-1 text-xs text-slate-500">Exam code · {exam.code}</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Close exam details" onClick={onClose}>
              <X size={17} />
            </Button>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{exam.description}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">Subjects</p>
              <p className="mt-1 text-xl font-semibold text-[#142344]">{exam.subjects}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">Questions</p>
              <p className="mt-1 text-xl font-semibold text-[#142344]">{exam.questions.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
            <span className="text-xs text-slate-500">Created {exam.createdDate}</span>
            <Badge variant={exam.status === "Active" ? "success" : "outline"}>{exam.status}</Badge>
          </div>
          <div className="mt-5 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}

function DeactivateConfirmation({
  exam,
  onCancel,
  onConfirm,
}: {
  exam: AdminExam;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key="deactivate-backdrop"
        className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.section
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="deactivate-title"
          aria-describedby="deactivate-description"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
            <Power size={18} />
          </span>
          <h2 id="deactivate-title" className="mt-4 text-lg font-semibold text-[#142344]">Deactivate {exam.code}?</h2>
          <p id="deactivate-description" className="mt-2 text-sm leading-6 text-slate-500">
            {exam.name} will be marked inactive in this local preview. No student access or records are changed.
          </p>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button variant="primary" onClick={onConfirm} className="gap-2">
              <Power size={14} /> Deactivate exam
            </Button>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}

export function ExamManagement() {
  const [exams, setExams] = useState<AdminExam[]>(initialAdminExams);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<AdminExam | null>(null);
  const [detailsExam, setDetailsExam] = useState<AdminExam | null>(null);
  const [deactivatingExam, setDeactivatingExam] = useState<AdminExam | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 300);
    return () => window.clearTimeout(timeout);
  }, []);

  const filteredExams = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return exams.filter((exam) => {
      if (statusFilter !== "All" && exam.status !== statusFilter) return false;
      if (!query) return true;
      return [exam.name, exam.code, exam.description].some((value) => value.toLowerCase().includes(query));
    });
  }, [exams, searchValue, statusFilter]);

  function openAddForm() {
    setEditingExam(null);
    setFormOpen(true);
    setFeedback("");
  }

  function openEditForm(exam: AdminExam) {
    setEditingExam(exam);
    setFormOpen(true);
    setFeedback("");
  }

  function saveExam(draft: ExamDraft): string | null {
    const duplicate = exams.some((exam) =>
      exam.id !== editingExam?.id
      && (exam.code.toLowerCase() === draft.code.toLowerCase()
        || exam.name.toLowerCase() === draft.name.toLowerCase()),
    );
    if (duplicate) return "An exam with this name or code already exists.";

    if (editingExam) {
      setExams((current) => current.map((exam) => exam.id === editingExam.id
        ? { ...exam, ...draft }
        : exam));
      setFeedback(`${draft.code} updated in this preview.`);
    } else {
      const createdDate = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      setExams((current) => [{
        id: `exam-${Date.now()}`,
        ...draft,
        subjects: 0,
        questions: 0,
        createdDate,
      }, ...current]);
      setFeedback(`${draft.code} added to this preview.`);
    }
    setFormOpen(false);
    return null;
  }

  function activateExam(exam: AdminExam) {
    setExams((current) => current.map((item) => item.id === exam.id ? { ...item, status: "Active" } : item));
    setFeedback(`${exam.code} activated in this preview.`);
  }

  function confirmDeactivation() {
    if (!deactivatingExam) return;
    setExams((current) => current.map((item) => item.id === deactivatingExam.id
      ? { ...item, status: "Inactive" }
      : item));
    setFeedback(`${deactivatingExam.code} deactivated in this preview.`);
    setDeactivatingExam(null);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingExam(null);
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#142344]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <ExamSidebar />
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
              <ExamSidebar mobile onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
      <div className="min-h-screen lg:pl-[252px]">
        <ExamHeader
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
                <span className="text-indigo-600">Exam Management</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-3xl">Exam Management</h1>
              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                Manage competitive examinations and review their sample question coverage.
              </p>
            </div>
            <Button onClick={openAddForm} className="gap-2">
              <Plus size={16} /> Add Exam
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
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-end">
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Search exams</span>
                <span className="relative">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    aria-label="Search exams"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search by exam name, code, or description..."
                    className="!min-h-10 rounded-xl !pl-9 text-xs"
                  />
                </span>
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Exam status</span>
                <span className="relative">
                  <select
                    aria-label="Filter exams by status"
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
                <Filter size={14} /> {filteredExams.length} of {exams.length} exams
              </div>
            </div>
          </Card>

          <section id="exam-list" aria-label="Exam list" className="scroll-mt-24">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-[#142344]">Competitive examinations</h2>
                <p className="mt-1 text-[10px] text-slate-500">Sample exam records · local preview only</p>
              </div>
              <Badge variant="outline" className="gap-1.5"><Eye size={12} /> Admin preview</Badge>
            </div>

            {loading ? (
              <ExamLoadingSkeleton />
            ) : filteredExams.length ? (
              <motion.div layout className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filteredExams.map((exam) => (
                    <motion.div
                      key={exam.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="min-w-0"
                    >
                      <Card interactive className="flex h-full min-w-0 flex-col p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                            <BookOpenCheck size={18} />
                          </span>
                          <Badge variant={exam.status === "Active" ? "success" : "outline"} className="gap-1.5">
                            <span className={`size-1.5 rounded-full ${exam.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                            {exam.status}
                          </Badge>
                        </div>
                        <div className="mt-4 min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-600">{exam.code}</p>
                          <h3 className="mt-1 text-base font-semibold leading-6 text-[#142344] sm:text-lg">{exam.name}</h3>
                          <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">{exam.description}</p>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                            <span className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500">
                              <Users size={12} /> Subjects
                            </span>
                            <p className="mt-1 text-lg font-semibold text-[#142344]">{exam.subjects}</p>
                          </div>
                          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                            <span className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500">
                              <FileQuestion size={12} /> Questions
                            </span>
                            <p className="mt-1 text-lg font-semibold text-[#142344]">{exam.questions.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[10px] text-slate-400">
                          <CalendarDays size={12} /> Created {exam.createdDate}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setDetailsExam(exam)}>
                            <Eye size={13} /> View Details
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => openEditForm(exam)}>
                            <Pencil size={13} /> Edit
                          </Button>
                          {exam.status === "Active" ? (
                            <Button variant="outline" size="sm" className="gap-1.5 text-slate-600" onClick={() => setDeactivatingExam(exam)}>
                              <Power size={13} /> Deactivate
                            </Button>
                          ) : (
                            <Button size="sm" className="gap-1.5" onClick={() => activateExam(exam)}>
                              <Power size={13} /> Activate
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Card className="grid min-h-64 place-items-center p-6 text-center">
                <div>
                  <CircleHelp size={25} className="mx-auto text-slate-300" />
                  <h3 className="mt-3 text-sm font-semibold text-[#142344]">No exams found</h3>
                  <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                    No sample exams match your search and status filter.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-2"
                    onClick={() => {
                      setSearchValue("");
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
            <span className="inline-flex items-center gap-2"><ShieldCheck size={13} className="text-indigo-500" /> Exam changes are held in local UI state only.</span>
            <span>No database or authentication is connected.</span>
          </div>
        </motion.main>
      </div>

      <AnimatePresence>
        {formOpen ? (
          <ExamFormDialog
            key={editingExam?.id ?? "new-exam"}
            initialExam={editingExam}
            onClose={closeForm}
            onSave={saveExam}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {detailsExam ? (
          <ExamDetailsDialog exam={detailsExam} onClose={() => setDetailsExam(null)} />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {deactivatingExam ? (
          <DeactivateConfirmation
            exam={deactivatingExam}
            onCancel={() => setDeactivatingExam(null)}
            onConfirm={confirmDeactivation}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
