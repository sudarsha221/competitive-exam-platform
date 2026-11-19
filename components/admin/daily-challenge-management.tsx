"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Eye,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Target,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import {
  dailyChallengeQuestionBank,
  initialAdminDailyChallenges,
  type AdminChallengeStatus,
  type AdminDailyChallenge,
  type ChallengeQuestion,
} from "@/components/admin/daily-challenge-data";
import {
  subjectExamOptions,
  type SubjectExam,
} from "@/components/admin/subject-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ChallengeFilter = "All" | AdminChallengeStatus;
type ExamFilter = "All" | SubjectExam;
type ChallengeDraft = Pick<AdminDailyChallenge, "title" | "exam" | "startDate" | "questionIds">;

const TIME_ZONE = "Asia/Kolkata";
const questionCount = 30;

const navigationItems = [
  { label: "Admin overview", href: "/admin", icon: LayoutDashboard },
  { label: "Exam management", href: "/admin/exams", icon: GraduationCap },
  { label: "Subject management", href: "/admin/subjects", icon: BookOpen },
  { label: "Chapter management", href: "/admin/chapters", icon: Layers3 },
  { label: "Question bank", href: "/admin/questions", icon: FileCheck2 },
  { label: "Bulk question import", href: "/admin/import", icon: FileCheck2 },
  { label: "Daily challenge management", href: "/admin/challenges", icon: Target },
];

const challengeStatuses: AdminChallengeStatus[] = ["Draft", "Scheduled", "Published", "Completed"];

