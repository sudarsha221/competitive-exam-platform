"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Bookmark,
  BookOpenCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Filter,
  Flame,
  GraduationCap,
  LayoutDashboard,
  Menu,
  NotebookPen,
  Settings,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AnimatedStatCard,
} from "@/components/dashboard/dashboard-widgets";
import {
  examMetrics,
  type ExamName,
} from "@/components/dashboard/dashboard-data";
import {
  getAccuracy,
  performanceData,
  rankingPeriods,
  sampleBookmarkIds,
  sampleHistory,
  sampleLeaderboards,
  sampleMistakes,
  type RankingPeriod,
} from "@/components/insights/insights-data";
import {
  practiceQuestions,
  type PracticeQuestion,
} from "@/components/practice/practice-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type InsightsPageKey = "performance" | "leaderboard" | "bookmarks" | "mistakes";

const examOptions: ExamName[] = ["CET", "NEET", "JEE"];
const pageDetails: Record<InsightsPageKey, { title: string; description: string }> = {
  performance: {
    title: "My Performance",
    description: "Understand your study momentum and find your next opportunity to improve.",
  },
  leaderboard: {
    title: "Leaderboard",
    description: "A friendly sample ranking to add a little motivation to your practice.",
  },
  bookmarks: {
    title: "Bookmarks",
    description: "Keep useful questions close and revisit the ideas worth remembering.",
  },
  mistakes: {
    title: "Mistake Notebook",
    description: "Review tricky questions, learn from each attempt, and try them again.",
  },
};

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Practice Questions", href: "/practice", icon: BookOpenCheck },
  { label: "Daily Challenge", href: "/challenges", icon: Target },
  { label: "My Performance", href: "/performance", icon: Activity, key: "performance" },
  { label: "Activity Calendar", href: "/dashboard#activity-calendar", icon: CalendarDays },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark, key: "bookmarks" },
  { label: "Mistake Notebook", href: "/mistakes", icon: NotebookPen, key: "mistakes" },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy, key: "leaderboard" },
  { label: "Profile", href: "/dashboard#profile", icon: UserRound },
  { label: "Settings", href: "/dashboard#settings", icon: Settings },
];

type InsightsSidebarProps = {
  page: InsightsPageKey;
  mobile?: boolean;
  onClose?: () => void;
};

function InsightsSidebar({ page, mobile = false, onClose }: InsightsSidebarProps) {
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
          <Button variant="ghost" size="icon" aria-label="Close student navigation" onClick={onClose}>
            <X size={18} />
          </Button>
        ) : null}
      </div>
      <nav aria-label="Student dashboard" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Workspace
        </p>
        <div className="grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.key === page;
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
            <Sparkles size={15} className="text-indigo-200" />
            <span className="text-xs font-semibold">Keep your momentum</span>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-indigo-100/70">
            Small, consistent practice adds up.
          </p>
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

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-[10px] font-semibold text-slate-500">{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={label}
          className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        >
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </span>
    </label>
  );
}

