"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useId } from "react";
import {
  AnimatedStatCard,
} from "@/components/dashboard/dashboard-widgets";
import {
  analyticsRanges,
  getAnalyticsSeries,
  getExamAnalyticsSummary,
  getLeaderboardEntries,
  getPerExamSummaries,
  leaderboardPeriods,
  trackedExams,
} from "@/components/admin/analytics-data";
import type {
  AnalyticsExam,
  AnalyticsRange,
  LeaderboardPeriod,
  TrackedExam,
} from "@/components/admin/analytics-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type TrendPoint = { label: string; value: number };
type TrendChartProps = {
  title: string;
  points: TrendPoint[];
  formatValue: (value: number) => string;
  color?: string;
  fillColor?: string;
  maxValue?: number;
};

const navigationItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Analytics & leaderboard", href: "/admin/analytics", icon: BarChart3, active: true },
  { label: "Student management", href: "/admin/students", icon: Users },
  { label: "Teacher management", href: "/admin/teachers", icon: UserRound },
  { label: "Exam management", href: "/admin/exams", icon: GraduationCap },
];

const chartColors: Record<TrackedExam, { line: string; soft: string; bar: string }> = {
  KCET: { line: "#4f46e5", soft: "#eef2ff", bar: "bg-indigo-500" },
  NEET: { line: "#0f9f78", soft: "#ecfdf5", bar: "bg-emerald-500" },
  "JEE Main": { line: "#0284c7", soft: "#f0f9ff", bar: "bg-sky-500" },
};

const rankStyles = [
  "bg-amber-100 text-amber-700 ring-amber-200",
  "bg-slate-100 text-slate-600 ring-slate-200",
  "bg-orange-100 text-orange-700 ring-orange-200",
];

function formatCompact(value: number) {
  return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
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
            Sample analytics · no live student data.
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

function AnalyticsHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
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
          <p className="mt-0.5 truncate text-sm font-semibold text-[#142344]">Analytics &amp; Leaderboard</p>
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

function FilterSelect<Value extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: Value;
  options: Array<{ value: Value; label: string }>;
  onChange: (value: Value) => void;
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-[10px] font-semibold text-slate-500">{label}</span>
      <span className="relative">
        <select
          aria-label={label}
          value={value}
          onChange={(event) => {
            const option = options.find((item) => String(item.value) === event.target.value);
            if (option) onChange(option.value);
          }}
          className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </span>
    </label>
  );
}

