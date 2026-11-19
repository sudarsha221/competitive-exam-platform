"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BookOpenCheck,
  Building2,
  Camera,
  Check,
  ChevronDown,
  CircleHelp,
  Globe2,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Palette,
  Save,
  Settings,
  ShieldCheck,
  Sun,
  Upload,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { PasswordInput } from "@/components/auth/password-input";
import { LogoutButton } from "@/components/auth/logout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SettingsTab = "profile" | "general" | "appearance" | "notifications" | "security";
type AppearanceMode = "light" | "dark";
type NotificationKey = "students" | "teachers" | "challenges" | "system";
type ProfileDraft = { name: string; email: string; phone: string };
type GeneralDraft = {
  websiteName: string;
  description: string;
  language: string;
  timezone: string;
  dateFormat: string;
};
type ProfileErrors = Partial<Record<keyof ProfileDraft, string>>;
type GeneralErrors = Partial<Record<"websiteName" | "description", string>>;
type PasswordErrors = Partial<Record<"current" | "next" | "confirm", string>>;
type Feedback = { type: "success" | "error"; message: string } | null;

const initialProfile: ProfileDraft = {
  name: "Aarav Mehta",
  email: "aarav.mehta@northstar.edu",
  phone: "+91 98765 43210",
};

const initialGeneral: GeneralDraft = {
  websiteName: "Northstar",
  description: "A focused learning platform for competitive exam preparation.",
  language: "English",
  timezone: "Asia/Kolkata",
  dateFormat: "DD MMM YYYY",
};

const settingsTabs: Array<{
  id: SettingsTab;
  label: string;
  description: string;
  icon: typeof UserRound;
}> = [
  { id: "profile", label: "Admin profile", description: "Personal details and photo", icon: UserRound },
  { id: "general", label: "General", description: "Website preferences", icon: Globe2 },
  { id: "appearance", label: "Appearance", description: "Theme preview", icon: Palette },
  { id: "notifications", label: "Notifications", description: "Choose what to see", icon: Bell },
  { id: "security", label: "Security", description: "Password interface", icon: ShieldCheck },
];

const notificationOptions: Array<{
  id: NotificationKey;
  title: string;
  description: string;
}> = [
  { id: "students", title: "New student registration", description: "Get notified when a student profile is added." },
  { id: "teachers", title: "New teacher registration", description: "Get notified when a teacher profile is added." },
  { id: "challenges", title: "Daily challenge updates", description: "Receive reminders about challenge publishing and completion." },
  { id: "system", title: "System notifications", description: "See maintenance and platform status notices." },
];

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Sidebar({
  mobile = false,
  onClose,
  adminName,
}: {
  mobile?: boolean;
  onClose?: () => void;
  adminName: string;
}) {
  const links = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Analytics & leaderboard", href: "/admin/analytics", icon: Settings },
    { label: "Student management", href: "/admin/students", icon: Users },
    { label: "Teacher management", href: "/admin/teachers", icon: UserRound },
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
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="group flex min-h-10 items-center gap-3 rounded-xl px-3 text-[12px] font-medium text-slate-500 transition hover:bg-slate-50 hover:text-[#142344]"
              >
                <Icon size={16} className="text-slate-400 group-hover:text-indigo-500" />
                {item.label}
              </Link>
            );
          })}
          <span className="mx-3 my-2 border-t border-slate-100" />
          <span className="flex min-h-10 items-center gap-3 rounded-xl bg-indigo-50 px-3 text-[12px] font-semibold text-indigo-700" aria-current="page">
            <Settings size={16} className="text-indigo-600" />
            Admin settings
          </span>
        </div>
      </nav>
      <div className="shrink-0 border-t border-slate-100 p-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#142344] to-[#263d70] p-4 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-indigo-200" />
            <span className="text-xs font-semibold">Admin workspace</span>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-indigo-100/70">
            Settings are a local preview · nothing is persisted.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2.5 px-1">
          <span className="grid size-9 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{getInitials(adminName)}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-[#142344]">{adminName}</span>
            <span className="mt-0.5 block text-[10px] text-slate-400">Platform admin · sample</span>
          </span>
          <ShieldCheck size={16} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}

