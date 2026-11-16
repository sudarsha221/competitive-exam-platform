"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Eye,
  FileQuestion,
  Filter,
  GraduationCap,
  Layers3,
  LayoutDashboard,
  Menu,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { PracticeExam } from "@/components/practice/practice-data";
import {
  getTeacherQuestion,
  teacherExams,
  teacherNotifications,
  teacherQuestions,
  teacherRecentPublishedIds,
  teacherRecentViewedIds,
} from "@/components/teacher/teacher-data";
import type { PublishedTeacherQuestion } from "@/components/teacher/teacher-data";
import { AnimatedStatCard } from "@/components/dashboard/dashboard-widgets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type TeacherView = "overview" | "question-bank";
type ExamFilter = "All exams" | PracticeExam;
type DifficultyFilter = "All levels" | "Basic" | "Medium" | "Advanced";
type QuestionSortOrder = "newest" | "oldest";

const sidebarItems = [
  { label: "Overview", href: "/teacher", icon: LayoutDashboard, view: "overview" },
  { label: "Browse Exams", href: "/teacher#exams", icon: GraduationCap },
  { label: "Question Bank", href: "/teacher/question-bank", icon: FileQuestion, view: "question-bank" },
  { label: "Subjects", href: "/teacher/question-bank#subject-filter", icon: Layers3 },
  { label: "Chapters", href: "/teacher/question-bank#chapter-filter", icon: BookOpen },
  { label: "Recently Viewed", href: "/teacher#recently-viewed", icon: Clock3 },
  { label: "Profile", href: "/teacher#profile", icon: UserRound },
  { label: "Settings", href: "/teacher#settings", icon: Settings },
];

type TeacherSidebarProps = {
  view: TeacherView;
  mobile?: boolean;
  onClose?: () => void;
};

function TeacherSidebar({ view, mobile = false, onClose }: TeacherSidebarProps) {
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
          <Button variant="ghost" size="icon" aria-label="Close teacher navigation" onClick={onClose}>
            <X size={18} />
          </Button>
        ) : null}
      </div>
      <nav aria-label="Teacher workspace" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Teaching workspace
        </p>
        <div className="grid gap-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = item.view === view;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`group flex min-h-10 items-center gap-3 rounded-xl px-3 text-[12px] font-medium transition ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[#142344]"
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
            <Eye size={15} className="text-indigo-200" />
            <span className="text-xs font-semibold">Published library</span>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-indigo-100/70">
            Browse and review questions in view-only mode.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2.5 px-1">
          <span className="grid size-9 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">PN</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-[#142344]">Priya Nair</span>
            <span className="mt-0.5 block text-[10px] text-slate-400">Teacher workspace</span>
          </span>
          <GraduationCap size={16} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}