function TrendChart({
  title,
  points,
  formatValue,
  color = "#4f46e5",
  fillColor = "#e0e7ff",
  maxValue,
}: TrendChartProps) {
  const gradientId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const width = 720;
  const height = 254;
  const left = 58;
  const right = 704;
  const top = 18;
  const bottom = 210;
  const highest = maxValue ?? Math.max(1, ...points.map((point) => point.value));
  const upperBound = maxValue ?? highest * 1.12;
  const usableWidth = right - left;
  const usableHeight = bottom - top;
  const coordinates = points.map((point, index) => ({
    ...point,
    x: points.length <= 1 ? left + usableWidth / 2 : left + (index * usableWidth) / (points.length - 1),
    y: bottom - (point.value / upperBound) * usableHeight,
  }));
  const linePath = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = coordinates.length
    ? `${linePath} L ${coordinates[coordinates.length - 1].x} ${bottom} L ${coordinates[0].x} ${bottom} Z`
    : "";
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="relative mt-5 min-w-0">
      {points.length === 0 ? (
        <div className="grid h-56 place-items-center rounded-xl bg-slate-50 text-sm text-slate-500">
          No chart data is available for this selection.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="h-56 min-w-[560px] w-full overflow-visible"
            role="group"
            aria-label={`${title} trend chart`}
          >
            <defs>
              <linearGradient id={`fill-${gradientId}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={fillColor} stopOpacity="0.9" />
                <stop offset="100%" stopColor={fillColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            {ticks.map((tick) => {
              const y = bottom - tick * usableHeight;
              return (
                <g key={tick}>
                  <line x1={left} x2={right} y1={y} y2={y} stroke="#e9edf5" strokeDasharray="3 5" />
                  <text x="0" y={y + 3} fill="#94a3b8" fontSize="10">{formatValue(upperBound * tick)}</text>
                </g>
              );
            })}
            <path d={areaPath} fill={`url(#fill-${gradientId})`} />
            <motion.path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
            {coordinates.map((point) => (
              <g key={point.label} className="group/point">
                <title>{point.label}: {formatValue(point.value)}</title>
                <circle cx={point.x} cy={point.y} r="12" fill="transparent" />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4.5"
                  fill="white"
                  stroke={color}
                  strokeWidth="2.5"
                  tabIndex={0}
                  aria-label={`${point.label}: ${formatValue(point.value)}`}
                  className="cursor-crosshair transition-[r] hover:[r:6] focus:[r:6]"
                />
              </g>
            ))}
            {coordinates.map((point) => (
              <text key={`label-${point.label}`} x={point.x} y={bottom + 20} textAnchor="middle" fill="#94a3b8" fontSize="9">
                {point.label}
              </text>
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  subtitle: string;
  icon: typeof Activity;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`min-w-0 p-4 sm:p-5 ${className}`}>
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><Icon size={17} /></span>
        <div>
          <h2 className="text-sm font-bold text-[#142344]">{title}</h2>
          <p className="mt-1 text-[10px] leading-4 text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}

function ComparisonBarChart({
  points,
}: {
  points: Array<{ label: string; correct: number; incorrect: number }>;
}) {
  const width = 760;
  const height = 254;
  const left = 54;
  const right = 746;
  const top = 16;
  const bottom = 208;
  const maximum = Math.max(1, ...points.flatMap((point) => [point.correct, point.incorrect]));
  const upperBound = maximum * 1.16;
  const groupWidth = points.length ? (right - left) / points.length : 0;
  const barWidth = Math.min(13, groupWidth * 0.27);

  return (
    <div className="mt-5 overflow-x-auto">
      {points.length === 0 ? (
        <div className="grid h-56 min-w-[560px] place-items-center rounded-xl bg-slate-50 text-sm text-slate-500">
          No answer data is available for this selection.
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="h-56 min-w-[560px] w-full"
          role="img"
          aria-label="Correct and incorrect answers by month"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = bottom - tick * (bottom - top);
            return (
              <g key={tick}>
                <line x1={left} x2={right} y1={y} y2={y} stroke="#e9edf5" strokeDasharray="3 5" />
                <text x="0" y={y + 3} fill="#94a3b8" fontSize="10">{formatCompact(upperBound * tick)}</text>
              </g>
            );
          })}
          {points.map((point, index) => {
            const x = left + index * groupWidth + groupWidth / 2;
            const correctHeight = (point.correct / upperBound) * (bottom - top);
            const incorrectHeight = (point.incorrect / upperBound) * (bottom - top);
            return (
              <g key={point.label}>
                <rect
                  x={x - barWidth - 1}
                  y={bottom - correctHeight}
                  width={barWidth}
                  height={correctHeight}
                  rx="4"
                  fill="#10b981"
                >
                  <title>{point.label}: {formatCompact(point.correct)} correct</title>
                </rect>
                <rect
                  x={x + 1}
                  y={bottom - incorrectHeight}
                  width={barWidth}
                  height={incorrectHeight}
                  rx="4"
                  fill="#fb7185"
                >
                  <title>{point.label}: {formatCompact(point.incorrect)} incorrect</title>
                </rect>
                <text x={x} y={bottom + 20} textAnchor="middle" fill="#94a3b8" fontSize="9">{point.label}</text>
              </g>
            );
          })}
        </svg>
      )}
      <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-slate-500">
        <span className="inline-flex items-center gap-1.5"><i className="size-2 rounded-sm bg-emerald-500" />Correct</span>
        <span className="inline-flex items-center gap-1.5"><i className="size-2 rounded-sm bg-rose-400" />Incorrect</span>
      </div>
    </div>
  );
}

function ParticipationChart({
  summaries,
  selectedExam,
  onSelectExam,
}: {
  summaries: ReturnType<typeof getPerExamSummaries>;
  selectedExam: AnalyticsExam;
  onSelectExam: (exam: AnalyticsExam) => void;
}) {
  const maximum = Math.max(1, ...trackedExams.map((exam) => summaries[exam].students));

  return (
    <div className="mt-5 space-y-4">
      {trackedExams.map((exam) => {
        const summary = summaries[exam];
        const selected = selectedExam === exam;
        const width = Math.max(2, (summary.students / maximum) * 100);
        return (
          <button
            key={exam}
            type="button"
            aria-pressed={selected}
            aria-label={`Filter analytics by ${exam}`}
            onClick={() => onSelectExam(selected ? "All exams" : exam)}
            className={`block w-full rounded-xl p-2 text-left transition hover:bg-slate-50 focus-visible:outline-indigo-500 ${
              selected ? "bg-indigo-50/70 ring-1 ring-indigo-100" : ""
            }`}
          >
            <span className="mb-2 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-xs font-semibold text-[#142344]">
                <i className={`size-2.5 rounded-full ${chartColors[exam].bar}`} />{exam}
              </span>
              <span className="text-[10px] text-slate-500">{summary.students.toLocaleString()} students · {summary.challengeRate}% challenge completion</span>
            </span>
            <span className="block h-2.5 overflow-hidden rounded-full bg-slate-100">
              <motion.span
                className={`block h-full rounded-full ${chartColors[exam].bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              />
            </span>
          </button>
        );
      })}
      <p className="px-2 text-[10px] text-slate-400">Select an exam bar to filter analytics. Select it again to clear.</p>
    </div>
  );
}

function ExamAnalyticsCard({
  exam,
  summary,
  selected,
  onSelect,
}: {
  exam: TrackedExam;
  summary: ReturnType<typeof getPerExamSummaries>[TrackedExam];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      whileHover={{ y: -2 }}
      className={`rounded-2xl border bg-white p-4 text-left shadow-[0_8px_24px_rgba(22,37,71,0.05)] transition sm:p-5 ${
        selected ? "border-indigo-300 ring-2 ring-indigo-100" : "border-slate-200 hover:border-indigo-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`grid size-9 place-items-center rounded-xl ${chartColors[exam].soft}`} style={{ color: chartColors[exam].line }}>
            <GraduationCap size={17} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#142344]">{exam}</h3>
            <p className="mt-0.5 text-[10px] text-slate-400">Exam performance</p>
          </div>
        </div>
        <ArrowUpRight size={15} className="text-slate-400" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        <div>
          <p className="text-[10px] text-slate-400">Total students</p>
          <p className="mt-1 text-base font-bold text-[#142344]">{summary.students.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400">Questions attempted</p>
          <p className="mt-1 text-base font-bold text-[#142344]">{formatCompact(summary.questions)}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400">Correct / incorrect</p>
          <p className="mt-1 text-xs font-semibold text-[#142344]">
            <span className="text-emerald-700">{formatCompact(summary.correct)}</span>
            <span className="mx-1 text-slate-300">/</span>
            <span className="text-rose-600">{formatCompact(summary.incorrect)}</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400">Average accuracy</p>
          <p className="mt-1 text-base font-bold text-indigo-700">{summary.accuracy}%</p>
        </div>
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] text-slate-400">Daily challenge participation</p>
          <p className="text-[10px] font-semibold text-[#142344]">{summary.challengeParticipants.toLocaleString()} <span className="font-normal text-slate-400">({summary.challengeRate}%)</span></p>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full ${chartColors[exam].bar}`} style={{ width: `${summary.challengeRate}%` }} />
        </div>
      </div>
    </motion.button>
  );
}

function Leaderboard({
  exam,
  period,
  onSelectExam,
  onSelectPeriod,
}: {
  exam: AnalyticsExam;
  period: LeaderboardPeriod;
  onSelectExam: (exam: AnalyticsExam) => void;
  onSelectPeriod: (period: LeaderboardPeriod) => void;
}) {
  const entries = useMemo(() => getLeaderboardEntries(exam, period), [exam, period]);
  const [first, second, third] = entries.slice(0, 3);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600"><Trophy size={17} /></span>
            <div>
              <h2 className="text-base font-bold text-[#142344]">Student leaderboard</h2>
              <p className="mt-0.5 text-[10px] text-slate-500">Sample rankings by questions attempted and accuracy.</p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[460px]">
          <FilterSelect
            label="Leaderboard exam"
            value={exam}
            options={[
              { value: "All exams", label: "All exams" },
              ...trackedExams.map((item) => ({ value: item, label: item })),
            ]}
            onChange={onSelectExam}
          />
          <FilterSelect
            label="Leaderboard period"
            value={period}
            options={leaderboardPeriods.map((item) => ({ value: item, label: item }))}
            onChange={onSelectPeriod}
          />
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="grid place-items-center px-5 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500"><Trophy size={20} /></span>
          <h3 className="mt-4 text-sm font-bold text-[#142344]">No leaderboard results</h3>
          <p className="mt-1 text-xs text-slate-500">There are no sample results for this exam and period.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 bg-gradient-to-br from-[#f8faff] to-white p-4 sm:grid-cols-3 sm:p-5">
            {[second, first, third].map((entry, index) => {
              if (!entry) return null;
              const place = entry.rank;
              return (
                <motion.div
                  key={`${entry.name}-${entry.exam}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className={`relative rounded-2xl border bg-white p-4 text-center shadow-sm ${
                    place === 1 ? "border-amber-200 sm:-mt-2 sm:pb-6" : "border-slate-200 sm:mt-3"
                  }`}
                >
                  <span className={`mx-auto grid size-9 place-items-center rounded-full ring-1 ${rankStyles[place - 1]}`}>
                    {place === 1 ? <Trophy size={16} /> : <span className="text-xs font-bold">#{place}</span>}
                  </span>
                  <p className="mt-2 truncate text-sm font-bold text-[#142344]">{entry.name}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{entry.exam}</p>
                  <div className="mt-3 flex items-center justify-center gap-3 text-[10px]">
                    <span className="font-semibold text-indigo-700">{entry.questions.toLocaleString()} Q</span>
                    <span className="font-semibold text-emerald-700">{entry.accuracy}% accuracy</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Rank</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Student</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Exam</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Questions attempted</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Correct answers</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Accuracy</th>
                  <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Challenge streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry) => (
                  <tr key={`${entry.exam}-${entry.name}`} className="transition-colors hover:bg-indigo-50/30">
                    <td className="px-5 py-3">
                      <span className={`grid size-7 place-items-center rounded-full text-[10px] font-bold ${entry.rank <= 3 ? rankStyles[entry.rank - 1] : "bg-slate-50 text-slate-500"}`}>#{entry.rank}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 place-items-center rounded-lg bg-indigo-50 text-[9px] font-bold text-indigo-700">
                          {entry.name.split(" ").map((part) => part[0]).join("")}
                        </span>
                        <span className="text-xs font-semibold text-[#142344]">{entry.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant="outline">{entry.exam}</Badge></td>
                    <td className="px-4 py-3 text-right text-xs font-semibold text-[#142344]">{entry.questions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-xs font-medium text-emerald-700">{entry.correct.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">{entry.accuracy}%</span></td>
                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex items-center justify-end gap-1 text-xs font-semibold text-amber-700">
                        <Flame size={13} />{entry.streak} day{entry.streak === 1 ? "" : "s"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-slate-100 md:hidden">
            {entries.map((entry) => (
              <div key={`${entry.exam}-${entry.name}`} className="flex items-start gap-3 p-4">
                <span className={`grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-bold ${entry.rank <= 3 ? rankStyles[entry.rank - 1] : "bg-slate-50 text-slate-500"}`}>#{entry.rank}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-semibold text-[#142344]">{entry.name}</p>
                    <Badge variant="outline">{entry.exam}</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-500">
                    <span>{entry.questions.toLocaleString()} questions</span>
                    <span>{entry.correct.toLocaleString()} correct</span>
                    <span className="font-semibold text-emerald-700">{entry.accuracy}% accuracy</span>
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      <Flame size={11} />{entry.streak} day{entry.streak === 1 ? "" : "s"} streak
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex flex-col gap-1 border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <span>Rankings are illustrative and based on generated sample data.</span>
        <span className="inline-flex items-center gap-1"><Sparkles size={12} />Friendly competition, sample only</span>
      </div>
    </Card>
  );
}

function ChartsSkeleton() {
  return (
    <div role="status" aria-label="Loading analytics charts" className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 4 }, (_, index) => (
        <Card key={index} className="space-y-4 p-5">
          <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-56 animate-pulse rounded bg-slate-100" />
          <div className="h-52 animate-pulse rounded-xl bg-slate-50" />
        </Card>
      ))}
      <span className="sr-only">Loading sample analytics…</span>
    </div>
  );
}

export function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<AnalyticsRange>(12);
  const [exam, setExam] = useState<AnalyticsExam>("All exams");
  const [leaderboardExam, setLeaderboardExam] = useState<AnalyticsExam>("All exams");
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<LeaderboardPeriod>("Weekly");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 480);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileMenuOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const summary = useMemo(() => getExamAnalyticsSummary(exam, range), [exam, range]);
  const perExamSummaries = useMemo(() => getPerExamSummaries(range), [range]);
  const series = useMemo(() => getAnalyticsSeries(exam, range), [exam, range]);
  const registrationsPoints = series.map((point) => ({ label: point.label, value: point.registrations }));
  const questionsPoints = series.map((point) => ({ label: point.label, value: point.questions }));
  const challengePoints = series.map((point) => ({ label: point.label, value: point.challengeRate }));
  const questionAnswerPoints = series.map((point) => ({
    label: point.label,
    correct: point.correct,
    incorrect: point.questions - point.correct,
  }));
  const overviewStats = [
    { label: "Total registered students", value: summary.students, note: "Registrations in selected period", icon: Users, tone: "bg-indigo-50 text-indigo-600" },
    { label: "Questions attempted", value: summary.questions, note: `${exam === "All exams" ? "Across all exams" : exam} · selected period`, icon: Target, tone: "bg-sky-50 text-sky-600" },
    { label: "Overall accuracy", value: summary.accuracy, suffix: "%", note: `${summary.correct.toLocaleString()} correct answers`, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Challenge completion rate", value: summary.challengeRate, suffix: "%", note: `${summary.challengeParticipants.toLocaleString()} participants in sample`, icon: CalendarDays, tone: "bg-amber-50 text-amber-600" },
    { label: "Active students", value: summary.activeStudents, note: "Estimated in sample period", icon: Activity, tone: "bg-violet-50 text-violet-600" },
  ];

  function resetFilters() {
    setRange(12);
    setExam("All exams");
    setLeaderboardExam("All exams");
    setLeaderboardPeriod("Weekly");
    setNotice(null);
  }

  function exportReport() {
    const leaderboard = getLeaderboardEntries(leaderboardExam, leaderboardPeriod);
    const rows = [
      ["Northstar Admin Analytics · Illustrative sample data"],
      ["Date range", analyticsRanges.find((item) => item.value === range)?.label ?? ""],
      ["Exam filter", exam],
      [],
      ["Overview metric", "Sample value"],
      ["Registered students", summary.students],
      ["Questions attempted", summary.questions],
      ["Correct answers", summary.correct],
      ["Incorrect answers", summary.incorrect],
      ["Overall accuracy", `${summary.accuracy}%`],
      ["Daily challenge completion rate", `${summary.challengeRate}%`],
      ["Active students (estimated)", summary.activeStudents],
      [],
      ["Rank", "Student", "Exam", "Questions attempted", "Correct answers", "Accuracy", "Challenge streak"],
      ...leaderboard.map((entry) => [
        entry.rank,
        entry.name,
        entry.exam,
        entry.questions,
        entry.correct,
        `${entry.accuracy}%`,
        `${entry.streak} days`,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => {
          const value = String(cell ?? "");
          return `"${value.replace(/"/g, '""')}"`;
        }).join(","),
      )
      .join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "northstar-admin-analytics-sample.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setNotice("Sample analytics report exported. This file contains illustrative data only.");
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
        <AnalyticsHeader onOpenMenu={() => setMobileMenuOpen(true)} />
        <main className="mx-auto max-w-[1600px] px-4 pb-10 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
              <div className="max-w-2xl">
                <div className="mb-2 flex items-center gap-2 text-[11px] text-slate-400">
                  <Link href="/admin" className="transition hover:text-indigo-600">Admin dashboard</Link>
                  <span aria-hidden="true">/</span>
                  <span aria-current="page" className="text-indigo-600">Analytics &amp; Leaderboard</span>
                </div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/70 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">
                  <BarChart3 size={12} /> PLATFORM INSIGHTS
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#142344] sm:text-[30px]">Analytics &amp; Leaderboard</h1>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  Explore learning trends, exam performance, and friendly sample rankings.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
                <FilterSelect
                  label="Date range"
                  value={range}
                  options={analyticsRanges.map((item) => ({ value: item.value, label: item.label }))}
                  onChange={setRange}
                />
                <FilterSelect
                  label="Analytics exam"
                  value={exam}
                  options={[
                    { value: "All exams", label: "All exams" },
                    ...trackedExams.map((item) => ({ value: item, label: item })),
                  ]}
                  onChange={setExam}
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetFilters}><RotateCcw size={14} /> Reset filters</Button>
                  <Button size="sm" onClick={exportReport}><ArrowDownToLine size={14} /> Export report</Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3.5 py-3 text-xs leading-5 text-indigo-900">
              <Sparkles size={15} className="mt-0.5 shrink-0 text-indigo-600" />
              <p><strong className="font-semibold">Illustrative sample analytics.</strong> These generated figures are for UI demonstration only and do not represent real student results.</p>
            </div>

            <AnimatePresence>
              {notice ? (
                <motion.div
                  role="status"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800"
                >
                  <span className="flex items-center gap-2"><CheckCircle2 size={15} />{notice}</span>
                  <button type="button" aria-label="Dismiss message" onClick={() => setNotice(null)} className="rounded-md p-1 hover:bg-emerald-100">
                    <X size={14} />
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {loading ? (
              <div role="status" aria-label="Loading analytics overview" className="grid grid-cols-2 gap-3 xl:grid-cols-5 xl:gap-4">
                {Array.from({ length: 5 }, (_, index) => (
                  <Card key={index} className="space-y-4 p-5">
                    <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
                    <div className="h-8 w-20 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-36 animate-pulse rounded bg-slate-100" />
                  </Card>
                ))}
              </div>
            ) : (
              <section aria-label="Analytics overview statistics" className="grid grid-cols-2 gap-3 xl:grid-cols-5 xl:gap-4">
                {overviewStats.map((stat, index) => (
                  <AnimatedStatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    suffix={"suffix" in stat ? stat.suffix : undefined}
                    note={stat.note}
                    icon={stat.icon}
                    tone={stat.tone}
                    delay={index * 0.05}
                  />
                ))}
              </section>
            )}

            <section aria-labelledby="exam-analytics-title" className="space-y-3">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 id="exam-analytics-title" className="text-base font-bold text-[#142344]">Exam-wise analytics</h2>
                  <p className="mt-1 text-xs text-slate-500">Engagement and accuracy across each examination.</p>
                </div>
                <Badge variant="outline">{analyticsRanges.find((item) => item.value === range)?.label} · Sample</Badge>
              </div>
              <div className="grid gap-3 lg:grid-cols-3">
                {loading
                  ? trackedExams.map((item) => (
                      <Card key={item} className="space-y-4 p-5">
                        <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                        <div className="h-28 animate-pulse rounded-xl bg-slate-50" />
                      </Card>
                    ))
                  : trackedExams.map((item) => (
                      <ExamAnalyticsCard
                        key={item}
                        exam={item}
                        summary={perExamSummaries[item]}
                        selected={exam === item}
                        onSelect={() => setExam(exam === item ? "All exams" : item)}
                      />
                    ))}
              </div>
            </section>

            {loading ? (
              <ChartsSkeleton />
            ) : (
              <section aria-label="Performance charts" className="grid gap-4 xl:grid-cols-2">
                <ChartCard
                  title="Student registrations over time"
                  subtitle={`Monthly registrations · ${analyticsRanges.find((item) => item.value === range)?.label} · ${exam}`}
                  icon={Users}
                >
                  <TrendChart
                    title="Student registrations"
                    points={registrationsPoints}
                    formatValue={formatCompact}
                  />
                </ChartCard>
                <ChartCard
                  title="Questions attempted over time"
                  subtitle={`Practice volume by month · ${exam}`}
                  icon={Target}
                >
                  <TrendChart
                    title="Questions attempted"
                    points={questionsPoints}
                    formatValue={formatCompact}
                    color="#0284c7"
                    fillColor="#e0f2fe"
                  />
                </ChartCard>
                <ChartCard
                  title="Correct vs incorrect answers"
                  subtitle="Monthly answer outcomes across the selected range."
                  icon={CheckCircle2}
                >
                  <ComparisonBarChart points={questionAnswerPoints} />
                </ChartCard>
                <ChartCard
                  title="Exam-wise student participation"
                  subtitle={`Registered student activity · ${analyticsRanges.find((item) => item.value === range)?.label}`}
                  icon={GraduationCap}
                >
                  <ParticipationChart
                    summaries={perExamSummaries}
                    selectedExam={exam}
                    onSelectExam={setExam}
                  />
                </ChartCard>
                <ChartCard
                  title="Daily challenge completion trends"
                  subtitle={`Completion rate by month · ${exam}`}
                  icon={CalendarDays}
                  className="xl:col-span-2"
                >
                  <TrendChart
                    title="Daily challenge completion"
                    points={challengePoints}
                    formatValue={(value) => `${Math.round(value)}%`}
                    color="#10b981"
                    fillColor="#d1fae5"
                    maxValue={100}
                  />
                </ChartCard>
              </section>
            )}

            {loading ? (
              <Card className="h-80 animate-pulse bg-slate-50 p-5" role="status" aria-label="Loading leaderboard" />
            ) : (
              <Leaderboard
                exam={leaderboardExam}
                period={leaderboardPeriod}
                onSelectExam={setLeaderboardExam}
                onSelectPeriod={setLeaderboardPeriod}
              />
            )}

            <div className="flex flex-col gap-2 rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/80 via-white to-sky-50/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm"><ShieldCheck size={17} /></span>
                <div>
                  <p className="text-xs font-semibold text-[#142344]">Demo data, transparent by design</p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">Charts, rankings, and exported reports use generated example data and are not connected to a live platform.</p>
                </div>
              </div>
              <Link href="/admin" className="inline-flex items-center gap-1 self-start text-[11px] font-semibold text-indigo-700 transition hover:text-indigo-900 sm:self-center">
                Back to overview <ArrowUpRight size={13} />
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