function SettingsHeader({ onOpenMenu, adminName }: { onOpenMenu: () => void; adminName: string }) {
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
          <p className="mt-0.5 truncate text-sm font-semibold text-[#142344]">Settings &amp; Profile</p>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button variant="ghost" size="icon" className="!size-9 !min-h-9 !min-w-9 !p-0 rounded-xl" aria-label="Help">
            <CircleHelp size={17} />
          </Button>
          <span className="mx-1 hidden h-7 w-px bg-slate-200 sm:block" />
          <div className="hidden items-center gap-2 sm:flex">
            <span className="grid size-8 place-items-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">{getInitials(adminName)}</span>
            <span>
              <span className="block text-[10px] font-semibold text-[#142344]">{adminName}</span>
              <span className="block text-[9px] text-slate-400">Administrator · sample</span>
            </span>
            <ChevronDown size={13} className="text-slate-400" />
          </div>
          <LogoutButton
            variant="outline"
            size="sm"
            className="!size-9 !min-h-9 !min-w-9 !p-0 rounded-xl sm:!h-9 sm:!w-auto sm:!px-3"
            aria-label="Log out"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Log out</span>
          </LogoutButton>
        </div>
      </div>
    </header>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-slate-100 pb-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-600">{eyebrow}</p>
      <h2 className="mt-1 text-lg font-bold tracking-tight text-[#142344]">{title}</h2>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

function FieldError({ children }: { children?: string }) {
  return children ? <p className="text-xs text-danger">{children}</p> : null;
}

function SettingsSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 ${
        checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-slate-200"
      }`}
    >
      <span className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[22px]" : "translate-x-1"}`} />
    </button>
  );
}

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [profile, setProfile] = useState<ProfileDraft>(initialProfile);
  const [general, setGeneral] = useState<GeneralDraft>(initialGeneral);
  const [appearance, setAppearance] = useState<AppearanceMode>("light");
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    students: true,
    teachers: true,
    challenges: true,
    system: false,
  });
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [generalErrors, setGeneralErrors] = useState<GeneralErrors>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});

  useEffect(() => {
    if (!profileImageUrl?.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(profileImageUrl);
  }, [profileImageUrl]);

  useEffect(() => {
    if (!logoUrl?.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(logoUrl);
  }, [logoUrl]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileMenuOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  function showSuccess(message: string) {
    setFeedback({ type: "success", message });
  }

  function showError(message: string) {
    setFeedback({ type: "error", message });
  }

  function updateProfile<Key extends keyof ProfileDraft>(key: Key, value: ProfileDraft[Key]) {
    setProfile((current) => ({ ...current, [key]: value }));
    setProfileErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handleProfileSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: ProfileErrors = {};
    if (profile.name.trim().length < 2) nextErrors.name = "Enter a name with at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!/^[+]?[\d\s()-]{7,20}$/.test(profile.phone.trim())) nextErrors.phone = "Enter a valid phone number.";
    setProfileErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      showError("Check the highlighted profile fields and try again.");
      return;
    }
    setProfile((current) => ({
      ...current,
      name: current.name.trim(),
      email: current.email.trim(),
      phone: current.phone.trim(),
    }));
    showSuccess("Profile changes are updated in this preview session only; nothing was permanently saved.");
  }

  function handleProfileImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showError("Choose an image file for the profile picture.");
      return;
    }
    setProfileImageUrl(URL.createObjectURL(file));
    showSuccess("Profile picture preview updated for this session only.");
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showError("Choose an image file for the website logo.");
      return;
    }
    setLogoUrl(URL.createObjectURL(file));
    setLogoName(file.name);
    showSuccess("Website logo preview updated for this session only.");
  }

  function updateGeneral<Key extends keyof GeneralDraft>(key: Key, value: GeneralDraft[Key]) {
    setGeneral((current) => ({ ...current, [key]: value }));
    if (key === "websiteName" || key === "description") {
      setGeneralErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  function handleGeneralSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: GeneralErrors = {};
    if (general.websiteName.trim().length < 2) nextErrors.websiteName = "Enter a website name.";
    if (general.description.trim().length < 12) nextErrors.description = "Enter a description with at least 12 characters.";
    setGeneralErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      showError("Check the highlighted general settings and try again.");
      return;
    }
    setGeneral((current) => ({
      ...current,
      websiteName: current.websiteName.trim(),
      description: current.description.trim(),
    }));
    showSuccess("General settings are updated in this preview session only; nothing was permanently saved.");
  }

  function handleNotificationSave() {
    showSuccess("Notification preferences are updated in this preview session only; nothing was permanently saved.");
  }

  function handlePasswordSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: PasswordErrors = {};
    if (!password.current) nextErrors.current = "Enter the current password to continue.";
    if (password.next.length < 8) nextErrors.next = "Use at least 8 characters for the new password.";
    if (password.next && password.next === password.current) nextErrors.next = "Choose a new password different from the current one.";
    if (!password.confirm) nextErrors.confirm = "Confirm the new password.";
    else if (password.confirm !== password.next) nextErrors.confirm = "The new passwords do not match.";
    setPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      showError("Check the highlighted password fields. No password was changed.");
      return;
    }
    setPassword({ current: "", next: "", confirm: "" });
    showSuccess("Password fields validated for this demo. No password was changed or saved.");
  }

  function changeTab(tab: SettingsTab) {
    if (activeTab === "security" && tab !== "security") {
      setPassword({ current: "", next: "", confirm: "" });
      setPasswordErrors({});
    }
    setActiveTab(tab);
    setFeedback(null);
  }

  const tabDetails = settingsTabs.find((tab) => tab.id === activeTab) ?? settingsTabs[0];
  const TabIcon = tabDetails.icon;

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[252px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <Sidebar adminName={profile.name} />
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
              <Sidebar mobile adminName={profile.name} onClose={() => setMobileMenuOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="min-h-screen lg:pl-[252px]">
        <SettingsHeader onOpenMenu={() => setMobileMenuOpen(true)} adminName={profile.name} />
        <main className="mx-auto max-w-[1600px] px-4 pb-10 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] text-slate-400">
                <Link href="/admin" className="transition hover:text-indigo-600">Admin dashboard</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page" className="text-indigo-600">Settings</span>
              </div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/70 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">
                <Settings size={12} /> WORKSPACE PREFERENCES
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#142344] sm:text-[30px]">Settings</h1>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                Manage your admin profile, workspace preferences, and notification experience.
              </p>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3.5 py-3 text-xs leading-5 text-indigo-900">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-indigo-600" />
              <p><strong className="font-semibold">Preview mode.</strong> Settings changes stay in this page session. No account, website, or password settings are connected or permanently saved.</p>
            </div>

            {feedback ? (
              <div
                role={feedback.type === "error" ? "alert" : "status"}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs ${
                  feedback.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }`}
              >
                <span className="flex items-center gap-2">
                  {feedback.type === "success" ? <Check size={15} /> : <CircleHelp size={15} />}
                  {feedback.message}
                </span>
                <button type="button" aria-label="Dismiss message" onClick={() => setFeedback(null)} className="rounded-md p-1 hover:bg-black/5">
                  <X size={14} />
                </button>
              </div>
            ) : null}

            <div className="grid items-start gap-4 lg:grid-cols-[250px_minmax(0,1fr)] xl:gap-5">
              <nav
                aria-label="Settings sections"
                role="tablist"
                aria-orientation="vertical"
                className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_8px_24px_rgba(22,37,71,0.04)] lg:grid lg:gap-1.5 lg:overflow-visible lg:p-3"
              >
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      id={`settings-tab-${tab.id}`}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="settings-panel"
                      onClick={() => changeTab(tab.id)}
                      className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-left transition lg:min-h-[60px] lg:gap-3 ${
                        active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-[#142344]"
                      }`}
                    >
                      <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${active ? "bg-white text-indigo-600 shadow-sm" : "bg-slate-50 text-slate-400"}`}>
                        <Icon size={16} />
                      </span>
                      <span className="min-w-0">
                        <span className="block whitespace-nowrap text-xs font-semibold">{tab.label}</span>
                        <span className="mt-0.5 hidden whitespace-nowrap text-[9px] text-slate-400 lg:block">{tab.description}</span>
                      </span>
                    </button>
                  );
                })}
              </nav>

              <Card className="min-w-0 overflow-hidden">
                <motion.section
                  key={activeTab}
                  id="settings-panel"
                  role="tabpanel"
                  aria-labelledby={`settings-tab-${activeTab}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="p-4 sm:p-6"
                >
                    <div className="mb-5 flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><TabIcon size={18} /></span>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">{tabDetails.description}</p>
                        <h2 className="mt-0.5 text-base font-bold text-[#142344]">{tabDetails.label}</h2>
                      </div>
                    </div>

                    {activeTab === "profile" ? (
                      <form onSubmit={handleProfileSave} className="grid gap-5">
                        <SectionHeading
                          eyebrow="Admin account"
                          title="Profile information"
                          description="Update the sample administrator details shown in the workspace."
                        />
                        <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center">
                          <span className="grid size-[68px] shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-lg font-bold text-indigo-700">
                            {profileImageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={profileImageUrl} alt="Admin profile preview" className="size-full object-cover" />
                            ) : (
                              profile.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[#142344]">Profile picture</p>
                            <p className="mt-1 text-[10px] leading-4 text-slate-500">Choose an image to preview your profile photo. It remains local to this page.</p>
                            <label className="mt-3 inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-700">
                              <Camera size={14} /> Upload picture
                              <input className="sr-only" type="file" accept="image/*" onChange={handleProfileImageChange} />
                            </label>
                          </div>
                          <Badge variant="outline" className="self-start sm:self-center">Preview only</Badge>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Input
                            label="Admin name"
                            value={profile.name}
                            onChange={(event) => updateProfile("name", event.target.value)}
                            autoComplete="name"
                            error={profileErrors.name}
                            required
                          />
                          <Input
                            label="Email address"
                            value={profile.email}
                            type="email"
                            onChange={(event) => updateProfile("email", event.target.value)}
                            autoComplete="email"
                            error={profileErrors.email}
                            required
                          />
                          <Input
                            label="Phone number"
                            value={profile.phone}
                            type="tel"
                            onChange={(event) => updateProfile("phone", event.target.value)}
                            autoComplete="tel"
                            error={profileErrors.phone}
                            required
                          />
                        </div>
                        <div className="flex justify-end border-t border-slate-100 pt-4">
                          <Button type="submit"><Save size={15} /> Save profile changes</Button>
                        </div>
                      </form>
                    ) : null}

                    {activeTab === "general" ? (
                      <form onSubmit={handleGeneralSave} className="grid gap-5">
                        <SectionHeading
                          eyebrow="Workspace identity"
                          title="General settings"
                          description="Configure the sample website identity and regional preferences."
                        />
                        <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center">
                          <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#15264b] text-white">
                            {logoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={logoUrl} alt="Website logo preview" className="size-full bg-white object-contain p-1.5" />
                            ) : (
                              <BookOpenCheck size={24} />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[#142344]">Website logo</p>
                            <p className="mt-1 truncate text-[10px] text-slate-500">{logoName || "No custom logo selected"}</p>
                            <label className="mt-3 inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-700">
                              <Upload size={14} /> Choose logo
                              <input className="sr-only" type="file" accept="image/*" onChange={handleLogoChange} />
                            </label>
                          </div>
                          <ImageIcon size={17} className="hidden shrink-0 text-slate-300 sm:block" />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Input
                            label="Website name"
                            value={general.websiteName}
                            onChange={(event) => updateGeneral("websiteName", event.target.value)}
                            error={generalErrors.websiteName}
                            required
                          />
                          <div className="grid gap-2">
                            <label htmlFor="settings-language" className="text-sm font-medium text-foreground">Default language</label>
                            <select
                              id="settings-language"
                              value={general.language}
                              onChange={(event) => updateGeneral("language", event.target.value)}
                              className="min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15"
                            >
                              <option>English</option>
                              <option>Hindi</option>
                              <option>Kannada</option>
                            </select>
                          </div>
                          <div className="grid gap-2">
                            <label htmlFor="settings-timezone" className="text-sm font-medium text-foreground">Time zone</label>
                            <select
                              id="settings-timezone"
                              value={general.timezone}
                              onChange={(event) => updateGeneral("timezone", event.target.value)}
                              className="min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15"
                            >
                              <option>Asia/Kolkata</option>
                              <option>Asia/Dubai</option>
                              <option>Europe/London</option>
                              <option>America/New_York</option>
                            </select>
                          </div>
                          <div className="grid gap-2">
                            <label htmlFor="settings-date-format" className="text-sm font-medium text-foreground">Date format</label>
                            <select
                              id="settings-date-format"
                              value={general.dateFormat}
                              onChange={(event) => updateGeneral("dateFormat", event.target.value)}
                              className="min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15"
                            >
                              <option>DD MMM YYYY</option>
                              <option>DD/MM/YYYY</option>
                              <option>MM/DD/YYYY</option>
                              <option>YYYY-MM-DD</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="settings-description" className="text-sm font-medium text-foreground">Website description</label>
                          <textarea
                            id="settings-description"
                            rows={3}
                            value={general.description}
                            onChange={(event) => updateGeneral("description", event.target.value)}
                            className={`w-full resize-y rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted/80 focus:border-ring focus:ring-4 focus:ring-ring/15 ${
                              generalErrors.description ? "border-danger focus:border-danger focus:ring-danger/15" : ""
                            }`}
                            required
                          />
                          <FieldError>{generalErrors.description}</FieldError>
                        </div>
                        <div className="flex justify-end border-t border-slate-100 pt-4">
                          <Button type="submit"><Save size={15} /> Save settings</Button>
                        </div>
                      </form>
                    ) : null}

                    {activeTab === "appearance" ? (
                      <div className="grid gap-5">
                        <SectionHeading
                          eyebrow="Display preferences"
                          title="Appearance"
                          description="Choose a theme preview and see how a dashboard card could look."
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          {([
                            { mode: "light" as const, label: "Light mode", detail: "Bright surfaces and calm contrast", icon: Sun },
                            { mode: "dark" as const, label: "Dark mode", detail: "Deep surfaces for low-light use", icon: Moon },
                          ]).map((item) => {
                            const Icon = item.icon;
                            const selected = appearance === item.mode;
                            return (
                              <button
                                key={item.mode}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => {
                                  setAppearance(item.mode);
                                  showSuccess(`${item.label} selected for the preview. The rest of the app theme is unchanged.`);
                                }}
                                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                                  selected ? "border-indigo-300 bg-indigo-50/70 ring-2 ring-indigo-100" : "border-slate-200 bg-white hover:border-indigo-200"
                                }`}
                              >
                                <span className={`grid size-10 place-items-center rounded-xl ${selected ? "bg-white text-indigo-600" : "bg-slate-50 text-slate-500"}`}><Icon size={18} /></span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-sm font-semibold text-[#142344]">{item.label}</span>
                                  <span className="mt-1 block text-[10px] text-slate-500">{item.detail}</span>
                                </span>
                                <span className={`size-4 rounded-full border-4 ${selected ? "border-indigo-600 bg-white" : "border-slate-300 bg-white"}`} />
                              </button>
                            );
                          })}
                        </div>

                        <div>
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <h3 className="text-xs font-semibold text-[#142344]">Theme preview</h3>
                              <p className="mt-1 text-[10px] text-slate-500">Preview only · this does not change the app theme.</p>
                            </div>
                            <Badge variant={appearance === "light" ? "outline" : "primary"}>{appearance === "light" ? "Light preview" : "Dark preview"}</Badge>
                          </div>
                          <motion.div
                            key={appearance}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`rounded-2xl border p-4 sm:p-5 ${
                              appearance === "light"
                                ? "border-slate-200 bg-[#f7f8fc]"
                                : "border-slate-700 bg-[#101827]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`grid size-9 place-items-center rounded-xl ${appearance === "light" ? "bg-white text-indigo-600 shadow-sm" : "bg-slate-800 text-indigo-300"}`}>
                                <Building2 size={17} />
                              </span>
                              <div>
                                <p className={`text-xs font-semibold ${appearance === "light" ? "text-[#142344]" : "text-slate-100"}`}>{general.websiteName || "Northstar"}</p>
                                <p className={`mt-0.5 text-[10px] ${appearance === "light" ? "text-slate-500" : "text-slate-400"}`}>Workspace overview</p>
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <div className={`rounded-xl border p-3 ${appearance === "light" ? "border-slate-200 bg-white" : "border-slate-700 bg-slate-800/80"}`}>
                                <p className={`text-[10px] ${appearance === "light" ? "text-slate-500" : "text-slate-400"}`}>Active learners</p>
                                <p className={`mt-1 text-lg font-bold ${appearance === "light" ? "text-[#142344]" : "text-white"}`}>2,480</p>
                              </div>
                              <div className={`rounded-xl border p-3 ${appearance === "light" ? "border-slate-200 bg-white" : "border-slate-700 bg-slate-800/80"}`}>
                                <p className={`text-[10px] ${appearance === "light" ? "text-slate-500" : "text-slate-400"}`}>Weekly growth</p>
                                <p className={`mt-1 text-lg font-bold ${appearance === "light" ? "text-emerald-700" : "text-emerald-300"}`}>+8.4%</p>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    ) : null}

                    {activeTab === "notifications" ? (
                      <div className="grid gap-5">
                        <SectionHeading
                          eyebrow="Admin alerts"
                          title="Notification settings"
                          description="Choose which sample notification types would appear in your workspace."
                        />
                        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 px-4">
                          {notificationOptions.map((option) => (
                            <div key={option.id} className="flex items-center justify-between gap-4 py-4">
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#142344]">{option.title}</p>
                                <p className="mt-1 text-[10px] leading-4 text-slate-500">{option.description}</p>
                              </div>
                              <SettingsSwitch
                                label={option.title}
                                checked={notifications[option.id]}
                                onChange={() =>
                                  setNotifications((current) => ({
                                    ...current,
                                    [option.id]: !current[option.id],
                                  }))
                                }
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col gap-3 rounded-xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-[10px] leading-4 text-slate-500">Notification preferences only affect this page preview.</p>
                          <Button onClick={handleNotificationSave}><Save size={15} /> Save preferences</Button>
                        </div>
                      </div>
                    ) : null}

                    {activeTab === "security" ? (
                      <form onSubmit={handlePasswordSave} className="grid gap-5">
                        <SectionHeading
                          eyebrow="Account protection"
                          title="Change password"
                          description="This is a non-functional interface preview. No password change will be made."
                        />
                        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-900">
                          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-amber-700" />
                          <p>For this demo, password fields are only checked in your browser and are never sent or saved.</p>
                        </div>
                        <div className="grid max-w-xl gap-4">
                          <div>
                            <PasswordInput
                              label="Current password"
                              placeholder="Enter current password"
                              value={password.current}
                              onChange={(event) => {
                                setPassword((current) => ({ ...current, current: event.target.value }));
                                setPasswordErrors((current) => ({ ...current, current: undefined }));
                              }}
                              autoComplete="current-password"
                              error={passwordErrors.current}
                              required
                            />
                          </div>
                          <div>
                            <PasswordInput
                              label="New password"
                              placeholder="At least 8 characters"
                              value={password.next}
                              onChange={(event) => {
                                setPassword((current) => ({ ...current, next: event.target.value }));
                                setPasswordErrors((current) => ({ ...current, next: undefined }));
                              }}
                              autoComplete="new-password"
                              hint="Use at least 8 characters. Avoid reusing your current password."
                              error={passwordErrors.next}
                              required
                            />
                          </div>
                          <div>
                            <PasswordInput
                              label="Confirm new password"
                              placeholder="Re-enter new password"
                              value={password.confirm}
                              onChange={(event) => {
                                setPassword((current) => ({ ...current, confirm: event.target.value }));
                                setPasswordErrors((current) => ({ ...current, confirm: undefined }));
                              }}
                              autoComplete="new-password"
                              error={passwordErrors.confirm}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex justify-end border-t border-slate-100 pt-4">
                          <Button type="submit"><ShieldCheck size={15} /> Validate password fields</Button>
                        </div>
                      </form>
                    ) : null}
                </motion.section>
              </Card>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:px-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500"><ShieldCheck size={16} /></span>
              <div>
                <p className="text-xs font-semibold text-[#142344]">Your settings stay private to this preview</p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">Nothing on this page is connected to an account service, database, or authentication provider.</p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
