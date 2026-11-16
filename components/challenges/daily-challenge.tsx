"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Settings,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  challengeExams,
  dailyChallenges,
  sampleCompletedDays,
  type DailyQuestion,
} from "@/components/challenges/challenge-data";
import type { PracticeExam } from "@/components/practice/practice-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const TIME_ZONE = "Asia/Kolkata";
const DAY_MS = 24 * 60 * 60 * 1000;
const OPTION_LETTERS = ["A", "B", "C", "D"];

type Attempt = {
  selected: number | null;
  result: "correct" | "incorrect" | null;
  count: number;
};

type ChallengeSidebarProps = {
  mobile?: boolean;
  onClose?: () => void;
};

function getKolkataDate(timestamp: number) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(timestamp);
  const part = (type: string) => parts.find((value) => value.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function shiftDate(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function getDateDifference(start: string, end: string) {
  const [startYear, startMonth, startDay] = start.split("-").map(Number);
  const [endYear, endMonth, endDay] = end.split("-").map(Number);
  return Math.round(
    (Date.UTC(endYear, endMonth - 1, endDay) - Date.UTC(startYear, startMonth - 1, startDay)) / DAY_MS,
  );
}

function getDeadline(timestamp: number) {
  const today = getKolkataDate(timestamp);
  const [year, month, day] = today.split("-").map(Number);
  return Date.UTC(year, month - 1, day + 1) - (5 * 60 + 30) * 60 * 1000 - 1;
}

function getInitialCompletedDays(todayDay: number) {
  return Object.fromEntries(
    challengeExams.map((exam) => [
      exam,
      sampleCompletedDays[exam].filter((day) => day < todayDay),
    ]),
  ) as Record<PracticeExam, number[]>;
}

function calculateStreak(completedDays: number[], todayDay: number) {
  let day = completedDays.includes(todayDay) ? todayDay : todayDay - 1;
  let streak = 0;
  while (day > 0 && completedDays.includes(day)) {
    streak += 1;
    day -= 1;
  }
  return streak;
}

function formatChallengeDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const timestamp = Date.UTC(year, month - 1, day, 6, 30);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(timestamp);
}

function getCountdown(deadline: number, now: number) {
  const remaining = Math.max(0, deadline - now);
  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    isClosed: remaining <= 0,
    text: [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":"),
  };
}

