"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  CircleAlert,
  CircleCheck,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  ListFilter,
  Menu,
  RotateCcw,
  Search,
  Settings,
  Target,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  practiceQuestions,
  questionDifficulties,
  questionExams,
  type Difficulty,
  type PracticeExam,
  type PracticeQuestion,
} from "@/components/practice/practice-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Filters = {
  exam: PracticeExam;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: Difficulty | "All";
};

type QuestionStatus = {
  selected: number | null;
  submitted: boolean;
  review: boolean;
  bookmarked: boolean;
};

const initialFilters: Filters = {
  exam: "NEET",
  subject: "All",
  chapter: "All",
  topic: "All",
  difficulty: "All",
};

const sidebarItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Practice Questions", href: "/practice", icon: BookOpenCheck, active: true },
  { label: "Daily Challenge", href: "/challenges", icon: Target },
  { label: "My Performance", href: "/performance", icon: CircleCheck },
  { label: "Activity Calendar", href: "/dashboard#activity-calendar", icon: Clock3 },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "Mistake Notebook", href: "/mistakes", icon: CircleAlert },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Profile", href: "/dashboard#profile", icon: UserRound },
  { label: "Settings", href: "/dashboard#settings", icon: Settings },
];

const optionLetters = ["A", "B", "C", "D"];

