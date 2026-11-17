"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bell,
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileQuestion,
  GraduationCap,
  Layers3,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  adminCatalogCounts,
  adminExamQuestionStats,
  adminRecentQuestions,
  adminRecentStudents,
  adminSampleMetrics,
  adminTeacherActivity,
  adminUpcomingChallenges,
} from "@/components/admin/admin-data";
import { AnimatedStatCard } from "@/components/dashboard/dashboard-widgets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const adminNavigation: Array<{ label: string; href: string; icon: LucideIcon }> = [
  { label: "Overview", href: "#overview", icon: LayoutDashboard },
  { label: "Exam statistics", href: "#exam-statistics", icon: GraduationCap },
  { label: "Question activity", href: "#recent-questions", icon: FileQuestion },
  { label: "Students", href: "#student-registrations", icon: Users },
  { label: "Teachers", href: "#teacher-activity", icon: UserRound },
  { label: "Daily challenges", href: "#upcoming-challenges", icon: CalendarDays },
  { label: "Quick actions", href: "#quick-actions", icon: Settings },
];

const adminStatIcons: LucideIcon[] = [
  Users,
  GraduationCap,
  FileQuestion,
  CheckCircle2,
  CalendarDays,
  BookOpenCheck,
];

const adminStatTones = [
  "bg-indigo-50 text-indigo-600",
  "bg-sky-50 text-sky-600",
  "bg-violet-50 text-violet-600",
  "bg-emerald-50 text-emerald-600",
  "bg-amber-50 text-amber-600",
  "bg-blue-50 text-blue-600",
];

const adminQuickActions: Array<{
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}> = [
  { label: "Manage Exams", description: "Edit the exam catalog", href: "/admin/exams", icon: GraduationCap },
  { label: "Manage Subjects", description: "Edit exam subjects", href: "/admin/subjects", icon: BookOpen },
  { label: "Manage Chapters", description: "Edit subject chapters", href: "/admin/chapters", icon: Layers3 },
  { label: "Manage Subtopics", description: "Edit chapter subtopics", href: "/admin/subtopics", icon: Layers3 },
  { label: "Manage Questions", description: "Review the question bank", href: "/admin/questions", icon: FileQuestion },
  { label: "Bulk Question Import", description: "Preview question imports", href: "/admin/import", icon: BookOpenCheck },
  { label: "Manage Teachers", description: "Review teacher accounts", href: "/admin/teachers", icon: UserRound },
  { label: "Manage Students", description: "Review student accounts", href: "/admin/students", icon: Users },
  { label: "Daily Challenge Management", description: "Manage daily challenges", href: "/admin/challenges", icon: CalendarDays },
  { label: "Analytics & Leaderboard", description: "Explore sample analytics", href: "/admin/analytics", icon: Activity },
  { label: "Admin Settings", description: "Manage workspace preferences", href: "/admin/settings", icon: Settings },
];

function AdminSidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
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
          {adminNavigation.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                aria-current={index === 0 ? "page" : undefined}
                className={`group flex min-h-10 items-center gap-3 rounded-xl px-3 text-[12px] font-medium transition ${
                  index === 0
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[#142344]"
                }`}
              >
                <Icon size={16} className={index === 0 ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"} />
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
            Overview only · sample data · no connected management actions.
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

function AdminHeader({
  mobileMenuOpen,
  onOpenMenu,
  profileOpen,
  onToggleProfile,
  notificationsOpen,
  onToggleNotifications,
  onLogout,
}: {
  mobileMenuOpen: boolean;
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
          aria-label={mobileMenuOpen ? "Admin navigation is open" : "Open admin navigation"}
          aria-expanded={mobileMenuOpen}
          onClick={onOpenMenu}
        >
          <Menu size={18} />
        </Button>
        <div className="min-w-0">
          <p className="truncate text-[10px] text-slate-400">Platform administration</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-[#142344]">Dashboard overview</p>
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
                  <div className="mt-3 space-y-3">
                    <div className="flex gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><Users size={15} /></span>
                      <div>
                        <p className="text-xs font-semibold text-[#142344]">New student registrations</p>
                        <p className="mt-0.5 text-[10px] leading-4 text-slate-500">Sample activity from the latest sign-ups.</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><BookOpenCheck size={15} /></span>
                      <div>
                        <p className="text-xs font-semibold text-[#142344]">Question bank updated</p>
                        <p className="mt-0.5 text-[10px] leading-4 text-slate-500">Published question counts are sample data.</p>
                      </div>
                    </div>
                  </div>
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
                  <div className="border-b border-slate-100 px-2 pb-3">
                    <p className="text-xs font-semibold text-[#142344]">Aarav Mehta</p>
                    <p className="mt-1 text-[10px] text-slate-500">Platform admin · sample UI</p>
                  </div>
                  <p className="px-2 pt-3 text-[10px] leading-4 text-slate-400">
                    Account settings are not connected in this preview.
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="!size-9 !min-h-9 !min-w-9 !p-0 rounded-xl sm:!h-9 sm:!w-auto sm:!px-3"
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

function AdminDashboardSkeleton() {
  return (
    <div aria-label="Loading admin dashboard" role="status" className="space-y-5">
      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <Card key={index} className="space-y-3 p-4">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            <div className="h-7 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
          </Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <Card key={item} className="space-y-4 p-5">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="size-9 animate-pulse rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </Card>
        ))}
      </div>
      <span className="sr-only">Loading sample administration data…</span>
    </div>
  );
}

function AdminEmptyState({ message }: { message: string }) {
  return (
    <div className="grid min-h-36 place-items-center px-4 py-8 text-center">
      <div>
        <CircleHelp size={22} className="mx-auto text-slate-300" />
        <p className="mt-2 text-xs font-semibold text-[#142344]">Nothing to show yet</p>
        <p className="mt-1 text-[10px] text-slate-400">{message}</p>
      </div>
    </div>
  );
}

function AdminPanelHeading({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="mb-3 flex items-start gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-[#142344]">{title}</h2>
        <p className="mt-1 text-[10px] leading-4 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoutNotice, setLogoutNotice] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#142344]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <AdminSidebar />
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
              <AdminSidebar mobile onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
      <div className="min-h-screen lg:pl-[252px]">
        <AdminHeader
          mobileMenuOpen={sidebarOpen}
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
            setProfileOpen(false);
            setNotificationsOpen(false);
            setLogoutNotice(true);
          }}
        />
        <motion.main
          id="overview"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto w-full min-w-0 max-w-[1600px] px-4 pb-12 pt-5 sm:px-6 sm:pt-7 lg:px-8"
        >
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="primary">Admin workspace</Badge>
                <Badge variant="outline">Sample data</Badge>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-3xl">
                Welcome back, Aarav
              </h1>
              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                Here’s a sample overview of students, educators, questions, and daily challenges across Northstar.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-[10px] font-medium text-indigo-700">
              <Activity size={14} /> Platform overview · preview only
            </div>
          </div>

          <AnimatePresence>
            {logoutNotice ? (
              <motion.div
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900"
              >
                Sign-out is not connected in this frontend preview.
                <Button variant="ghost" size="icon" aria-label="Dismiss sign-out message" onClick={() => setLogoutNotice(false)}>
                  <X size={15} />
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {loading ? (
            <AdminDashboardSkeleton />
          ) : (
            <div className="space-y-6">
              <section aria-label="Platform statistics" className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6">
                {adminSampleMetrics.map((metric, index) => (
                  <AnimatedStatCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    note={metric.note}
                    icon={adminStatIcons[index]}
                    tone={adminStatTones[index]}
                    delay={index * 0.05}
                  />
                ))}
              </section>

              <section id="quick-actions" className="scroll-mt-24">
                <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-[#142344]">Quick actions</h2>
                    <p className="mt-1 text-[10px] text-slate-500">Open a management page. Actions use sample data in this frontend preview.</p>
                  </div>
                  <Badge variant="outline">Frontend preview</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                  {adminQuickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.label}
                        href={action.href}
                        className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-4"
                      >
                        <span className="flex items-start justify-between gap-2">
                          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                            <Icon size={15} />
                          </span>
                          <ArrowRight size={13} className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                        </span>
                        <span className="mt-3 block text-[10px] font-semibold leading-4 text-[#142344] sm:text-xs">
                          {action.label}
                        </span>
                        <span className="mt-1 hidden text-[9px] leading-4 text-slate-400 sm:block">{action.description}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>

              <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
                <section id="student-registrations" className="min-w-0 scroll-mt-24">
                  <Card className="h-full min-w-0 p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <AdminPanelHeading
                        title="Recent student registrations"
                        description="Latest sample student sign-ups."
                        icon={Users}
                      />
                      <Badge variant="outline">Sample</Badge>
                    </div>
                    {adminRecentStudents.length ? (
                      <div className="divide-y divide-slate-100">
                        {adminRecentStudents.map((student) => (
                          <div key={student.name} className="flex min-w-0 items-center gap-3 py-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-700">
                              {student.initials}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-semibold text-[#142344]">{student.name}</span>
                              <span className="mt-0.5 block text-[10px] text-slate-400">{student.registered} · {student.exam}</span>
                            </span>
                            <Badge variant={student.status === "Active" ? "success" : "outline"}>{student.status}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <AdminEmptyState message="New student registrations will appear here." />
                    )}
                  </Card>
                </section>

                <section id="teacher-activity" className="min-w-0 scroll-mt-24">
                  <Card className="h-full min-w-0 p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <AdminPanelHeading
                        title="Recent teacher activity"
                        description="A sample snapshot of educator activity."
                        icon={Activity}
                      />
                      <Badge variant="outline">Sample</Badge>
                    </div>
                    {adminTeacherActivity.length ? (
                      <div className="divide-y divide-slate-100">
                        {adminTeacherActivity.map((item) => (
                          <div key={`${item.name}-${item.activity}`} className="flex min-w-0 items-center gap-3 py-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sky-50 text-[10px] font-bold text-sky-700">
                              {item.initials}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-semibold text-[#142344]">{item.name}</span>
                              <span className="mt-0.5 block text-[10px] leading-4 text-slate-500">{item.activity}</span>
                            </span>
                            <span className="shrink-0 text-right">
                              <Badge variant="outline">{item.type}</Badge>
                              <span className="mt-1 block text-[9px] text-slate-400">{item.time}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <AdminEmptyState message="Teacher activity will appear here." />
                    )}
                  </Card>
                </section>

                <section id="recent-questions" className="min-w-0 scroll-mt-24">
                  <Card className="h-full min-w-0 p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <AdminPanelHeading
                        title="Recently added questions"
                        description="Published question samples from the shared question bank."
                        icon={FileQuestion}
                      />
                      <Badge variant="outline">Read only</Badge>
                    </div>
                    {adminRecentQuestions.length ? (
                      <div className="divide-y divide-slate-100">
                        {adminRecentQuestions.map((question) => (
                          <div key={question.id} className="flex min-w-0 items-start gap-3 py-3">
                            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                              <BookOpenCheck size={15} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-xs font-semibold leading-5 text-[#142344]">{question.prompt}</p>
                              <p className="mt-1 text-[9px] text-slate-400">{question.exam} · {question.subject} · {question.publishedLabel}</p>
                            </div>
                            <Badge variant="outline">{question.difficulty}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <AdminEmptyState message="Recently added questions will appear here." />
                    )}
                  </Card>
                </section>

                <section id="upcoming-challenges" className="min-w-0 scroll-mt-24">
                  <Card className="h-full min-w-0 p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <AdminPanelHeading
                        title="Upcoming daily challenges"
                        description="Scheduled sample challenges by exam."
                        icon={CalendarDays}
                      />
                      <Badge variant="primary">{adminUpcomingChallenges.length} scheduled</Badge>
                    </div>
                    {adminUpcomingChallenges.length ? (
                      <div className="space-y-2.5">
                        {adminUpcomingChallenges.map((challenge) => (
                          <div key={`${challenge.exam}-${challenge.day}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                              <CalendarDays size={16} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <Badge variant="primary">{challenge.exam}</Badge>
                                <span className="text-[10px] font-semibold text-[#142344]">{challenge.day}</span>
                              </div>
                              <p className="mt-1 truncate text-[10px] text-slate-500">{challenge.topic} · {challenge.questions} questions</p>
                            </div>
                            <span className="shrink-0 text-right">
                              <Badge variant="success">{challenge.status}</Badge>
                              <span className="mt-1 block text-[9px] text-slate-400"><Clock3 size={10} className="mr-1 inline" />11:59 PM IST</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <AdminEmptyState message="No sample challenges are scheduled." />
                    )}
                  </Card>
                </section>
              </div>

              <section id="exam-statistics" className="scroll-mt-24">
                <Card className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <AdminPanelHeading
                      title="Exam-wise question statistics"
                      description="Published question counts from the sample bank."
                      icon={GraduationCap}
                    />
                    <Badge variant="outline">CET · NEET · JEE</Badge>
                  </div>
                  {adminExamQuestionStats.length ? (
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.6fr)]">
                      <div className="space-y-4">
                        {adminExamQuestionStats.map((item) => {
                          const maximum = Math.max(...adminExamQuestionStats.map((exam) => exam.questions), 1);
                          const percentage = Math.round((item.questions / maximum) * 100);
                          return (
                            <div key={item.exam}>
                              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                                <span className="font-semibold text-[#142344]">{item.exam}</span>
                                <span className="text-[10px] text-slate-500">{item.published} published · {item.questions} sample questions</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${percentage}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.7, ease: "easeOut" }}
                                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div id="catalog-overview" className="grid grid-cols-2 gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 scroll-mt-24">
                        <div>
                          <p className="text-[10px] font-medium text-slate-500">Subjects in sample bank</p>
                          <p className="mt-1 text-2xl font-semibold text-[#142344]">{adminCatalogCounts.subjects}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-slate-500">Chapters in sample bank</p>
                          <p className="mt-1 text-2xl font-semibold text-[#142344]">{adminCatalogCounts.chapters}</p>
                        </div>
                        <p className="col-span-2 text-[9px] leading-4 text-slate-400">
                          Counts are derived from the shared sample question collection; catalog management is not connected.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <AdminEmptyState message="Exam statistics will appear when sample questions are available." />
                  )}
                </Card>
              </section>

              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[10px] text-slate-500">
                <span className="inline-flex items-center gap-2"><Sparkles size={13} className="text-indigo-500" /> This admin dashboard is a frontend preview using sample data only.</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck size={12} /> No database, authentication, or admin actions are connected.</span>
              </div>
            </div>
          )}
        </motion.main>
      </div>
    </div>
  );
}