function ChallengeSidebar({ mobile = false, onClose }: ChallengeSidebarProps) {
  const items = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Practice Questions", href: "/practice", icon: BookOpenCheck },
    { label: "Daily Challenge", href: "/challenges", icon: Target, active: true },
    { label: "My Performance", href: "/performance", icon: CheckCircle2 },
    { label: "Activity Calendar", href: "/dashboard#activity-calendar", icon: CalendarDays },
    { label: "Bookmarks", href: "/bookmarks", icon: Sparkles },
    { label: "Mistake Notebook", href: "/mistakes", icon: CircleAlert },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { label: "Profile", href: "/dashboard#profile", icon: UserRound },
    { label: "Settings", href: "/dashboard#settings", icon: Settings },
  ];

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
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close challenge navigation"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        ) : null}
      </div>
      <nav aria-label="Student dashboard" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Workspace
        </p>
        <div className="grid gap-1">
          {items.map((item) => {
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
                <Icon
                  size={16}
                  className={item.active ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="shrink-0 border-t border-slate-100 p-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#142344] to-[#263d70] p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">30-day journey</span>
            <Badge className="bg-white/10 text-indigo-100">Daily</Badge>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-indigo-100/70">
            One question. One good step. Every day.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2.5 px-1">
          <span className="grid size-9 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
            AS
          </span>
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

export function DailyChallenge() {
  const [now, setNow] = useState<number | null>(null);
  const [cycleStart, setCycleStart] = useState("2026-11-01");
  const [currentDay, setCurrentDay] = useState(16);
  const [selectedExam, setSelectedExam] = useState<PracticeExam>("NEET");
  const [selectedDay, setSelectedDay] = useState(16);
  const [completedDays, setCompletedDays] = useState<Record<PracticeExam, number[]>>(
    () => getInitialCompletedDays(16),
  );
  const [attempts, setAttempts] = useState<Record<PracticeExam, Record<number, Attempt>>>({
    CET: {},
    NEET: {},
    JEE: {},
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    let lastDate = "";
    let lastDay = 16;
    const updateTime = () => {
      const timestamp = Date.now();
      const today = getKolkataDate(timestamp);
      const start = shiftDate(today, -15);
      const day = Math.max(1, Math.min(30, getDateDifference(start, today) + 1));
      setNow(timestamp);
      if (today !== lastDate) {
        setCycleStart(start);
        setCurrentDay(day);
        if (lastDate) {
          setSelectedDay((current) => (current === lastDay ? day : current));
        } else {
          setSelectedDay(day);
          setCompletedDays(getInitialCompletedDays(day));
        }
        lastDate = today;
        lastDay = day;
      }
    };

    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const questions = dailyChallenges[selectedExam];
  const completed = completedDays[selectedExam];
  const streaks = useMemo(
    () => Object.fromEntries(
      challengeExams.map((exam) => [
        exam,
        calculateStreak(completedDays[exam], currentDay),
      ]),
    ) as Record<PracticeExam, number>,
    [completedDays, currentDay],
  );
  const activeQuestion: DailyQuestion = questions[selectedDay - 1];
  const attempt = attempts[selectedExam][selectedDay] ?? {
    selected: null,
    result: null,
    count: 0,
  };
  const selectedIsToday = selectedDay === currentDay;
  const selectedIsFuture = selectedDay > currentDay;
  const selectedIsComplete = completed.includes(selectedDay);
  const deadline = now === null ? 0 : getDeadline(now);
  const countdown = now === null
    ? { isClosed: false, text: "--:--:--" }
    : getCountdown(deadline, now);
  const canAnswer = selectedIsToday && !selectedIsComplete && !countdown.isClosed;
  const dayDate = cycleStart ? shiftDate(cycleStart, selectedDay - 1) : "";

  function chooseExam(exam: PracticeExam) {
    setSelectedExam(exam);
    setSelectedDay(currentDay);
  }

  function setAttempt(updates: Partial<Attempt>) {
    setAttempts((current) => ({
      ...current,
      [selectedExam]: {
        ...current[selectedExam],
        [selectedDay]: {
        ...(current[selectedExam][selectedDay] ?? {
          selected: null,
          result: null,
          count: 0,
        }),
          ...updates,
        },
      },
    }));
  }

  function submitAnswer() {
    if (!canAnswer || attempt.selected === null || attempt.result !== null) return;
    const isCorrect = attempt.selected === activeQuestion.correctIndex;
    setAttempt({
      result: isCorrect ? "correct" : "incorrect",
      count: attempt.count + 1,
    });

    if (isCorrect) {
      setCompletedDays((current) => ({
        ...current,
        [selectedExam]: current[selectedExam].includes(selectedDay)
          ? current[selectedExam]
          : [...current[selectedExam], selectedDay].sort((a, b) => a - b),
      }));
    }
  }

  function retryAnswer() {
    if (!canAnswer || attempt.result !== "incorrect") return;
    setAttempt({ selected: null, result: null });
  }

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const leadingBlanks = cycleStart
    ? (new Date(`${cycleStart}T12:00:00Z`).getUTCDay() + 6) % 7
    : 5;

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#142344]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <ChallengeSidebar />
      </aside>

      <AnimatePresence>
        {mobileSidebarOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close challenge navigation"
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
              <ChallengeSidebar mobile onClose={() => setMobileSidebarOpen(false)} />
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
              aria-label="Open challenge navigation"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu size={18} />
            </Button>
            <div className="min-w-0">
              <p className="hidden text-[10px] text-slate-400 sm:block">Student workspace</p>
              <p className="truncate text-sm font-semibold text-[#142344]">Daily Challenges</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="primary" className="hidden gap-1.5 sm:inline-flex">
                <Flame size={13} /> {selectedExam}
              </Badge>
              <div className="relative">
                <Button
                  variant="ghost"
                  className="!size-9 !min-h-9 !min-w-9 !p-0 rounded-xl sm:!size-auto sm:!min-h-11 sm:!min-w-0 sm:!px-2"
                  aria-label="Student profile menu"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((open) => !open)}
                >
                  <span className="grid size-8 place-items-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">
                    AS
                  </span>
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
                      <Link href="/dashboard#profile" className="block rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">
                        Student profile
                      </Link>
                      <Link href="/" className="block rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">
                        Public landing page
                      </Link>
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
          className="mx-auto w-full min-w-0 max-w-[1600px] px-4 pb-12 pt-5 sm:px-6 sm:pt-7 lg:px-8"
        >
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Link href="/dashboard" className="transition hover:text-indigo-600">Dashboard</Link>
                <span>/</span><span className="text-indigo-600">Daily Challenges</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-3xl">
                  Daily Challenges
                </h1>
                <Badge variant="primary">30-day streak builder</Badge>
              </div>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                One focused question each day. Build a little momentum for the exam you care about.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 sm:self-auto">
              <Clock3 size={15} className={countdown.isClosed ? "text-rose-500" : "text-indigo-600"} />
              <span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                  {countdown.isClosed ? "Today's challenge closed" : "Closes at 11:59 PM"}
                </span>
                <span
                  className="mt-0.5 block font-mono text-sm font-semibold tabular-nums text-[#142344]"
                  aria-live="off"
                  aria-label={`Time remaining: ${countdown.text}`}
                >
                  {countdown.text}
                </span>
              </span>
              <span className="ml-1 text-[9px] text-slate-400">IST</span>
            </div>
          </div>

          <section aria-label="Exam challenge progress" className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-3">
            {challengeExams.map((exam, index) => {
              const isSelected = selectedExam === exam;
              const examCompleted = completedDays[exam].length;
              const examProgress = Math.round((examCompleted / 30) * 100);
              return (
                <motion.div
                  key={exam}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.07 }}
                >
                  <Card
                    className={`min-w-0 w-full p-4 transition-colors hover:shadow-lg sm:p-5 ${
                      isSelected ? "border-indigo-200 ring-2 ring-indigo-100" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => chooseExam(exam)}
                      aria-pressed={isSelected}
                      className="w-full min-w-0 text-left focus-visible:rounded-xl"
                    >
                      <span className="flex flex-wrap items-start justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-3">
                          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                            isSelected ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
                          }`}>
                            <GraduationCap size={19} />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-[#142344]">{exam} challenge</span>
                            <span className="mt-0.5 block truncate text-[10px] text-slate-400">30 days · 1 question/day</span>
                          </span>
                        </span>
                        {isSelected ? <Badge variant="primary">Selected</Badge> : <ChevronDown size={15} className="text-slate-400" />}
                      </span>
                      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-2 gap-y-1">
                        <span>
                          <span className="text-2xl font-semibold tracking-tight text-[#142344]">{examCompleted}</span>
                          <span className="ml-1 text-xs text-slate-500">/ 30 days</span>
                        </span>
                        <span className="inline-flex items-center gap-1 whitespace-nowrap text-[10px] font-semibold text-amber-600 sm:text-xs">
                          <Flame size={14} /> {streaks[exam]} day streak
                        </span>
                      </span>
                      <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <motion.span
                          className="block h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                          animate={{ width: `${examProgress}%` }}
                          transition={{ duration: 0.55, ease: "easeOut" }}
                        />
                      </span>
                    </button>
                  </Card>
                </motion.div>
              );
            })}
          </section>

          <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <Card className="min-w-0 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-indigo-600" />
                    <h2 className="text-sm font-semibold text-[#142344]">{selectedExam} · 30-day calendar</h2>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Day {currentDay} of 30 · {now === null ? "Asia/Kolkata" : formatChallengeDate(getKolkataDate(now))}
                  </p>
                </div>
                <Badge variant="outline" className="border-indigo-100 bg-indigo-50/50 text-indigo-700">
                  {completed.length} completed
                </Badge>
              </div>

              <div className="mt-5 grid grid-cols-7 gap-1.5 text-center sm:gap-2">
                {weekDays.map((day) => (
                  <span key={day} className="pb-1 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                    {day}
                  </span>
                ))}
                {Array.from({ length: leadingBlanks }, (_, index) => (
                  <span key={`blank-${index}`} aria-hidden="true" />
                ))}
                {Array.from({ length: 30 }, (_, index) => {
                  const day = index + 1;
                  const isFuture = day > currentDay;
                  const isCurrent = day === currentDay;
                  const isDone = completed.includes(day);
                  const isSelected = day === selectedDay;
                  const isMissed = day < currentDay && !isDone;
                  let statusClass = "border-slate-200 bg-white text-slate-600 hover:border-indigo-300";
                  if (isMissed) statusClass = "border-rose-100 bg-rose-50 text-rose-600 hover:border-rose-200";
                  if (isDone) statusClass = "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600";
                  if (isCurrent && !isDone) statusClass = "border-indigo-600 bg-indigo-600 text-white";
                  if (isSelected) statusClass += " ring-4 ring-indigo-100";
                  if (isFuture) statusClass = "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300";
                  return (
                    <motion.button
                      key={day}
                      type="button"
                      layout
                      disabled={isFuture}
                      aria-current={isCurrent ? "date" : undefined}
                      aria-label={`Day ${day}${isCurrent ? ", today" : ""}${isFuture ? ", locked" : isDone ? ", completed" : isMissed ? ", missed" : ""}`}
                      onClick={() => setSelectedDay(day)}
                      whileHover={isFuture ? undefined : { y: -2 }}
                      whileTap={isFuture ? undefined : { scale: 0.94 }}
                      className={`relative grid aspect-square min-h-8 place-items-center rounded-xl border text-[10px] font-semibold transition sm:min-h-9 sm:text-xs ${statusClass}`}
                    >
                      {isFuture ? <LockKeyhole size={12} /> : isDone ? <Check size={14} /> : isMissed ? <span className="text-[9px]">×</span> : day}
                      {isCurrent ? (
                        <span className="absolute -bottom-1 size-1 rounded-full bg-white ring-1 ring-indigo-600" />
                      ) : null}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-[9px] text-slate-500">
                <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded bg-emerald-500" /> Completed</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded bg-rose-100 ring-1 ring-rose-200" /> Missed</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded bg-indigo-600" /> Today</span>
                <span className="inline-flex items-center gap-1.5"><LockKeyhole size={10} /> Locked</span>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 px-3.5 py-3 text-[10px] leading-5 text-slate-500">
                <span className="font-semibold text-[#142344]">Sample challenge window:</span>{" "}
                {formatChallengeDate(cycleStart)} – {formatChallengeDate(shiftDate(cycleStart, 29))}.
                The active day&apos;s challenge closes at 11:59 PM Asia/Kolkata.
              </div>
            </Card>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-600">
                    {selectedDay === currentDay ? "Your daily question" : `Challenge day ${selectedDay}`}
                  </p>
                  <h2 className="mt-1 text-base font-semibold text-[#142344]">
                    {selectedDay === currentDay ? "Today's challenge" : formatChallengeDate(dayDate)}
                  </h2>
                </div>
                <Badge
                  variant={selectedIsComplete ? "success" : selectedIsFuture ? "outline" : selectedDay < currentDay ? "danger" : "primary"}
                  className="gap-1.5"
                >
                  {selectedIsComplete ? <CheckCircle2 size={12} /> : selectedIsFuture ? <LockKeyhole size={12} /> : selectedDay < currentDay ? <CircleAlert size={12} /> : <Clock3 size={12} />}
                  {selectedIsComplete ? "Completed" : selectedIsFuture ? "Locked" : selectedDay < currentDay ? "Past challenge" : "In progress"}
                </Badge>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedExam}-${selectedDay}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="min-w-0 overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                      <span className="flex items-center gap-2">
                        <span className="grid size-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                          <Sparkles size={16} />
                        </span>
                        <span>
                          <span className="block text-xs font-semibold text-[#142344]">{activeQuestion.subject} · {activeQuestion.topic}</span>
                          <span className="mt-0.5 block text-[9px] text-slate-400">{selectedExam} · Day {selectedDay} of 30</span>
                        </span>
                      </span>
                      <Badge variant="outline">Question {String(selectedDay).padStart(2, "0")} / 30</Badge>
                    </div>

                    <div className="p-4 sm:p-5">
                      <h3 className="text-sm font-semibold leading-6 text-[#142344] sm:text-base sm:leading-7">
                        {activeQuestion.prompt}
                      </h3>

                      {selectedDay === currentDay ? (
                        <fieldset className="mt-4 grid gap-2.5">
                          <legend className="sr-only">Choose one answer</legend>
                          {activeQuestion.options.map((option, index) => {
                            const isSelected = attempt.selected === index;
                            const isCorrectChoice = activeQuestion.correctIndex === index;
                            let choiceStyle = "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/40";
                            if (attempt.result && isCorrectChoice) {
                              choiceStyle = "border-emerald-300 bg-emerald-50 text-emerald-900";
                            } else if (attempt.result === "incorrect" && isSelected) {
                              choiceStyle = "border-rose-300 bg-rose-50 text-rose-900";
                            } else if (isSelected) {
                              choiceStyle = "border-indigo-300 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-100";
                            }
                            const disabled = !canAnswer || attempt.result !== null;
                            return (
                              <motion.button
                                key={option}
                                type="button"
                                disabled={disabled}
                                aria-pressed={isSelected}
                                onClick={() => setAttempt({ selected: index })}
                                whileTap={disabled ? undefined : { scale: 0.99 }}
                                className={`flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-xs leading-5 transition sm:text-sm ${choiceStyle} disabled:cursor-default`}
                              >
                                <span className={`grid size-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold ${
                                  isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                                }`}>
                                  {OPTION_LETTERS[index]}
                                </span>
                                <span className="min-w-0 flex-1">{option}</span>
                                {attempt.result && isCorrectChoice ? <CheckCircle2 size={16} className="shrink-0 text-emerald-600" /> : null}
                                {attempt.result === "incorrect" && isSelected ? <CircleAlert size={16} className="shrink-0 text-rose-600" /> : null}
                              </motion.button>
                            );
                          })}
                        </fieldset>
                      ) : (
                        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <p className="text-xs leading-5 text-slate-600">
                            {selectedIsFuture
                              ? "This challenge day is locked. Come back when it becomes available."
                              : selectedIsComplete
                                ? "You completed this day's challenge in the sample progress."
                                : "This day has passed in the sample challenge history."}
                          </p>
                          {selectedIsComplete ? (
                            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                              <CheckCircle2 size={14} /> Challenge completed
                            </p>
                          ) : null}
                        </div>
                      )}

                      {attempt.result && selectedDay === currentDay ? (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={`mt-4 rounded-xl border p-3.5 sm:p-4 ${
                            attempt.result === "correct"
                              ? "border-emerald-200 bg-emerald-50/80"
                              : "border-rose-200 bg-rose-50/80"
                          }`}
                          role="status"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className={`mt-0.5 ${attempt.result === "correct" ? "text-emerald-600" : "text-rose-600"}`}>
                              {attempt.result === "correct" ? <CheckCircle2 size={17} /> : <CircleAlert size={17} />}
                            </span>
                            <div>
                              <p className={`text-xs font-semibold ${attempt.result === "correct" ? "text-emerald-900" : "text-rose-900"}`}>
                                {attempt.result === "correct" ? "You got it! Day complete." : "Not quite. Take another look."}
                              </p>
                              {attempt.result === "incorrect" ? (
                                <p className="mt-1 text-[11px] font-medium text-slate-600">
                                  Correct answer: {OPTION_LETTERS[activeQuestion.correctIndex]}. {activeQuestion.options[activeQuestion.correctIndex]}
                                </p>
                              ) : null}
                              <div className="mt-2 border-t border-black/5 pt-2">
                                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">Explanation</p>
                                <p className="mt-1 text-[11px] leading-5 text-slate-600">{activeQuestion.explanation}</p>
                              </div>
                            </div>
                          </div>

                          {attempt.result === "correct" ? (
                            <motion.div
                              aria-hidden="true"
                              className="mt-3 flex items-center gap-1.5 text-emerald-600"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              {[0, 1, 2, 3, 4].map((item) => (
                                <motion.span
                                  key={item}
                                  initial={{ scale: 0, rotate: -40 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ delay: 0.25 + item * 0.07, type: "spring" }}
                                >
                                  <Sparkles size={14} />
                                </motion.span>
                              ))}
                              <span className="ml-1 text-[10px] font-semibold">Nice work showing up today!</span>
                            </motion.div>
                          ) : null}
                        </motion.div>
                      ) : null}

                      {selectedDay === currentDay && countdown.isClosed && !selectedIsComplete ? (
                        <p className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-[11px] leading-5 text-rose-700">
                          Today&apos;s challenge closed at 11:59 PM Asia/Kolkata. You can review it, but responses are no longer accepted.
                        </p>
                      ) : null}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Clock3 size={13} />
                          {selectedDay === currentDay
                            ? countdown.isClosed
                              ? "Closed for today"
                              : "Closes at 11:59 PM · Asia/Kolkata"
                            : selectedIsFuture
                              ? "Available on its scheduled day"
                              : "Past challenge · read only"}
                        </div>
                        {selectedDay === currentDay ? (
                          <div className="flex w-full flex-wrap justify-end gap-2 sm:w-auto">
                            {attempt.result === "incorrect" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={!canAnswer}
                                onClick={retryAnswer}
                              >
                                <ArrowLeft size={14} /> Retry answer
                              </Button>
                            ) : null}
                            <Button
                              size="md"
                              disabled={!canAnswer || attempt.selected === null || attempt.result !== null}
                              onClick={submitAnswer}
                              className="w-full sm:w-auto"
                            >
                              {selectedIsComplete ? "Day completed" : "Submit Answer"}
                              {selectedIsComplete ? <Check size={15} /> : <ArrowRight size={15} />}
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <section className="mt-6" aria-labelledby="streak-stats-title">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 id="streak-stats-title" className="text-sm font-semibold text-[#142344]">
                  Separate streaks, steady progress
                </h2>
                <p className="mt-1 text-[10px] text-slate-500">Your challenge streak is tracked independently for each exam.</p>
              </div>
              <Badge variant="outline" className="hidden gap-1.5 sm:inline-flex">
                <Flame size={12} className="text-amber-500" /> Current streaks
              </Badge>
            </div>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-3">
              {challengeExams.map((exam, index) => (
                <motion.div
                  key={exam}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                >
                  <Card className={`min-w-0 p-4 ${selectedExam === exam ? "border-indigo-200 bg-gradient-to-br from-white to-indigo-50/50" : ""}`}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-semibold text-[#142344]">
                        <span className="grid size-8 place-items-center rounded-lg bg-amber-50 text-amber-600">
                          <Flame size={16} />
                        </span>
                        {exam}
                      </span>
                      {selectedExam === exam ? <Badge variant="primary">Active</Badge> : null}
                    </div>
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-[#142344]">
                      <motion.span
                        key={`${exam}-${streaks[exam]}`}
                        initial={{ opacity: 0.5, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {streaks[exam]}
                      </motion.span>
                      <span className="ml-1 text-xs font-medium text-slate-500">day streak</span>
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {completedDays[exam].length} of 30 days completed
                    </p>
                    <button
                      type="button"
                      onClick={() => chooseExam(exam)}
                      className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:gap-2"
                    >
                      View {exam} calendar <ArrowRight size={12} />
                    </button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4 text-[10px] text-slate-400">
            <span>Sample daily challenge · Progress is local to this page session.</span>
            <Link href="/dashboard" className="inline-flex items-center gap-1 font-medium text-slate-500 hover:text-indigo-600">
              Back to student dashboard <ArrowRight size={12} />
            </Link>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
