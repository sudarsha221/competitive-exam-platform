"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpenCheck,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Flame,
  GraduationCap,
  Heart,
  Lightbulb,
  Menu,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const exams = [
  {
    name: "MHT-CET",
    category: "State entrance",
    description: "Build speed and accuracy for your state-level engineering or pharmacy entrance.",
    icon: GraduationCap,
    tint: "from-indigo-50 to-white",
    iconTint: "bg-indigo-100 text-indigo-700",
    detail: "Physics · Chemistry · Maths",
    tag: "Maharashtra",
  },
  {
    name: "NEET",
    category: "Medical entrance",
    description: "Make every biology, chemistry, and physics concept count on exam day.",
    icon: Heart,
    tint: "from-rose-50 to-white",
    iconTint: "bg-rose-100 text-rose-600",
    detail: "Physics · Chemistry · Biology",
    tag: "All India",
  },
  {
    name: "JEE",
    category: "Engineering entrance",
    description: "Turn challenging problems into a steady, achievable practice routine.",
    icon: Target,
    tint: "from-sky-50 to-white",
    iconTint: "bg-sky-100 text-sky-700",
    detail: "Physics · Chemistry · Maths",
    tag: "Main + Advanced",
  },
];

const features = [
  {
    icon: BookOpenCheck,
    title: "Practice that pays off",
    description: "Work through exam-style questions, organized by subject and topic.",
    tone: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Lightbulb,
    title: "Explanations that click",
    description: "Learn the thinking behind an answer, not just which option is right.",
    tone: "bg-amber-50 text-amber-600",
  },
  {
    icon: BarChart3,
    title: "Progress you can see",
    description: "Spot strengths and focus areas with a clear view of your practice.",
    tone: "bg-sky-50 text-sky-600",
  },
  {
    icon: Flame,
    title: "Streaks that keep you going",
    description: "Celebrate the small daily habits that make preparation consistent.",
    tone: "bg-orange-50 text-orange-600",
  },
  {
    icon: Trophy,
    title: "A little friendly motivation",
    description: "Use optional leaderboards to stay inspired and recognize milestones.",
    tone: "bg-emerald-50 text-emerald-600",
  },
];

const testimonials = [
  {
    quote:
      "Breaking my prep into smaller sessions made it easier to stay consistent. I could finally see the progress I was making.",
    name: "Aarav",
    detail: "JEE aspirant",
    initials: "A",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    quote:
      "The explanations help me understand where I went wrong. It feels much more useful than just checking a score.",
    name: "Ananya",
    detail: "NEET aspirant",
    initials: "A",
    color: "bg-rose-100 text-rose-700",
  },
  {
    quote:
      "A little practice every day feels manageable now. The clean layout helps me stay focused on the next step.",
    name: "Ishaan",
    detail: "MHT-CET aspirant",
    initials: "I",
    color: "bg-sky-100 text-sky-700",
  },
];

