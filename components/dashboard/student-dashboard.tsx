"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Clock3,
  Flame,
  LayoutDashboard,
  Lightbulb,
  Menu,
  NotebookPen,
  Search,
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
  bookmarks,
  examMetrics,
  examStreaks,
  leaderboard,
  recentPractice,
  type ExamName,
} from "@/components/dashboard/dashboard-data";
import {
  ActivityCalendar,
  AnimatedStatCard,
  PerformanceChart,
} from "@/components/dashboard/dashboard-widgets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const navigation = [
  {
    label: "Workspace",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "practice", label: "Practice Questions", icon: BookOpen },
      { id: "daily-challenge", label: "Daily Challenge", icon: Sparkles, mark: "NEW" },
    ],
  },
  {
    label: "Your progress",
    items: [
      { id: "performance", label: "My Performance", icon: Activity },
      { id: "activity-calendar", label: "Activity Calendar", icon: CalendarDays },
    ],
  },
  {
    label: "Study tools",
    items: [
      { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
      { id: "mistakes", label: "Mistake Notebook", icon: NotebookPen },
      { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "profile", label: "Profile", icon: UserRound },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

type SidebarProps = {
  activeSection: string;
  selectedExam: ExamName;
  isMobile?: boolean;
  onNavigate: (id: string) => void;
  onClose?: () => void;
};

function SidebarContent({
  activeSection,
  selectedExam,
  isMobile = false,
  onNavigate,
  onClose,
}: SidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Northstar home">
          <span className="grid size-9 place-items-center rounded-xl bg-[#15264b] text-white">
            <BookOpenCheck size={18} />
          </span>
          <span className="text-[16px] font-bold tracking-tight text-[#142344]">
            northstar<span className="text-indigo-600">.</span>
          </span>
        </Link>
        {isMobile ? (
          <Button variant="ghost" size="icon" aria-label="Close dashboard menu" onClick={onClose}>
            <X size={18} />
          </Button>
        ) : null}
      </div>

      <nav aria-label="Student dashboard" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navigation.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {group.label}
            </p>
            <div className="grid gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={
                      item.id === "practice"
                        ? "/practice"
                        : item.id === "daily-challenge"
                          ? "/challenges"
                          : item.id === "performance"
                            ? "/performance"
                            : item.id === "bookmarks"
                              ? "/bookmarks"
                              : item.id === "mistakes"
                                ? "/mistakes"
                                : item.id === "leaderboard"
                                  ? "/leaderboard"
                          : `#${item.id}`
                    }
                    onClick={() => onNavigate(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex min-h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-[#142344]"
                    }`}
                  >
                    <Icon size={17} className={isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"} />
                    <span className="flex-1">{item.label}</span>
                    {"mark" in item ? (
                      <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-indigo-700">
                        {item.mark}
                      </span>
                    ) : null}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-slate-100 p-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#142344] to-[#263d70] p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="grid size-8 place-items-center rounded-lg bg-white/10 text-indigo-200">
              <Target size={16} />
            </span>
            <Badge className="bg-white/10 text-indigo-100">{selectedExam}</Badge>
          </div>
          <p className="mt-3 text-xs font-semibold">Your weekly goal</p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-indigo-100/70">
            <span>4 of 5 study days</span><span>80%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-4/5 rounded-full bg-indigo-300" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2.5 px-1">
          <span className="grid size-9 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">AS</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-[#142344]">Aarav Sharma</span>
            <span className="mt-0.5 block text-[10px] text-slate-400">Student account</span>
          </span>
          <ChevronDown size={15} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}

export function StudentDashboard() {
  const [selectedExam, setSelectedExam] = useState<ExamName>("NEET");
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [challengeMessage, setChallengeMessage] = useState("");
  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  const metrics = examMetrics[selectedExam];
  const filteredActivity = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return recentPractice.filter((activity) => {
      const matchesExam = activity.exam === selectedExam;
      const matchesQuery = !query || `${activity.subject} ${activity.topic} ${activity.exam}`.toLowerCase().includes(query);
      return matchesExam && matchesQuery;
    });
  }, [searchQuery, selectedExam]);

  function navigateToSection(id: string) {
    setActiveSection(id);
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }

  const searchField = (
    <div className="relative w-full">
      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <Input
        type="search"
        aria-label="Search recent practice"
        placeholder="Search recent practice..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="min-h-10 rounded-xl border-slate-200 bg-slate-50 pl-10 pr-3 text-xs focus:bg-white"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#142344]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <SidebarContent
          activeSection={activeSection}
          selectedExam={selectedExam}
          onNavigate={navigateToSection}
        />
      </aside>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close dashboard menu"
              className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[288px] max-w-[86vw] bg-white shadow-2xl lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              <SidebarContent
                activeSection={activeSection}
                selectedExam={selectedExam}
                isMobile
                onNavigate={navigateToSection}
                onClose={() => setMobileMenuOpen(false)}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="min-h-screen lg:pl-[264px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[68px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Button
              variant="outline"
              size="icon"
              className="!size-9 !min-h-9 !min-w-9 !p-0 shrink-0 rounded-xl lg:hidden"
              aria-label="Open dashboard menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={18} />
            </Button>

            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-xs text-slate-400">Student workspace</p>
              <p className="mt-0.5 text-sm font-semibold text-[#142344]">Overview</p>
            </div>

            <div className="ml-auto hidden w-full max-w-[300px] sm:block">
              {searchField}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="!size-9 !min-h-9 !min-w-9 !p-0 shrink-0 rounded-xl sm:hidden"
              aria-label="Toggle practice search"
              aria-expanded={mobileSearchOpen}
              onClick={() => setMobileSearchOpen((open) => !open)}
            >
              <Search size={18} />
            </Button>

            <div className="relative shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="!size-9 !min-h-9 !min-w-9 !p-0 relative rounded-xl"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  setProfileOpen(false);
                }}
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </Button>
              <AnimatePresence>
                {notificationsOpen ? (
                  <motion.div
                    className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10"
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-[#142344]">Notifications</h2>
                      <Badge variant="primary">2 new</Badge>
                    </div>
                    <div className="mt-3 grid gap-2">
                      <div className="flex gap-3 rounded-xl bg-indigo-50/70 p-3">
                        <span className="mt-0.5 text-indigo-600"><Flame size={16} /></span>
                        <p className="text-xs leading-5 text-slate-600"><strong className="text-[#142344]">Your streak is waiting.</strong> Try today&apos;s short challenge.</p>
                      </div>
                      <div className="flex gap-3 rounded-xl p-3">
                        <span className="mt-0.5 text-emerald-600"><CircleCheck size={16} /></span>
                        <p className="text-xs leading-5 text-slate-600"><strong className="text-[#142344]">Weekly goal: 4/5.</strong> One more study day to go.</p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="relative shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="!size-9 !min-h-9 !min-w-9 !p-0 rounded-xl sm:hidden"
                aria-label="Student profile menu"
                aria-expanded={profileOpen}
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setNotificationsOpen(false);
                }}
              >
                <span className="grid size-8 place-items-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">AS</span>
              </Button>
              <Button
                variant="ghost"
                className="!hidden gap-2 rounded-xl px-2 sm:!inline-flex"
                aria-label="Student profile menu"
                aria-expanded={profileOpen}
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setNotificationsOpen(false);
                }}
              >
                <span className="grid size-8 place-items-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">AS</span>
                <span className="hidden text-left sm:block">
                  <span className="block text-xs font-semibold text-[#142344]">Aarav Sharma</span>
                  <span className="block text-[10px] text-slate-400">{selectedExam} student</span>
                </span>
                <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
              </Button>
              <AnimatePresence>
                {profileOpen ? (
                  <motion.div
                    className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10"
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                  >
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="text-xs font-semibold text-[#142344]">Aarav Sharma</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">Sample student profile</p>
                    </div>
                    <a href="#profile" onClick={() => navigateToSection("profile")} className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                      <UserRound size={15} /> My profile
                    </a>
                    <a href="#settings" onClick={() => navigateToSection("settings")} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                      <Settings size={15} /> Preferences
                    </a>
                    <Link href="/" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                      <ArrowUpRight size={15} /> Public landing page
                    </Link>
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
                {searchField}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto w-full min-w-0 max-w-[1600px] px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8"
        >
          <section id="overview" className="scroll-mt-24">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
                  Your learning, organized
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-3xl">
                  Welcome back, Aarav <span aria-hidden="true">✦</span>
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  A little progress each day takes you closer to your goal.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-medium text-slate-500">Preparing for</span>
                <div role="group" aria-label="Choose exam" className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                  {(["CET", "NEET", "JEE"] as const).map((exam) => (
                    <button
                      key={exam}
                      type="button"
                      aria-pressed={selectedExam === exam}
                      onClick={() => setSelectedExam(exam)}
                      className={`min-h-8 rounded-lg px-3 text-xs font-semibold transition ${
                        selectedExam === exam
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-50 hover:text-[#142344]"
                      }`}
                    >
                      {exam}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <AnimatedStatCard
                label="Questions attempted"
                value={metrics.questions}
                icon={BookOpenCheck}
                note="Across your practice sets"
                tone="bg-indigo-50 text-indigo-600"
                delay={0}
              />
              <AnimatedStatCard
                label="Correct answers"
                value={metrics.correct}
                icon={CircleCheck}
                note="Keep building on what you know"
                tone="bg-emerald-50 text-emerald-600"
                delay={0.05}
              />
              <AnimatedStatCard
                label="Overall accuracy"
                value={metrics.accuracy}
                suffix="%"
                icon={Activity}
                note="A steady upward trend"
                tone="bg-sky-50 text-sky-600"
                delay={0.1}
              />
              <AnimatedStatCard
                label="Current study streak"
                value={examStreaks[selectedExam].days}
                suffix=" days"
                icon={Flame}
                note={`${examStreaks[selectedExam].best}-day personal best`}
                tone="bg-amber-50 text-amber-600"
                delay={0.15}
              />
            </div>
          </section>

          <section id="daily-challenge" className="mt-8 scroll-mt-24">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#142344]">Today&apos;s focus</h2>
                <p className="mt-1 text-xs text-slate-500">A small challenge to keep your study rhythm going.</p>
              </div>
              <Badge variant="primary" className="gap-1.5"><Sparkles size={12} /> Daily challenge</Badge>
            </div>
            <div className="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
              <Card className="overflow-hidden border-indigo-100/80 bg-gradient-to-br from-white via-white to-indigo-50/70 p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="grid size-10 place-items-center rounded-xl bg-indigo-100 text-indigo-700">
                        <Lightbulb size={19} />
                      </span>
                      <span>
                        <span className="block text-xs font-semibold text-indigo-700">{selectedExam} · Today&apos;s question</span>
                        <span className="mt-0.5 block text-[10px] text-slate-400">About 3 minutes · Sample content</span>
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold leading-7 text-[#142344] sm:text-xl">
                      Which process allows green plants to convert light energy into chemical energy?
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Take a quick concept check and keep your daily streak alive.
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                    <span className="grid size-[68px] place-items-center rounded-full border-[5px] border-indigo-100 bg-white text-center shadow-sm">
                      <span className="text-sm font-bold text-indigo-700">3<span className="text-slate-300">/5</span></span>
                    </span>
                    <span className="text-xs text-slate-500 sm:text-right">Daily goal<br /><strong className="text-[#142344]">60% complete</strong></span>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-[10px] font-medium text-slate-400">
                    <span>Challenge progress</span><span>3 of 5 questions</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-indigo-100">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="min-h-4 text-xs text-indigo-700" aria-live="polite">{challengeMessage}</p>
                  <Button
                    size="md"
                    onClick={() => setChallengeMessage("Challenge preview only — no answers are submitted or saved.")}
                  >
                    Start Challenge <ArrowRight size={16} />
                  </Button>
                </div>
              </Card>

              <Card className="flex flex-col justify-between p-5 sm:p-6">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Next study set</p>
                      <h3 className="mt-2 text-base font-semibold text-[#142344]">A focused session is up next</h3>
                    </div>
                    <span className="grid size-9 place-items-center rounded-xl bg-sky-50 text-sky-600">
                      <Clock3 size={17} />
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Sample loading-skeleton pattern for a future recommendation.
                  </p>
                </div>
                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4" aria-label="Sample loading skeleton">
                  <div className="flex animate-pulse items-center gap-3">
                    <span className="size-9 rounded-lg bg-slate-200" />
                    <span className="flex-1 space-y-2">
                      <span className="block h-2.5 w-3/4 rounded-full bg-slate-200" />
                      <span className="block h-2 w-1/2 rounded-full bg-slate-100" />
                    </span>
                  </div>
                  <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-slate-100" />
                </div>
              </Card>
            </div>
          </section>

          <section className="mt-8" aria-labelledby="streaks-heading">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 id="streaks-heading" className="text-base font-semibold text-[#142344]">Your exam streaks</h2>
                <p className="mt-1 text-xs text-slate-500">Separate progress for each preparation path.</p>
              </div>
              <span className="hidden items-center gap-1 text-[10px] text-slate-400 sm:flex">
                <Flame size={13} className="text-orange-500" /> Keep the rhythm going
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {(["CET", "NEET", "JEE"] as const).map((exam) => {
                const streak = examStreaks[exam];
                const active = selectedExam === exam;
                return (
                  <Card
                    key={exam}
                    interactive
                    className={`p-4 transition-colors ${active ? "border-indigo-200 ring-2 ring-indigo-100" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedExam(exam)}
                      aria-pressed={active}
                      className="w-full text-left focus-visible:rounded-xl"
                    >
                      <span className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-semibold text-[#142344]">
                          <span className={`grid size-8 place-items-center rounded-lg ${active ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-500"}`}>
                            <Flame size={16} />
                          </span>
                          {exam}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">Best {streak.best} days</span>
                      </span>
                      <span className="mt-4 flex items-end justify-between">
                        <span>
                          <span className="text-2xl font-semibold tracking-tight text-[#142344]">{streak.days}</span>
                          <span className="ml-1 text-xs text-slate-500">day streak</span>
                        </span>
                        <span className="flex gap-1" aria-label="Weekly activity">
                          {streak.activeDays.map((activeDay, day) => (
                            <span
                              key={day}
                              className={`size-2.5 rounded-full ${activeDay ? "bg-indigo-500" : "bg-slate-200"}`}
                            />
                          ))}
                        </span>
                      </span>
                    </button>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="mt-8 grid gap-4 xl:grid-cols-[1fr_1.35fr]">
            <ActivityCalendar exam={selectedExam} />
            <PerformanceChart
              key={selectedExam}
              exam={selectedExam}
              values={metrics.weeklyAccuracy}
            />
          </section>

          <section className="mt-8" aria-labelledby="practice-heading">
            <Card id="practice" className="scroll-mt-24 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
                <div>
                  <h2 id="practice-heading" className="text-base font-semibold text-[#142344]">Recent practice</h2>
                  <p className="mt-1 text-xs text-slate-500">Your latest {selectedExam} sessions at a glance.</p>
                </div>
                <a href="#daily-challenge" className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:gap-2.5">
                  Practice more <ArrowRight size={14} />
                </a>
              </div>
              {filteredActivity.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {filteredActivity.map((activity) => (
                    <div key={activity.id} className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-6">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                        <BookOpen size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#142344]">{activity.subject} <span className="font-normal text-slate-400">· {activity.topic}</span></p>
                        <p className="mt-1 text-[10px] text-slate-400">{activity.time} · {activity.questions} questions</p>
                      </div>
                      <Badge variant={activity.accuracy >= 80 ? "success" : "warning"}>{activity.accuracy}% accuracy</Badge>
                      <span className="hidden text-[10px] text-slate-400 sm:block">{activity.exam}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-10 text-center">
                  <Search size={20} className="mx-auto text-slate-300" />
                  <p className="mt-2 text-sm font-medium text-slate-600">No matching practice sessions</p>
                  <p className="mt-1 text-xs text-slate-400">Try a different search term.</p>
                </div>
              )}
            </Card>
          </section>

          <section className="mt-8" aria-labelledby="quick-access-heading">
            <div className="mb-3">
              <h2 id="quick-access-heading" className="text-base font-semibold text-[#142344]">Quick access</h2>
              <p className="mt-1 text-xs text-slate-500">Pick up where you left off.</p>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              <Card id="bookmarks" interactive className="min-w-0 w-full scroll-mt-24 p-5">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><Bookmark size={18} /></span>
                  <Badge variant="outline">{bookmarks.length} saved</Badge>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[#142344]">Bookmarks</h3>
                <div className="mt-3 space-y-2">
                  {bookmarks.slice(0, 2).map((item) => (
                    <div key={item.title} className="flex min-w-0 items-center justify-between gap-2 text-[10px] text-slate-500">
                      <span className="min-w-0 truncate">{item.title}</span><span className="shrink-0 text-slate-400">{item.tag}</span>
                    </div>
                  ))}
                </div>
                <a href="#practice" onClick={() => setActiveSection("practice")} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                  Review saved notes <ChevronRight size={14} />
                </a>
              </Card>

              <Card id="mistakes" interactive className="min-w-0 w-full scroll-mt-24 p-5">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-600"><NotebookPen size={18} /></span>
                  <Badge variant="warning">3 to revisit</Badge>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[#142344]">Mistake notebook</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Revisit concepts you marked for another look.
                </p>
                <a href="#practice" onClick={() => setActiveSection("practice")} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                  Review practice <ChevronRight size={14} />
                </a>
              </Card>

              <Card id="leaderboard" interactive className="min-w-0 w-full scroll-mt-24 p-5">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><Trophy size={18} /></span>
                  <Badge variant="success">This week</Badge>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[#142344]">Leaderboard</h3>
                <div className="mt-3 space-y-2">
                  {leaderboard.map((student) => (
                    <div key={student.rank} className="flex items-center gap-2">
                      <span className="w-4 text-[10px] font-semibold text-slate-400">#{student.rank}</span>
                      <span className={`grid size-6 place-items-center rounded-full text-[9px] font-bold ${student.tone}`}>{student.initials}</span>
                      <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-slate-600">{student.name}</span>
                      <span className="text-[10px] text-slate-400">{student.points.toLocaleString()} XP</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-2">
            <Card id="profile" className="min-w-0 scroll-mt-24 p-5 sm:p-6">
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">AS</span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-[#142344]">Student profile</h2>
                  <p className="mt-1 truncate text-xs text-slate-500">Aarav Sharma · {selectedExam} aspirant</p>
                </div>
                <Badge variant="outline" className="ml-auto">Sample</Badge>
              </div>
              <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
                Your student profile and exam focus are shown here as sample dashboard content.
              </p>
            </Card>

            <Card id="settings" className="min-w-0 scroll-mt-24 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-[#142344]">Study preferences</h2>
                  <p className="mt-1 text-xs text-slate-500">Local UI controls · no settings are saved.</p>
                </div>
                <Settings size={18} className="text-slate-400" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  aria-pressed={dailyReminder}
                  onClick={() => setDailyReminder((enabled) => !enabled)}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                    dailyReminder ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500"
                  }`}
                >
                  Daily reminder {dailyReminder ? "On" : "Off"}
                </button>
                <button
                  type="button"
                  aria-pressed={weeklySummary}
                  onClick={() => setWeeklySummary((enabled) => !enabled)}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                    weeklySummary ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500"
                  }`}
                >
                  Weekly summary {weeklySummary ? "On" : "Off"}
                </button>
              </div>
            </Card>
          </section>

          <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Northstar student dashboard · Sample data only</span>
            <Link href="/" className="inline-flex items-center gap-1 font-medium text-slate-500 hover:text-indigo-600">
              Back to public site <ArrowUpRight size={13} />
            </Link>
          </footer>
        </motion.main>
      </div>
    </div>
  );
}
