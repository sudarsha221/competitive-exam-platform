import {
  ArrowUpRight,
  BookOpenCheck,
  Check,
  Flame,
  GraduationCap,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/motion";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-[#f6f8fc] lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#142344] px-10 py-9 text-white lg:flex lg:flex-col xl:px-16">
        <div className="pointer-events-none absolute -right-36 -top-32 size-[34rem] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-32 size-[32rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="auth-grid pointer-events-none absolute inset-0 opacity-30" />

        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-between">
          <Link href="/" className="inline-flex w-fit items-center gap-3" aria-label="Northstar home">
            <span className="grid size-10 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
              <BookOpenCheck size={20} />
            </span>
            <span className="text-[17px] font-bold tracking-tight">
              northstar<span className="text-indigo-300">.</span>
            </span>
          </Link>

          <FadeIn className="my-12">
            <Badge className="gap-1.5 border border-white/15 bg-white/10 px-3 py-1.5 text-indigo-100">
              <Sparkles size={13} /> A better study rhythm starts here
            </Badge>
            <h1 className="mt-6 max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.045em] xl:text-5xl">
              Your next big goal is closer than it feels.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-indigo-100/75">
              Keep your preparation focused with thoughtful practice for CET,
              NEET, and JEE—one confident step at a time.
            </p>

            <Card className="mt-9 overflow-hidden border-white/10 bg-white/[0.08] p-5 text-white shadow-none backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-indigo-300/15 text-indigo-200">
                    <Target size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Your progress, at a glance</p>
                    <p className="mt-0.5 text-xs text-indigo-100/60">Small steps count</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-indigo-200">This week</span>
              </div>
              <div className="mt-6 flex h-16 items-end gap-2">
                {[38, 58, 45, 80, 62, 92, 72].map((height, index) => (
                  <span
                    key={index}
                    className={`flex-1 rounded-t-md ${index === 5 ? "bg-indigo-300" : "bg-white/20"}`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="inline-flex items-center gap-2 text-xs text-indigo-100/75">
                  <Flame size={15} className="text-amber-300" /> Build a little momentum
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-200">
                  You&apos;ve got this <ArrowUpRight size={14} />
                </span>
              </div>
            </Card>
          </FadeIn>

          <div className="relative z-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-indigo-100/55">
            <span className="inline-flex items-center gap-1.5"><Check size={14} /> Focused practice</span>
            <span className="inline-flex items-center gap-1.5"><Check size={14} /> Clear explanations</span>
            <span className="inline-flex items-center gap-1.5"><GraduationCap size={14} /> CET · NEET · JEE</span>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-screen flex-col overflow-hidden px-5 py-5 sm:px-8 lg:px-12 lg:py-8">
        <div className="pointer-events-none absolute -right-28 top-0 size-80 rounded-full bg-indigo-200/25 blur-3xl lg:hidden" />
        <div className="relative z-10 mx-auto flex w-full max-w-[500px] flex-1 flex-col justify-center py-6 sm:py-10">
          <Link href="/" className="mb-8 inline-flex w-fit items-center gap-2.5 lg:hidden">
            <span className="grid size-9 place-items-center rounded-xl bg-[#15264b] text-white">
              <BookOpenCheck size={18} />
            </span>
            <span className="text-base font-bold tracking-tight text-[#142344]">
              northstar<span className="text-indigo-600">.</span>
            </span>
          </Link>
          <FadeIn>{children}</FadeIn>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[500px] pt-5 text-center text-[11px] text-slate-400">
          UI preview only · No authentication service is connected
        </div>
      </section>
    </main>
  );
}