const challengeOptions = [
  { key: "A", text: "The rate of change of velocity" },
  { key: "B", text: "The product of mass and velocity" },
  { key: "C", text: "The distance travelled per unit time" },
  { key: "D", text: "The force acting on an object" },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    `${Number.isInteger(value) ? Math.round(latest) : latest.toFixed(1)}${suffix}`,
  );

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, value, { duration: 1.6, ease: "easeOut" });
    return controls.stop;
  }, [count, isInView, value]);

  return (
    <div className="text-center">
      <p className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        <motion.span ref={ref}>{rounded}</motion.span>
      </p>
      <p className="mt-2 text-xs text-indigo-100/70 sm:text-sm">{label}</p>
    </div>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Exams", href: "#exams" },
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
  ];

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <a
            href="#home"
            className="flex items-center gap-2.5"
            aria-label="Northstar home"
            onClick={closeMenu}
          >
            <span className="grid size-10 place-items-center rounded-2xl bg-[#15264b] text-white shadow-lg shadow-indigo-950/15">
              <BookOpenCheck size={20} strokeWidth={2.2} />
            </span>
            <span className="text-[17px] font-bold tracking-tight text-[#142344]">
              northstar<span className="text-indigo-600">.</span>
            </span>
          </a>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <a key={item.label} className="ui-nav-link" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-700"
            >
              Login
            </a>
            <a
              href="/register"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-600/15 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
            >
              Get started <ArrowUpRight size={16} />
            </a>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-xl lg:hidden"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </Button>
        </div>

        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <motion.nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className="absolute inset-x-0 top-full border-b border-slate-200 bg-white px-5 pb-5 pt-2 shadow-xl shadow-slate-900/5 sm:px-8 lg:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="mx-auto flex max-w-7xl flex-col gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                    href={item.href}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                  <a
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
                    href="/login"
                    onClick={closeMenu}
                  >
                    Login
                  </a>
                  <a
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white"
                    href="/register"
                    onClick={closeMenu}
                  >
                    Get started <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <section
        id="home"
        className="hero-spotlight relative scroll-mt-24"
      >
        <div className="hero-grid pointer-events-none absolute inset-x-0 top-0 -z-0 h-[88%] opacity-60" />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:pb-28 lg:pt-24">
          <Reveal className="relative z-10">
            <Badge variant="primary" className="gap-1.5 px-3 py-1.5 uppercase tracking-[0.12em]">
              <Sparkles size={13} /> Your next chapter starts here
            </Badge>
            <h1 className="mt-7 max-w-2xl text-[2.8rem] font-semibold leading-[1.06] tracking-[-0.055em] text-[#142344] sm:text-6xl lg:text-[4.25rem]">
              Every question brings you
              <span className="block text-indigo-600">closer to your goal.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Prepare for CET, NEET, and JEE with focused practice, clear
              explanations, and a plan that makes progress feel possible.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#exams"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl"
              >
                Find your exam <ArrowRight size={17} />
              </a>
              <a
                href="#daily-challenge"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-700"
              >
                <span className="grid size-8 place-items-center rounded-full bg-white text-indigo-600 shadow-sm">
                  <CircleHelp size={16} />
                </span>
                Try a daily challenge
              </a>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-emerald-600" /> Learn at your pace
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-emerald-600" /> Start with a free sample
              </span>
            </div>
          </Reveal>

          <Reveal className="relative mx-auto w-full max-w-[500px]" delay={0.12}>
            <motion.div
              className="absolute -right-4 top-4 z-20 hidden rounded-2xl border border-white bg-white px-4 py-3 shadow-xl shadow-indigo-950/10 sm:flex"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="mr-3 grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <Flame size={18} />
              </span>
              <span>
                <span className="block text-xs font-semibold text-[#142344]">7 day streak</span>
                <span className="mt-0.5 block text-[11px] text-slate-500">Consistency looks good on you</span>
              </span>
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 z-20 hidden items-center gap-2.5 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl shadow-indigo-950/10 sm:flex"
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <Check size={18} />
              </span>
              <span className="text-xs font-semibold text-[#142344]">One more concept mastered</span>
            </motion.div>

            <div className="absolute -left-10 top-16 size-36 rounded-full bg-indigo-300/30 blur-3xl" />
            <div className="absolute -right-8 bottom-12 size-40 rounded-full bg-sky-200/50 blur-3xl" />
            <Card className="relative overflow-hidden border-white/80 p-5 shadow-[0_30px_90px_-32px_rgba(27,48,93,0.28)] sm:p-7">
              <div className="absolute right-0 top-0 h-48 w-48 rounded-bl-full bg-indigo-50/80" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
                    Your prep, in focus
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#142344]">
                    A plan that moves with you.
                  </h2>
                </div>
                <span className="grid size-11 place-items-center rounded-2xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100">
                  <GraduationCap size={21} />
                </span>
              </div>
              <div className="relative mt-6 rounded-2xl bg-[#142344] p-5 text-white sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-indigo-200">Today&apos;s focus</p>
                    <p className="mt-1 text-lg font-semibold">Build consistency</p>
                  </div>
                  <Badge className="bg-white/10 text-indigo-100">DAY 08</Badge>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-semibold tracking-tight">
                      82<span className="text-2xl text-indigo-200">%</span>
                    </p>
                    <p className="mt-1 text-xs text-indigo-200">weekly practice goal</p>
                  </div>
                  <div className="flex h-14 items-end gap-1.5" aria-label="Weekly activity trend">
                    {[34, 52, 40, 76, 57, 91, 67].map((height, index) => (
                      <span
                        key={index}
                        className={`w-2.5 rounded-full ${index === 5 ? "bg-indigo-300" : "bg-white/20"}`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <BookOpenCheck size={16} />
                    <span className="text-xs font-semibold text-slate-500">Practice</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-[#142344]">12 questions</p>
                  <p className="mt-0.5 text-xs text-slate-500">One focused session</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Zap size={16} />
                    <span className="text-xs font-semibold text-slate-500">Momentum</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-[#142344]">On track</p>
                  <p className="mt-0.5 text-xs text-slate-500">You showed up today</p>
                </div>
              </div>
              <div className="relative mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-medium text-slate-500">A little progress adds up.</span>
                <span className="grid size-8 place-items-center rounded-full bg-indigo-50 text-indigo-600">
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      <section id="exams" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <Reveal className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
            <div>
              <Badge variant="outline" className="border-indigo-200 bg-white text-indigo-700">
                Find your path
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-4xl">
                One goal. <span className="text-indigo-600">A plan built for it.</span>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Choose your exam and take the next step with practice designed around what matters.
              </p>
            </div>
            <a href="#get-started" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:gap-3">
              See all exam paths <ArrowRight size={16} />
            </a>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3">
            {exams.map((exam, index) => {
              const Icon = exam.icon;
              return (
                <Reveal key={exam.name} delay={index * 0.08}>
                  <Card interactive className={`group h-full overflow-hidden bg-gradient-to-br ${exam.tint} p-6 sm:p-7`}>
                    <div className="flex items-start justify-between gap-4">
                      <span className={`grid size-12 place-items-center rounded-2xl ${exam.iconTint}`}>
                        <Icon size={22} />
                      </span>
                      <Badge variant="outline" className="border-white/80 bg-white/75 text-slate-500">
                        {exam.tag}
                      </Badge>
                    </div>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {exam.category}
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#142344]">{exam.name}</h3>
                    <p className="mt-3 min-h-[3rem] text-sm leading-6 text-slate-600">{exam.description}</p>
                    <div className="mt-5 border-t border-slate-200/70 pt-4">
                      <p className="text-xs text-slate-500">{exam.detail}</p>
                      <a
                        href="#get-started"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition group-hover:gap-3"
                        aria-label={`Explore ${exam.name} preparation`}
                      >
                        Explore this exam <ChevronRight size={16} />
                      </a>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#142344] py-14 sm:py-16">
        <div className="absolute -right-20 -top-32 size-96 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 size-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-2 gap-y-9 px-5 sm:grid-cols-4 sm:px-8 lg:px-10">
          <Reveal><StatCounter value={250} suffix="K+" label="practice questions" /></Reveal>
          <Reveal delay={0.06}><StatCounter value={40} suffix="K+" label="students learning" /></Reveal>
          <Reveal delay={0.12}><StatCounter value={92} suffix="%" label="weekly goal streaks" /></Reveal>
          <Reveal delay={0.18}><StatCounter value={4.9} suffix="/5" label="student experience" /></Reveal>
        </div>
        <p className="relative mt-8 text-center text-[10px] text-indigo-100/40">
          Sample figures shown for design preview purposes.
        </p>
      </section>

      <section id="daily-challenge" className="scroll-mt-24 bg-white/70 py-20 sm:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10">
          <Reveal>
            <Badge variant="primary" className="gap-1.5">
              <Zap size={13} /> Your daily challenge
            </Badge>
            <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#142344] sm:text-4xl">
              A few focused minutes can move you forward.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
              Take on a quick question, check your understanding, and keep your learning rhythm going.
              No pressure—just one good next step.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5"><Clock3 size={15} className="text-indigo-600" /> 2-minute challenge</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-indigo-600" /> Sample question</span>
            </div>
            <a
              href="#get-started"
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-600/15 transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Build your practice habit <ArrowRight size={16} />
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="overflow-hidden border-slate-100 p-5 shadow-[0_24px_70px_-35px_rgba(27,48,93,0.3)] sm:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                    <CircleHelp size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#142344]">Question of the day</p>
                    <p className="mt-0.5 text-xs text-slate-500">Physics · Motion</p>
                  </div>
                </div>
                <Badge variant="outline">01 / 01</Badge>
              </div>
              <div className="py-5">
                <p className="text-base font-semibold leading-7 text-[#142344] sm:text-lg">
                  Momentum is defined as which of the following?
                </p>
                <div className="mt-5 grid gap-2.5">
                  {challengeOptions.map((option) => {
                    const isSelected = selectedAnswer === option.key;
                    const isCorrect = option.key === "B";
                    return (
                      <Button
                        key={option.key}
                        variant={isSelected ? (isCorrect ? "secondary" : "outline") : "outline"}
                        size="md"
                        className={`min-h-12 w-full justify-start rounded-xl text-left ${
                          isSelected && isCorrect
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : isSelected
                              ? "border-rose-200 bg-rose-50 text-rose-800"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                        onClick={() => setSelectedAnswer(option.key)}
                        aria-pressed={isSelected}
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-500">
                          {option.key}
                        </span>
                        {option.text}
                      </Button>
                    );
                  })}
                </div>
                <p className="mt-4 min-h-5 text-sm font-medium" aria-live="polite">
                  {selectedAnswer ? (
                    selectedAnswer === "B" ? (
                      <span className="text-emerald-700">That&apos;s right! Momentum is mass multiplied by velocity.</span>
                    ) : (
                      <span className="text-rose-700">Not quite. Give it another try.</span>
                    )
                  ) : (
                    <span className="text-slate-400">Choose an answer to check your understanding.</span>
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
                <span>Sample content for preview</span>
                <span className="inline-flex items-center gap-1 font-semibold text-indigo-600">Keep learning <ArrowRight size={13} /></span>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      <section id="features" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <Badge variant="outline" className="border-indigo-200 bg-white text-indigo-700">Made for your momentum</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-4xl">
              Everything you need to <span className="text-indigo-600">keep moving.</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Thoughtful tools for the everyday work behind a big exam goal.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={index * 0.06}>
                  <Card interactive className="h-full p-5 sm:p-6">
                    <span className={`grid size-11 place-items-center rounded-2xl ${feature.tone}`}>
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-5 text-base font-semibold text-[#142344]">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p>
                  </Card>
                </Reveal>
              );
            })}
            <Reveal delay={0.3}>
              <Card className="flex h-full flex-col justify-between bg-[#142344] p-5 text-white sm:p-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-indigo-200">
                  <Sparkles size={20} />
                </span>
                <div className="mt-5">
                  <h3 className="text-base font-semibold">Your effort, made visible</h3>
                  <p className="mt-2 text-sm leading-6 text-indigo-100/70">
                    Every session is a step. Keep showing up and let the small wins add up.
                  </p>
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white/70 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <Reveal className="mb-12 max-w-xl">
            <Badge variant="primary">How it works</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-4xl">
              Three steps. <span className="text-indigo-600">One stronger you.</span>
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: GraduationCap,
                title: "Choose your exam",
                description: "Start with CET, NEET, or JEE and make the experience yours.",
              },
              {
                number: "02",
                icon: BookOpenCheck,
                title: "Practice with purpose",
                description: "Tackle focused questions and learn from clear explanations.",
              },
              {
                number: "03",
                icon: Award,
                title: "See your progress",
                description: "Celebrate consistency and discover what to work on next.",
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.number} delay={index * 0.1}>
                  <div className="relative h-full rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <span className="grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <Icon size={21} />
                      </span>
                      <span className="text-sm font-semibold tracking-[0.12em] text-indigo-200">{step.number}</span>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-[#142344]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{step.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <Reveal className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <Badge variant="outline" className="border-indigo-200 bg-white text-indigo-700">A little encouragement</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-4xl">
                Progress feels better <span className="text-indigo-600">together.</span>
              </h2>
            </div>
            <p className="max-w-md text-xs leading-5 text-slate-400">
              Sample testimonials for design preview purposes.
            </p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 0.08}>
                <Card className="h-full p-5 sm:p-6">
                  <Quote size={21} className="text-indigo-300" />
                  <p className="mt-4 min-h-[6rem] text-sm leading-7 text-slate-600">
                    “{testimonial.quote}”
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <span className={`grid size-10 place-items-center rounded-full text-sm font-semibold ${testimonial.color}`}>
                      {testimonial.initials}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#142344]">{testimonial.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{testimonial.detail}</p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="get-started" className="scroll-mt-24 px-5 pb-20 sm:px-8 sm:pb-24 lg:px-10">
        <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#142344] px-6 py-12 text-center sm:px-12 sm:py-16 lg:px-20">
          <div className="absolute -right-20 -top-40 size-96 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="absolute -bottom-48 left-1/4 size-96 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <Badge className="border border-white/15 bg-white/10 text-indigo-100">
              Your next step starts small
            </Badge>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              Your goal is worth showing up for.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-indigo-100/75 sm:text-base">
              Pick an exam, try a sample challenge, and start building a study rhythm that works for you.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href="/register"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#142344] shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
              >
                Get started <ArrowRight size={16} />
              </a>
              <a
                href="#daily-challenge"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Try a sample question
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-slate-200/80 bg-white/70">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
          <div>
            <a href="#home" className="inline-flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-[#15264b] text-white">
                <BookOpenCheck size={18} />
              </span>
              <span className="text-base font-bold tracking-tight text-[#142344]">
                northstar<span className="text-indigo-600">.</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              Thoughtful tools for your next big goal. One focused step at a time.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Explore</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <a className="transition hover:text-indigo-600" href="#exams">Exams</a>
              <a className="transition hover:text-indigo-600" href="#features">Features</a>
              <a className="transition hover:text-indigo-600" href="#daily-challenge">Daily challenge</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Company</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <a className="transition hover:text-indigo-600" href="#about">About</a>
              <a className="transition hover:text-indigo-600" href="#get-started">Contact</a>
              <a className="transition hover:text-indigo-600" href="/login">Login</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Your journey</p>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Choose a path that feels right, then take the next step.
            </p>
            <a href="/register" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:gap-2.5">
              Get started <ArrowRight size={15} />
            </a>
          </div>
        </div>
        <div className="border-t border-slate-200/80">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <span>© Northstar. All rights reserved.</span>
            <span>Sample content for a public landing page preview.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
