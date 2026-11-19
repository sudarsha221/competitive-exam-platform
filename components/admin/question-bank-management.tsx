"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Eye,
  FileQuestion,
  Filter,
  GraduationCap,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
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
  initialAdminQuestions,
  questionDifficultyOptions,
  questionStatusOptions,
  questionTypeOptions,
  type AdminDifficulty,
  type AdminQuestion,
  type CorrectIndex,
  type QuestionDraft,
  type QuestionStatus,
} from "@/components/admin/question-data";
import { initialAdminChapters } from "@/components/admin/chapter-data";
import { initialAdminSubtopics } from "@/components/admin/subtopic-data";
import {
  initialAdminSubjects,
  subjectExamOptions,
  type SubjectExam,
} from "@/components/admin/subject-data";

type ExamFilter = "All" | SubjectExam;
type SubjectFilter = "All" | string;
type ChapterFilter = "All" | string;
type SubtopicFilter = "All" | string;
type DifficultyFilter = "All" | AdminDifficulty;
type StatusFilter = "All" | QuestionStatus;
type CorrectAnswer = "" | "A" | "B" | "C" | "D";

const navigationItems = [
  { label: "Admin overview", href: "/admin", icon: LayoutDashboard },
  { label: "Exam management", href: "/admin/exams", icon: GraduationCap },
  { label: "Subject management", href: "/admin/subjects", icon: BookOpen },
  { label: "Chapter management", href: "/admin/chapters", icon: Layers3 },
  { label: "Subtopic management", href: "/admin/subtopics", icon: FileQuestion },
  { label: "Question bank", href: "/admin/questions", icon: FileQuestion },
  { label: "Question list", href: "#question-list", icon: Eye },
];

const answerIndex: Record<Exclude<CorrectAnswer, "">, CorrectIndex> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
};

const answerLabels = ["A", "B", "C", "D"] as const;
const optionSlots = [0, 1, 2, 3] as const;

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

function getSubtopicsForChapter(exam: SubjectExam, subject: string, chapter: string) {
  return initialAdminSubtopics
    .filter((subtopic) =>
      subtopic.exam === exam
      && subtopic.subject === subject
      && subtopic.chapter === chapter,
    )
    .map((subtopic) => subtopic.name);
}

function questionStatusVariant(status: QuestionStatus) {
  if (status === "Published") return "success";
  if (status === "Draft") return "warning";
  return "outline";
}

function difficultyVariant(difficulty: AdminDifficulty) {
  if (difficulty === "Basic") return "success";
  if (difficulty === "Advanced") return "warning";
  return "primary";
}

function QuestionSidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
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
      <nav aria-label="Admin question bank" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Platform administration
        </p>
        <div className="grid gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/admin/questions";
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
            Sample question records · changes stay in this page.
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

function QuestionHeader({
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
          <p className="mt-0.5 truncate text-sm font-semibold text-[#142344]">Question Bank</p>
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
                  <p className="mt-3 text-xs font-semibold text-[#142344]">Question records are ready to review</p>
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

function QuestionLoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading questions" className="grid grid-cols-1 gap-3">
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
      <span className="sr-only">Loading sample questions…</span>
    </div>
  );
}

