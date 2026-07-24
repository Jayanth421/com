"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Mail,
  MessageCircle,
  Smartphone,
  Bell,
  Send,
  Hash,
  Slack,
  Globe,
  Users,
  BrainCircuit,
  FileText,
  CalendarClock,
  ShieldCheck,
  Webhook,
  BarChart2,
  HardDriveDownload,
  KeyRound,
  ScrollText,
  ChevronRight,
  Upload,
  RotateCcw,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Zap,
  RefreshCw,
  Download,
  Eye,
  Info,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Section =
  | "general"
  | "email-smtp"
  | "whatsapp"
  | "sms-gateway"
  | "in-app"
  | "push"
  | "telegram"
  | "slack"
  | "discord"
  | "ms-teams"
  | "ai-integrations"
  | "templates"
  | "scheduling"
  | "security"
  | "webhooks"
  | "analytics"
  | "backup"
  | "api-keys"
  | "logs";

interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
}

// ─── Sidebar Nav ───────────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  { id: "general",        label: "General",             icon: <Settings size={15} /> },
  { id: "email-smtp",     label: "Email (SMTP)",        icon: <Mail size={15} /> },
  { id: "whatsapp",       label: "WhatsApp",            icon: <MessageCircle size={15} /> },
  { id: "sms-gateway",    label: "SMS Gateway",         icon: <Smartphone size={15} /> },
  { id: "in-app",         label: "In-App Notifications",icon: <Bell size={15} /> },
  { id: "push",           label: "Push Notifications",  icon: <Send size={15} /> },
  { id: "telegram",       label: "Telegram",            icon: <Send size={15} /> },
  { id: "slack",          label: "Slack",               icon: <Hash size={15} /> },
  { id: "discord",        label: "Discord",             icon: <Hash size={15} /> },
  { id: "ms-teams",       label: "Microsoft Teams",     icon: <Users size={15} /> },
  { id: "ai-integrations",label: "AI Integrations",     icon: <BrainCircuit size={15} /> },
  { id: "templates",      label: "Templates",           icon: <FileText size={15} /> },
  { id: "scheduling",     label: "Scheduling",          icon: <CalendarClock size={15} /> },
  { id: "security",       label: "Security",            icon: <ShieldCheck size={15} /> },
  { id: "webhooks",       label: "Webhooks",            icon: <Webhook size={15} /> },
  { id: "analytics",      label: "Analytics",           icon: <BarChart2 size={15} /> },
  { id: "backup",         label: "Backup & Restore",    icon: <HardDriveDownload size={15} /> },
  { id: "api-keys",       label: "API Keys",            icon: <KeyRound size={15} /> },
  { id: "logs",           label: "Logs",                icon: <ScrollText size={15} /> },
];

// ─── Integration Cards data ────────────────────────────────────────────────────

interface Integration {
  id: Section;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  status: "Connected" | "Active" | "Inactive" | "Error";
  lastTest: string;
  testAction: string;
}

const integrations: Integration[] = [
  { id: "email-smtp",  label: "Email (SMTP)",     icon: <Mail size={20} />,           iconBg: "bg-blue-100 text-blue-600",     status: "Connected", lastTest: "24 Jul 2025, 10:30 AM", testAction: "Test Email" },
  { id: "whatsapp",    label: "WhatsApp",          icon: <MessageCircle size={20} />,  iconBg: "bg-green-100 text-green-600",   status: "Connected", lastTest: "24 Jul 2025, 09:45 AM", testAction: "Send Test" },
  { id: "sms-gateway", label: "SMS Gateway",       icon: <Smartphone size={20} />,     iconBg: "bg-orange-100 text-orange-600", status: "Connected", lastTest: "24 Jul 2025, 09:20 AM", testAction: "Test SMS" },
  { id: "push",        label: "Push Notifications",icon: <Bell size={20} />,           iconBg: "bg-pink-100 text-pink-600",     status: "Active",    lastTest: "24 Jul 2025, 10:10 AM", testAction: "Test Push" },
  { id: "telegram",    label: "Telegram",          icon: <Send size={20} />,           iconBg: "bg-sky-100 text-sky-600",       status: "Connected", lastTest: "24 Jul 2025, 09:50 AM", testAction: "Test Telegram" },
  { id: "slack",       label: "Slack",             icon: <Hash size={20} />,           iconBg: "bg-purple-100 text-purple-600", status: "Connected", lastTest: "24 Jul 2025, 09:55 AM", testAction: "Test Slack" },
  { id: "discord",     label: "Discord",           icon: <Globe size={20} />,          iconBg: "bg-indigo-100 text-indigo-600", status: "Connected", lastTest: "24 Jul 2025, 09:55 AM", testAction: "Test Discord" },
  { id: "ms-teams",    label: "Microsoft Teams",   icon: <Users size={20} />,          iconBg: "bg-cyan-100 text-cyan-600",     status: "Connected", lastTest: "24 Jul 2025, 10:00 AM", testAction: "Test Teams" },
  { id: "ai-integrations", label: "AI Integrations", icon: <BrainCircuit size={20} />,iconBg: "bg-violet-100 text-violet-600", status: "Active",    lastTest: "24 Jul 2025, 10:05 AM", testAction: "Test AI" },
  { id: "webhooks",    label: "Webhooks",          icon: <Webhook size={20} />,        iconBg: "bg-amber-100 text-amber-600",   status: "Active",    lastTest: "24 Jul 2025, 09:40 AM", testAction: "View Logs" },
];