function TeacherHeader({
  view,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onOpenMenu,
  mobileSearchOpen,
  onToggleMobileSearch,
  profileOpen,
  onToggleProfile,
  notificationsOpen,
  onToggleNotifications,
}: {
  view: TeacherView;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onOpenMenu: () => void;
  mobileSearchOpen: boolean;
  onToggleMobileSearch: () => void;
  profileOpen: boolean;
  onToggleProfile: () => void;
  notificationsOpen: boolean;
  onToggleNotifications: () => void;
}) {
  const searchForm = (mobile = false) => (
    <form onSubmit={onSearchSubmit} role="search" className={`relative ${mobile ? "w-full" : "w-full"}`}>
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <Input
        aria-label="Search published questions"
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search published questions..."
        className="!min-h-10 rounded-xl !pl-9 text-xs"
      />
      {mobile ? (
        <button type="submit" className="sr-only">Search questions</button>
      ) : null}
    </form>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          size="icon"
          className="!size-9 !min-h-9 !min-w-9 !p-0 shrink-0 rounded-xl lg:hidden"
          aria-label="Open teacher navigation"
          onClick={onOpenMenu}
        >
          <Menu size={18} />
        </Button>
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-[10px] text-slate-400">Teacher workspace</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-[#142344]">
            {view === "overview" ? "Overview" : "Question Bank"}
          </p>
        </div>
        <div className="ml-auto hidden w-full max-w-[340px] sm:block">
          {searchForm()}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="!size-9 !min-h-9 !min-w-9 !p-0 shrink-0 rounded-xl sm:hidden"
          aria-label="Toggle question search"
          aria-expanded={mobileSearchOpen}
          onClick={onToggleMobileSearch}
        >
          <Search size={18} />
        </Button>
        <div className="relative shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="!size-9 !min-h-9 !min-w-9 !p-0 relative rounded-xl"
            aria-label="Teacher notifications"
            aria-expanded={notificationsOpen}
            onClick={onToggleNotifications}
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-indigo-500 ring-2 ring-white" />
          </Button>
          <AnimatePresence>
            {notificationsOpen ? (
              <motion.div
                className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[min(21rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.16 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[#142344]">Notifications</h2>
                  <Badge variant="primary">Sample</Badge>
                </div>
                <div className="mt-3 grid gap-2">
                  {teacherNotifications.map((item) => (
                    <div key={item.title} className="flex gap-3 rounded-xl bg-slate-50 p-3">
                      <span className="mt-0.5 text-indigo-600">
                        {item.icon === "book" ? <BookOpenCheck size={16} /> : <Sparkles size={16} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#142344]">{item.title}</p>
                        <p className="mt-0.5 text-[10px] leading-4 text-slate-500">{item.description}</p>
                      </div>
                      <span className="shrink-0 text-[9px] text-slate-400">{item.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div id="profile" className="relative shrink-0">
          <Button
            variant="ghost"
            className="!size-9 !min-h-9 !min-w-9 !p-0 rounded-xl sm:!h-11 sm:!w-auto sm:!min-w-0 sm:!px-2"
            aria-label="Teacher profile menu"
            aria-expanded={profileOpen}
            onClick={onToggleProfile}
          >
            <span className="grid size-8 place-items-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">PN</span>
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-semibold text-[#142344]">Priya Nair</span>
              <span className="block text-[10px] text-slate-400">Teacher</span>
            </span>
            <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
          </Button>
          <AnimatePresence>
            {profileOpen ? (
              <motion.div
                className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="text-xs font-semibold text-[#142344]">Priya Nair</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">Teacher profile · sample UI</p>
                </div>
                <Link href="/teacher#profile" className="mt-1 block rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">
                  Profile overview
                </Link>
                <Link href="/teacher#settings" className="block rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">
                  Workspace settings
                </Link>
                <p className="px-3 py-2 text-[9px] text-slate-400">Account actions are not connected.</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {mobileSearchOpen ? (
          <motion.div
            className="border-t border-slate-100 px-4 py-3 sm:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {searchForm(true)}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function QuestionFilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label id={`${id}-filter`} className="grid min-w-0 gap-1.5">
      <span className="text-[10px] font-semibold text-slate-500">{label}</span>
      <span className="relative">
        <select
          value={value}
          aria-label={label}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        >
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </span>
    </label>
  );
}

function sortTeacherQuestions(
  questions: PublishedTeacherQuestion[],
  order: QuestionSortOrder,
) {
  return [...questions].sort((a, b) => order === "newest"
    ? a.publishedAgeDays - b.publishedAgeDays
    : b.publishedAgeDays - a.publishedAgeDays);
}

function QuestionBankLoadingSkeleton() {
  return (
    <>
      <Card className="space-y-3 p-4" aria-label="Loading questions" role="status">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-2 rounded-xl border border-slate-100 p-3">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
        <span className="sr-only">Loading published questions…</span>
      </Card>
      <Card className="space-y-4 p-5">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
        <div className="h-7 w-4/5 animate-pulse rounded bg-slate-100" />
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-11 animate-pulse rounded-xl bg-slate-100" />
        ))}
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
      </Card>
    </>
  );
}

function OverviewPage({
  recentIds,
}: {
  recentIds: string[];
}) {
  const subjectsCount = new Set(teacherQuestions.map((question) => question.subject)).size;
  const chaptersCount = new Set(teacherQuestions.map((question) => question.chapter)).size;
  const publishedCount = teacherQuestions.length;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17284d] via-[#223966] to-[#394f84] px-5 py-6 text-white shadow-[0_18px_50px_rgba(20,35,68,0.12)] sm:px-7 sm:py-8">
        <div className="pointer-events-none absolute -right-10 -top-20 size-64 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-1 top-4 size-40 rounded-full border border-white/10" />
        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Badge className="border border-white/10 bg-white/10 text-indigo-100">Teacher workspace</Badge>
            <h1 className="mt-4 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
              Welcome back, Priya
            </h1>
            <p className="mt-2 max-w-xl text-xs leading-5 text-indigo-100/75 sm:text-sm">
              Browse the published question library and review clear explanations across CET, NEET, and JEE.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/teacher/question-bank">
              <Button className="bg-white text-[#17284d] hover:bg-indigo-50">
                Open question bank <ArrowRight size={15} />
              </Button>
            </Link>
            <Badge className="border border-white/10 bg-white/10 text-white">View-only access</Badge>
          </div>
        </div>
      </section>

      <section aria-label="Question library statistics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AnimatedStatCard
          label="Available exams"
          value={teacherExams.length}
          icon={GraduationCap}
          note="CET, NEET, and JEE"
          tone="bg-indigo-50 text-indigo-600"
        />
        <AnimatedStatCard
          label="Subjects"
          value={subjectsCount}
          icon={Layers3}
          note="Across all sample exams"
          tone="bg-sky-50 text-sky-600"
          delay={0.05}
        />
        <AnimatedStatCard
          label="Chapters"
          value={chaptersCount}
          icon={BookOpen}
          note="Published question coverage"
          tone="bg-amber-50 text-amber-600"
          delay={0.1}
        />
        <AnimatedStatCard
          label="Published questions"
          value={publishedCount}
          icon={FileQuestion}
          note="Sample questions · view only"
          tone="bg-emerald-50 text-emerald-600"
          delay={0.15}
        />
      </section>

      <section id="exams" className="scroll-mt-24">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-[#142344]">Browse by exam</h2>
            <p className="mt-1 text-[10px] text-slate-500">Choose an exam to explore its published sample questions.</p>
          </div>
          <Link href="/teacher/question-bank" className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:gap-2">
            Browse all questions <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {teacherExams.map((exam, index) => {
            const questions = teacherQuestions.filter((question) => question.exam === exam);
            const subjects = new Set(questions.map((question) => question.subject)).size;
            const chapters = new Set(questions.map((question) => question.chapter)).size;
            return (
              <motion.div
                key={exam}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <Link
                  href={`/teacher/question-bank?exam=${exam}`}
                  className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
                >
                  <Card interactive className="h-full p-4 transition-shadow hover:shadow-lg sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                        <GraduationCap size={20} />
                      </span>
                      <Badge variant="success" className="gap-1"><CheckCircle2 size={11} /> Published</Badge>
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-[#142344]">{exam} question library</h3>
                    <p className="mt-1 text-[10px] text-slate-500">{subjects} subjects · {chapters} chapters</p>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xs font-semibold text-indigo-600">{questions.length} questions</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        Browse bank <ArrowRight size={12} />
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <section id="recently-viewed" className="min-w-0 scroll-mt-24">
          <Card className="h-full min-w-0 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-[#142344]">Recently viewed questions</h2>
                <p className="mt-1 text-[10px] text-slate-500">Pick up where you left off.</p>
              </div>
              <Badge variant="outline" className="gap-1"><Clock3 size={11} /> Recent</Badge>
            </div>
            <div className="mt-3 divide-y divide-slate-100">
              {recentIds.map((id) => getTeacherQuestion(id)).filter((question): question is PublishedTeacherQuestion => Boolean(question)).map((question) => (
                <Link
                  key={question.id}
                  href={`/teacher/question-bank?question=${question.id}`}
                  className="flex min-w-0 items-center gap-2.5 py-3 transition hover:bg-indigo-50/40"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-50 text-indigo-600">
                    <FileQuestion size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-[#142344]">{question.topic}</span>
                    <span className="mt-0.5 block truncate text-[9px] text-slate-400">{question.exam} · {question.subject} · {question.chapter}</span>
                  </span>
                  <ArrowRight size={13} className="shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          </Card>
        </section>

        <section id="recently-added" className="min-w-0">
          <Card className="h-full min-w-0 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-[#142344]">Recently added</h2>
                <p className="mt-1 text-[10px] text-slate-500">Newly published sample questions.</p>
              </div>
              <Badge variant="primary" className="gap-1"><Sparkles size={11} /> Published</Badge>
            </div>
            <div className="mt-3 divide-y divide-slate-100">
              {teacherRecentPublishedIds.map((id) => getTeacherQuestion(id)).filter((question): question is PublishedTeacherQuestion => Boolean(question)).map((question) => (
                <Link
                  key={question.id}
                  href={`/teacher/question-bank?question=${question.id}`}
                  className="flex min-w-0 items-center gap-2.5 py-3 transition hover:bg-indigo-50/40"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                    <BookOpenCheck size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-[#142344]">{question.prompt}</span>
                    <span className="mt-0.5 block truncate text-[9px] text-slate-400">{question.exam} · {question.subject} · {question.publishedLabel}</span>
                  </span>
                  <ArrowRight size={13} className="shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          </Card>
        </section>
      </div>

      <section id="settings" className="scroll-mt-24">
        <Card className="flex flex-wrap items-center justify-between gap-3 border-indigo-100 bg-indigo-50/50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-indigo-600">
              <Eye size={16} />
            </span>
            <div>
              <h2 className="text-xs font-semibold text-[#142344]">Teacher permissions</h2>
              <p className="mt-1 max-w-2xl text-[10px] leading-5 text-slate-500">
                This preview is read-only. Teachers can browse published questions and explanations; question creation, editing, deletion, and publishing are not available here.
              </p>
            </div>
          </div>
          <Badge variant="outline">View only</Badge>
        </Card>
      </section>
    </div>
  );
}

function TeacherQuestionBank({
  searchValue,
  onSearchChange,
  examFilter,
  onExamFilterChange,
  selectedQuestionId,
  onSelectQuestion,
  onViewedQuestion,
  recentIds,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  examFilter: ExamFilter;
  onExamFilterChange: (exam: ExamFilter) => void;
  selectedQuestionId: string;
  onSelectQuestion: (id: string) => void;
  onViewedQuestion: (id: string) => void;
  recentIds: string[];
}) {
  const [subjectFilter, setSubjectFilter] = useState("All subjects");
  const [chapterFilter, setChapterFilter] = useState("All chapters");
  const [topicFilter, setTopicFilter] = useState("All topics");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("All levels");
  const [sortOrder, setSortOrder] = useState<QuestionSortOrder>("newest");
  const [questionsPerPage, setQuestionsPerPage] = useState(5);
  const [pageLoading, setPageLoading] = useState(false);

  const searchFiltered = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return teacherQuestions.filter((question) => {
      if (examFilter !== "All exams" && question.exam !== examFilter) return false;
      if (!query) return true;
      return [
        question.prompt,
        question.subject,
        question.chapter,
        question.topic,
        question.exam,
        ...question.options,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [examFilter, searchValue]);

  const subjects = useMemo(
    () => ["All subjects", ...new Set(searchFiltered.map((question) => question.subject))],
    [searchFiltered],
  );
  const activeSubjectFilter = subjects.includes(subjectFilter) ? subjectFilter : "All subjects";
  const chapters = useMemo(
    () => ["All chapters", ...new Set(searchFiltered
      .filter((question) => activeSubjectFilter === "All subjects" || question.subject === activeSubjectFilter)
      .map((question) => question.chapter))],
    [searchFiltered, activeSubjectFilter],
  );
  const activeChapterFilter = chapters.includes(chapterFilter) ? chapterFilter : "All chapters";
  const topics = useMemo(
    () => ["All topics", ...new Set(searchFiltered
      .filter((question) => (activeSubjectFilter === "All subjects" || question.subject === activeSubjectFilter)
        && (activeChapterFilter === "All chapters" || question.chapter === activeChapterFilter))
      .map((question) => question.topic))],
    [searchFiltered, activeSubjectFilter, activeChapterFilter],
  );
  const activeTopicFilter = topics.includes(topicFilter) ? topicFilter : "All topics";
  const filteredQuestions = useMemo(
    () => searchFiltered.filter((question) =>
      (activeSubjectFilter === "All subjects" || question.subject === activeSubjectFilter)
        && (activeChapterFilter === "All chapters" || question.chapter === activeChapterFilter)
        && (activeTopicFilter === "All topics" || question.topic === activeTopicFilter)
        && (difficultyFilter === "All levels" || question.difficulty === difficultyFilter),
    ),
    [searchFiltered, activeSubjectFilter, activeChapterFilter, activeTopicFilter, difficultyFilter],
  );
  const sortedQuestions = useMemo(
    () => sortTeacherQuestions(filteredQuestions, sortOrder),
    [filteredQuestions, sortOrder],
  );
  const pageCount = Math.max(1, Math.ceil(sortedQuestions.length / questionsPerPage));
  const selectedIndex = sortedQuestions.findIndex((question) => question.id === selectedQuestionId);
  const safeCurrentPage = selectedIndex >= 0
    ? Math.floor(selectedIndex / questionsPerPage) + 1
    : 1;
  const pageStart = (safeCurrentPage - 1) * questionsPerPage;
  const pageQuestions = sortedQuestions.slice(pageStart, pageStart + questionsPerPage);
  const activeQuestion = sortedQuestions.find((question) => question.id === selectedQuestionId)
    ?? sortedQuestions[0];
  const activeIndex = activeQuestion
    ? sortedQuestions.findIndex((question) => question.id === activeQuestion.id)
    : -1;
  const recentQuestions = recentIds
    .map(getTeacherQuestion)
    .filter((question): question is PublishedTeacherQuestion => question !== undefined);

  useEffect(() => {
    if (!pageLoading) return;
    const timeout = window.setTimeout(() => setPageLoading(false), 180);
    return () => window.clearTimeout(timeout);
  }, [pageLoading]);

  function chooseQuestion(id: string) {
    onSelectQuestion(id);
    onViewedQuestion(id);
  }

  function changePage(page: number) {
    if (page < 1 || page > pageCount || page === safeCurrentPage) return;
    const firstQuestion = sortedQuestions[(page - 1) * questionsPerPage];
    setPageLoading(true);
    if (firstQuestion) chooseQuestion(firstQuestion.id);
  }

  function navigateQuestion(direction: -1 | 1) {
    const nextIndex = activeIndex + direction;
    const next = sortedQuestions[nextIndex];
    if (next) {
      chooseQuestion(next.id);
    }
  }

  function resetFilters() {
    onSearchChange("");
    onExamFilterChange("All exams");
    setSubjectFilter("All subjects");
    setChapterFilter("All chapters");
    setTopicFilter("All topics");
    setDifficultyFilter("All levels");
    setSortOrder("newest");
    setQuestionsPerPage(5);
    const firstQuestion = sortTeacherQuestions(teacherQuestions, "newest")[0];
    if (firstQuestion) chooseQuestion(firstQuestion.id);
  }

  function openRecentQuestion(question: PublishedTeacherQuestion) {
    onSearchChange("");
    onExamFilterChange("All exams");
    setSubjectFilter("All subjects");
    setChapterFilter("All chapters");
    setTopicFilter("All topics");
    setDifficultyFilter("All levels");
    setSortOrder("newest");
    setQuestionsPerPage(5);
    chooseQuestion(question.id);
  }

  function changeSortOrder(value: string) {
    const nextOrder = value as QuestionSortOrder;
    setSortOrder(nextOrder);
    setPageLoading(true);
    const firstQuestion = sortTeacherQuestions(filteredQuestions, nextOrder)[0];
    if (firstQuestion) chooseQuestion(firstQuestion.id);
  }

  function changeQuestionsPerPage(value: string) {
    const nextPageSize = Number(value);
    if (![5, 10, 20].includes(nextPageSize)) return;
    setQuestionsPerPage(nextPageSize);
    setPageLoading(true);
    if (sortedQuestions[0]) chooseQuestion(sortedQuestions[0].id);
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <Filter size={16} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-[#142344]">Find published questions</h2>
              <p className="mt-1 text-[10px] text-slate-500">Filter by exam, subject, chapter, subtopic, keyword, or difficulty.</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1.5"><Eye size={12} /> Published · view only</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          <QuestionFilterSelect
            id="exam"
            label="Exam"
            value={examFilter}
            options={["All exams", ...teacherExams]}
            onChange={(value) => {
              onExamFilterChange(value as ExamFilter);
              setSubjectFilter("All subjects");
              setChapterFilter("All chapters");
              setTopicFilter("All topics");
            }}
          />
          <QuestionFilterSelect
            id="subject"
            label="Subject"
            value={activeSubjectFilter}
            options={subjects}
            onChange={(value) => {
              setSubjectFilter(value);
              setChapterFilter("All chapters");
              setTopicFilter("All topics");
            }}
          />
          <QuestionFilterSelect
            id="chapter"
            label="Chapter"
            value={activeChapterFilter}
            options={chapters}
            onChange={(value) => {
              setChapterFilter(value);
              setTopicFilter("All topics");
            }}
          />
          <QuestionFilterSelect
            id="subtopic"
            label="Subtopic"
            value={activeTopicFilter}
            options={topics}
            onChange={setTopicFilter}
          />
          <QuestionFilterSelect
            id="difficulty"
            label="Difficulty"
            value={difficultyFilter}
            options={["All levels", "Basic", "Medium", "Advanced"]}
            onChange={(value) => setDifficultyFilter(value as DifficultyFilter)}
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_170px_auto] sm:items-end">
          <label className="grid min-w-0 gap-1.5">
            <span className="text-[10px] font-semibold text-slate-500">Search by keyword</span>
            <span className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                aria-label="Search by question keyword"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search question text..."
                className="!min-h-10 rounded-xl !pl-9 text-xs"
              />
            </span>
          </label>
          <label className="grid min-w-0 gap-1.5">
            <span className="text-[10px] font-semibold text-slate-500">Sort by</span>
            <select
              aria-label="Sort questions by publication date"
              value={sortOrder}
              onChange={(event) => changeSortOrder(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
          <Button variant="outline" size="sm" className="gap-2" onClick={resetFilters}>
            <RotateCcw size={14} /> Reset filters
          </Button>
        </div>
      </Card>

      {recentQuestions.length ? (
        <Card className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xs font-semibold text-[#142344]">Recently viewed</h2>
              <p className="mt-1 text-[10px] text-slate-400">Quickly return to questions you reviewed.</p>
            </div>
            <Badge variant="outline">{recentQuestions.length} recent</Badge>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {recentQuestions.map((question) => (
              <button
                key={question.id}
                type="button"
                onClick={() => openRecentQuestion(question)}
                className="group min-w-0 rounded-xl border border-slate-100 p-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <Badge variant="primary">{question.exam}</Badge>
                    <span className="truncate text-[10px] text-slate-500">{question.subject}</span>
                  </span>
                  <Clock3 size={13} className="shrink-0 text-slate-400 group-hover:text-indigo-500" />
                </span>
                <span className="mt-2 block line-clamp-2 text-[11px] font-semibold leading-4 text-[#142344]">
                  {question.prompt}
                </span>
                <span className="mt-1.5 block truncate text-[9px] text-slate-400">ID: {question.id}</span>
              </button>
            ))}
          </div>
        </Card>
      ) : null}

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)]">
        {pageLoading ? (
          <QuestionBankLoadingSkeleton />
        ) : (
          <>
            <Card className="min-w-0 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3.5">
                <div>
                  <h2 className="text-xs font-semibold text-[#142344]">Question library</h2>
                  <p className="mt-1 text-[9px] text-slate-400">{sortedQuestions.length} matching published questions</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="primary">{sortedQuestions.length}</Badge>
                  <label className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500">
                    Per page
                    <select
                      aria-label="Questions per page"
                      value={questionsPerPage}
                      onChange={(event) => changeQuestionsPerPage(event.target.value)}
                      className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-[10px] text-[#142344] outline-none focus:border-indigo-400"
                    >
                      {[5, 10, 20].map((count) => <option key={count} value={count}>{count}</option>)}
                    </select>
                  </label>
                </div>
              </div>
              <div className="max-h-[620px] overflow-y-auto p-2">
                {sortedQuestions.length ? pageQuestions.map((question) => {
                  const active = question.id === activeQuestion?.id;
                  const questionNumber = sortedQuestions.findIndex((item) => item.id === question.id) + 1;
                  return (
                    <button
                      key={question.id}
                      type="button"
                      aria-label={`View details for question ${question.id}`}
                      aria-pressed={active}
                      onClick={() => chooseQuestion(question.id)}
                      className={`mb-1 w-full rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-indigo-200 bg-indigo-50/70"
                          : "border-transparent hover:border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <Badge variant={active ? "primary" : "outline"}>{question.exam}</Badge>
                          <span className="truncate text-[10px] font-medium text-slate-500">{question.subject}</span>
                          <Badge variant="outline">{question.difficulty}</Badge>
                        </span>
                        <span className="shrink-0 text-[9px] text-slate-400">Q{questionNumber}</span>
                      </span>
                      <span className="mt-2 block break-all text-[9px] font-medium text-indigo-600">ID: {question.id}</span>
                      <span className="mt-1 block line-clamp-2 text-[11px] font-semibold leading-4 text-[#142344]">
                        {question.prompt}
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                        <span className="min-w-0 truncate text-[9px] text-slate-400">{question.chapter} · {question.topic}</span>
                        <span className="inline-flex shrink-0 items-center gap-1 text-[9px] font-semibold text-indigo-600">
                          View details <ArrowRight size={11} />
                        </span>
                      </span>
                    </button>
                  );
                }) : (
                  <div className="grid place-items-center px-4 py-12 text-center">
                    <Search size={20} className="text-slate-300" />
                    <p className="mt-3 text-xs font-semibold text-[#142344]">No questions found</p>
                    <p className="mt-1 text-[10px] text-slate-400">Try another keyword or adjust the filters.</p>
                    <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={resetFilters}>
                      <RotateCcw size={13} /> Reset filters
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
                <p className="text-[9px] text-slate-400">
                  Showing {sortedQuestions.length ? pageStart + 1 : 0}–{Math.min(pageStart + questionsPerPage, sortedQuestions.length)} of {sortedQuestions.length}
                </p>
                {sortedQuestions.length ? (
                  <nav aria-label="Question pages" className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Previous question page"
                      disabled={safeCurrentPage <= 1 || pageLoading}
                      onClick={() => changePage(safeCurrentPage - 1)}
                      className="!size-8 !min-h-8 !min-w-8 !p-0"
                    >
                      <ChevronLeft size={14} />
                    </Button>
                    {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === safeCurrentPage ? "primary" : "ghost"}
                        size="icon"
                        aria-label={`Go to question page ${page}`}
                        aria-current={page === safeCurrentPage ? "page" : undefined}
                        disabled={pageLoading}
                        onClick={() => changePage(page)}
                        className="!size-8 !min-h-8 !min-w-8 !p-0 text-[10px]"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Next question page"
                      disabled={safeCurrentPage >= pageCount || pageLoading}
                      onClick={() => changePage(safeCurrentPage + 1)}
                      className="!size-8 !min-h-8 !min-w-8 !p-0"
                    >
                      <ChevronRight size={14} />
                    </Button>
                  </nav>
                ) : null}
              </div>
            </Card>

            {activeQuestion ? (
              <QuestionDetail
                question={activeQuestion}
                index={activeIndex}
                total={sortedQuestions.length}
                onPrevious={() => navigateQuestion(-1)}
                onNext={() => navigateQuestion(1)}
                onViewedQuestion={onViewedQuestion}
              />
            ) : (
              <Card className="grid min-h-72 place-items-center p-6 text-center">
                <div>
                  <CircleHelp size={24} className="mx-auto text-slate-300" />
                  <p className="mt-3 text-sm font-semibold text-[#142344]">Choose a question to review</p>
                  <p className="mt-1 text-xs text-slate-500">Questions and explanations are visible to teachers in this sample library.</p>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
      <p className="text-center text-[10px] text-slate-400">
        Published question content is read-only. No create, edit, delete, or publish actions are available.
      </p>
    </div>
  );
}

function QuestionDetail({
  question,
  index,
  total,
  onPrevious,
  onNext,
  onViewedQuestion,
}: {
  question: PublishedTeacherQuestion;
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onViewedQuestion: (id: string) => void;
}) {
  useEffect(() => {
    onViewedQuestion(question.id);
  }, [onViewedQuestion, question.id]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="primary">Exam · {question.exam}</Badge>
              <Badge variant="outline">Subject · {question.subject}</Badge>
              <Badge variant="outline">Difficulty · {question.difficulty}</Badge>
            </div>
            <Badge variant="success" className="gap-1"><CheckCircle2 size={11} /> Published · view only</Badge>
          </div>
          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-600">
                Chapter: {question.chapter} · Subtopic: {question.topic}
              </p>
              <span className="inline-flex items-center gap-1 text-[9px] text-slate-400">
                <span>Question ID: {question.id}</span>
                <Eye size={12} /> {question.views} sample views
              </span>
            </div>
            <h2 className="mt-3 text-base font-semibold leading-7 text-[#142344] sm:text-lg">
              {question.prompt}
            </h2>

            <div className="mt-5 grid gap-2.5">
              {question.options.map((option, optionIndex) => {
                const isCorrect = optionIndex === question.correctIndex;
                return (
                  <div
                    key={`${question.id}-${option}`}
                    className={`flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2.5 text-xs leading-5 sm:text-sm ${
                      isCorrect
                        ? "border-emerald-200 bg-emerald-50/80 text-emerald-950"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    <span className={`grid size-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold ${
                      isCorrect ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {["A", "B", "C", "D"][optionIndex]}
                    </span>
                    <span className="min-w-0 flex-1">{option}</span>
                    {isCorrect ? (
                      <Badge variant="success" className="gap-1"><CheckCircle2 size={11} /> Correct</Badge>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/55 p-4">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-white text-indigo-600 shadow-sm">
                  <Sparkles size={15} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#142344]">Explanation</p>
                  <p className="mt-0.5 text-[9px] text-slate-400">Published answer guidance</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-600">{question.explanation}</p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <span className="text-[10px] text-slate-400">
                Question {index + 1} of {total} · Published {question.publishedLabel}
              </span>
              <div className="flex w-full justify-end gap-2 sm:w-auto">
                <Button variant="outline" size="sm" disabled={index <= 0} onClick={onPrevious}>
                  <ChevronLeft size={14} /> Previous
                </Button>
                <Button size="sm" disabled={index < 0 || index >= total - 1} onClick={onNext}>
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export function TeacherWorkspace({
  view,
  initialSearch = "",
  initialExam = "All exams",
  initialQuestionId = teacherQuestions[0]?.id ?? "",
}: {
  view: TeacherView;
  initialSearch?: string;
  initialExam?: ExamFilter;
  initialQuestionId?: string;
}) {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [examFilter, setExamFilter] = useState<ExamFilter>(initialExam);
  const [selectedQuestionId, setSelectedQuestionId] = useState(
    () => getTeacherQuestion(initialQuestionId)?.id ?? teacherQuestions[0]?.id ?? "",
  );
  const [recentIds, setRecentIds] = useState<string[]>(teacherRecentViewedIds);

  const viewQuestion = useCallback((id: string) => {
    setRecentIds((current) => current[0] === id
      ? current
      : [id, ...current.filter((currentId) => currentId !== id)].slice(0, 5));
  }, []);

  const selectQuestion = useCallback((id: string) => {
    setSelectedQuestionId(id);
    viewQuestion(id);
  }, [viewQuestion]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchValue.trim()) params.set("search", searchValue.trim());
    if (view === "question-bank" && examFilter !== "All exams") params.set("exam", examFilter);
    const query = params.toString();
    router.push(`/teacher/question-bank${query ? `?${query}` : ""}`);
    setMobileSearchOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#142344]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <TeacherSidebar view={view} />
      </aside>
      <AnimatePresence>
        {mobileSidebarOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close teacher navigation"
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
              <TeacherSidebar view={view} mobile onClose={() => setMobileSidebarOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
      <div className="min-h-screen lg:pl-[252px]">
        <TeacherHeader
          view={view}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={submitSearch}
          onOpenMenu={() => setMobileSidebarOpen(true)}
          mobileSearchOpen={mobileSearchOpen}
          onToggleMobileSearch={() => setMobileSearchOpen((open) => !open)}
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
        />
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto w-full min-w-0 max-w-[1600px] px-4 pb-12 pt-5 sm:px-6 sm:pt-7 lg:px-8"
        >
          {view === "overview" ? (
            <OverviewPage recentIds={recentIds} />
          ) : (
            <div>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Link href="/teacher" className="transition hover:text-indigo-600">Teacher workspace</Link>
                    <span>/</span><span className="text-indigo-600">Question Bank</span>
                  </div>
                  <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-3xl">Published Question Bank</h1>
                  <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                    Browse published sample questions, correct answers, and explanations.
                  </p>
                </div>
                <Badge variant="outline" className="gap-1.5"><Eye size={13} /> Teacher view-only access</Badge>
              </div>
              <TeacherQuestionBank
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                examFilter={examFilter}
                onExamFilterChange={setExamFilter}
                selectedQuestionId={selectedQuestionId}
                onSelectQuestion={selectQuestion}
                onViewedQuestion={viewQuestion}
                recentIds={recentIds}
              />
            </div>
          )}
          <div id="settings" className="h-px" />
        </motion.main>
      </div>
    </div>
  );
}