function PageHeader({
  page,
  onOpenMenu,
  selectedExam,
  onSelectExam,
}: {
  page: InsightsPageKey;
  onOpenMenu: () => void;
  selectedExam: ExamName;
  onSelectExam: (exam: ExamName) => void;
}) {
  const showExamSelect = page === "performance" || page === "leaderboard";
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          size="icon"
          className="!size-9 !min-h-9 !min-w-9 !p-0 shrink-0 rounded-xl lg:hidden"
          aria-label="Open student navigation"
          onClick={onOpenMenu}
        >
          <Menu size={18} />
        </Button>
        <div className="min-w-0">
          <p className="hidden text-[10px] text-slate-400 sm:block">Student workspace</p>
          <p className="truncate text-sm font-semibold text-[#142344]">{pageDetails[page].title}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {showExamSelect ? (
            <label className="relative">
              <span className="sr-only">Select exam</span>
              <select
                value={selectedExam}
                onChange={(event) => onSelectExam(event.target.value as ExamName)}
                aria-label="Select exam"
                className="h-9 appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-xs font-semibold text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              >
                {examOptions.map((exam) => <option key={exam} value={exam}>{exam}</option>)}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </label>
          ) : (
            <Badge variant="primary" className="hidden sm:inline-flex">
              Sample workspace
            </Badge>
          )}
          <Link
            href="/dashboard#profile"
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
            aria-label="Student profile"
          >
            <span className="grid size-8 place-items-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">AS</span>
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-semibold text-[#142344]">Aarav Sharma</span>
              <span className="block text-[10px] text-slate-400">Student</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function TrendChart({ values, period }: { values: number[]; period: "week" | "month" }) {
  const labels = period === "week"
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
  const width = 720;
  const left = 38;
  const right = 704;
  const top = 14;
  const bottom = 178;
  const points = values.map((value, index) => ({
    x: left + (index * (right - left)) / Math.max(1, values.length - 1),
    y: bottom - (value / 100) * (bottom - top),
  }));
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L ${right} ${bottom} L ${left} ${bottom} Z`;
  const average = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

  return (
    <Card className="min-w-0 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#142344]">{period === "week" ? "Weekly" : "Monthly"} progress</h2>
          <p className="mt-1 text-[10px] text-slate-500">Practice accuracy over time</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-[#142344]">{average}%</p>
          <p className="text-[10px] text-emerald-600">Average accuracy</p>
        </div>
      </div>
      <div className="mt-4 min-w-0">
        <motion.svg
          key={period}
          viewBox={`0 0 ${width} 204`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`${period === "week" ? "Weekly" : "Monthly"} accuracy chart`}
          className="h-44 w-full overflow-visible"
        >
          {[40, 60, 80, 100].map((tick) => {
            const y = bottom - (tick / 100) * (bottom - top);
            return (
              <g key={tick}>
                <line x1={left} x2={right} y1={y} y2={y} stroke="#e9edf5" strokeDasharray="3 5" />
                <text x="0" y={y + 3} fill="#94a3b8" fontSize="9">{tick}%</text>
              </g>
            );
          })}
          <motion.path
            d={areaPath}
            fill="#6366f1"
            fillOpacity="0.08"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d={linePath}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3.5"
              fill="#fff"
              stroke="#4f46e5"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35 + index * 0.035, duration: 0.2 }}
            />
          ))}
        </motion.svg>
        <div className="ml-9 mr-1 flex justify-between text-[9px] text-slate-400 sm:text-[10px]">
          {labels.map((label) => <span key={label}>{label}</span>)}
        </div>
      </div>
    </Card>
  );
}

function AccuracyBar({
  label,
  attempted,
  correct,
}: {
  label: string;
  attempted: number;
  correct: number;
}) {
  const accuracy = getAccuracy(correct, attempted);
  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-xs font-medium text-slate-600">{label}</span>
        <span className="shrink-0 text-[11px] font-semibold text-[#142344]">{accuracy}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <motion.span
          className="block h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
          initial={{ width: 0 }}
          whileInView={{ width: `${accuracy}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        />
      </div>
      <p className="mt-1.5 text-[9px] text-slate-400">{correct} correct of {attempted} attempted</p>
    </div>
  );
}

function PerformancePage({ exam }: { exam: ExamName }) {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const metrics = examMetrics[exam];
  const data = performanceData[exam];
  const incorrect = metrics.questions - metrics.correct;
  const history = sampleHistory.filter((session) => session.exam === exam);
  const trend = period === "week" ? data.weekly : data.monthly;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AnimatedStatCard
          label="Questions attempted"
          value={metrics.questions}
          icon={BookOpenCheck}
          note={`Across ${exam} practice sessions`}
          tone="bg-indigo-50 text-indigo-600"
        />
        <AnimatedStatCard
          label="Correct answers"
          value={metrics.correct}
          icon={CheckCircle2}
          note={`${getAccuracy(metrics.correct, metrics.questions)}% of attempted questions`}
          tone="bg-emerald-50 text-emerald-600"
          delay={0.05}
        />
        <AnimatedStatCard
          label="Incorrect answers"
          value={incorrect}
          icon={CircleAlert}
          note="Every miss is a chance to learn"
          tone="bg-rose-50 text-rose-600"
          delay={0.1}
        />
        <AnimatedStatCard
          label="Overall accuracy"
          value={metrics.accuracy}
          suffix="%"
          icon={Target}
          note="Your correct-answer rate"
          tone="bg-sky-50 text-sky-600"
          delay={0.15}
        />
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <section className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[#142344]">Progress trend</h2>
              <p className="mt-1 text-[10px] text-slate-500">Choose a time range to review your accuracy.</p>
            </div>
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
              {(["week", "month"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={period === value}
                  onClick={() => setPeriod(value)}
                  className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold transition ${
                    period === value ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-indigo-600"
                  }`}
                >
                  {value === "week" ? "Weekly" : "Monthly"}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${exam}-${period}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <TrendChart values={trend} period={period} />
            </motion.div>
          </AnimatePresence>
        </section>

        <Card className="min-w-0 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-[#142344]">Recent performance</h2>
              <p className="mt-1 text-[10px] text-slate-500">Latest sample practice sessions</p>
            </div>
            <Badge variant="outline">{history.length} sessions</Badge>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {history.length ? history.map((session) => (
              <div key={session.id} className="flex items-center gap-2.5 py-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                  <BookOpenCheck size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-[#142344]">{session.topic}</span>
                  <span className="mt-0.5 block truncate text-[9px] text-slate-400">{session.subject} · {session.time}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-emerald-600">{session.accuracy}%</span>
              </div>
            )) : (
              <p className="py-5 text-center text-xs text-slate-500">No sample sessions for this exam yet.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-[#142344]">Subject-wise performance</h2>
              <p className="mt-1 text-[10px] text-slate-500">Accuracy by subject for {exam}</p>
            </div>
            <BarChart3 size={17} className="text-indigo-500" />
          </div>
          <div className="mt-2 divide-y divide-slate-100">
            {data.subjects.map((subject) => (
              <AccuracyBar key={subject.name} {...subject} label={subject.name} />
            ))}
          </div>
        </Card>
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-[#142344]">Difficulty-wise performance</h2>
              <p className="mt-1 text-[10px] text-slate-500">How you handle each question level</p>
            </div>
            <Target size={17} className="text-indigo-500" />
          </div>
          <div className="mt-2 divide-y divide-slate-100">
            {data.difficulty.map((item) => (
              <AccuracyBar key={item.name} {...item} label={item.name} />
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-[#142344]">Chapter-wise performance</h2>
            <p className="mt-1 text-[10px] text-slate-500">Focus your next revision on the chapters that need it most.</p>
          </div>
          <Badge variant="primary">{data.chapters.length} sample chapters</Badge>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                <th className="pb-2.5 pr-4">Chapter</th>
                <th className="pb-2.5 pr-4">Subject</th>
                <th className="pb-2.5 pr-4">Attempted</th>
                <th className="pb-2.5 pr-4">Correct</th>
                <th className="pb-2.5 text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.chapters.map((chapter) => (
                <tr key={chapter.name} className="text-xs">
                  <td className="py-3 pr-4 font-semibold text-[#142344]">{chapter.name}</td>
                  <td className="py-3 pr-4 text-slate-500">{chapter.subject}</td>
                  <td className="py-3 pr-4 text-slate-500">{chapter.attempted}</td>
                  <td className="py-3 pr-4 text-slate-500">{chapter.correct}</td>
                  <td className="py-3 text-right">
                    <Badge variant={getAccuracy(chapter.correct, chapter.attempted) >= 80 ? "success" : "warning"}>
                      {getAccuracy(chapter.correct, chapter.attempted)}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

function LeaderboardPage({
  exam,
  onSelectExam,
}: {
  exam: ExamName;
  onSelectExam: (exam: ExamName) => void;
}) {
  const [period, setPeriod] = useState<RankingPeriod>("week");
  const rankedStudents = useMemo(
    () => [...sampleLeaderboards[exam]]
      .sort((a, b) => b.points[period] - a.points[period])
      .map((student, index) => ({ ...student, rank: index + 1 })),
    [exam, period],
  );
  const currentStudent = rankedStudents.find((student) => student.id === "current-student");

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-indigo-100 bg-gradient-to-br from-white via-white to-indigo-50/80 p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
              <Trophy size={20} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-[#142344]">Your {exam} sample ranking</h2>
              <p className="mt-1 text-xs text-slate-500">Explore a friendly sample leaderboard and track points for each period.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <span className="sr-only">Leaderboard exam</span>
              <select
                aria-label="Leaderboard exam"
                value={exam}
                onChange={(event) => onSelectExam(event.target.value as ExamName)}
                className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-xs font-semibold text-[#142344] outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              >
                {examOptions.map((value) => <option key={value}>{value}</option>)}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </label>
            <label className="grid min-w-0 gap-1.5">
              <span className="text-[10px] font-semibold text-slate-500">Ranking period</span>
              <span className="relative">
                <select
                  aria-label="Ranking period"
                  value={period}
                  onChange={(event) => setPeriod(event.target.value as RankingPeriod)}
                  className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                >
                  {rankingPeriods.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </span>
            </label>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(270px,0.7fr)]">
        <Card className="min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-[#142344]">Top 10 students</h2>
              <p className="mt-1 text-[10px] text-slate-500">{rankingPeriods.find((item) => item.id === period)?.label} · {exam}</p>
            </div>
            <Badge variant="warning" className="gap-1.5"><Sparkles size={12} /> Sample data</Badge>
          </div>
          <div className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {rankedStudents.map((student) => {
                const isCurrent = student.id === "current-student";
                return (
                  <motion.div
                    key={`${exam}-${period}-${student.id}`}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className={`grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2.5 px-4 py-3 sm:grid-cols-[44px_minmax(0,1fr)_100px] sm:gap-3 sm:px-5 ${
                      isCurrent ? "bg-indigo-50/80" : "hover:bg-slate-50/70"
                    }`}
                  >
                    <span className={`grid size-7 place-items-center rounded-lg text-[10px] font-bold sm:size-8 ${
                      student.rank === 1
                        ? "bg-amber-100 text-amber-700"
                        : student.rank === 2
                          ? "bg-slate-100 text-slate-600"
                          : student.rank === 3
                            ? "bg-orange-100 text-orange-700"
                            : "bg-slate-50 text-slate-500"
                    }`}>
                      {student.rank <= 3 ? <Award size={14} /> : `#${student.rank}`}
                    </span>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className={`grid size-9 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                        isCurrent ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-700"
                      }`}>
                        {initials(student.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-[#142344]">{student.name}</span>
                        <span className="mt-0.5 block text-[9px] text-slate-400">
                          {isCurrent ? "You · sample profile" : "Sample student"}
                        </span>
                      </span>
                      {isCurrent ? <Badge variant="primary" className="hidden sm:inline-flex">You</Badge> : null}
                    </span>
                    <span className="text-right">
                      <span className="block text-xs font-semibold text-[#142344]">{student.points[period].toLocaleString()}</span>
                      <span className="text-[9px] text-slate-400">points</span>
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <p className="border-t border-slate-100 px-4 py-3 text-[9px] leading-4 text-slate-400 sm:px-5">
            This leaderboard uses fictional sample names and points for demonstration only. It does not show real student rankings.
          </p>
        </Card>

        <div className="space-y-4">
          {currentStudent ? (
            <Card className="overflow-hidden border-indigo-200 bg-gradient-to-br from-[#17284d] to-[#344b83] p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-[10px] font-medium text-indigo-100/70">Your sample rank</span>
                  <span className="mt-1 block text-4xl font-semibold tracking-tight">#{currentStudent.rank}</span>
                </span>
                <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-indigo-100"><Trophy size={20} /></span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-xs text-indigo-100/80">{rankingPeriods.find((item) => item.id === period)?.label}</span>
                <span className="text-sm font-semibold">{currentStudent.points[period].toLocaleString()} pts</span>
              </div>
              <p className="mt-3 text-[9px] leading-4 text-indigo-100/60">Fictional ranking sample · not real student data</p>
            </Card>
          ) : null}
          <Card className="p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-[#142344]">How points work</h2>
            <p className="mt-1.5 text-[10px] leading-5 text-slate-500">
              This preview uses sample points to demonstrate the leaderboard layout. In a connected product, points would come from completed practice activity.
            </p>
            <div className="mt-4 grid gap-2.5">
              {[
                { icon: CheckCircle2, text: "Correct answers add sample points" },
                { icon: Flame, text: "Consistency keeps study momentum" },
                { icon: CalendarDays, text: "Choose a period to compare" },
              ].map(({ icon: Icon, text }) => (
                <p key={text} className="flex items-center gap-2 text-[10px] font-medium text-slate-600">
                  <Icon size={14} className="text-indigo-500" /> {text}
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

type BookmarkExamFilter = "All exams" | ExamName;

function BookmarksPage() {
  const [savedIds, setSavedIds] = useState<string[]>(sampleBookmarkIds);
  const [exam, setExam] = useState<BookmarkExamFilter>("All exams");
  const [subject, setSubject] = useState("All subjects");
  const [chapter, setChapter] = useState("All chapters");
  const [difficulty, setDifficulty] = useState("All difficulties");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const savedQuestions = useMemo(
    () => practiceQuestions.filter((question) => savedIds.includes(question.id)),
    [savedIds],
  );
  const subjectOptions = useMemo(
    () => ["All subjects", ...new Set(savedQuestions
      .filter((question) => exam === "All exams" || question.exam === exam)
      .map((question) => question.subject))],
    [exam, savedQuestions],
  );
  const chapterOptions = useMemo(
    () => ["All chapters", ...new Set(savedQuestions
      .filter((question) => (exam === "All exams" || question.exam === exam)
        && (subject === "All subjects" || question.subject === subject))
      .map((question) => question.chapter))],
    [exam, savedQuestions, subject],
  );
  const visibleQuestions = savedQuestions.filter((question) =>
    (exam === "All exams" || question.exam === exam)
      && (subject === "All subjects" || question.subject === subject)
      && (chapter === "All chapters" || question.chapter === chapter)
      && (difficulty === "All difficulties" || question.difficulty === difficulty),
  );

  function removeBookmark(id: string) {
    setSavedIds((current) => current.filter((questionId) => questionId !== id));
    setExpandedId((current) => (current === id ? null : current));
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-[#142344]">Filter saved questions</h2>
            <p className="mt-1 text-[10px] text-slate-500">Choose a subject or exam to narrow your review list.</p>
          </div>
          <Badge variant="primary" className="gap-1.5"><Filter size={12} /> {savedIds.length} saved</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <FilterSelect
            label="Exam"
            value={exam}
            options={["All exams", ...examOptions]}
            onChange={(value) => {
              setExam(value as BookmarkExamFilter);
              setSubject("All subjects");
              setChapter("All chapters");
            }}
          />
          <FilterSelect
            label="Subject"
            value={subject}
            options={subjectOptions}
            onChange={(value) => {
              setSubject(value);
              setChapter("All chapters");
            }}
          />
          <FilterSelect label="Chapter" value={chapter} options={chapterOptions} onChange={setChapter} />
          <FilterSelect
            label="Difficulty"
            value={difficulty}
            options={["All difficulties", "Basic", "Medium", "Advanced"]}
            onChange={setDifficulty}
          />
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">
          Showing <span className="font-semibold text-[#142344]">{visibleQuestions.length}</span> saved questions
        </p>
        <Badge variant="outline" className="gap-1.5"><Bookmark size={12} /> Stored locally for this preview</Badge>
      </div>

      {visibleQuestions.length ? (
        <div className="grid gap-3">
          {visibleQuestions.map((question, index) => {
            const isExpanded = expandedId === question.id;
            return (
              <motion.div
                key={question.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                          <Bookmark size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap gap-1.5">
                            <Badge variant="primary">{question.exam}</Badge>
                            <Badge variant="outline">{question.subject}</Badge>
                            <Badge variant="outline">{question.difficulty}</Badge>
                          </div>
                          <h2 className="text-sm font-semibold leading-6 text-[#142344]">{question.prompt}</h2>
                          <p className="mt-1 text-[10px] text-slate-400">{question.chapter} · {question.topic}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        aria-label={`Remove bookmark for ${question.chapter}`}
                        onClick={() => removeBookmark(question.id)}
                      >
                        <X size={14} /> <span className="hidden sm:inline">Remove</span>
                      </Button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <span className="text-[9px] text-slate-400">Saved question {index + 1}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        aria-expanded={isExpanded}
                        onClick={() => setExpandedId(isExpanded ? null : question.id)}
                      >
                        {isExpanded ? "Hide details" : "View answer & explanation"}
                        <ArrowRight size={13} />
                      </Button>
                    </div>
                    <AnimatePresence initial={false}>
                      {isExpanded ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 grid gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                            <div>
                              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-emerald-700">Correct answer</p>
                              <p className="mt-1 text-xs font-semibold text-emerald-900">
                                {["A", "B", "C", "D"][question.correctIndex]}. {question.options[question.correctIndex]}
                              </p>
                              <p className="mt-2 text-[11px] leading-5 text-slate-600">{question.explanation}</p>
                            </div>
                            <CheckCircle2 size={17} className="hidden text-emerald-600 sm:block" />
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title={savedIds.length ? "No saved questions match these filters" : "Your bookmarks are empty"}
          message={savedIds.length ? "Try changing a filter to see more saved questions." : "Save questions during practice and they will appear here."}
        />
      )}
    </div>
  );
}

type MistakeExamFilter = "All exams" | ExamName;
type RetryFeedback = "correct" | "incorrect" | null;

function MistakesPage() {
  const [exam, setExam] = useState<MistakeExamFilter>("All exams");
  const [subject, setSubject] = useState("All subjects");
  const [chapter, setChapter] = useState("All chapters");
  const [activeRetryId, setActiveRetryId] = useState<string | null>(null);
  const [retrySelection, setRetrySelection] = useState<Record<string, number | null>>({});
  const [retryFeedback, setRetryFeedback] = useState<Record<string, RetryFeedback>>({});
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const [retryResults, setRetryResults] = useState<boolean[]>([]);

  const subjectOptions = useMemo(
    () => ["All subjects", ...new Set(sampleMistakes
      .filter((mistake) => exam === "All exams" || mistake.question.exam === exam)
      .map((mistake) => mistake.question.subject))],
    [exam],
  );
  const chapterOptions = useMemo(
    () => ["All chapters", ...new Set(sampleMistakes
      .filter((mistake) => (exam === "All exams" || mistake.question.exam === exam)
        && (subject === "All subjects" || mistake.question.subject === subject))
      .map((mistake) => mistake.question.chapter))],
    [exam, subject],
  );
  const visibleMistakes = sampleMistakes.filter((mistake) =>
    (exam === "All exams" || mistake.question.exam === exam)
      && (subject === "All subjects" || mistake.question.subject === subject)
      && (chapter === "All chapters" || mistake.question.chapter === chapter),
  );
  const initialWrongCount = sampleMistakes.length;
  const retryAccuracy = retryResults.length
    ? getAccuracy(retryResults.filter(Boolean).length, retryResults.length)
    : 0;

  function openRetry(id: string) {
    setActiveRetryId((current) => (current === id ? null : id));
    setReviewedIds((current) => current.includes(id) ? current : [...current, id]);
    setRetrySelection((current) => ({ ...current, [id]: null }));
    setRetryFeedback((current) => ({ ...current, [id]: null }));
  }

  function submitRetry(id: string, question: PracticeQuestion) {
    const selected = retrySelection[id];
    if (selected === null || selected === undefined) return;
    const correct = selected === question.correctIndex;
    setRetryFeedback((current) => ({ ...current, [id]: correct ? "correct" : "incorrect" }));
    setRetryResults((current) => [...current, correct]);
    if (correct) {
      setResolvedIds((current) => current.includes(id) ? current : [...current, id]);
    }
  }

  function tryAgain(id: string) {
    setRetrySelection((current) => ({ ...current, [id]: null }));
    setRetryFeedback((current) => ({ ...current, [id]: null }));
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <AnimatedStatCard
          label="Questions to review"
          value={initialWrongCount}
          icon={CircleAlert}
          note="Sample incorrect attempts"
          tone="bg-rose-50 text-rose-600"
        />
        <AnimatedStatCard
          label="Reviewed"
          value={reviewedIds.length}
          icon={BookOpenCheck}
          note="Opened for another attempt"
          tone="bg-indigo-50 text-indigo-600"
          delay={0.05}
        />
        <AnimatedStatCard
          label="Retry accuracy"
          value={retryAccuracy}
          suffix="%"
          icon={Target}
          note={retryResults.length ? `${retryResults.filter(Boolean).length} correct retry answers` : "Try a question to start tracking"}
          tone="bg-emerald-50 text-emerald-600"
          delay={0.1}
        />
      </div>

      <Card className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-[#142344]">Filter your notebook</h2>
            <p className="mt-1 text-[10px] text-slate-500">Find mistakes by exam, subject, and chapter.</p>
          </div>
          <Badge variant="warning" className="gap-1.5"><NotebookPen size={12} /> Sample attempts</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <FilterSelect
            label="Exam"
            value={exam}
            options={["All exams", ...examOptions]}
            onChange={(value) => {
              setExam(value as MistakeExamFilter);
              setSubject("All subjects");
              setChapter("All chapters");
            }}
          />
          <FilterSelect
            label="Subject"
            value={subject}
            options={subjectOptions}
            onChange={(value) => {
              setSubject(value);
              setChapter("All chapters");
            }}
          />
          <FilterSelect label="Chapter" value={chapter} options={chapterOptions} onChange={setChapter} />
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-[#142344]">Questions to revisit</h2>
          <p className="mt-1 text-[10px] text-slate-500">{visibleMistakes.length} matching sample attempts</p>
        </div>
        <Badge variant="outline" className="gap-1.5"><Sparkles size={12} /> Improve one question at a time</Badge>
      </div>

      {visibleMistakes.length ? (
        <div className="grid gap-3">
          {visibleMistakes.map((mistake) => {
            const { question } = mistake;
            const retrying = activeRetryId === mistake.id;
            const feedback = retryFeedback[mistake.id] ?? null;
            const selection = retrySelection[mistake.id] ?? null;
            const resolved = resolvedIds.includes(mistake.id);
            return (
              <motion.div key={mistake.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card className={`overflow-hidden transition-shadow hover:shadow-lg ${resolved ? "border-emerald-200" : ""}`}>
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                          resolved ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        }`}>
                          {resolved ? <CheckCircle2 size={16} /> : <CircleAlert size={16} />}
                        </span>
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap gap-1.5">
                            <Badge variant="primary">{question.exam}</Badge>
                            <Badge variant="outline">{question.subject}</Badge>
                            <Badge variant="outline">{question.chapter}</Badge>
                          </div>
                          <h3 className="text-sm font-semibold leading-6 text-[#142344]">{question.prompt}</h3>
                          <p className="mt-1 text-[9px] text-slate-400">{question.topic} · Sample attempt {mistake.date}</p>
                        </div>
                      </div>
                      <Badge variant={resolved ? "success" : "danger"}>
                        {resolved ? "Improved on retry" : "Review"}
                      </Badge>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-rose-600">Your original answer</p>
                        <p className="mt-1 text-xs font-medium text-rose-900">
                          {["A", "B", "C", "D"][mistake.selectedIndex]}. {question.options[mistake.selectedIndex]}
                        </p>
                      </div>
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-emerald-700">Correct answer</p>
                        <p className="mt-1 text-xs font-medium text-emerald-900">
                          {["A", "B", "C", "D"][question.correctIndex]}. {question.options[question.correctIndex]}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 rounded-xl bg-slate-50 p-3">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500">Explanation</p>
                      <p className="mt-1 text-[11px] leading-5 text-slate-600">{question.explanation}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <span className="text-[9px] text-slate-400">
                        {reviewedIds.includes(mistake.id) ? "Added to your review activity" : "Revisit this concept at your pace"}
                      </span>
                      <Button
                        variant={resolved ? "outline" : "primary"}
                        size="sm"
                        aria-expanded={retrying}
                        onClick={() => openRetry(mistake.id)}
                      >
                        {retrying ? "Close retry" : resolved ? "Practice Again" : "Retry Question"}
                        <ArrowRight size={13} />
                      </Button>
                    </div>

                    <AnimatePresence initial={false}>
                      {retrying ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 border-t border-slate-100 pt-4">
                            <p className="text-xs font-semibold text-[#142344]">Try the question again</p>
                            <div className="mt-3 grid gap-2">
                              {question.options.map((option, index) => {
                                const selected = selection === index;
                                const correctOption = question.correctIndex === index;
                                const style = feedback
                                  ? correctOption
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                                    : selected
                                      ? "border-rose-300 bg-rose-50 text-rose-900"
                                      : "border-slate-200 bg-white text-slate-500"
                                  : selected
                                    ? "border-indigo-300 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-100"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200";
                                return (
                                  <button
                                    key={`${mistake.id}-${option}`}
                                    type="button"
                                    disabled={feedback !== null}
                                    aria-pressed={selected}
                                    onClick={() => setRetrySelection((current) => ({ ...current, [mistake.id]: index }))}
                                    className={`flex min-h-10 items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs transition ${style} disabled:cursor-default`}
                                  >
                                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-slate-100 text-[9px] font-bold text-slate-500">
                                      {["A", "B", "C", "D"][index]}
                                    </span>
                                    <span className="flex-1">{option}</span>
                                    {feedback && correctOption ? <Check size={14} className="text-emerald-600" /> : null}
                                  </button>
                                );
                              })}
                            </div>
                            {feedback ? (
                              <p className={`mt-3 rounded-xl px-3 py-2 text-[11px] font-medium ${
                                feedback === "correct" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                              }`} role="status">
                                {feedback === "correct" ? "Correct — this question is marked as improved." : "Not quite. Review the explanation above, then try again."}
                              </p>
                            ) : null}
                            <div className="mt-3 flex flex-wrap justify-end gap-2">
                              {feedback === "incorrect" ? (
                                <Button variant="outline" size="sm" onClick={() => tryAgain(mistake.id)}>
                                  Try again
                                </Button>
                              ) : null}
                              {feedback === null ? (
                                <Button
                                  size="sm"
                                  disabled={selection === null}
                                  onClick={() => submitRetry(mistake.id, question)}
                                >
                                  Check answer <ArrowRight size={13} />
                                </Button>
                              ) : null}
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={NotebookPen}
          title="No mistakes match these filters"
          message="Try another exam, subject, or chapter to find a question to review."
        />
      )}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  message,
}: {
  icon: typeof Bookmark;
  title: string;
  message: string;
}) {
  return (
    <Card className="grid place-items-center px-5 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><Icon size={20} /></span>
      <h2 className="mt-4 text-sm font-semibold text-[#142344]">{title}</h2>
      <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-500">{message}</p>
    </Card>
  );
}

export function StudentInsights({ page }: { page: InsightsPageKey }) {
  const [selectedExam, setSelectedExam] = useState<ExamName>("NEET");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const details = pageDetails[page];

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#142344]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <InsightsSidebar page={page} />
      </aside>
      <AnimatePresence>
        {mobileSidebarOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close student navigation"
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
              <InsightsSidebar page={page} mobile onClose={() => setMobileSidebarOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
      <div className="min-h-screen lg:pl-[252px]">
        <PageHeader
          page={page}
          onOpenMenu={() => setMobileSidebarOpen(true)}
          selectedExam={selectedExam}
          onSelectExam={setSelectedExam}
        />
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto w-full min-w-0 max-w-[1600px] px-4 pb-12 pt-5 sm:px-6 sm:pt-7 lg:px-8"
        >
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Link href="/dashboard" className="transition hover:text-indigo-600">Dashboard</Link>
                <span>/</span><span className="text-indigo-600">{details.title}</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-3xl">{details.title}</h1>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">{details.description}</p>
            </div>
            {(page === "performance" || page === "leaderboard") ? (
              <Badge variant="outline" className="self-start gap-1.5 sm:self-auto">
                <GraduationCap size={13} /> {selectedExam} sample report
              </Badge>
            ) : null}
          </div>

          <AnimatePresence mode="wait">
            <motion.section
              key={page}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
            >
              {page === "performance" ? <PerformancePage exam={selectedExam} /> : null}
              {page === "leaderboard" ? (
                <LeaderboardPage exam={selectedExam} onSelectExam={setSelectedExam} />
              ) : null}
              {page === "bookmarks" ? <BookmarksPage /> : null}
              {page === "mistakes" ? <MistakesPage /> : null}
            </motion.section>
          </AnimatePresence>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4 text-[10px] text-slate-400">
            <span>Sample student workspace · No account data or backend connection.</span>
            <Link href="/dashboard" className="inline-flex items-center gap-1 font-medium text-slate-500 hover:text-indigo-600">
              Back to dashboard <ArrowRight size={12} />
            </Link>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