// ─── Shared UI ─────────────────────────────────────────────────────────────────

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <label className="mb-1 flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
      {hint && <Info size={12} className="text-slate-400" title={hint} />}
    </label>
  );
}

function Input({ placeholder, defaultValue, type = "text" }: { placeholder?: string; defaultValue?: string; type?: string }) {
  return (
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
    />
  );
}

function SelectField({ options, defaultValue }: { options: string[]; defaultValue?: string }) {
  return (
    <select
      defaultValue={defaultValue}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Toggle({ defaultChecked, label }: { defaultChecked?: boolean; label?: string }) {
  const [on, setOn] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setOn(p => !p)}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
      {label && <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>}
    </div>
  );
}

function StatusBadge({ status }: { status: Integration["status"] }) {
  const styles: Record<Integration["status"], string> = {
    Connected: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Active:    "bg-blue-50 text-blue-600 border-blue-200",
    Inactive:  "bg-slate-100 text-slate-500 border-slate-200",
    Error:     "bg-red-50 text-red-500 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "Connected" || status === "Active" ? "bg-current" : "bg-current"}`} />
      {status}
    </span>
  );
}

// ─── General Settings Panel ───────────────────────────────────────────────────

function GeneralSettings({ onNavigate }: { onNavigate: (id: Section) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">General Settings</h2>
        <p className="mt-0.5 text-sm text-slate-500">Configure general communication preferences and defaults.</p>
      </div>

      {/* Org + Fields */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="grid gap-6 md:grid-cols-[160px_1fr_1fr]">

          {/* Logo Upload */}
          <div>
            <FieldLabel label="Organization Logo" />
            <div className="relative mt-1 flex h-28 w-28 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-600 dark:bg-slate-800">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                <Globe size={28} className="text-indigo-500" />
              </div>
              <button className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow">
                <span className="text-xs font-bold">×</span>
              </button>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">JPG, PNG or SVG. Max size 2MB</p>
          </div>

          {/* Right Fields */}
          <div className="md:col-span-1 space-y-4">
            <div>
              <FieldLabel label="Organization Name" />
              <Input defaultValue="CampusHub University" />
            </div>
            <div>
              <FieldLabel label="Default Reply Email" />
              <Input defaultValue="noreply@campushub.edu" type="email" />
            </div>
            <div>
              <FieldLabel label="Time Zone" />
              <SelectField options={["(UTC+05:30) Asia/Kolkata", "(UTC+00:00) UTC", "(UTC-05:00) America/New_York", "(UTC+08:00) Asia/Singapore"]} defaultValue="(UTC+05:30) Asia/Kolkata" />
            </div>
            <div>
              <FieldLabel label="Time Format" />
              <SelectField options={["12 Hour (03:45 PM)", "24 Hour (15:45)"]} defaultValue="12 Hour (03:45 PM)" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <FieldLabel label="Sender Name" />
              <Input defaultValue="CampusHub" />
            </div>
            <div>
              <FieldLabel label="Default Language" />
              <SelectField options={["English", "Hindi", "Tamil", "Telugu", "Kannada"]} defaultValue="English" />
            </div>
            <div>
              <FieldLabel label="Date Format" />
              <SelectField options={["24 July 2025 (DD MMM YYYY)", "07/24/2025 (MM/DD/YYYY)", "24/07/2025 (DD/MM/YYYY)"]} defaultValue="24 July 2025 (DD MMM YYYY)" />
            </div>
            <div className="flex items-center justify-between gap-6 pt-1">
              <div>
                <FieldLabel label="Communication Enabled" />
                <Toggle defaultChecked={true} />
              </div>
              <div>
                <FieldLabel label="Maintenance Mode" hint="Disables all outbound communication" />
                <Toggle defaultChecked={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Reset
          </button>
          <button className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700">
            Save Changes
          </button>
        </div>
      </div>

      {/* Integration Cards */}
      <div>
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-white">Connected Integrations</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {integrations.map((intg) => (
            <IntegrationCard key={intg.id} intg={intg} onOpen={() => onNavigate(intg.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Integration Card ─────────────────────────────────────────────────────────

function IntegrationCard({ intg, onOpen }: { intg: Integration; onOpen: () => void }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${intg.iconBg}`}>{intg.icon}</div>
        <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={14} /></button>
      </div>
      <div className="mt-3">
        <p className="text-sm font-bold text-slate-800 dark:text-white">{intg.label}</p>
        <div className="mt-1.5">
          <StatusBadge status={intg.status} />
        </div>
      </div>
      <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
        <p className="text-[11px] text-slate-400">Last Test</p>
        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{intg.lastTest}</p>
      </div>
      <button
        onClick={onOpen}
        className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
      >
        {intg.testAction}
      </button>
    </div>
  );
}

// ─── Email SMTP Panel ─────────────────────────────────────────────────────────

function EmailSMTPPanel() {
  return (
    <SettingsPanel
      title="Email (SMTP)"
      description="Configure your outbound email server settings."
      status="Connected"
      statusColor="emerald"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div><FieldLabel label="SMTP Host" /><Input defaultValue="smtp.campushub.edu" /></div>
        <div><FieldLabel label="Port" /><Input defaultValue="587" /></div>
        <div><FieldLabel label="Username" /><Input defaultValue="admin@campushub.edu" /></div>
        <div><FieldLabel label="Password" /><Input type="password" defaultValue="••••••••••" /></div>
        <div><FieldLabel label="From Name" /><Input defaultValue="CampusHub University" /></div>
        <div><FieldLabel label="From Email" /><Input defaultValue="noreply@campushub.edu" type="email" /></div>
        <div>
          <FieldLabel label="Encryption" />
          <SelectField options={["TLS", "SSL", "None"]} defaultValue="TLS" />
        </div>
        <div className="flex items-end pb-1">
          <div className="space-y-1">
            <FieldLabel label="Authentication Required" />
            <Toggle defaultChecked={true} />
          </div>
        </div>
      </div>
    </SettingsPanel>
  );
}

// ─── WhatsApp Panel ───────────────────────────────────────────────────────────

function WhatsAppPanel() {
  return (
    <SettingsPanel
      title="WhatsApp"
      description="Connect WhatsApp Business API for messaging."
      status="Connected"
      statusColor="emerald"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div><FieldLabel label="Business Account ID" /><Input defaultValue="102938475610293" /></div>
        <div><FieldLabel label="Phone Number ID" /><Input defaultValue="188390283910388" /></div>
        <div className="sm:col-span-2"><FieldLabel label="API Access Token" /><Input defaultValue="EAAxxxxxxxxxxxxxxxxx" type="password" /></div>
        <div><FieldLabel label="Webhook Verify Token" /><Input defaultValue="campushub_wh_2025" /></div>
        <div>
          <FieldLabel label="Message Template Namespace" />
          <Input defaultValue="campushub_templates" />
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Read Receipts" /><Toggle defaultChecked={true} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Delivery Reports" /><Toggle defaultChecked={true} /></div>
        </div>
      </div>
    </SettingsPanel>
  );
}

// ─── SMS Gateway Panel ────────────────────────────────────────────────────────

function SMSGatewayPanel() {
  return (
    <SettingsPanel
      title="SMS Gateway"
      description="Configure SMS delivery via your preferred gateway."
      status="Connected"
      statusColor="emerald"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel label="Gateway Provider" />
          <SelectField options={["Twilio", "MSG91", "TextLocal", "AWS SNS", "Vonage"]} defaultValue="MSG91" />
        </div>
        <div><FieldLabel label="Sender ID" /><Input defaultValue="CAMPHS" /></div>
        <div><FieldLabel label="API Key" /><Input type="password" defaultValue="•••••••••••••••" /></div>
        <div><FieldLabel label="Auth Key" /><Input type="password" defaultValue="•••••••••••••••" /></div>
        <div><FieldLabel label="Route" /><SelectField options={["Transactional", "Promotional", "OTP"]} defaultValue="Transactional" /></div>
        <div><FieldLabel label="Country Code" /><Input defaultValue="+91" /></div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="DND Filter" hint="Skip Do-Not-Disturb numbers" /><Toggle defaultChecked={true} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Delivery Reports" /><Toggle defaultChecked={true} /></div>
        </div>
      </div>
    </SettingsPanel>
  );
}

// ─── In-App Notifications Panel ───────────────────────────────────────────────

function InAppPanel() {
  return (
    <SettingsPanel
      title="In-App Notifications"
      description="Manage push-style notifications delivered within the portal."
      status="Active"
      statusColor="blue"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div><FieldLabel label="Default Icon" /><Input defaultValue="bell" /></div>
        <div><FieldLabel label="Auto-Dismiss (seconds)" /><Input defaultValue="5" /></div>
        <div><FieldLabel label="Max Notifications Stored" /><Input defaultValue="100" /></div>
        <div><FieldLabel label="Retention Period (days)" /><Input defaultValue="30" /></div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Sound Alert" /><Toggle defaultChecked={true} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Badge Count" /><Toggle defaultChecked={true} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Allow Student Replies" /><Toggle defaultChecked={false} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Rich Notifications" hint="Support images and action buttons" /><Toggle defaultChecked={true} /></div>
        </div>
      </div>
    </SettingsPanel>
  );
}

// ─── Push Notifications Panel ─────────────────────────────────────────────────

function PushPanel() {
  return (
    <SettingsPanel
      title="Push Notifications"
      description="Configure Firebase / APNs push notification credentials."
      status="Active"
      statusColor="blue"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel label="Provider" />
          <SelectField options={["Firebase (FCM)", "Apple (APNs)", "OneSignal", "Pusher"]} defaultValue="Firebase (FCM)" />
        </div>
        <div><FieldLabel label="App ID" /><Input defaultValue="campushub-app" /></div>
        <div className="sm:col-span-2"><FieldLabel label="Server Key" /><Input type="password" defaultValue="AAAAxxxxxxxx:APA91xxxxxxxxxxxxxxxxxxxxxxxxx" /></div>
        <div><FieldLabel label="Android Package" /><Input defaultValue="edu.campushub.app" /></div>
        <div><FieldLabel label="iOS Bundle ID" /><Input defaultValue="edu.campushub.ios" /></div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Background Sync" /><Toggle defaultChecked={true} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Analytics Tracking" /><Toggle defaultChecked={true} /></div>
        </div>
      </div>
    </SettingsPanel>
  );
}

// ─── Telegram Panel ───────────────────────────────────────────────────────────

function TelegramPanel() {
  return (
    <SettingsPanel
      title="Telegram"
      description="Send alerts and announcements via Telegram Bot API."
      status="Connected"
      statusColor="emerald"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div><FieldLabel label="Bot Token" /><Input type="password" defaultValue="7123456789:AAFxxxxxxxxxxxxxxxxxxxxxx" /></div>
        <div><FieldLabel label="Bot Username" /><Input defaultValue="@campushub_bot" /></div>
        <div><FieldLabel label="Default Channel ID" /><Input defaultValue="-100123456789" /></div>
        <div><FieldLabel label="Admin Channel ID" /><Input defaultValue="-100987654321" /></div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Parse Mode (HTML)" /><Toggle defaultChecked={true} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Silent Messages" hint="Deliver without notification sound" /><Toggle defaultChecked={false} /></div>
        </div>
      </div>
    </SettingsPanel>
  );
}

// ─── Slack Panel ──────────────────────────────────────────────────────────────

function SlackPanel() {
  return (
    <SettingsPanel title="Slack" description="Post messages to Slack channels via Incoming Webhooks." status="Connected" statusColor="emerald">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2"><FieldLabel label="Webhook URL" /><Input defaultValue="https://hooks.slack.com/services/T000/B000/xxxx" /></div>
        <div><FieldLabel label="Default Channel" /><Input defaultValue="#campushub-alerts" /></div>
        <div><FieldLabel label="Bot Display Name" /><Input defaultValue="CampusHub Bot" /></div>
        <div><FieldLabel label="Bot Icon Emoji" /><Input defaultValue=":school:" /></div>
        <div><FieldLabel label="Mention Role (for critical)" /><Input defaultValue="@channel" /></div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Rich Attachments" /><Toggle defaultChecked={true} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Thread Replies" /><Toggle defaultChecked={false} /></div>
        </div>
      </div>
    </SettingsPanel>
  );
}

// ─── Discord Panel ────────────────────────────────────────────────────────────

function DiscordPanel() {
  return (
    <SettingsPanel title="Discord" description="Send rich embeds to Discord servers via Webhook." status="Connected" statusColor="emerald">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2"><FieldLabel label="Webhook URL" /><Input defaultValue="https://discord.com/api/webhooks/000/xxxx" /></div>
        <div><FieldLabel label="Bot Name" /><Input defaultValue="CampusHub" /></div>
        <div><FieldLabel label="Embed Color (hex)" /><Input defaultValue="#4F46E5" /></div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Use Embeds" /><Toggle defaultChecked={true} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Mention @everyone on Critical" /><Toggle defaultChecked={false} /></div>
        </div>
      </div>
    </SettingsPanel>
  );
}

// ─── Microsoft Teams Panel ────────────────────────────────────────────────────

function MSTeamsPanel() {
  return (
    <SettingsPanel title="Microsoft Teams" description="Post adaptive cards to Teams channels." status="Connected" statusColor="emerald">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2"><FieldLabel label="Incoming Webhook URL" /><Input defaultValue="https://campushub.webhook.office.com/webhookb2/xxxx" /></div>
        <div><FieldLabel label="Team Name" /><Input defaultValue="CampusHub Staff" /></div>
        <div><FieldLabel label="Channel" /><Input defaultValue="Announcements" /></div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Adaptive Card Format" /><Toggle defaultChecked={true} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Mention All on Urgent" /><Toggle defaultChecked={false} /></div>
        </div>
      </div>
    </SettingsPanel>
  );
}

// ─── AI Integrations Panel ────────────────────────────────────────────────────

function AIPanel() {
  return (
    <SettingsPanel title="AI Integrations" description="Configure AI models for smart message drafting and auto-reply." status="Active" statusColor="blue">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><FieldLabel label="Provider" /><SelectField options={["OpenAI (GPT-4o)", "Google Gemini", "Anthropic Claude", "Custom API"]} defaultValue="OpenAI (GPT-4o)" /></div>
        <div><FieldLabel label="Model Version" /><SelectField options={["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"]} defaultValue="gpt-4o" /></div>
        <div className="sm:col-span-2"><FieldLabel label="API Key" /><Input type="password" defaultValue="sk-xxxxxxxxxxxxxxxxxxxxxxxx" /></div>
        <div><FieldLabel label="Max Tokens" /><Input defaultValue="500" /></div>
        <div><FieldLabel label="Temperature" /><Input defaultValue="0.7" /></div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Auto-Suggest Replies" /><Toggle defaultChecked={true} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Smart Message Drafting" /><Toggle defaultChecked={true} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Sentiment Analysis" /><Toggle defaultChecked={false} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Log AI Interactions" /><Toggle defaultChecked={true} /></div>
        </div>
      </div>
    </SettingsPanel>
  );
}

// ─── Templates Panel ──────────────────────────────────────────────────────────

function TemplatesPanel() {
  const templates = [
    { name: "Fee Reminder", channel: "Email + WhatsApp", category: "Finance", uses: 142 },
    { name: "Exam Schedule Alert", channel: "In-App + SMS", category: "Academic", uses: 98 },
    { name: "Attendance Warning", channel: "Email", category: "Attendance", uses: 73 },
    { name: "Event Invitation", channel: "WhatsApp + Email", category: "Events", uses: 55 },
    { name: "Result Published", channel: "In-App + Push", category: "Results", uses: 210 },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Message Templates</h2>
          <p className="mt-0.5 text-sm text-slate-500">Create and manage reusable message templates.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          + New Template
        </button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 dark:border-slate-800">
            <tr className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3">Template Name</th>
              <th className="px-5 py-3">Channel</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Uses</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.name} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-white">{t.name}</td>
                <td className="px-5 py-3.5 text-slate-500">{t.channel}</td>
                <td className="px-5 py-3.5"><span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">{t.category}</span></td>
                <td className="px-5 py-3.5 text-slate-500">{t.uses}</td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">Edit</button>
                    <button className="rounded-lg bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-100">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Scheduling Panel ─────────────────────────────────────────────────────────

function SchedulingPanel() {
  return (
    <SettingsPanel title="Scheduling" description="Set rules for when and how messages can be scheduled and delivered.">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><FieldLabel label="Quiet Hours Start" /><Input type="time" defaultValue="22:00" /></div>
        <div><FieldLabel label="Quiet Hours End" /><Input type="time" defaultValue="07:00" /></div>
        <div><FieldLabel label="Max Scheduled Queue" /><Input defaultValue="500" /></div>
        <div><FieldLabel label="Retry Attempts on Failure" /><Input defaultValue="3" /></div>
        <div><FieldLabel label="Retry Interval (minutes)" /><Input defaultValue="15" /></div>
        <div><FieldLabel label="Max Bulk Batch Size" /><Input defaultValue="1000" /></div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Enforce Quiet Hours" /><Toggle defaultChecked={true} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Override for Emergency Alerts" /><Toggle defaultChecked={true} /></div>
        </div>
      </div>
    </SettingsPanel>
  );
}

// ─── Security Panel ───────────────────────────────────────────────────────────

function SecurityPanel() {
  return (
    <SettingsPanel title="Security" description="Manage authentication, rate limits, and access controls." status="Active" statusColor="emerald">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><FieldLabel label="Rate Limit (messages/hour)" /><Input defaultValue="500" /></div>
        <div><FieldLabel label="Max Recipients per Message" /><Input defaultValue="5000" /></div>
        <div><FieldLabel label="Allowed IP Ranges" /><Input defaultValue="0.0.0.0/0" /></div>
        <div><FieldLabel label="Webhook Secret Key" /><Input type="password" defaultValue="wh_secret_xxxx" /></div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Require 2FA for Settings" /><Toggle defaultChecked={true} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="IP Whitelist Enabled" /><Toggle defaultChecked={false} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Audit Logging" /><Toggle defaultChecked={true} /></div>
        </div>
        <div className="flex items-end pb-1">
          <div><FieldLabel label="Encrypt Message Payloads" /><Toggle defaultChecked={true} /></div>
        </div>
      </div>
    </SettingsPanel>
  );
}

// ─── Webhooks Panel ───────────────────────────────────────────────────────────

function WebhooksPanel() {
  const hooks = [
    { url: "https://api.campushub.edu/hooks/delivery", events: "Delivery Report", active: true, lastTrig: "5 mins ago" },
    { url: "https://analytics.campushub.edu/events", events: "Open / Read", active: true, lastTrig: "12 mins ago" },
    { url: "https://crm.campushub.edu/inbound", events: "Student Reply", active: false, lastTrig: "2 days ago" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Webhooks</h2>
          <p className="mt-0.5 text-sm text-slate-500">Register endpoints to receive real-time delivery events.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">+ Add Webhook</button>
      </div>
      <div className="space-y-3">
        {hooks.map((h) => (
          <div key={h.url} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{h.url}</p>
                <p className="mt-0.5 text-xs text-slate-500">Events: {h.events} · Last trigger: {h.lastTrig}</p>
              </div>
              <div className="flex items-center gap-3">
                <Toggle defaultChecked={h.active} />
                <button className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">Edit</button>
                <button className="rounded-lg bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Analytics Panel ──────────────────────────────────────────────────────────

function AnalyticsPanel() {
  const stats = [
    { label: "Total Sent (30d)", value: "18,492", delta: "+12.4%" },
    { label: "Delivery Rate",    value: "96.2%",  delta: "+0.8%" },
    { label: "Open Rate",        value: "72.1%",  delta: "+3.2%" },
    { label: "Failure Rate",     value: "0.4%",   delta: "-0.1%" },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analytics</h2>
        <p className="mt-0.5 text-sm text-slate-500">Communication performance metrics and delivery insights.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
            <p className="mt-0.5 text-xs font-semibold text-emerald-500">{s.delta}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="mb-4 font-semibold text-slate-800 dark:text-white">Delivery by Channel (Last 30 days)</p>
        <div className="space-y-3">
          {[
            { label: "Email",    pct: 94, color: "bg-blue-500" },
            { label: "WhatsApp", pct: 98, color: "bg-emerald-500" },
            { label: "SMS",      pct: 89, color: "bg-orange-500" },
            { label: "In-App",   pct: 99, color: "bg-indigo-500" },
            { label: "Push",     pct: 87, color: "bg-pink-500" },
          ].map(c => (
            <div key={c.label} className="flex items-center gap-4">
              <span className="w-20 text-xs font-semibold text-slate-600 dark:text-slate-300">{c.label}</span>
              <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className={`h-2.5 rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
              </div>
              <span className="w-10 text-right text-xs font-bold text-slate-600 dark:text-slate-300">{c.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Backup & Restore Panel ───────────────────────────────────────────────────

function BackupPanel() {
  const backups = [
    { name: "Full Settings Backup", date: "24 Jul 2025, 02:00 AM", size: "1.2 MB", type: "Auto" },
    { name: "Full Settings Backup", date: "23 Jul 2025, 02:00 AM", size: "1.1 MB", type: "Auto" },
    { name: "Manual Backup", date: "20 Jul 2025, 11:30 AM", size: "1.0 MB", type: "Manual" },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Backup & Restore</h2>
          <p className="mt-0.5 text-sm text-slate-500">Export or restore your communication settings.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Upload size={14} /> Import
          </button>
          <button className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            <HardDriveDownload size={14} /> Backup Now
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-100 dark:border-slate-800">
            <tr className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 text-left">Backup Name</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Size</th>
              <th className="px-5 py-3 text-left">Type</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {backups.map((b, i) => (
              <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-white">{b.name}</td>
                <td className="px-5 py-3.5 text-slate-500">{b.date}</td>
                <td className="px-5 py-3.5 text-slate-500">{b.size}</td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${b.type === "Auto" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}>{b.type}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"><Download size={11} /> Download</button>
                    <button className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600"><RotateCcw size={11} /> Restore</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── API Keys Panel ───────────────────────────────────────────────────────────

function APIKeysPanel() {
  const keys = [
    { name: "Production API Key", created: "01 Jan 2025", last: "24 Jul 2025", scopes: "read, write, send", active: true },
    { name: "Staging API Key", created: "15 Mar 2025", last: "20 Jul 2025", scopes: "read, send", active: true },
    { name: "Webhook Integration Key", created: "05 Feb 2025", last: "10 Jun 2025", scopes: "read", active: false },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">API Keys</h2>
          <p className="mt-0.5 text-sm text-slate-500">Manage API access credentials for external integrations.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">+ Generate Key</button>
      </div>
      <div className="space-y-3">
        {keys.map(k => (
          <div key={k.name} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800 dark:text-white">{k.name}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${k.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{k.active ? "Active" : "Inactive"}</span>
                </div>
                <p className="mt-1 font-mono text-xs text-slate-400">sk_live_••••••••••••••••••••••••</p>
                <p className="mt-1 text-xs text-slate-400">Scopes: {k.scopes} · Created: {k.created} · Last used: {k.last}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"><Eye size={12} /> Reveal</button>
                <button className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-500">Revoke</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Logs Panel ───────────────────────────────────────────────────────────────

function LogsPanel() {
  const logs = [
    { time: "24 Jul 2025, 10:48 AM", level: "INFO",    service: "Email SMTP",   message: "Message delivered to riya.sharma@college.edu" },
    { time: "24 Jul 2025, 10:45 AM", level: "INFO",    service: "WhatsApp",     message: "Broadcast sent to CSE Batch 2025 (68 recipients)" },
    { time: "24 Jul 2025, 10:40 AM", level: "WARN",    service: "SMS Gateway",  message: "Rate limit approaching: 480/500 per hour" },
    { time: "24 Jul 2025, 10:38 AM", level: "ERROR",   service: "Push",         message: "Failed to deliver to device token: token_xxxx" },
    { time: "24 Jul 2025, 10:30 AM", level: "INFO",    service: "Telegram",     message: "Alert posted to #campushub-alerts" },
    { time: "24 Jul 2025, 10:22 AM", level: "INFO",    service: "Slack",        message: "Notification posted: Lab rescheduled" },
    { time: "24 Jul 2025, 10:15 AM", level: "DEBUG",   service: "AI",           message: "Smart draft generated for template: Fee Reminder" },
    { time: "24 Jul 2025, 09:58 AM", level: "INFO",    service: "Webhooks",     message: "Delivery event dispatched to crm.campushub.edu" },
  ];
  const levelStyles: Record<string, string> = {
    INFO:  "bg-blue-50 text-blue-600",
    WARN:  "bg-amber-50 text-amber-600",
    ERROR: "bg-red-50 text-red-600",
    DEBUG: "bg-slate-100 text-slate-500",
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">System Logs</h2>
          <p className="mt-0.5 text-sm text-slate-500">Real-time communication service logs and audit trail.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"><Download size={14} /> Export</button>
          <button className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-indigo-600"><RefreshCw size={14} /> Refresh</button>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-100 dark:border-slate-800">
            <tr className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 text-left">Timestamp</th>
              <th className="px-5 py-3 text-left">Level</th>
              <th className="px-5 py-3 text-left">Service</th>
              <th className="px-5 py-3 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, i) => (
              <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">{l.time}</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${levelStyles[l.level]}`}>{l.level}</span></td>
                <td className="px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">{l.service}</td>
                <td className="px-5 py-3 text-xs text-slate-500">{l.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Generic Settings Panel wrapper ──────────────────────────────────────────

function SettingsPanel({
  title,
  description,
  status,
  statusColor,
  children,
}: {
  title: string;
  description: string;
  status?: string;
  statusColor?: "emerald" | "blue" | "amber";
  children: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    blue:    "bg-blue-50 text-blue-600 border-blue-200",
    amber:   "bg-amber-50 text-amber-600 border-amber-200",
  };
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        </div>
        {status && (
          <span className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${colorMap[statusColor ?? "emerald"]}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
          </span>
        )}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        {children}
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">Reset</button>
          <button className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ─── Section Router ────────────────────────────────────────────────────────────

function SectionContent({ section, onNavigate }: { section: Section; onNavigate: (id: Section) => void }) {
  switch (section) {
    case "general":       return <GeneralSettings onNavigate={onNavigate} />;
    case "email-smtp":    return <EmailSMTPPanel />;
    case "whatsapp":      return <WhatsAppPanel />;
    case "sms-gateway":   return <SMSGatewayPanel />;
    case "in-app":        return <InAppPanel />;
    case "push":          return <PushPanel />;
    case "telegram":      return <TelegramPanel />;
    case "slack":         return <SlackPanel />;
    case "discord":       return <DiscordPanel />;
    case "ms-teams":      return <MSTeamsPanel />;
    case "ai-integrations": return <AIPanel />;
    case "templates":     return <TemplatesPanel />;
    case "scheduling":    return <SchedulingPanel />;
    case "security":      return <SecurityPanel />;
    case "webhooks":      return <WebhooksPanel />;
    case "analytics":     return <AnalyticsPanel />;
    case "backup":        return <BackupPanel />;
    case "api-keys":      return <APIKeysPanel />;
    case "logs":          return <LogsPanel />;
    default:              return null;
  }
}

// ─── Quick Actions Footer ─────────────────────────────────────────────────────

const quickActions = [
  { icon: <Zap size={14} />,             label: "Test All Services",  color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { icon: <RefreshCw size={14} />,       label: "Clear Cache",        color: "text-slate-700 bg-white border-slate-200" },
  { icon: <Download size={14} />,        label: "Export Settings",    color: "text-slate-700 bg-white border-slate-200" },
  { icon: <Upload size={14} />,          label: "Import Settings",    color: "text-slate-700 bg-white border-slate-200" },
  { icon: <ScrollText size={14} />,      label: "View Logs",          color: "text-slate-700 bg-white border-slate-200" },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function CommunicationSettings() {
  const [activeSection, setActiveSection] = useState<Section>("general");

  const activeLabel = navItems.find(n => n.id === activeSection)?.label ?? "Settings";

  return (
    <div className="flex min-h-screen flex-col gap-0">

      {/* Breadcrumb Header */}
      <div className="mb-5 flex items-center gap-2 text-sm text-slate-400">
        <span>Dashboard</span>
        <ChevronRight size={13} />
        <span>Communication</span>
        <ChevronRight size={13} />
        <span className="font-semibold text-indigo-600">Settings</span>
      </div>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 gap-5">

        {/* ── Left Sidebar ── */}
        <aside className="w-[210px] flex-shrink-0">
          <div className="rounded-[20px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <nav className="space-y-0.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    activeSection === item.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className={activeSection === item.id ? "text-white" : "text-slate-400"}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Content Area ── */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <SectionContent section={activeSection} onNavigate={setActiveSection} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Footer Bar ── */}
      <div className="mt-6 rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Quick Actions</p>
            {quickActions.map(a => (
              <button
                key={a.label}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition hover:opacity-80 ${a.color}`}
              >
                {a.icon} {a.label}
              </button>
            ))}
          </div>

          {/* System Info */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Settings size={12} className="text-slate-400" />
              <span className="font-semibold text-slate-600 dark:text-slate-300">Configuration Version</span>
              <span>v2.9.0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw size={12} className="text-slate-400" />
              <span className="font-semibold text-slate-600 dark:text-slate-300">Last Updated</span>
              <span>24 Jul 2025, 10:48 AM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-slate-400" />
              <span className="font-semibold text-slate-600 dark:text-slate-300">Synced By</span>
              <span>Admin</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-semibold">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