function getKolkataDate(timestamp = Date.now()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(timestamp);
  const part = (type: string) => parts.find((value) => value.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function formatChallengeDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const timestamp = Date.UTC(year, month - 1, day, 6, 30);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: TIME_ZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(timestamp);
}

function challengeStatusVariant(status: AdminChallengeStatus) {
  if (status === "Published" || status === "Completed") return "success";
  if (status === "Scheduled") return "primary";
  return "warning";
}

function ChallengeSidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
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
      <nav aria-label="Admin daily challenge management" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Platform administration
        </p>
        <div className="grid gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/admin/challenges";
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
            Challenge changes stay in this local preview.
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

function ChallengeHeader({
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
          <p className="mt-0.5 truncate text-sm font-semibold text-[#142344]">Daily Challenge Management</p>
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
                  <p className="mt-3 text-xs font-semibold text-[#142344]">Challenge plans are ready to review</p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">This workspace uses sample data only.</p>
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
                  className="absolute right-0 top-12 w-56 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"
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

function ChallengeStats({
  total,
  published,
  scheduled,
  drafts,
  completed,
}: {
  total: number;
  published: number;
  scheduled: number;
  drafts: number;
  completed: number;
}) {
  const stats = [
    { label: "Total challenges", value: total, icon: Target, tone: "bg-indigo-100 text-indigo-700", detail: "Across all exam cycles" },
    { label: "Published challenges", value: published, icon: CheckCircle2, tone: "bg-emerald-100 text-emerald-700", detail: "Visible in the sample preview" },
    { label: "Scheduled challenges", value: scheduled, icon: CalendarDays, tone: "bg-blue-100 text-blue-700", detail: "Future start dates" },
    { label: "Draft challenges", value: drafts, icon: Pencil, tone: "bg-amber-100 text-amber-700", detail: "Not yet published" },
    { label: "Completed challenges", value: completed, icon: Check, tone: "bg-violet-100 text-violet-700", detail: "Sample completed cycles" },
  ];

  return (
    <section aria-label="Challenge statistics" className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -3 }}
          >
            <Card className="relative overflow-hidden p-4 sm:p-5">
              <span className={`absolute -right-4 -top-5 size-20 rounded-full opacity-50 blur-2xl ${stat.tone.split(" ")[0]}`} />
              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-slate-500 sm:text-xs">{stat.label}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-[#142344] sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-400">{stat.detail}</p>
                </div>
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${stat.tone}`}>
                  <Icon size={18} />
                </span>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </section>
  );
}

function ChallengeRulesNotice() {
  return (
    <Card className="mb-5 overflow-hidden">
      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] lg:items-center">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
            <Clock3 size={18} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-[#142344]">Daily challenge rules</h2>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              A cycle contains 30 unique questions, scheduled one per day. Students may retry an incorrect answer until 11:59 PM Asia/Kolkata; a correct answer completes that day. Future days remain locked until their scheduled date.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
            <CircleHelp size={15} />
            Scheduling is a preview
          </div>
          <p className="mt-1.5 text-[10px] leading-4 text-amber-800/80">
            Dates, publishing, retries, and locked-day rules are not enforced or connected to a backend here.
          </p>
        </div>
      </div>
    </Card>
  );
}

function LoadingChallenges() {
  return (
    <div role="status" aria-label="Loading daily challenges" className="grid gap-3">
      {Array.from({ length: 4 }, (_, index) => (
        <Card key={index} className="flex items-center gap-4 p-4">
          <div className="size-10 shrink-0 animate-pulse rounded-xl bg-slate-100" />
          <div className="grid min-w-0 flex-1 gap-2">
            <div className="h-4 w-2/5 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="hidden h-8 w-20 animate-pulse rounded bg-slate-100 sm:block" />
        </Card>
      ))}
      <span className="sr-only">Loading sample daily challenges…</span>
    </div>
  );
}

function ChallengeFormDialog({
  initialChallenge,
  questions,
  onClose,
  onSaveDraft,
  onRequestPublish,
}: {
  initialChallenge: AdminDailyChallenge | null;
  questions: ChallengeQuestion[];
  onClose: () => void;
  onSaveDraft: (draft: ChallengeDraft) => void;
  onRequestPublish: (draft: ChallengeDraft) => void;
}) {
  const [title, setTitle] = useState(initialChallenge?.title ?? "");
  const [exam, setExam] = useState<SubjectExam>(initialChallenge?.exam ?? "KCET");
  const [startDate, setStartDate] = useState(initialChallenge?.startDate ?? getKolkataDate());
  const [selectedIds, setSelectedIds] = useState<string[]>(initialChallenge?.questionIds ?? []);
  const [questionSearch, setQuestionSearch] = useState("");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; startDate?: string; questions?: string }>({});

  const examQuestions = useMemo(
    () => questions.filter((question) => question.exam === exam),
    [exam, questions],
  );
  const selectedQuestions = selectedIds
    .map((id) => examQuestions.find((question) => question.id === id))
    .filter((question): question is ChallengeQuestion => Boolean(question));
  const filteredQuestions = examQuestions.filter((question) => {
    const query = questionSearch.trim().toLowerCase();
    return !query || [question.id, question.prompt, question.subject, question.chapter]
      .some((value) => value.toLowerCase().includes(query));
  });
  function getDraft(requireThirty: boolean): ChallengeDraft | null {
    const nextErrors: typeof fieldErrors = {};
    if (!title.trim()) nextErrors.title = "Enter a challenge title.";
    if (!startDate) nextErrors.startDate = "Choose a schedule start date.";
    if (new Set(selectedIds).size !== selectedIds.length) {
      nextErrors.questions = "Each question may be selected only once.";
    } else if (requireThirty && selectedIds.length !== questionCount) {
      nextErrors.questions = `Select exactly ${questionCount} unique questions to publish.`;
    }

    setFieldErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) return null;
    return {
      title: title.trim(),
      exam,
      startDate,
      questionIds: [...selectedIds],
    };
  }

  function toggleQuestion(questionId: string) {
    setFormError("");
    setFieldErrors((current) => ({ ...current, questions: undefined }));
    setSelectedIds((current) => current.includes(questionId)
      ? current.filter((id) => id !== questionId)
      : current.length < questionCount
        ? [...current, questionId]
        : current);
    if (!selectedIds.includes(questionId) && selectedIds.length >= questionCount) {
      setFormError(`A challenge can contain only ${questionCount} questions. Remove one before adding another.`);
    }
  }

  function handleExamChange(nextExam: SubjectExam) {
    setExam(nextExam);
    setSelectedIds([]);
    setQuestionSearch("");
    setFieldErrors((current) => ({ ...current, questions: undefined }));
    setFormError("");
  }

  function handleSaveDraft() {
    const draft = getDraft(false);
    if (draft) onSaveDraft(draft);
  }

  function handlePublish() {
    const draft = getDraft(true);
    if (draft) onRequestPublish(draft);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/45 p-3 backdrop-blur-sm sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="challenge-form-title"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-6xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="primary">30-day exam cycle</Badge>
            <h2 id="challenge-form-title" className="mt-3 text-lg font-semibold text-[#142344]">
              {initialChallenge ? "Edit daily challenge" : "Create daily challenge"}
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Build a 30-question cycle. Changes remain in this local UI preview.
            </p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close challenge form" onClick={onClose}>
            <X size={17} />
          </Button>
        </div>

        <div className="mt-5 grid gap-5">
          {formError ? (
            <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {formError}
            </p>
          ) : null}
          <section aria-label="Challenge information" className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(180px,0.7fr)_minmax(180px,0.7fr)]">
              <label className="grid min-w-0 gap-1.5">
                <span className="text-xs font-medium text-[#142344]">Challenge title</span>
                <Input
                  aria-label="Challenge title"
                  aria-invalid={Boolean(fieldErrors.title)}
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setFieldErrors((current) => ({ ...current, title: undefined }));
                  }}
                  placeholder="e.g. KCET November Practice Cycle"
                  className="!min-h-10 rounded-xl text-xs"
                />
                {fieldErrors.title ? <span role="alert" className="text-[11px] text-rose-700">{fieldErrors.title}</span> : null}
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-xs font-medium text-[#142344]">Exam</span>
                <span className="relative">
                  <select
                    aria-label="Challenge exam"
                    value={exam}
                    onChange={(event) => handleExamChange(event.target.value as SubjectExam)}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    {subjectExamOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-xs font-medium text-[#142344]">Schedule start date</span>
                <Input
                  aria-label="Schedule start date"
                  type="date"
                  min={initialChallenge ? undefined : getKolkataDate()}
                  aria-invalid={Boolean(fieldErrors.startDate)}
                  value={startDate}
                  onChange={(event) => {
                    setStartDate(event.target.value);
                    setFieldErrors((current) => ({ ...current, startDate: undefined }));
                  }}
                  className="!min-h-10 rounded-xl text-xs"
                />
                {fieldErrors.startDate ? <span role="alert" className="text-[11px] text-rose-700">{fieldErrors.startDate}</span> : null}
              </label>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2.5 text-[10px] leading-4 text-indigo-900">
              <span className="inline-flex items-center gap-2 font-semibold">
                <Clock3 size={14} /> One question per day · 30 unique questions
              </span>
              <span>Retry deadline: 11:59 PM Asia/Kolkata · future days are locked until their date.</span>
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section aria-labelledby="question-bank-title" className="min-w-0 rounded-2xl border border-slate-200 p-3 sm:p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 id="question-bank-title" className="text-sm font-semibold text-[#142344]">Select questions</h3>
                  <p className="mt-1 text-[10px] text-slate-500">Choose from the {exam} sample question bank.</p>
                </div>
                <Badge variant={selectedIds.length === questionCount ? "success" : "primary"}>
                  {selectedIds.length} / {questionCount} selected
                </Badge>
              </div>
              <div className="relative mt-3">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  aria-label="Search challenge questions"
                  value={questionSearch}
                  onChange={(event) => setQuestionSearch(event.target.value)}
                  placeholder="Search question, subject, chapter, or ID..."
                  className="!min-h-9 rounded-xl !pl-9 text-[11px]"
                />
              </div>
              {fieldErrors.questions ? <p role="alert" className="mt-2 text-[11px] text-rose-700">{fieldErrors.questions}</p> : null}
              <div className="mt-3 max-h-[340px] space-y-2 overflow-y-auto pr-1">
                {filteredQuestions.length ? filteredQuestions.map((question) => {
                  const checked = selectedIds.includes(question.id);
                  const disabled = !checked && selectedIds.length >= questionCount;
                  return (
                    <label
                      key={question.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                        checked ? "border-indigo-200 bg-indigo-50/60" : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        aria-label={`Select question ${question.id}`}
                        onChange={() => toggleQuestion(question.id)}
                        className="mt-0.5 size-4 shrink-0 accent-indigo-600"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-semibold text-indigo-700">{question.id}</span>
                          <Badge variant={question.difficulty === "Advanced" ? "warning" : "outline"}>{question.difficulty}</Badge>
                        </span>
                        <span className="mt-1 block text-[11px] leading-5 text-[#142344]">{question.prompt}</span>
                        <span className="mt-1 block text-[10px] text-slate-400">{question.subject} · {question.chapter}</span>
                      </span>
                    </label>
                  );
                }) : (
                  <div className="rounded-xl bg-slate-50 px-3 py-6 text-center">
                    <p className="text-xs font-semibold text-[#142344]">No questions found</p>
                    <p className="mt-1 text-[10px] text-slate-500">Try another search term.</p>
                  </div>
                )}
              </div>
            </section>

            <section aria-labelledby="selected-questions-title" className="min-w-0 rounded-2xl border border-slate-200 p-3 sm:p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 id="selected-questions-title" className="text-sm font-semibold text-[#142344]">Preview selected questions</h3>
                  <p className="mt-1 text-[10px] text-slate-500">Selection order determines the 30-day sequence.</p>
                </div>
                <Badge variant={selectedIds.length === questionCount ? "success" : "outline"}>
                  {questionCount - selectedIds.length} remaining
                </Badge>
              </div>
              <div className="mt-3 max-h-[340px] space-y-2 overflow-y-auto pr-1">
                {selectedQuestions.length ? selectedQuestions.map((question, index) => (
                  <div key={question.id} className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-white text-[10px] font-bold text-indigo-600 shadow-sm">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold text-[#142344]">{question.id}</p>
                      <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-600">{question.prompt}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="!size-7 !min-h-7 !min-w-7 !p-0 shrink-0 rounded-lg text-slate-400 hover:!text-rose-600"
                      aria-label={`Remove question ${question.id}`}
                      onClick={() => toggleQuestion(question.id)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                )) : (
                  <div className="grid min-h-48 place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-5 text-center">
                    <div>
                      <span className="mx-auto grid size-9 place-items-center rounded-xl bg-white text-slate-400">
                        <BookOpen size={16} />
                      </span>
                      <p className="mt-2 text-xs font-semibold text-[#142344]">No questions selected</p>
                      <p className="mt-1 text-[10px] text-slate-500">Select questions from the bank to build the cycle.</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3 rounded-xl border border-slate-100 bg-white px-3 py-2 text-[10px] text-slate-500">
                <span className="font-semibold text-[#142344]">{new Set(selectedIds).size}</span> unique questions selected for {exam}
              </div>
            </section>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-[10px] leading-4 text-slate-400">
              Save as Draft can keep an incomplete cycle. Publishing requires exactly 30 unique questions.
            </p>
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button variant="secondary" onClick={handleSaveDraft} className="gap-2">
                <Pencil size={14} /> Save as Draft
              </Button>
              <Button onClick={handlePublish} className="gap-2">
                <CheckCircle2 size={15} /> Publish Challenge
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

function ChallengeDetailsDialog({
  challenge,
  questions,
  onClose,
}: {
  challenge: AdminDailyChallenge;
  questions: ChallengeQuestion[];
  onClose: () => void;
}) {
  const selectedQuestions = challenge.questionIds
    .map((id) => questions.find((question) => question.id === id))
    .filter((question): question is ChallengeQuestion => Boolean(question));
  const completionRate = challenge.participants
    ? Math.round((challenge.completedStudents / challenge.participants) * 100)
    : 0;

  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/45 p-3 backdrop-blur-sm sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="challenge-details-title"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={challengeStatusVariant(challenge.status)}>{challenge.status}</Badge>
              <Badge variant="outline">{challenge.exam}</Badge>
            </div>
            <h2 id="challenge-details-title" className="mt-3 text-lg font-semibold text-[#142344]">{challenge.title}</h2>
            <p className="mt-1 text-xs text-slate-500">Starts {formatChallengeDate(challenge.startDate)} · Asia/Kolkata</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close challenge details" onClick={onClose}>
            <X size={17} />
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] text-slate-400">Questions</p>
            <p className="mt-1 text-sm font-semibold text-[#142344]">{selectedQuestions.length} / 30</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] text-slate-400">Participants</p>
            <p className="mt-1 text-sm font-semibold text-[#142344]">{challenge.participants.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] text-slate-400">Completed</p>
            <p className="mt-1 text-sm font-semibold text-[#142344]">{challenge.completedStudents.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] text-slate-400">Completion rate</p>
            <p className="mt-1 text-sm font-semibold text-[#142344]">{completionRate}%</p>
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-[#142344]">30-day question sequence</h3>
            <Badge variant={selectedQuestions.length === 30 ? "success" : "warning"}>{selectedQuestions.length} selected</Badge>
          </div>
          <ol className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {selectedQuestions.map((question, index) => (
              <li key={question.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-indigo-50 text-[10px] font-bold text-indigo-700">
                  Day {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-[#142344]">{question.id} · {question.subject} · {question.chapter}</p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-600">{question.prompt}</p>
                </div>
                <Badge variant="outline">{question.difficulty}</Badge>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2.5 text-[10px] leading-5 text-indigo-900">
          One question per day. Incorrect answers may be retried until 11:59 PM Asia/Kolkata. Future days remain locked until their scheduled date. These rules are informational in this UI preview.
        </div>
        <div className="mt-5 flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </motion.section>
    </motion.div>
  );
}

function DeleteChallengeDialog({
  challenge,
  onCancel,
  onConfirm,
}: {
  challenge: AdminDailyChallenge;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-challenge-title"
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
      >
        <span className="grid size-10 place-items-center rounded-xl bg-rose-50 text-rose-600">
          <Trash2 size={18} />
        </span>
        <h2 id="delete-challenge-title" className="mt-4 text-sm font-semibold text-[#142344]">Delete {challenge.title}?</h2>
        <p className="mt-2 text-xs leading-5 text-slate-500">This challenge will be removed from this page&apos;s local preview only.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} className="gap-2">
            <Trash2 size={14} /> Delete challenge
          </Button>
        </div>
      </motion.section>
    </motion.div>
  );
}

function PublishChallengeDialog({
  draft,
  isScheduled,
  onCancel,
  onConfirm,
}: {
  draft: ChallengeDraft;
  isScheduled: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="publish-challenge-title"
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
      >
        <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          <CalendarDays size={18} />
        </span>
        <h2 id="publish-challenge-title" className="mt-4 text-sm font-semibold text-[#142344]">
          Confirm {isScheduled ? "scheduled" : "published"} challenge
        </h2>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          {draft.title} will be marked {isScheduled ? "Scheduled" : "Published"} for {formatChallengeDate(draft.startDate)} in this local preview. This does not publish to students or create a real schedule.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm} className="gap-2">
            <CheckCircle2 size={14} /> Confirm preview
          </Button>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function AdminDailyChallengeManagement() {
  const [challenges, setChallenges] = useState<AdminDailyChallenge[]>(initialAdminDailyChallenges);
  const [searchValue, setSearchValue] = useState("");
  const [examFilter, setExamFilter] = useState<ExamFilter>("All");
  const [statusFilter, setStatusFilter] = useState<ChallengeFilter>("All");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formChallenge, setFormChallenge] = useState<AdminDailyChallenge | null>(null);
  const [detailsChallenge, setDetailsChallenge] = useState<AdminDailyChallenge | null>(null);
  const [deletingChallenge, setDeletingChallenge] = useState<AdminDailyChallenge | null>(null);
  const [pendingPublish, setPendingPublish] = useState<ChallengeDraft | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timeout);
  }, []);

  const filteredChallenges = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return challenges.filter((challenge) => {
      if (examFilter !== "All" && challenge.exam !== examFilter) return false;
      if (statusFilter !== "All" && challenge.status !== statusFilter) return false;
      if (!query) return true;
      return [challenge.title, challenge.exam, challenge.status, challenge.startDate]
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [challenges, examFilter, searchValue, statusFilter]);

  const statCounts = useMemo(() => ({
    total: challenges.length,
    published: challenges.filter((challenge) => challenge.status === "Published").length,
    scheduled: challenges.filter((challenge) => challenge.status === "Scheduled").length,
    drafts: challenges.filter((challenge) => challenge.status === "Draft").length,
    completed: challenges.filter((challenge) => challenge.status === "Completed").length,
  }), [challenges]);

  function openCreateForm() {
    setFormChallenge(null);
    setFormOpen(true);
    setFeedback("");
  }

  function openEditForm(challenge: AdminDailyChallenge) {
    setFormChallenge(challenge);
    setFormOpen(true);
    setFeedback("");
  }

  function saveDraft(draft: ChallengeDraft) {
    if (formChallenge) {
      setChallenges((current) => current.map((challenge) => challenge.id === formChallenge.id
        ? { ...challenge, ...draft, status: "Draft" }
        : challenge));
      setFeedback(`${draft.title} saved as a draft in this preview.`);
    } else {
      const newChallenge: AdminDailyChallenge = {
        id: `challenge-${Date.now()}`,
        ...draft,
        status: "Draft",
        participants: 0,
        completedStudents: 0,
      };
      setChallenges((current) => [newChallenge, ...current]);
      setFeedback(`${draft.title} saved as a draft in this preview.`);
    }
    setFormOpen(false);
    setFormChallenge(null);
  }

  function requestPublish(draft: ChallengeDraft) {
    setPendingPublish(draft);
  }

  function confirmPublish() {
    if (!pendingPublish) return;
    const status: AdminChallengeStatus = pendingPublish.startDate > getKolkataDate()
      ? "Scheduled"
      : "Published";

    if (formChallenge) {
      setChallenges((current) => current.map((challenge) => challenge.id === formChallenge.id
        ? { ...challenge, ...pendingPublish, status }
        : challenge));
    } else {
      setChallenges((current) => [{
        id: `challenge-${Date.now()}`,
        ...pendingPublish,
        status,
        participants: 0,
        completedStudents: 0,
      }, ...current]);
    }
    setFeedback(`${pendingPublish.title} marked ${status.toLowerCase()} in this preview. Nothing was scheduled or published to students.`);
    setPendingPublish(null);
    setFormOpen(false);
    setFormChallenge(null);
  }

  function confirmDelete() {
    if (!deletingChallenge) return;
    setChallenges((current) => current.filter((challenge) => challenge.id !== deletingChallenge.id));
    setFeedback(`${deletingChallenge.title} deleted from this preview.`);
    setDeletingChallenge(null);
  }

  function renderActions(challenge: AdminDailyChallenge) {
    return (
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="!size-8 !min-h-8 !min-w-8 !p-0 rounded-lg text-slate-500 hover:!text-indigo-700"
          aria-label={`View ${challenge.title}`}
          onClick={() => setDetailsChallenge(challenge)}
        >
          <Eye size={15} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="!size-8 !min-h-8 !min-w-8 !p-0 rounded-lg text-slate-500 hover:!text-indigo-700"
          aria-label={`Edit ${challenge.title}`}
          onClick={() => openEditForm(challenge)}
        >
          <Pencil size={15} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="!size-8 !min-h-8 !min-w-8 !p-0 rounded-lg text-slate-500 hover:!text-rose-600"
          aria-label={`Delete ${challenge.title}`}
          onClick={() => setDeletingChallenge(challenge)}
        >
          <Trash2 size={15} />
        </Button>
      </div>
    );
  }

  function renderMobileChallenge(challenge: AdminDailyChallenge) {
    const completionRate = challenge.participants
      ? Math.round((challenge.completedStudents / challenge.participants) * 100)
      : 0;
    return (
      <motion.article
        layout
        key={challenge.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#142344]">{challenge.title}</h3>
            <p className="mt-1 text-[10px] text-slate-500">{challenge.exam} · Starts {formatChallengeDate(challenge.startDate)}</p>
          </div>
          <Badge variant={challengeStatusVariant(challenge.status)}>{challenge.status}</Badge>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3">
          <div>
            <p className="text-[9px] text-slate-400">Questions</p>
            <p className="mt-1 text-xs font-semibold text-[#142344]">{challenge.questionIds.length}/30</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-400">Completed</p>
            <p className="mt-1 text-xs font-semibold text-[#142344]">{challenge.completedStudents.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-400">Completion</p>
            <p className="mt-1 text-xs font-semibold text-[#142344]">{completionRate}%</p>
          </div>
        </div>
        <div className="mt-2 flex justify-end">{renderActions(challenge)}</div>
      </motion.article>
    );
  }

  function handleSubmitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#142344]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <ChallengeSidebar />
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
              <ChallengeSidebar mobile onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
      <div className="min-h-screen lg:pl-[252px]">
        <ChallengeHeader
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
                <span className="text-indigo-600">Daily Challenge Management</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-3xl">Daily Challenge Management</h1>
              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                Plan 30-day question cycles for KCET, NEET, and JEE Main.
              </p>
            </div>
            <Button onClick={openCreateForm} className="gap-2">
              <Plus size={16} /> Create Challenge
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
                <span>{feedback}</span>
                <Button variant="ghost" size="icon" aria-label="Dismiss message" onClick={() => setFeedback("")}>
                  <X size={15} />
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <ChallengeStats
            total={statCounts.total}
            published={statCounts.published}
            scheduled={statCounts.scheduled}
            drafts={statCounts.drafts}
            completed={statCounts.completed}
          />
          <ChallengeRulesNotice />

          <Card className="mb-4 p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-[#142344]">Challenge list</h2>
                <p className="mt-1 text-[11px] text-slate-500">{filteredChallenges.length} sample challenge{filteredChallenges.length === 1 ? "" : "s"}</p>
              </div>
              <Badge variant="outline">Local preview</Badge>
            </div>
            <form onSubmit={handleSubmitSearch} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(260px,1fr)_200px_200px]">
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Search challenges</span>
                <span className="relative">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    aria-label="Search challenges"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search title, exam, status, or date..."
                    className="!min-h-10 rounded-xl !pl-9 text-xs"
                  />
                </span>
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Exam</span>
                <span className="relative">
                  <select
                    aria-label="Filter challenges by exam"
                    value={examFilter}
                    onChange={(event) => setExamFilter(event.target.value as ExamFilter)}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="All">All exams</option>
                    {subjectExamOptions.map((exam) => <option key={exam} value={exam}>{exam}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Status</span>
                <span className="relative">
                  <select
                    aria-label="Filter challenges by status"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as ChallengeFilter)}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="All">All statuses</option>
                    {challengeStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
            </form>
          </Card>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" exit={{ opacity: 0 }}><LoadingChallenges /></motion.div>
            ) : filteredChallenges.length ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="grid gap-3 lg:hidden">
                  <AnimatePresence initial={false}>
                    {filteredChallenges.map(renderMobileChallenge)}
                  </AnimatePresence>
                </div>
                <Card className="hidden overflow-hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] text-left text-xs">
                      <thead className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        <tr>
                          <th scope="col" className="px-4 py-3">Challenge</th>
                          <th scope="col" className="px-4 py-3">Exam</th>
                          <th scope="col" className="px-4 py-3">Scheduled date</th>
                          <th scope="col" className="px-4 py-3">Questions</th>
                          <th scope="col" className="px-4 py-3">Published status</th>
                          <th scope="col" className="px-4 py-3">Completion statistics</th>
                          <th scope="col" className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredChallenges.map((challenge) => {
                          const completionRate = challenge.participants
                            ? Math.round((challenge.completedStudents / challenge.participants) * 100)
                            : 0;
                          return (
                            <motion.tr layout key={challenge.id} className="transition hover:bg-slate-50/70">
                              <td className="max-w-[260px] px-4 py-3.5">
                                <span className="block truncate font-semibold text-[#142344]">{challenge.title}</span>
                                <span className="mt-1 block text-[10px] text-slate-400">{challenge.id}</span>
                              </td>
                              <td className="px-4 py-3.5"><Badge variant="outline">{challenge.exam}</Badge></td>
                              <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">{formatChallengeDate(challenge.startDate)}</td>
                              <td className="px-4 py-3.5">
                                <span className={`font-semibold ${challenge.questionIds.length === 30 ? "text-[#142344]" : "text-amber-700"}`}>
                                  {challenge.questionIds.length} / 30
                                </span>
                              </td>
                              <td className="px-4 py-3.5"><Badge variant={challengeStatusVariant(challenge.status)}>{challenge.status}</Badge></td>
                              <td className="px-4 py-3.5">
                                <span className="block font-medium text-[#142344]">{challenge.completedStudents.toLocaleString()} completed</span>
                                <span className="mt-1 block text-[10px] text-slate-400">
                                  {challenge.participants.toLocaleString()} participants · {completionRate}%
                                </span>
                              </td>
                              <td className="px-4 py-3.5">{renderActions(challenge)}</td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400">
                    <span>Sample data · changes stay in this browser session</span>
                    <span>{filteredChallenges.length} challenges</span>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <Card className="grid min-h-64 place-items-center px-5 py-10 text-center">
                  <div className="max-w-sm">
                    <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <Target size={21} />
                    </span>
                    <h2 className="mt-3 text-sm font-semibold text-[#142344]">
                      {challenges.length ? "No challenges match these filters" : "No daily challenges yet"}
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {challenges.length
                        ? "Try another search term or reset the exam and status filters."
                        : "Create a 30-day cycle by selecting unique questions from the sample bank."}
                    </p>
                    {challenges.length ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => {
                          setSearchValue("");
                          setExamFilter("All");
                          setStatusFilter("All");
                        }}
                      >
                        Reset filters
                      </Button>
                    ) : (
                      <Button size="sm" className="mt-4 gap-2" onClick={openCreateForm}>
                        <Plus size={14} /> Create Challenge
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5 flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[10px] leading-5 text-slate-500">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-slate-400" />
            <p>Admin challenge edits, confirmation, and status changes are local UI demonstrations. There is no backend, real publication, or enforced student deadline.</p>
          </div>
        </motion.main>
      </div>

      <AnimatePresence>
        {formOpen ? (
          <ChallengeFormDialog
            key={formChallenge?.id ?? "new-challenge"}
            initialChallenge={formChallenge}
            questions={dailyChallengeQuestionBank}
            onClose={() => {
              setFormOpen(false);
              setFormChallenge(null);
              setPendingPublish(null);
            }}
            onSaveDraft={saveDraft}
            onRequestPublish={requestPublish}
          />
        ) : null}
        {detailsChallenge ? (
          <ChallengeDetailsDialog
            challenge={detailsChallenge}
            questions={dailyChallengeQuestionBank}
            onClose={() => setDetailsChallenge(null)}
          />
        ) : null}
        {deletingChallenge ? (
          <DeleteChallengeDialog
            challenge={deletingChallenge}
            onCancel={() => setDeletingChallenge(null)}
            onConfirm={confirmDelete}
          />
        ) : null}
        {pendingPublish ? (
          <PublishChallengeDialog
            draft={pendingPublish}
            isScheduled={pendingPublish.startDate > getKolkataDate()}
            onCancel={() => setPendingPublish(null)}
            onConfirm={confirmPublish}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