function QuestionFormDialog({
  initialQuestion,
  onClose,
  onSave,
}: {
  initialQuestion: AdminQuestion | null;
  onClose: () => void;
  onSave: (draft: QuestionDraft, status: QuestionStatus) => string | null;
}) {
  const initialExam = initialQuestion?.exam ?? "KCET";
  const initialSubject = initialQuestion?.subject ?? getSubjectsForExam(initialExam)[0] ?? "";
  const initialChapter = initialQuestion?.chapter ?? getChaptersForSubject(initialExam, initialSubject)[0] ?? "";
  const initialSubtopic = initialQuestion?.subtopic
    ?? getSubtopicsForChapter(initialExam, initialSubject, initialChapter)[0]
    ?? "";
  const [exam, setExam] = useState<SubjectExam>(initialExam);
  const [subject, setSubject] = useState(initialSubject);
  const [chapter, setChapter] = useState(initialChapter);
  const [subtopic, setSubtopic] = useState(initialSubtopic);
  const [difficulty, setDifficulty] = useState<AdminDifficulty>(initialQuestion?.difficulty ?? "Basic");
  const [prompt, setPrompt] = useState(initialQuestion?.prompt ?? "");
  const [options, setOptions] = useState<[string, string, string, string]>(
    initialQuestion?.options ?? ["", "", "", ""],
  );
  const [correctAnswer, setCorrectAnswer] = useState<CorrectAnswer>(
    initialQuestion ? answerLabels[initialQuestion.correctIndex] : "",
  );
  const [explanation, setExplanation] = useState(initialQuestion?.explanation ?? "");
  const [errors, setErrors] = useState<{
    exam?: string;
    subject?: string;
    chapter?: string;
    subtopic?: string;
    prompt?: string;
    options?: string;
    correctAnswer?: string;
    explanation?: string;
    form?: string;
  }>({});
  const examSubjects = getSubjectsForExam(exam);
  const subjectChapters = getChaptersForSubject(exam, subject);
  const chapterSubtopics = getSubtopicsForChapter(exam, subject, chapter);

  function changeExam(nextExam: SubjectExam) {
    const nextSubject = getSubjectsForExam(nextExam)[0] ?? "";
    const nextChapter = getChaptersForSubject(nextExam, nextSubject)[0] ?? "";
    setExam(nextExam);
    setSubject(nextSubject);
    setChapter(nextChapter);
    setSubtopic(getSubtopicsForChapter(nextExam, nextSubject, nextChapter)[0] ?? "");
  }

  function changeSubject(nextSubject: string) {
    const nextChapter = getChaptersForSubject(exam, nextSubject)[0] ?? "";
    setSubject(nextSubject);
    setChapter(nextChapter);
    setSubtopic(getSubtopicsForChapter(exam, nextSubject, nextChapter)[0] ?? "");
  }

  function changeChapter(nextChapter: string) {
    setChapter(nextChapter);
    setSubtopic(getSubtopicsForChapter(exam, subject, nextChapter)[0] ?? "");
  }

  function changeOption(index: CorrectIndex, value: string) {
    setOptions((current) => {
      switch (index) {
        case 0:
          return [value, current[1], current[2], current[3]];
        case 1:
          return [current[0], value, current[2], current[3]];
        case 2:
          return [current[0], current[1], value, current[3]];
        case 3:
          return [current[0], current[1], current[2], value];
      }
    });
  }

  function submitQuestion(nextStatus: QuestionStatus) {
    const nextErrors: typeof errors = {};
    const trimmedPrompt = prompt.trim();
    const trimmedExplanation = explanation.trim();
    const cleanedOptions: [string, string, string, string] = [
      options[0].trim(),
      options[1].trim(),
      options[2].trim(),
      options[3].trim(),
    ];

    if (!subjectExamOptions.includes(exam)) nextErrors.exam = "Select an exam.";
    if (!examSubjects.includes(subject)) nextErrors.subject = "Select a subject for this exam.";
    if (!subjectChapters.includes(chapter)) nextErrors.chapter = "Select a chapter for this subject.";
    if (!chapterSubtopics.includes(subtopic)) nextErrors.subtopic = "Select a subtopic for this chapter.";
    if (trimmedPrompt.length < 10) nextErrors.prompt = "Enter question text with at least 10 characters.";
    if (cleanedOptions.some((option) => option.length === 0)) {
      nextErrors.options = "Provide text for all four answer options.";
    }
    if (!correctAnswer) nextErrors.correctAnswer = "Select the one correct answer.";
    if (trimmedExplanation.length < 10) {
      nextErrors.explanation = "Enter an explanation with at least 10 characters.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    if (!correctAnswer) return;
    const saveError = onSave({
      exam,
      subject,
      chapter,
      subtopic,
      difficulty,
      questionType: "MCQ (single correct answer)",
      prompt: trimmedPrompt,
      options: cleanedOptions,
      correctIndex: answerIndex[correctAnswer],
      explanation: trimmedExplanation,
    }, nextStatus);
    if (saveError) {
      setErrors({ form: saveError });
      return;
    }
    setErrors({});
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitQuestion("Draft");
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
        aria-labelledby="question-form-title"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="primary">MCQ · single correct answer</Badge>
            <h2 id="question-form-title" className="mt-3 text-lg font-semibold text-[#142344]">
              {initialQuestion ? "Edit question" : "Add question"}
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">Question changes stay in this local preview.</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close question form" onClick={onClose}>
            <X size={17} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 grid gap-5">
          {errors.form ? (
            <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {errors.form}
            </p>
          ) : null}
          <section aria-labelledby="question-information-heading" className="grid gap-3">
            <div>
              <h3 id="question-information-heading" className="text-sm font-semibold text-[#142344]">Question information</h3>
              <p className="mt-1 text-[10px] text-slate-500">Choose where this question belongs in the exam catalog.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-medium text-foreground">Exam</span>
                <select
                  aria-label="Question exam"
                  aria-invalid={Boolean(errors.exam)}
                  value={exam}
                  onChange={(event) => changeExam(event.target.value as SubjectExam)}
                  className={`h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none focus:border-ring focus:ring-4 focus:ring-ring/15 ${errors.exam ? "border-danger" : ""}`}
                >
                  {subjectExamOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                {errors.exam ? <span className="text-xs text-danger">{errors.exam}</span> : null}
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium text-foreground">Subject</span>
                <select
                  aria-label="Question subject"
                  aria-invalid={Boolean(errors.subject)}
                  value={subject}
                  onChange={(event) => changeSubject(event.target.value)}
                  className={`h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none focus:border-ring focus:ring-4 focus:ring-ring/15 ${errors.subject ? "border-danger" : ""}`}
                >
                  {examSubjects.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                {errors.subject ? <span className="text-xs text-danger">{errors.subject}</span> : null}
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium text-foreground">Chapter</span>
                <select
                  aria-label="Question chapter"
                  aria-invalid={Boolean(errors.chapter)}
                  value={chapter}
                  onChange={(event) => changeChapter(event.target.value)}
                  className={`h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none focus:border-ring focus:ring-4 focus:ring-ring/15 ${errors.chapter ? "border-danger" : ""}`}
                >
                  {subjectChapters.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                {errors.chapter ? <span className="text-xs text-danger">{errors.chapter}</span> : null}
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium text-foreground">Subtopic</span>
                <select
                  aria-label="Question subtopic"
                  aria-invalid={Boolean(errors.subtopic)}
                  value={subtopic}
                  onChange={(event) => setSubtopic(event.target.value)}
                  className={`h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none focus:border-ring focus:ring-4 focus:ring-ring/15 ${errors.subtopic ? "border-danger" : ""}`}
                >
                  {chapterSubtopics.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                {errors.subtopic ? <span className="text-xs text-danger">{errors.subtopic}</span> : null}
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium text-foreground">Difficulty</span>
                <select
                  aria-label="Question difficulty"
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value as AdminDifficulty)}
                  className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none focus:border-ring focus:ring-4 focus:ring-ring/15"
                >
                  {questionDifficultyOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium text-foreground">Question type</span>
                <select
                  aria-label="Question type"
                  value={questionTypeOptions[0]}
                  disabled
                  className="h-11 w-full rounded-xl border border-border bg-slate-50 px-3.5 text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {questionTypeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section aria-labelledby="question-content-heading" className="grid gap-3 border-t border-slate-100 pt-4">
            <div>
              <h3 id="question-content-heading" className="text-sm font-semibold text-[#142344]">Question content</h3>
              <p className="mt-1 text-[10px] text-slate-500">Add the prompt, four options, correct answer, and explanation.</p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="question-prompt" className="text-xs font-medium text-foreground">Question text</label>
              <textarea
                id="question-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Write the question prompt..."
                rows={3}
                aria-invalid={Boolean(errors.prompt)}
                aria-describedby={errors.prompt ? "question-prompt-error" : undefined}
                className={`w-full resize-y rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted/80 focus:border-ring focus:ring-4 focus:ring-ring/15 ${errors.prompt ? "border-danger focus:border-danger focus:ring-danger/15" : ""}`}
              />
              {errors.prompt ? <p id="question-prompt-error" className="text-xs text-danger">{errors.prompt}</p> : null}
            </div>

            <fieldset className="grid gap-3">
              <legend className="text-xs font-medium text-foreground">Answer options</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {optionSlots.map((index) => (
                  <label key={answerLabels[index]} className="grid gap-1.5">
                    <span className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
                      <span className="grid size-6 place-items-center rounded-lg bg-indigo-50 text-indigo-700">{answerLabels[index]}</span>
                      Option {answerLabels[index]}
                    </span>
                    <Input
                      aria-label={`Option ${answerLabels[index]}`}
                      value={options[index]}
                      onChange={(event) => changeOption(index, event.target.value)}
                      placeholder={`Enter option ${answerLabels[index]}`}
                      aria-invalid={Boolean(errors.options)}
                    />
                  </label>
                ))}
              </div>
              {errors.options ? <p role="alert" className="text-xs text-danger">{errors.options}</p> : null}
            </fieldset>

            <label className="grid gap-2">
              <span className="text-xs font-medium text-foreground">Correct answer</span>
              <select
                aria-label="Correct answer"
                aria-invalid={Boolean(errors.correctAnswer)}
                value={correctAnswer}
                onChange={(event) => setCorrectAnswer(event.target.value as CorrectAnswer)}
                className={`h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none focus:border-ring focus:ring-4 focus:ring-ring/15 ${errors.correctAnswer ? "border-danger" : ""}`}
              >
                <option value="">Select the correct option</option>
                {answerLabels.map((answer) => <option key={answer} value={answer}>Option {answer}</option>)}
              </select>
              {errors.correctAnswer ? <span className="text-xs text-danger">{errors.correctAnswer}</span> : null}
            </label>

            <div className="grid gap-2">
              <label htmlFor="question-explanation" className="text-xs font-medium text-foreground">Detailed explanation</label>
              <textarea
                id="question-explanation"
                value={explanation}
                onChange={(event) => setExplanation(event.target.value)}
                placeholder="Explain why the selected answer is correct."
                rows={4}
                aria-invalid={Boolean(errors.explanation)}
                aria-describedby={errors.explanation ? "question-explanation-error" : undefined}
                className={`w-full resize-y rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted/80 focus:border-ring focus:ring-4 focus:ring-ring/15 ${errors.explanation ? "border-danger focus:border-danger focus:ring-danger/15" : ""}`}
              />
              {errors.explanation ? <p id="question-explanation-error" className="text-xs text-danger">{errors.explanation}</p> : null}
            </div>
          </section>

          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <div className="flex flex-wrap justify-end gap-2">
              <Button type="button" variant="secondary" className="gap-2" onClick={() => submitQuestion("Draft")}>
                Save as Draft
              </Button>
              <Button type="button" className="gap-2" onClick={() => submitQuestion("Published")}>
                <CheckCircle2 size={15} /> Publish Question
              </Button>
            </div>
          </div>
        </form>
      </motion.section>
    </motion.div>
  );
}

function QuestionDetailsDialog({ question, onClose }: { question: AdminQuestion; onClose: () => void }) {
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
        aria-labelledby="question-details-title"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{question.id}</Badge>
              <Badge variant={questionStatusVariant(question.status)}>{question.status}</Badge>
            </div>
            <h2 id="question-details-title" className="mt-3 text-lg font-semibold leading-6 text-[#142344]">
              Question details
            </h2>
            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              {question.exam} · {question.subject} · {question.chapter} · {question.subtopic}
            </p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close question details" onClick={onClose}>
            <X size={17} />
          </Button>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={difficultyVariant(question.difficulty)}>{question.difficulty}</Badge>
            <Badge variant="outline">{question.questionType}</Badge>
          </div>
          <p className="mt-3 text-sm font-medium leading-6 text-[#142344]">{question.prompt}</p>
          <div className="mt-4 grid gap-2">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correctIndex;
              return (
                <div
                  key={answerLabels[index]}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-xs leading-5 ${
                    isCorrect
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <span className={`grid size-6 shrink-0 place-items-center rounded-lg text-[10px] font-semibold ${
                    isCorrect ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {answerLabels[index]}
                  </span>
                  <span className="min-w-0 flex-1">{option}</span>
                  {isCorrect ? <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" aria-label="Correct answer" /> : null}
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold text-indigo-950">
              <BookOpen size={14} /> Explanation
            </p>
            <p className="mt-2 text-xs leading-5 text-indigo-950/80">{question.explanation}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
            <CalendarDays size={12} /> Created {question.createdDate}
          </span>
          <Button onClick={onClose}>Close</Button>
        </div>
      </motion.section>
    </motion.div>
  );
}

function DeleteConfirmation({
  question,
  onCancel,
  onConfirm,
}: {
  question: AdminQuestion;
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
        aria-labelledby="delete-question-title"
        aria-describedby="delete-question-description"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
      >
        <span className="grid size-10 place-items-center rounded-xl bg-rose-50 text-rose-600">
          <Trash2 size={18} />
        </span>
        <h2 id="delete-question-title" className="mt-4 text-lg font-semibold text-[#142344]">Delete {question.id}?</h2>
        <p id="delete-question-description" className="mt-2 text-sm leading-6 text-slate-500">
          This question will be removed from this page&apos;s local preview.
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} className="gap-2">
            <Trash2 size={14} /> Delete question
          </Button>
        </div>
      </motion.section>
    </motion.div>
  );
}

function QuestionActions({
  question,
  onView,
  onEdit,
  onDelete,
}: {
  question: AdminQuestion;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Button variant="outline" size="sm" className="gap-1" aria-label={`View ${question.id}`} onClick={onView}>
        <Eye size={13} /><span>View</span>
      </Button>
      <Button variant="ghost" size="sm" className="gap-1" aria-label={`Edit ${question.id}`} onClick={onEdit}>
        <Pencil size={13} /><span>Edit</span>
      </Button>
      <Button variant="outline" size="sm" className="gap-1 text-rose-700" aria-label={`Delete ${question.id}`} onClick={onDelete}>
        <Trash2 size={13} /><span>Delete</span>
      </Button>
    </div>
  );
}

export function QuestionBankManagement() {
  const [questions, setQuestions] = useState<AdminQuestion[]>(initialAdminQuestions);
  const [searchValue, setSearchValue] = useState("");
  const [examFilter, setExamFilter] = useState<ExamFilter>("All");
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("All");
  const [chapterFilter, setChapterFilter] = useState<ChapterFilter>("All");
  const [subtopicFilter, setSubtopicFilter] = useState<SubtopicFilter>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AdminQuestion | null>(null);
  const [detailsQuestion, setDetailsQuestion] = useState<AdminQuestion | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<AdminQuestion | null>(null);
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

  const availableSubtopics = useMemo(() => {
    const subtopics = initialAdminSubtopics.filter((subtopic) =>
      (examFilter === "All" || subtopic.exam === examFilter)
      && (subjectFilter === "All" || subtopic.subject === subjectFilter)
      && (chapterFilter === "All" || subtopic.chapter === chapterFilter),
    );
    return [...new Set(subtopics.map((subtopic) => subtopic.name))];
  }, [chapterFilter, examFilter, subjectFilter]);

  const filteredQuestions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return questions.filter((question) => {
      if (examFilter !== "All" && question.exam !== examFilter) return false;
      if (subjectFilter !== "All" && question.subject !== subjectFilter) return false;
      if (chapterFilter !== "All" && question.chapter !== chapterFilter) return false;
      if (subtopicFilter !== "All" && question.subtopic !== subtopicFilter) return false;
      if (difficultyFilter !== "All" && question.difficulty !== difficultyFilter) return false;
      if (statusFilter !== "All" && question.status !== statusFilter) return false;
      if (!query) return true;
      return [
        question.id,
        question.prompt,
        question.exam,
        question.subject,
        question.chapter,
        question.subtopic,
        question.difficulty,
        question.status,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [chapterFilter, difficultyFilter, examFilter, questions, searchValue, statusFilter, subjectFilter, subtopicFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
  const displayedPage = Math.min(currentPage, totalPages);
  const pageQuestions = filteredQuestions.slice((displayedPage - 1) * pageSize, displayedPage * pageSize);
  const firstResult = filteredQuestions.length ? (displayedPage - 1) * pageSize + 1 : 0;
  const lastResult = Math.min(displayedPage * pageSize, filteredQuestions.length);

  function setExamFilterValue(value: ExamFilter) {
    setExamFilter(value);
    setSubjectFilter("All");
    setChapterFilter("All");
    setSubtopicFilter("All");
    setCurrentPage(1);
  }

  function setSubjectFilterValue(value: SubjectFilter) {
    setSubjectFilter(value);
    setChapterFilter("All");
    setSubtopicFilter("All");
    setCurrentPage(1);
  }

  function setChapterFilterValue(value: ChapterFilter) {
    setChapterFilter(value);
    setSubtopicFilter("All");
    setCurrentPage(1);
  }

  function openAddForm() {
    setEditingQuestion(null);
    setCurrentPage(1);
    setFormOpen(true);
    setFeedback("");
  }

  function openEditForm(question: AdminQuestion) {
    setEditingQuestion(question);
    setFormOpen(true);
    setFeedback("");
  }

  function saveQuestion(draft: QuestionDraft, status: QuestionStatus): string | null {
    const duplicate = questions.some((question) =>
      question.id !== editingQuestion?.id
      && question.exam === draft.exam
      && question.subject === draft.subject
      && question.chapter === draft.chapter
      && question.prompt.trim().toLowerCase() === draft.prompt.trim().toLowerCase(),
    );
    if (duplicate) return "A matching question already exists for the selected chapter.";

    if (editingQuestion) {
      setQuestions((current) => current.map((question) => question.id === editingQuestion.id
        ? { ...question, ...draft, status }
        : question));
      setFeedback(`${editingQuestion.id} saved as ${status.toLowerCase()} in this preview.`);
    } else {
      const createdDate = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      const id = `ADMIN-Q-${Date.now()}`;
      setQuestions((current) => [{
        id,
        ...draft,
        status,
        createdDate,
      }, ...current]);
      setFeedback(`${id} ${status === "Published" ? "published" : "saved as draft"} in this preview.`);
    }
    setFormOpen(false);
    setEditingQuestion(null);
    setCurrentPage(1);
    return null;
  }

  function confirmDelete() {
    if (!deletingQuestion) return;
    setQuestions((current) => current.filter((question) => question.id !== deletingQuestion.id));
    setFeedback(`${deletingQuestion.id} deleted from this preview.`);
    setDeletingQuestion(null);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingQuestion(null);
  }

  function renderActions(question: AdminQuestion) {
    return (
      <QuestionActions
        question={question}
        onView={() => setDetailsQuestion(question)}
        onEdit={() => openEditForm(question)}
        onDelete={() => setDeletingQuestion(question)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#142344]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <QuestionSidebar />
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
              <QuestionSidebar mobile onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
      <div className="min-h-screen lg:pl-[252px]">
        <QuestionHeader
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
                <span className="text-indigo-600">Question Bank</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-3xl">Question Bank</h1>
              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                Create, review, and organize sample MCQ content across the exam catalog.
              </p>
            </div>
            <Button onClick={openAddForm} className="gap-2">
              <Plus size={16} /> Add Question
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
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <label className="grid min-w-0 gap-1.5 sm:col-span-2 xl:col-span-2">
                <span className="text-[10px] font-semibold text-slate-500">Search questions</span>
                <span className="relative">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    aria-label="Search questions"
                    value={searchValue}
                    onChange={(event) => {
                      setSearchValue(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search ID, question, exam, subject, chapter, or subtopic..."
                    className="!min-h-10 rounded-xl !pl-9 text-xs"
                  />
                </span>
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Exam</span>
                <span className="relative">
                  <select
                    aria-label="Filter questions by exam"
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
                    aria-label="Filter questions by subject"
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
                    aria-label="Filter questions by chapter"
                    value={chapterFilter}
                    onChange={(event) => setChapterFilterValue(event.target.value)}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="All">All chapters</option>
                    {availableChapters.map((chapter) => <option key={chapter} value={chapter}>{chapter}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Subtopic</span>
                <span className="relative">
                  <select
                    aria-label="Filter questions by subtopic"
                    value={subtopicFilter}
                    onChange={(event) => {
                      setSubtopicFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="All">All subtopics</option>
                    {availableSubtopics.map((subtopic) => <option key={subtopic} value={subtopic}>{subtopic}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Difficulty</span>
                <span className="relative">
                  <select
                    aria-label="Filter questions by difficulty"
                    value={difficultyFilter}
                    onChange={(event) => {
                      setDifficultyFilter(event.target.value as DifficultyFilter);
                      setCurrentPage(1);
                    }}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="All">All difficulties</option>
                    {questionDifficultyOptions.map((difficulty) => <option key={difficulty} value={difficulty}>{difficulty}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">Status</span>
                <span className="relative">
                  <select
                    aria-label="Filter questions by status"
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value as StatusFilter);
                      setCurrentPage(1);
                    }}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="All">All statuses</option>
                    {questionStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
              <div className="flex items-end gap-2 pb-1 text-[10px] text-slate-400">
                <Filter size={14} /> {filteredQuestions.length} of {questions.length} questions
              </div>
            </div>
          </Card>

          <section id="question-list" aria-label="Question list" className="scroll-mt-24">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-[#142344]">Question catalog</h2>
                <p className="mt-1 text-[10px] text-slate-500">Sample MCQ records · local preview only</p>
              </div>
              <Badge variant="outline" className="gap-1.5"><Eye size={12} /> Admin preview</Badge>
            </div>

            {loading ? (
              <QuestionLoadingSkeleton />
            ) : filteredQuestions.length ? (
              <>
                <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
                  <table className="w-full min-w-[1450px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        <th scope="col" className="px-4 py-3">Question ID</th>
                        <th scope="col" className="px-4 py-3">Question preview</th>
                        <th scope="col" className="px-4 py-3">Exam</th>
                        <th scope="col" className="px-4 py-3">Subject</th>
                        <th scope="col" className="px-4 py-3">Chapter / subtopic</th>
                        <th scope="col" className="px-4 py-3">Difficulty</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3">Created</th>
                        <th scope="col" className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <AnimatePresence initial={false}>
                        {pageQuestions.map((question) => (
                          <motion.tr
                            key={question.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="align-top transition-colors hover:bg-slate-50/70"
                          >
                            <th scope="row" className="whitespace-nowrap px-4 py-4 text-[10px] font-semibold text-indigo-700">
                              {question.id}
                            </th>
                            <td className="max-w-[280px] px-4 py-4">
                              <p className="line-clamp-3 text-xs leading-5 text-[#142344]">{question.prompt}</p>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">{question.exam}</td>
                            <td className="px-4 py-4 text-xs font-medium text-[#142344]">{question.subject}</td>
                            <td className="max-w-[220px] px-4 py-4">
                              <p className="line-clamp-1 text-xs text-[#142344]">{question.chapter}</p>
                              <p className="mt-1 line-clamp-1 text-[10px] text-slate-500">{question.subtopic}</p>
                            </td>
                            <td className="px-4 py-4">
                              <Badge variant={difficultyVariant(question.difficulty)}>{question.difficulty}</Badge>
                            </td>
                            <td className="px-4 py-4">
                              <Badge variant={questionStatusVariant(question.status)}>{question.status}</Badge>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-[10px] text-slate-500">{question.createdDate}</td>
                            <td className="px-4 py-4">{renderActions(question)}</td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                <motion.div layout className="grid min-w-0 grid-cols-1 gap-3 md:hidden">
                  <AnimatePresence mode="popLayout">
                    {pageQuestions.map((question) => (
                      <motion.div
                        key={question.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                      >
                        <Card className="min-w-0 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <Badge variant="outline">{question.id}</Badge>
                            <div className="flex flex-wrap gap-1.5">
                              <Badge variant={difficultyVariant(question.difficulty)}>{question.difficulty}</Badge>
                              <Badge variant={questionStatusVariant(question.status)}>{question.status}</Badge>
                            </div>
                          </div>
                          <p className="mt-3 text-xs font-medium leading-5 text-[#142344]">{question.prompt}</p>
                          <p className="mt-2 text-[10px] leading-4 text-slate-500">
                            {question.exam} · {question.subject} · {question.chapter} · {question.subtopic}
                          </p>
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                            <CalendarDays size={12} /> Created {question.createdDate}
                          </div>
                          <div className="mt-4 border-t border-slate-100 pt-3">{renderActions(question)}</div>
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
                  <h3 className="mt-3 text-sm font-semibold text-[#142344]">No questions found</h3>
                  <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                    No sample questions match your search and filters.
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
                      setSubtopicFilter("All");
                      setDifficultyFilter("All");
                      setStatusFilter("All");
                      setCurrentPage(1);
                    }}
                  >
                    <X size={13} /> Clear filters
                  </Button>
                </div>
              </Card>
            )}
          </section>

          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] text-slate-500" aria-live="polite">
              Showing {firstResult}–{lastResult} of {filteredQuestions.length} questions
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-[10px] text-slate-500">
                Rows per page
                <select
                  aria-label="Questions per page"
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs text-[#142344] outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                >
                  {[5, 10, 20].map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
              <Button
                variant="outline"
                size="sm"
                className="!size-9 !min-h-9 !min-w-9 !p-0"
                aria-label="Previous page"
                disabled={displayedPage <= 1}
                onClick={() => setCurrentPage(displayedPage - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="min-w-20 text-center text-[10px] font-medium text-slate-500">
                Page {displayedPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="!size-9 !min-h-9 !min-w-9 !p-0"
                aria-label="Next page"
                disabled={displayedPage >= totalPages}
                onClick={() => setCurrentPage(displayedPage + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[10px] text-slate-500">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={13} className="text-indigo-500" /> Question changes are held in local UI state only.</span>
            <span>No database or authentication is connected.</span>
          </div>
        </motion.main>
      </div>

      <AnimatePresence>
        {formOpen ? (
          <QuestionFormDialog
            key={editingQuestion?.id ?? "new-question"}
            initialQuestion={editingQuestion}
            onClose={closeForm}
            onSave={saveQuestion}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {detailsQuestion ? (
          <QuestionDetailsDialog question={detailsQuestion} onClose={() => setDetailsQuestion(null)} />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {deletingQuestion ? (
          <DeleteConfirmation
            question={deletingQuestion}
            onCancel={() => setDeletingQuestion(null)}
            onConfirm={confirmDelete}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
