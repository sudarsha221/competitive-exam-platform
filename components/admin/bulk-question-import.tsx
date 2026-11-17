"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Bell,
  BookOpen,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  CloudUpload,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  FileUp,
  GraduationCap,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  questionDifficultyOptions,
  type AdminDifficulty,
} from "@/components/admin/question-data";
import { initialAdminChapters } from "@/components/admin/chapter-data";
import { initialAdminSubtopics } from "@/components/admin/subtopic-data";
import {
  initialAdminSubjects,
  subjectExamOptions,
  type SubjectExam,
} from "@/components/admin/subject-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ImportMethodId = "spreadsheet" | "word" | "pdf";
type ImportFile = {
  file: File;
  method: ImportMethodId;
};
type ImportMethod = {
  id: ImportMethodId;
  title: string;
  description: string;
  formats: string;
  accept: string;
  extensions: string[];
  icon: typeof FileSpreadsheet;
  accent: string;
};
type PreviewQuestion = {
  id: string;
  prompt: string;
  options: [string, string, string, string];
  correctAnswer: string;
  explanation: string;
  difficulty: AdminDifficulty;
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_FILE_SIZE_LABEL = "10 MB";

const importMethods: ImportMethod[] = [
  {
    id: "spreadsheet",
    title: "Excel / CSV Import",
    description: "Spreadsheet question files",
    formats: ".xlsx, .xls, .csv",
    accept: ".xlsx,.xls,.csv",
    extensions: [".xlsx", ".xls", ".csv"],
    icon: FileSpreadsheet,
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "word",
    title: "Word Import",
    description: "Formatted question documents",
    formats: ".docx",
    accept: ".docx",
    extensions: [".docx"],
    icon: FileText,
    accent: "bg-blue-50 text-blue-700",
  },
  {
    id: "pdf",
    title: "PDF Import",
    description: "Question sheets and handouts",
    formats: ".pdf",
    accept: ".pdf",
    extensions: [".pdf"],
    icon: FileUp,
    accent: "bg-rose-50 text-rose-700",
  },
];

const workflowStages = [
  "Select file",
  "Upload file",
  "Preview questions",
  "Validate",
  "Confirm import",
] as const;

const answerLabels = ["A", "B", "C", "D"] as const;
const defaultPreviewQuestions: Omit<PreviewQuestion, "difficulty">[] = [
  {
    id: "PREVIEW-001",
    prompt: "A 2 kg object accelerates at 3 m/s². What is the net force acting on it?",
    options: ["1 N", "5 N", "6 N", "9 N"],
    correctAnswer: "C",
    explanation: "Newton's second law gives F = ma. Multiplying 2 kg by 3 m/s² gives 6 N.",
  },
  {
    id: "PREVIEW-002",
    prompt: "Which principle states that energy cannot be created or destroyed?",
    options: [
      "Conservation of energy",
      "Conservation of charge",
      "Newton's first law",
      "Ohm's law",
    ],
    correctAnswer: "A",
    explanation: "The conservation of energy principle states that energy changes form but the total amount is conserved.",
  },
  {
    id: "PREVIEW-003",
    prompt: "Which quantity is measured in joules?",
    options: ["Force", "Power", "", "Acceleration"],
    correctAnswer: "",
    explanation: "",
  },
];

const navigationItems = [
  { label: "Admin overview", href: "/admin", icon: LayoutDashboard },
  { label: "Exam management", href: "/admin/exams", icon: GraduationCap },
  { label: "Subject management", href: "/admin/subjects", icon: BookOpen },
  { label: "Chapter management", href: "/admin/chapters", icon: Layers3 },
  { label: "Question bank", href: "/admin/questions", icon: FileCheck2 },
  { label: "Bulk question import", href: "/admin/import", icon: CloudUpload },
];

function getSubjectsForExam(exam: SubjectExam) {
  return [...new Set(initialAdminSubjects
    .filter((subject) => subject.exam === exam)
    .map((subject) => subject.name))];
}

function getChaptersForSubject(exam: SubjectExam, subject: string) {
  return initialAdminChapters
    .filter((chapter) => chapter.exam === exam && chapter.subject === subject)
    .map((chapter) => chapter.name);
}

function getSubtopicsForChapter(exam: SubjectExam, subject: string, chapter: string) {
  return initialAdminSubtopics
    .filter((subtopic) =>
      subtopic.exam === exam
      && subtopic.subject === subject
      && subtopic.chapter === chapter,
    )
    .map((subtopic) => subtopic.name);
}

function BulkImportSidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
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
      <nav aria-label="Admin bulk import" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Platform administration
        </p>
        <div className="grid gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/admin/import";
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`group flex min-h-10 items-center gap-3 rounded-xl px-3 text-[12px] font-medium transition ${
                  active ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-[#142344]"
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
            <ShieldCheck size={15} className="text-indigo-200" />
            <span className="text-xs font-semibold">Admin workspace</span>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-indigo-100/70">
            Import preview only · no files are sent or stored.
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

function ImportHeader({
  sidebarOpen,
  onOpenMenu,
  profileOpen,
  onToggleProfile,
  notificationsOpen,
  onToggleNotifications,
  onLogout,
}: {
  sidebarOpen: boolean;
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
          aria-label={sidebarOpen ? "Admin navigation is open" : "Open admin navigation"}
          aria-expanded={sidebarOpen}
          onClick={onOpenMenu}
        >
          <Menu size={18} />
        </Button>
        <div className="min-w-0 max-[380px]:hidden">
          <p className="truncate text-[10px] text-slate-400">Admin workspace</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-[#142344]">Bulk Question Import</p>
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
                  <p className="mt-3 text-xs font-semibold text-[#142344]">Import preview is ready</p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">This workspace uses sample data only.</p>
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
                  className="absolute right-0 top-12 w-56 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"
                >
                  <p className="text-xs font-semibold text-[#142344]">Aarav Mehta</p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">Profile settings are not connected in this preview.</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden !size-9 !min-h-9 !min-w-9 !p-0 rounded-xl sm:inline-flex sm:!h-9 sm:!w-auto sm:!px-3 max-[380px]:!hidden"
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

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function validatePreviewQuestion(question: PreviewQuestion) {
  const missing: string[] = [];
  if (!question.prompt.trim()) missing.push("Question");
  question.options.forEach((option, index) => {
    if (!option.trim()) missing.push(`Option ${answerLabels[index]}`);
  });
  if (!answerLabels.includes(question.correctAnswer as (typeof answerLabels)[number])) {
    missing.push("Correct answer");
  }
  if (!question.explanation.trim()) missing.push("Explanation");
  return { valid: missing.length === 0, missing };
}

function ImportMethodCard({
  method,
  selectedFile,
  error,
  onSelectFile,
}: {
  method: ImportMethod;
  selectedFile: File | null;
  error: string;
  onSelectFile: (file: File, method: ImportMethodId) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const Icon = method.icon;

  function acceptFile(file: File) {
    onSelectFile(file, method.id);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) acceptFile(file);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) acceptFile(file);
  }

  return (
    <Card className={`min-w-0 p-4 transition hover:-translate-y-0.5 hover:shadow-lg sm:p-5 ${dragging ? "border-indigo-400 ring-4 ring-indigo-100" : ""}`}>
      <input
        ref={inputRef}
        type="file"
        accept={method.accept}
        aria-label={`Choose ${method.title} file`}
        className="sr-only"
        onChange={handleInputChange}
      />
      <div className="flex items-start gap-3">
        <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${method.accent}`}>
          <Icon size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-[#142344]">{method.title}</span>
          <span className="mt-1 block text-[11px] leading-5 text-slate-500">{method.description}</span>
        </span>
        <Badge variant={selectedFile ? "success" : "outline"}>{selectedFile ? "Selected" : method.formats}</Badge>
      </div>
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={handleDrop}
        className={`mt-4 rounded-2xl border border-dashed p-4 text-center transition ${
          dragging ? "border-indigo-400 bg-indigo-50/60" : "border-slate-200 bg-slate-50/70"
        }`}
      >
        {selectedFile ? (
          <div className="flex items-center gap-3 text-left">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <FileCheck2 size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-[#142344]" title={selectedFile.name}>
                {selectedFile.name}
              </span>
              <span className="mt-1 block text-[10px] text-slate-500">{formatFileSize(selectedFile.size)} · selected locally</span>
            </span>
          </div>
        ) : (
          <>
            <CloudUpload size={23} className="mx-auto text-indigo-500" />
            <p className="mt-2 text-xs font-semibold text-[#142344]">Drag and drop your file</p>
            <p className="mt-1 text-[10px] text-slate-400">or choose a file from your device</p>
          </>
        )}
        <Button
          type="button"
          variant={selectedFile ? "outline" : "secondary"}
          size="sm"
          className="mt-3 gap-2"
          onClick={() => inputRef.current?.click()}
        >
          <FileUp size={14} />
          {selectedFile ? "Replace file" : "Browse files"}
        </Button>
      </div>
      {error ? (
        <p role="alert" className="mt-3 flex items-start gap-2 text-[11px] leading-4 text-rose-700">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : (
        <p className="mt-3 text-[10px] text-slate-400">Accepted: {method.formats} · Max size {MAX_FILE_SIZE_LABEL}</p>
      )}
    </Card>
  );
}

function ImportConfiguration({
  exam,
  subject,
  chapter,
  subtopic,
  difficulty,
  onChangeExam,
  onChangeSubject,
  onChangeChapter,
  onChangeSubtopic,
  onChangeDifficulty,
}: {
  exam: SubjectExam;
  subject: string;
  chapter: string;
  subtopic: string;
  difficulty: AdminDifficulty;
  onChangeExam: (value: SubjectExam) => void;
  onChangeSubject: (value: string) => void;
  onChangeChapter: (value: string) => void;
  onChangeSubtopic: (value: string) => void;
  onChangeDifficulty: (value: AdminDifficulty) => void;
}) {
  const subjects = getSubjectsForExam(exam);
  const chapters = getChaptersForSubject(exam, subject);
  const subtopics = getSubtopicsForChapter(exam, subject, chapter);
  const fields: {
    label: string;
    value: string;
    options: readonly string[];
    onChange: (value: string) => void;
    id: string;
  }[] = [
    { label: "Exam", value: exam, options: subjectExamOptions, onChange: (value) => onChangeExam(value as SubjectExam), id: "import-exam" },
    { label: "Subject", value: subject, options: subjects, onChange: onChangeSubject, id: "import-subject" },
    { label: "Chapter", value: chapter, options: chapters, onChange: onChangeChapter, id: "import-chapter" },
    { label: "Subtopic", value: subtopic, options: subtopics, onChange: onChangeSubtopic, id: "import-subtopic" },
    { label: "Default difficulty", value: difficulty, options: questionDifficultyOptions, onChange: (value) => onChangeDifficulty(value as AdminDifficulty), id: "import-difficulty" },
  ];

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-[#142344]">Import configuration</h2>
        <p className="mt-1 text-[11px] text-slate-500">Set the catalog defaults that would be applied to imported questions.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {fields.map((field) => (
          <label key={field.id} htmlFor={field.id} className="grid min-w-0 gap-1.5">
            <span className="text-[10px] font-semibold text-slate-500">{field.label}</span>
            <span className="relative">
              <select
                id={field.id}
                aria-label={field.label}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-[#142344] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              >
                {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </span>
          </label>
        ))}
      </div>
    </Card>
  );
}

function WorkflowProgress({
  activeStage,
  imported,
}: {
  activeStage: number;
  imported: boolean;
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-[#142344]">Import workflow</h2>
          <p className="mt-1 text-[11px] text-slate-500">Follow each step to review the local demonstration.</p>
        </div>
        <Badge variant="primary">Frontend demo</Badge>
      </div>
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {workflowStages.map((stage, index) => {
          const complete = imported || index < activeStage;
          const current = !imported && index === activeStage;
          return (
            <li
              key={stage}
              aria-current={current ? "step" : undefined}
              className={`flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-[10px] font-medium transition ${
                complete
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : current
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                    : "border-slate-100 bg-slate-50 text-slate-400"
              }`}
            >
              <span className={`grid size-6 shrink-0 place-items-center rounded-lg text-[10px] font-bold ${
                complete ? "bg-emerald-600 text-white" : current ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
              }`}>
                {complete ? <Check size={13} /> : index + 1}
              </span>
              <span className="truncate">{stage}</span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

function PreviewTable({
  questions,
  validated,
}: {
  questions: PreviewQuestion[];
  validated: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full min-w-[1180px] border-collapse text-left text-[11px]">
        <thead className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="w-12 px-3 py-3">#</th>
            <th scope="col" className="min-w-[220px] px-3 py-3">Question</th>
            {answerLabels.map((label) => <th key={label} scope="col" className="min-w-[135px] px-3 py-3">Option {label}</th>)}
            <th scope="col" className="w-24 px-3 py-3">Correct answer</th>
            <th scope="col" className="min-w-[190px] px-3 py-3">Explanation</th>
            <th scope="col" className="w-28 px-3 py-3">Difficulty</th>
            <th scope="col" className="w-36 px-3 py-3">Validation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {questions.map((question, index) => {
            const result = validatePreviewQuestion(question);
            return (
              <tr
                key={question.id}
                className={`align-top transition ${result.valid ? "bg-white" : "bg-rose-50/60"}`}
              >
                <td className="px-3 py-3 font-semibold text-slate-500">{index + 1}</td>
                <td className={`px-3 py-3 leading-5 ${question.prompt.trim() ? "text-[#142344]" : "bg-rose-100 text-rose-700"}`}>
                  {question.prompt || <span className="font-medium">Missing question</span>}
                </td>
                {question.options.map((option, optionIndex) => (
                  <td
                    key={answerLabels[optionIndex]}
                    className={`px-3 py-3 leading-5 ${
                      option.trim()
                        ? "text-slate-600"
                        : "bg-rose-100 font-semibold text-rose-700"
                    }`}
                  >
                    {option || `Missing option ${answerLabels[optionIndex]}`}
                  </td>
                ))}
                <td className={`px-3 py-3 font-semibold ${question.correctAnswer ? "text-indigo-700" : "bg-rose-100 text-rose-700"}`}>
                  {question.correctAnswer || "Missing"}
                </td>
                <td className={`px-3 py-3 leading-5 ${question.explanation.trim() ? "text-slate-600" : "bg-rose-100 font-medium text-rose-700"}`}>
                  {question.explanation || "Missing explanation"}
                </td>
                <td className="px-3 py-3">
                  <Badge variant="primary">{question.difficulty}</Badge>
                </td>
                <td className="px-3 py-3">
                  {result.valid ? (
                    <Badge variant="success">{validated ? "Valid" : "Ready"}</Badge>
                  ) : (
                    <span className="inline-flex max-w-[140px] items-start gap-1.5 text-[10px] leading-4 text-rose-700">
                      <AlertCircle size={13} className="mt-0.5 shrink-0" />
                      {validated ? `Missing ${result.missing.join(", ")}` : "Needs attention"}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  detail: string;
  icon: typeof FileSpreadsheet;
  tone: string;
}) {
  return (
    <motion.div whileHover={{ y: -3 }}>
      <Card className="relative overflow-hidden p-4 sm:p-5">
        <span className={`absolute -right-4 -top-5 size-20 rounded-full opacity-50 blur-2xl ${tone}`} />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-slate-500 sm:text-xs">{label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-[#142344] sm:text-3xl">{value.toLocaleString()}</p>
            <p className="mt-1 text-[10px] leading-4 text-slate-400">{detail}</p>
          </div>
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone} text-indigo-700`}>
            <Icon size={18} />
          </span>
        </div>
      </Card>
    </motion.div>
  );
}

function fileExtension(name: string) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
}

export function BulkQuestionImport() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<ImportFile | null>(null);
  const [fileError, setFileError] = useState<{ method: ImportMethodId; message: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [validated, setValidated] = useState(false);
  const [imported, setImported] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [questions, setQuestions] = useState<PreviewQuestion[]>([]);
  const [exam, setExam] = useState<SubjectExam>("KCET");
  const [subject, setSubject] = useState(getSubjectsForExam("KCET")[0] ?? "");
  const [chapter, setChapter] = useState(getChaptersForSubject("KCET", getSubjectsForExam("KCET")[0] ?? "")[0] ?? "");
  const [subtopic, setSubtopic] = useState(getSubtopicsForChapter(
    "KCET",
    getSubjectsForExam("KCET")[0] ?? "",
    getChaptersForSubject("KCET", getSubjectsForExam("KCET")[0] ?? "")[0] ?? "",
  )[0] ?? "");
  const [defaultDifficulty, setDefaultDifficulty] = useState<AdminDifficulty>("Medium");
  const [stats, setStats] = useState({
    imported: 2840,
    successful: 2756,
    failed: 84,
    pending: 126,
  });
  const selectedMethod = selectedFile
    ? importMethods.find((method) => method.id === selectedFile.method) ?? null
    : null;
  const validationResults = questions.map((question) => validatePreviewQuestion(question));
  const validCount = validationResults.filter((result) => result.valid).length;
  const invalidCount = questions.length - validCount;
  const activeStage = imported ? workflowStages.length : !selectedFile ? 0 : isUploading
    ? 1
    : !uploaded ? 1
      : !previewReady ? 2
        : !validated ? 3
          : 4;

  function resetWorkflow() {
    setSelectedFile(null);
    setFileError(null);
    setIsUploading(false);
    setUploaded(false);
    setPreviewReady(false);
    setValidated(false);
    setImported(false);
    setQuestions([]);
    setFeedback("");
  }

  function handleFileSelection(file: File, methodId: ImportMethodId) {
    const method = importMethods.find((item) => item.id === methodId);
    if (!method) return;

    const extension = fileExtension(file.name);
    if (!method.extensions.includes(extension)) {
      setFileError({
        method: methodId,
        message: `Unsupported file type. Choose ${method.formats}.`,
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError({
        method: methodId,
        message: `File exceeds the ${MAX_FILE_SIZE_LABEL} limit. Choose a smaller file.`,
      });
      return;
    }

    resetWorkflow();
    setSelectedFile({ file, method: methodId });
    setFileError(null);
    setFeedback(`${file.name} is selected locally. No file has been uploaded.`);
  }

  function startLocalUpload() {
    if (!selectedFile || isUploading) return;
    setIsUploading(true);
    setFeedback("Simulating upload progress locally. The selected file is not sent to a server.");
    window.setTimeout(() => {
      setIsUploading(false);
      setUploaded(true);
      setFeedback("Local upload simulation complete. The file remains in your browser.");
    }, 850);
  }

  function generateMockPreview() {
    if (!uploaded) return;
    setQuestions(defaultPreviewQuestions.map((question) => ({
      ...question,
      options: [...question.options] as [string, string, string, string],
      difficulty: defaultDifficulty,
    })));
    setPreviewReady(true);
    setValidated(false);
    setImported(false);
    setFeedback("Mock preview generated. These sample questions were not extracted from your file.");
  }

  function validateQuestions() {
    if (!previewReady) return;
    setValidated(true);
    setFeedback(`${validCount} valid and ${invalidCount} invalid sample rows found. Review invalid fields before confirming.`);
  }

  function confirmImport() {
    if (!validated || validCount === 0) return;
    setStats((current) => ({
      imported: current.imported + validCount + invalidCount,
      successful: current.successful + validCount,
      failed: current.failed + invalidCount,
      pending: current.pending + validCount,
    }));
    setImported(true);
    setFeedback(`Demo complete: ${validCount} sample rows accepted and ${invalidCount} skipped. Nothing was saved to a database.`);
  }

  function handleExamChange(nextExam: SubjectExam) {
    const nextSubject = getSubjectsForExam(nextExam)[0] ?? "";
    const nextChapter = getChaptersForSubject(nextExam, nextSubject)[0] ?? "";
    setExam(nextExam);
    setSubject(nextSubject);
    setChapter(nextChapter);
    setSubtopic(getSubtopicsForChapter(nextExam, nextSubject, nextChapter)[0] ?? "");
  }

  function handleSubjectChange(nextSubject: string) {
    const nextChapter = getChaptersForSubject(exam, nextSubject)[0] ?? "";
    setSubject(nextSubject);
    setChapter(nextChapter);
    setSubtopic(getSubtopicsForChapter(exam, nextSubject, nextChapter)[0] ?? "");
  }

  function handleChapterChange(nextChapter: string) {
    setChapter(nextChapter);
    setSubtopic(getSubtopicsForChapter(exam, subject, nextChapter)[0] ?? "");
  }

  function updateDifficulty(nextDifficulty: AdminDifficulty) {
    setDefaultDifficulty(nextDifficulty);
    setQuestions((current) => current.map((question) => ({ ...question, difficulty: nextDifficulty })));
  }

  const metricCards = [
    { label: "Total imported questions", value: stats.imported, detail: "Sample platform total", icon: FileSpreadsheet, tone: "bg-indigo-100" },
    { label: "Successfully imported", value: stats.successful, detail: "Local demo outcomes", icon: CheckCircle2, tone: "bg-emerald-100" },
    { label: "Failed imports", value: stats.failed, detail: "Sample validation failures", icon: AlertCircle, tone: "bg-rose-100" },
    { label: "Pending review", value: stats.pending, detail: "Sample questions for review", icon: CircleHelp, tone: "bg-amber-100" },
  ];

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#142344]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <BulkImportSidebar />
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
              <BulkImportSidebar mobile onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
      <div className="min-h-screen lg:pl-[252px]">
        <ImportHeader
          sidebarOpen={sidebarOpen}
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
            setFeedback("Sign-out is not connected in this frontend preview.");
            setNotificationsOpen(false);
            setProfileOpen(false);
          }}
        />
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto w-full min-w-0 max-w-[1600px] px-4 pb-12 pt-5 sm:px-6 sm:pt-7 lg:px-8"
        >
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Link href="/admin" className="transition hover:text-indigo-600">Admin dashboard</Link>
                <span>/</span>
                <span className="text-indigo-600">Bulk Question Import</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#142344] sm:text-3xl">Bulk Question Import</h1>
              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                Review a guided import workflow for your exam question catalog.
              </p>
            </div>
            {selectedFile ? (
              <Button variant="outline" onClick={resetWorkflow} className="gap-2">
                <X size={15} /> Start over
              </Button>
            ) : null}
          </div>

          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-xs leading-5 text-indigo-900">
            <CircleHelp size={17} className="mt-0.5 shrink-0 text-indigo-600" />
            <p>
              <span className="font-semibold">Frontend demonstration only.</span> Files stay in your browser. Upload progress is simulated, and the preview below uses mock rows—it does not extract content from Excel, Word, or PDF files.
            </p>
          </div>

          <AnimatePresence>
            {feedback ? (
              <motion.div
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800"
              >
                <span>{feedback}</span>
                <Button variant="ghost" size="icon" aria-label="Dismiss message" onClick={() => setFeedback("")}>
                  <X size={15} />
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <section aria-label="Import statistics" className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <MetricCard {...metric} />
              </motion.div>
            ))}
          </section>

          <section aria-labelledby="import-methods-title" className="mb-5">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 id="import-methods-title" className="text-sm font-semibold text-[#142344]">Choose an import method</h2>
                <p className="mt-1 text-[11px] text-slate-500">One file per preview · up to {MAX_FILE_SIZE_LABEL} · accepted formats vary by method.</p>
              </div>
              {selectedMethod ? <Badge variant="primary">{selectedMethod.title}</Badge> : null}
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              {importMethods.map((method) => (
                <ImportMethodCard
                  key={method.id}
                  method={method}
                  selectedFile={selectedFile?.method === method.id ? selectedFile.file : null}
                  error={fileError?.method === method.id ? fileError.message : ""}
                  onSelectFile={handleFileSelection}
                />
              ))}
            </div>
          </section>

          <div className="mb-5 grid gap-5">
            <WorkflowProgress activeStage={activeStage} imported={imported} />
            <ImportConfiguration
              exam={exam}
              subject={subject}
              chapter={chapter}
              subtopic={subtopic}
              difficulty={defaultDifficulty}
              onChangeExam={handleExamChange}
              onChangeSubject={handleSubjectChange}
              onChangeChapter={handleChapterChange}
              onChangeSubtopic={setSubtopic}
              onChangeDifficulty={updateDifficulty}
            />
          </div>

          <Card className="mb-5 overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-[#142344]">Import preview</h2>
                  {previewReady ? <Badge variant="warning">Mock data</Badge> : <Badge variant="outline">Waiting for file</Badge>}
                </div>
                <p className="mt-1 max-w-3xl text-[11px] leading-5 text-slate-500">
                  {previewReady
                    ? `Preview rows are examples only—not extracted from ${selectedFile?.file.name ?? "a file"}. Review required fields and validation status.`
                    : "Select a file, then start the local demo to display mock question rows."}
                </p>
              </div>
              {previewReady ? (
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success">{validCount} valid</Badge>
                  <Badge variant={invalidCount ? "warning" : "outline"}>{invalidCount} need review</Badge>
                </div>
              ) : null}
            </div>
            {previewReady ? (
              <div className="p-3 sm:p-4">
                <PreviewTable questions={questions} validated={validated} />
                <p className="mt-2 text-[10px] text-slate-400">Scroll horizontally to review all columns on smaller screens.</p>
              </div>
            ) : (
              <div className="grid min-h-52 place-items-center px-5 py-10 text-center">
                <div className="max-w-sm">
                  <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <FileSpreadsheet size={20} />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-[#142344]">No preview generated yet</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {selectedFile
                      ? "Run the local upload simulation to enable the mock preview."
                      : "Choose an Excel, Word, or PDF file to begin. The selected file will not be sent anywhere."}
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
              <div>
                <h2 className="text-sm font-semibold text-[#142344]">Review and confirm</h2>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">Only valid mock rows are included in the local completion summary.</p>
              </div>
              {imported ? <Badge variant="success"><CheckCircle2 size={13} className="mr-1" /> Demo complete</Badge> : null}
            </div>
            <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex min-w-0 items-start gap-2.5">
                {imported ? (
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                ) : (
                  <CircleHelp size={17} className="mt-0.5 shrink-0 text-slate-400" />
                )}
                <p className="text-[11px] leading-5 text-slate-500">
                  {imported
                    ? `${validCount} sample rows accepted · ${invalidCount} invalid rows skipped. No records were persisted.`
                    : validated
                      ? `${validCount} valid and ${invalidCount} invalid rows. The confirmation updates only the sample counters on this page.`
                      : "Confirm becomes available after preview validation. Invalid rows are highlighted and excluded from the demo."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                {selectedFile && !uploaded ? (
                  <Button onClick={startLocalUpload} disabled={isUploading} className="gap-2">
                    <CloudUpload size={15} />
                    {isUploading ? "Simulating upload…" : "Start local upload demo"}
                  </Button>
                ) : null}
                {uploaded && !previewReady ? (
                  <Button onClick={generateMockPreview} className="gap-2">
                    <FileSpreadsheet size={15} /> Generate mock preview
                  </Button>
                ) : null}
                {previewReady && !validated ? (
                  <Button variant="secondary" onClick={validateQuestions} className="gap-2">
                    <CheckCircle2 size={15} /> Validate preview
                  </Button>
                ) : null}
                {validated && !imported ? (
                  <Button onClick={confirmImport} disabled={validCount === 0} className="gap-2">
                    <Check size={15} /> Confirm demo import ({validCount})
                  </Button>
                ) : null}
                {imported ? (
                  <Button variant="outline" onClick={resetWorkflow} className="gap-2">
                    <FileUp size={15} /> Import another file
                  </Button>
                ) : null}
              </div>
            </div>
            {selectedFile && isUploading ? (
              <div className="border-t border-slate-100 px-4 py-3 sm:px-5">
                <div className="mb-1.5 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Simulated upload progress</span>
                  <span>65%</span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Simulated upload progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={65}
                  className="h-2 overflow-hidden rounded-full bg-slate-100"
                >
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            ) : null}
          </Card>

          <div className="mt-5 flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[10px] leading-5 text-slate-500">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-slate-400" />
            <p>Privacy note: this UI does not transmit or persist the selected file. Excel, Word, and PDF extraction and backend import are not implemented.</p>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