function getOptions<T extends string>(
  questions: PracticeQuestion[],
  getValue: (question: PracticeQuestion) => T,
) {
  return [...new Set(questions.map(getValue))].sort();
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const id = `filter-${label.toLowerCase()}`;
  return (
    <div className="grid min-w-0 gap-1.5">
      <label htmlFor={id} className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400"
        >
          <option value="All">{label === "Difficulty" ? "All levels" : `All ${label.toLowerCase()}s`}</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
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
          <Button variant="ghost" size="icon" aria-label="Close practice navigation" onClick={onClose}>
            <X size={18} />
          </Button>
        ) : null}
      </div>
      <nav aria-label="Student dashboard" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Workspace</p>
        <div className="grid gap-1">
          {sidebarItems.map((item) => {
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
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Practice mode</span>
            <Badge className="bg-white/10 text-indigo-100">Demo</Badge>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-indigo-100/70">Your answers stay in this browser session.</p>
        </div>
        <div className="mt-4 flex items-center gap-2.5 px-1">
          <span className="grid size-9 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">AS</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-[#142344]">Aarav Sharma</span>
            <span className="mt-0.5 block text-[10px] text-slate-400">Student account</span>
          </span>
          <GraduationCap size={16} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}

export function PracticeInterface() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [statuses, setStatuses] = useState<Record<string, QuestionStatus>>({});
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const filteredQuestions = useMemo(
    () => practiceQuestions.filter((question) =>
      question.exam === filters.exam
      && (filters.subject === "All" || question.subject === filters.subject)
      && (filters.chapter === "All" || question.chapter === filters.chapter)
      && (filters.topic === "All" || question.topic === filters.topic)
      && (filters.difficulty === "All" || question.difficulty === filters.difficulty),
    ),
    [filters],
  );

  const activeQuestion =
    filteredQuestions.find((question) => question.id === currentId) ?? filteredQuestions[0];
  const currentIndex = activeQuestion
    ? filteredQuestions.findIndex((question) => question.id === activeQuestion.id)
    : -1;
  const currentStatus = activeQuestion
    ? statuses[activeQuestion.id] ?? {
      selected: null,
      submitted: false,
      review: false,
      bookmarked: false,
    }
    : undefined;
  const answeredCount = filteredQuestions.filter((question) => statuses[question.id]?.submitted).length;
  const reviewCount = filteredQuestions.filter((question) => statuses[question.id]?.review).length;
  const progress = filteredQuestions.length > 0
    ? Math.round((answeredCount / filteredQuestions.length) * 100)
    : 0;

  const subjects = getOptions(
    practiceQuestions.filter((question) => question.exam === filters.exam),
    (question) => question.subject,
  );
  const chapters = getOptions(
    practiceQuestions.filter((question) =>
      question.exam === filters.exam
      && (filters.subject === "All" || question.subject === filters.subject),
    ),
    (question) => question.chapter,
  );
  const topics = getOptions(
    practiceQuestions.filter((question) =>
      question.exam === filters.exam
      && (filters.subject === "All" || question.subject === filters.subject)
      && (filters.chapter === "All" || question.chapter === filters.chapter),
    ),
    (question) => question.topic,
  );

  function updateStatus(questionId: string, updates: Partial<QuestionStatus>) {
    setStatuses((current) => {
      const previous = current[questionId] ?? {
        selected: null,
        submitted: false,
        review: false,
        bookmarked: false,
      };
      return {
        ...current,
        [questionId]: { ...previous, ...updates },
      };
    });
  }

  function updateFilters(updates: Partial<Filters>) {
    setFilters((current) => ({
      ...current,
      ...updates,
      ...(updates.exam !== undefined ? { subject: "All", chapter: "All", topic: "All" } : {}),
      ...(updates.subject !== undefined ? { chapter: "All", topic: "All" } : {}),
      ...(updates.chapter !== undefined ? { topic: "All" } : {}),
    }));
    setCurrentId(null);
  }

  function goToQuestion(question: PracticeQuestion) {
    setCurrentId(question.id);
    setMobilePaletteOpen(false);
  }

  function goRelative(offset: number) {
    const next = filteredQuestions[currentIndex + offset];
    if (next) goToQuestion(next);
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#142344]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {mobileSidebarOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close practice navigation"
              className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[288px] max-w-[86vw] bg-white shadow-2xl lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              <Sidebar mobile onClose={() => setMobileSidebarOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="min-h-screen lg:pl-[252px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[68px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Button
              variant="outline"
              size="icon"
              className="!size-9 !min-h-9 !min-w-9 !p-0 shrink-0 rounded-xl lg:hidden"
              aria-label="Open practice navigation"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu size={18} />
            </Button>
            <div className="min-w-0">
              <p className="hidden text-[10px] text-slate-400 sm:block">Student workspace</p>
              <p className="truncate text-sm font-semibold text-[#142344]">Practice Questions</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <label className="sr-only" htmlFor="top-exam">Selected exam</label>
              <select
                id="top-exam"
                value={filters.exam}
                onChange={(event) => updateFilters({ exam: event.target.value as PracticeExam })}
                className="min-h-9 max-w-[72px] rounded-xl border border-slate-200 bg-white px-2 text-xs font-semibold text-[#142344] outline-none focus:border-indigo-400 sm:max-w-none sm:px-3"
              >
                {questionExams.map((exam) => <option key={exam} value={exam}>{exam}</option>)}
              </select>
              <div className="relative">
                <Button
                  variant="ghost"
                  className="!size-9 !min-h-9 !min-w-9 !p-0 rounded-xl sm:!size-auto sm:!min-h-11 sm:!min-w-0 sm:!px-2"
                  aria-label="Student profile menu"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((open) => !open)}
                >
                  <span className="grid size-8 place-items-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">AS</span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-xs font-semibold text-[#142344]">Aarav Sharma</span>
                    <span className="block text-[10px] text-slate-400">Student</span>
                  </span>
                  <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
                </Button>
                <AnimatePresence>
                  {profileOpen ? (
                    <motion.div
                      className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <p className="px-3 py-2 text-xs font-semibold text-[#142344]">Aarav Sharma</p>
                      <Link href="/dashboard#profile" className="block rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">Student profile</Link>
                      <Link href="/" className="block rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">Public landing page</Link>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto w-full min-w-0 max-w-[1600px] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-8"
        >
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Link href="/dashboard" className="transition hover:text-indigo-600">Dashboard</Link>
                <span>/</span><span className="text-indigo-600">Practice</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-3xl">Practice questions</h1>
              <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">Build confidence one question at a time.</p>
            </div>
            <Badge variant="outline" className="gap-1.5 border-indigo-200 bg-white text-indigo-700">
              <GraduationCap size={13} /> {filters.exam} preparation
            </Badge>
          </div>

          <Card className="mb-5 p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <ListFilter size={15} className="text-indigo-600" />
              <h2 className="text-xs font-semibold text-[#142344]">Find a question</h2>
              <span className="text-[10px] text-slate-400">Filters use sample questions</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <div className="grid min-w-0 gap-1.5">
                <label htmlFor="filter-exam" className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Exam</label>
                <div className="relative">
                  <select
                    id="filter-exam"
                    value={filters.exam}
                    onChange={(event) => updateFilters({ exam: event.target.value as PracticeExam })}
                    className="min-h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-[#142344] outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    {questionExams.map((exam) => <option key={exam} value={exam}>{exam}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <FilterSelect
                label="Subject"
                value={filters.subject}
                options={subjects}
                onChange={(subject) => updateFilters({ subject })}
              />
              <FilterSelect
                label="Chapter"
                value={filters.chapter}
                options={chapters}
                onChange={(chapter) => updateFilters({ chapter })}
              />
              <FilterSelect
                label="Topic"
                value={filters.topic}
                options={topics}
                onChange={(topic) => updateFilters({ topic })}
              />
              <FilterSelect
                label="Difficulty"
                value={filters.difficulty}
                options={[...questionDifficulties]}
                onChange={(difficulty) => updateFilters({ difficulty: difficulty as Difficulty | "All" })}
              />
            </div>
          </Card>

          <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold text-[#142344]">Question set</h2>
                <Badge variant="primary">
                  {filteredQuestions.length} {filteredQuestions.length === 1 ? "question" : "questions"}
                </Badge>
                {reviewCount > 0 ? <Badge variant="warning">{reviewCount} for review</Badge> : null}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 sm:max-w-72">
                  <motion.div
                    className="h-full rounded-full bg-indigo-600"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-500">
                  {answeredCount} of {filteredQuestions.length} answered · {progress}%
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500" /> Answered</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full border border-slate-300 bg-white" /> Unanswered</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-400" /> Review</span>
            </div>
          </div>

          <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_290px]">
            <div className="min-w-0">
              {activeQuestion && currentStatus ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeQuestion.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-4 sm:px-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-[#142344]">
                            Question {currentIndex + 1}
                            <span className="font-normal text-slate-400"> of {filteredQuestions.length}</span>
                          </span>
                          <Badge variant="primary">{activeQuestion.subject}</Badge>
                          <Badge variant="outline">{activeQuestion.difficulty}</Badge>
                        </div>
                        <span className="text-[10px] text-slate-400">{activeQuestion.chapter} · {activeQuestion.topic}</span>
                      </div>

                      <div className="p-4 sm:p-6 lg:p-8">
                        <div className="flex items-start gap-3">
                          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700">
                            Q{currentIndex + 1}
                          </span>
                          <h3 className="pt-1 text-base font-semibold leading-7 text-[#142344] sm:text-lg sm:leading-8">
                            {activeQuestion.prompt}
                          </h3>
                        </div>

                        <fieldset className="mt-6 grid gap-3">
                          <legend className="sr-only">Select one answer</legend>
                          {activeQuestion.options.map((option, index) => {
                            const isSelected = currentStatus.selected === index;
                            const isCorrect = activeQuestion.correctIndex === index;
                            let optionStyle = "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/40";
                            if (currentStatus.submitted && isCorrect) {
                              optionStyle = "border-emerald-300 bg-emerald-50 text-emerald-900";
                            } else if (currentStatus.submitted && isSelected && !isCorrect) {
                              optionStyle = "border-rose-300 bg-rose-50 text-rose-900";
                            } else if (isSelected) {
                              optionStyle = "border-indigo-300 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-100";
                            }
                            return (
                              <button
                                key={option}
                                type="button"
                                disabled={currentStatus.submitted}
                                aria-pressed={isSelected}
                                onClick={() => updateStatus(activeQuestion.id, { selected: index })}
                                className={`flex min-h-[58px] w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left text-xs leading-5 transition sm:px-4 sm:text-sm ${optionStyle} disabled:cursor-default`}
                              >
                                <span className={`grid size-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                                  currentStatus.submitted && isCorrect
                                    ? "bg-emerald-600 text-white"
                                    : currentStatus.submitted && isSelected
                                      ? "bg-rose-600 text-white"
                                      : isSelected
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 text-slate-500"
                                }`}>
                                  {optionLetters[index]}
                                </span>
                                <span className="min-w-0 flex-1">{option}</span>
                                {currentStatus.submitted && isCorrect ? <CheckCircle2 size={18} className="shrink-0 text-emerald-600" /> : null}
                                {currentStatus.submitted && isSelected && !isCorrect ? <CircleAlert size={18} className="shrink-0 text-rose-600" /> : null}
                              </button>
                            );
                          })}
                        </fieldset>

                        {currentStatus.submitted ? (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-5 rounded-2xl border p-4 sm:p-5 ${
                              currentStatus.selected === activeQuestion.correctIndex
                                ? "border-emerald-200 bg-emerald-50/70"
                                : "border-amber-200 bg-amber-50/70"
                            }`}
                            role="status"
                          >
                            <div className="flex items-start gap-3">
                              <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${
                                currentStatus.selected === activeQuestion.correctIndex
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}>
                                {currentStatus.selected === activeQuestion.correctIndex
                                  ? <CheckCircle2 size={17} />
                                  : <CircleAlert size={17} />}
                              </span>
                              <div>
                                <p className={`text-sm font-semibold ${
                                  currentStatus.selected === activeQuestion.correctIndex ? "text-emerald-900" : "text-amber-900"
                                }`}>
                                  {currentStatus.selected === activeQuestion.correctIndex ? "Correct answer" : "Not quite — review the explanation"}
                                </p>
                                <p className="mt-1 text-xs font-medium text-slate-600">
                                  Correct answer: {optionLetters[activeQuestion.correctIndex]}. {activeQuestion.options[activeQuestion.correctIndex]}
                                </p>
                                <div className="mt-3 border-t border-black/5 pt-3">
                                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">Explanation</p>
                                  <p className="mt-1.5 text-xs leading-6 text-slate-600">{activeQuestion.explanation}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ) : null}

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant={currentStatus.review ? "secondary" : "outline"}
                              size="sm"
                              aria-pressed={currentStatus.review}
                              onClick={() => updateStatus(activeQuestion.id, { review: !currentStatus.review })}
                              className={currentStatus.review ? "border-amber-200 bg-amber-50 text-amber-800" : ""}
                            >
                              <Circle size={14} /> {currentStatus.review ? "Marked for review" : "Mark for Review"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              aria-pressed={currentStatus.bookmarked}
                              onClick={() => updateStatus(activeQuestion.id, { bookmarked: !currentStatus.bookmarked })}
                              className={currentStatus.bookmarked ? "border-indigo-200 bg-indigo-50 text-indigo-700" : ""}
                            >
                              <Bookmark size={14} fill={currentStatus.bookmarked ? "currentColor" : "none"} />
                              {currentStatus.bookmarked ? "Bookmarked" : "Bookmark"}
                            </Button>
                          </div>
                          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                            {currentStatus.submitted ? (
                              <Button
                                variant="outline"
                                size="md"
                                className="flex-1 sm:flex-none"
                                onClick={() => updateStatus(activeQuestion.id, { submitted: false })}
                              >
                                <RotateCcw size={15} /> Try again
                              </Button>
                            ) : (
                              <Button
                                size="md"
                                className="flex-1 sm:flex-none"
                                disabled={currentStatus.selected === null}
                                onClick={() => updateStatus(activeQuestion.id, { submitted: true })}
                              >
                                Submit Answer <Check size={15} />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <Button
                        variant="outline"
                        size="md"
                        disabled={currentIndex <= 0}
                        onClick={() => goRelative(-1)}
                        className="min-w-0 flex-1 px-2 text-[11px] sm:flex-none sm:px-4 sm:text-sm"
                      >
                        <ArrowLeft size={15} /> Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="md"
                        disabled={currentIndex < 0 || currentIndex >= filteredQuestions.length - 1}
                        onClick={() => goRelative(1)}
                        className="min-w-0 flex-1 px-2 text-[11px] sm:flex-none sm:px-4 sm:text-sm"
                      >
                        Next question <ArrowRight size={15} />
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <Card className="grid min-h-80 place-items-center p-8 text-center">
                  <div>
                    <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                      <Search size={20} />
                    </span>
                    <h2 className="mt-4 text-base font-semibold text-[#142344]">No questions match those filters</h2>
                    <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">Try a different subject, chapter, topic, or difficulty.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => updateFilters(initialFilters)}
                    >
                      Reset filters
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            <aside className="min-w-0">
              <div className="mb-3 flex items-center justify-between xl:hidden">
                <h2 className="text-sm font-semibold text-[#142344]">Question palette</h2>
                <Button
                  variant="outline"
                  size="sm"
                  aria-expanded={mobilePaletteOpen}
                  onClick={() => setMobilePaletteOpen((open) => !open)}
                >
                  {mobilePaletteOpen ? "Hide palette" : "Show palette"}
                  <ChevronDown size={14} className={`transition-transform ${mobilePaletteOpen ? "rotate-180" : ""}`} />
                </Button>
              </div>
              <div className="hidden xl:block">
                <Palette
                  questions={filteredQuestions}
                  statuses={statuses}
                  currentId={activeQuestion?.id}
                  answeredCount={answeredCount}
                  reviewCount={reviewCount}
                  onSelect={goToQuestion}
                />
              </div>
              <AnimatePresence initial={false}>
                {mobilePaletteOpen ? (
                  <motion.div
                    className="mb-4 xl:hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Palette
                      questions={filteredQuestions}
                      statuses={statuses}
                      currentId={activeQuestion?.id}
                      answeredCount={answeredCount}
                      reviewCount={reviewCount}
                      onSelect={goToQuestion}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </aside>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] text-slate-400">
            <BookOpenCheck size={13} className="text-indigo-500" />
            Practice preview uses sample questions. Your answers, review marks, and bookmarks are not saved.
          </div>
        </motion.main>
      </div>
    </div>
  );
}

function Palette({
  questions,
  statuses,
  currentId,
  answeredCount,
  reviewCount,
  onSelect,
}: {
  questions: PracticeQuestion[];
  statuses: Record<string, QuestionStatus>;
  currentId?: string;
  answeredCount: number;
  reviewCount: number;
  onSelect: (question: PracticeQuestion) => void;
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-[#142344]">Question palette</h2>
          <p className="mt-1 text-[10px] text-slate-500">Select a question to navigate.</p>
        </div>
        <Badge variant="outline">{questions.length} total</Badge>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-8 xl:grid-cols-5">
        {questions.map((question, index) => {
          const status = statuses[question.id];
          const isCurrent = currentId === question.id;
          let paletteStyle = "border-slate-200 bg-white text-slate-600 hover:border-indigo-300";
          if (status?.submitted) paletteStyle = "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600";
          if (status?.review) paletteStyle = "border-amber-400 bg-amber-400 text-amber-950 hover:bg-amber-500";
          if (isCurrent) paletteStyle = "border-indigo-700 bg-indigo-700 text-white ring-4 ring-indigo-100";
          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onSelect(question)}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`Question ${index + 1}${status?.submitted ? ", answered" : ""}${status?.review ? ", marked for review" : ""}${isCurrent ? ", current" : ""}`}
              className={`grid aspect-square min-h-10 place-items-center rounded-xl border text-xs font-semibold transition ${paletteStyle}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {questions.length === 0 ? (
        <p className="py-6 text-center text-xs text-slate-400">No matching questions.</p>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-lg font-semibold text-[#142344]">{answeredCount}</p>
          <p className="mt-0.5 text-[10px] text-slate-500">Answered</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-3">
          <p className="text-lg font-semibold text-amber-800">{reviewCount}</p>
          <p className="mt-0.5 text-[10px] text-amber-700">For review</p>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Legend</p>
        <div className="mt-3 grid gap-2 text-[10px] text-slate-500">
          <span className="flex items-center gap-2"><span className="size-3 rounded border border-indigo-700 bg-indigo-700" /> Current question</span>
          <span className="flex items-center gap-2"><span className="size-3 rounded border border-emerald-500 bg-emerald-500" /> Answered</span>
          <span className="flex items-center gap-2"><span className="size-3 rounded border border-amber-400 bg-amber-400" /> Marked for review</span>
          <span className="flex items-center gap-2"><span className="size-3 rounded border border-slate-200 bg-white" /> Unanswered</span>
        </div>
      </div>
    </Card>
  );
}
