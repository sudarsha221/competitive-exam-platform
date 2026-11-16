"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { getActivityLevels, type ExamName } from "@/components/dashboard/dashboard-data";

type AnimatedStatCardProps = {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  note: string;
  tone: string;
  delay?: number;
};

export function AnimatedStatCard({
  label,
  value,
  suffix = "",
  icon: Icon,
  note,
  tone,
  delay = 0,
}: AnimatedStatCardProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -30px 0px" });
  const count = useMotionValue(0);
  const display = useTransform(count, (latest) => `${Math.round(latest).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, value, { duration: 1.2, delay, ease: "easeOut" });
    return controls.stop;
  }, [count, delay, isInView, value]);

  return (
    <Card interactive className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-[#142344] sm:text-[1.75rem]">
            <motion.span ref={ref}>{display}</motion.span>
          </p>
        </div>
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-400 sm:text-xs">
        {note}
      </p>
    </Card>
  );
}

export function ActivityCalendar({ exam }: { exam: ExamName }) {
  const levels = getActivityLevels(exam);
  const activeDays = levels.filter((level) => level > 0).length;
  const colors = [
    "bg-slate-100",
    "bg-indigo-200",
    "bg-indigo-300",
    "bg-indigo-500",
    "bg-indigo-700",
  ];

  return (
    <Card id="activity-calendar" className="min-w-0 w-full scroll-mt-24 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#142344]">Activity calendar</h2>
          <p className="mt-1 text-xs text-slate-500">A little practice adds up over time.</p>
        </div>
        <span className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700">
          {activeDays} active days
        </span>
      </div>

      <div className="mt-6 flex gap-2.5">
        <div className="grid grid-rows-7 gap-1 pt-0.5 text-[9px] leading-3 text-slate-400">
          <span>Mon</span>
          <span className="invisible">Tue</span>
          <span>Wed</span>
          <span className="invisible">Thu</span>
          <span>Fri</span>
          <span className="invisible">Sat</span>
          <span className="invisible">Sun</span>
        </div>
        <div className="grid min-w-0 flex-1 grid-flow-col grid-rows-7 gap-1">
          {levels.map((level, index) => (
            <span
              key={index}
              title={`${level === 0 ? "No" : level} practice ${level === 1 ? "session" : "sessions"} · week ${Math.floor(index / 7) + 1}`}
              aria-label={`${level === 0 ? "No" : level} practice ${level === 1 ? "session" : "sessions"}`}
              className={`aspect-square min-w-0 rounded-[3px] ${colors[level]}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 flex justify-between pl-8 text-[9px] text-slate-400">
        <span>12 weeks ago</span>
        <span>8 weeks</span>
        <span>4 weeks</span>
        <span>This week</span>
      </div>
      <div className="mt-5 flex items-center justify-end gap-1.5 text-[10px] text-slate-400">
        <span>Less</span>
        {colors.map((color) => <span key={color} className={`size-2.5 rounded-[2px] ${color}`} />)}
        <span>More</span>
      </div>
    </Card>
  );
}

export function PerformanceChart({
  exam,
  values,
}: {
  exam: ExamName;
  values: number[];
}) {
  const width = 680;
  const left = 38;
  const right = 664;
  const top = 18;
  const bottom = 188;
  const points = values.map((value, index) => ({
    x: left + (index * (right - left)) / (values.length - 1),
    y: bottom - ((value - 60) / 40) * (bottom - top),
  }));
  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${right} ${bottom} L ${left} ${bottom} Z`;
  const average = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

  return (
    <Card id="performance" className="min-w-0 w-full scroll-mt-24 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#142344]">Weekly performance</h2>
          <p className="mt-1 text-xs text-slate-500">Accuracy across your recent practice sessions.</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-[#142344]">{average}%</p>
          <p className="text-[10px] text-emerald-600">Weekly average</p>
        </div>
      </div>

      <div className="mt-5">
        <motion.svg
          key={exam}
          viewBox={`0 0 ${width} 220`}
          preserveAspectRatio="none"
          className="h-44 w-full overflow-visible"
          role="img"
          aria-label={`${exam} weekly accuracy chart`}
        >
          <defs>
            <linearGradient id={`chart-fill-${exam}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[60, 70, 80, 90, 100].map((tick) => {
            const y = bottom - ((tick - 60) / 40) * (bottom - top);
            return (
              <g key={tick}>
                <line x1={left} x2={right} y1={y} y2={y} stroke="#e9edf5" strokeDasharray="3 5" />
                <text x="0" y={y + 3} fill="#94a3b8" fontSize="9">{tick}%</text>
              </g>
            );
          })}
          <motion.path
            d={areaPath}
            fill={`url(#chart-fill-${exam})`}
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
            transition={{ duration: 1, ease: "easeOut" }}
          />
          {points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#ffffff"
              stroke="#4f46e5"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.06, duration: 0.2 }}
            />
          ))}
        </motion.svg>
        <div className="ml-[38px] mr-1 flex justify-between text-[10px] text-slate-400">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span key={day}>{day}</span>)}
        </div>
      </div>
    </Card>
  );
}
