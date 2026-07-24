"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Send,
  Paperclip,
  Smile,
  Bell,
  Mail,
  MessageCircle,
  Smartphone,
  Calendar,
  Users,
  GraduationCap,
  UserSquare2,
  Layers,
  Clock3,
  MoreVertical,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Hash,
  BookOpen,
  Building2,
  X,
  ArrowLeft,
  Info,
  Filter,
  Eye,
  Upload,
  AlertCircle,
} from "lucide-react";
import { ClayCard, SectionTitle } from "../../components/ui/erp-ui";

// ─── Types ────────────────────────────────────────────────────────────────────

type TargetType =
  | "individual" | "multiple" | "rollNumbers" | "class"
  | "section" | "department" | "semester" | "crs" | "faculty";

interface Conversation {
  id: string; name: string; avatar: string; avatarColor: string;
  lastMessage: string; time: string; unread: number;
  type: "students" | "crs" | "faculty" | "groups"; meta: string; online?: boolean;
}

interface ChatMessage {
  id: string; sender: string; role: "admin" | "crs" | "student" | "faculty";
  text: string; time: string; type?: "message" | "announcement";
  likes?: number; reads?: number;
}

interface MsgRow {
  id: string; title: string; subtitle: string; recipients: string;
  recipientCount: number; status: "Delivered" | "Failed" | "Pending" | "Scheduled";
  openPct: number; openCount: number; sentOn: string; channel: "inapp" | "email" | "whatsapp" | "sms";
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const conversations: Conversation[] = [
  { id: "1", name: "Computer Science - 2A", avatar: "CS", avatarColor: "bg-indigo-500", lastMessage: "Tomorrow is the last date to submit…", time: "10:48 AM", unread: 3, type: "students", meta: "68 Students", online: true },
  { id: "2", name: "Dr. Priya Sharma", avatar: "PS", avatarColor: "bg-purple-500", lastMessage: "Please review the updated syllabus.", time: "08:31 AM", unread: 1, type: "faculty", meta: "CSE Faculty", online: true },
  { id: "3", name: "Mechanical - 1B", avatar: "ME", avatarColor: "bg-orange-500", lastMessage: "Lab session rescheduled to Friday.", time: "Yesterday", unread: 0, type: "students", meta: "54 Students" },
  { id: "4", name: "Aarav Sharma", avatar: "AS", avatarColor: "bg-teal-500", lastMessage: "Thank you sir!", time: "Yesterday", unread: 0, type: "crs", meta: "CR • CSE 2A", online: true },
  { id: "5", name: "CRS Team", avatar: "CR", avatarColor: "bg-cyan-500", lastMessage: "Meeting @ 3 PM in Seminar Hall", time: "Tue", unread: 2, type: "crs", meta: "12 Members" },
  { id: "6", name: "Dr. Rahul Verma", avatar: "RV", avatarColor: "bg-green-500", lastMessage: "Exam papers are ready.", time: "Mon", unread: 0, type: "faculty", meta: "MECH Faculty" },
  { id: "7", name: "ECE Dept - Sem 4", avatar: "EC", avatarColor: "bg-pink-500", lastMessage: "New assignment uploaded.", time: "Mon", unread: 5, type: "students", meta: "92 Students" },
  { id: "8", name: "Placement Cell", avatar: "PC", avatarColor: "bg-amber-500", lastMessage: "Drive scheduled for Nov 12.", time: "Sun", unread: 0, type: "groups", meta: "Group" },
];

const chatMessages: ChatMessage[] = [
  { id: "1", sender: "Admin", role: "admin", text: "Important Announcement\n\nReminder: Tomorrow is the last date to submit the Data Structures assignment. Make sure to upload it on the portal before 11:59 PM.", time: "10:48 AM", type: "announcement", likes: 11, reads: 68 },
  { id: "2", sender: "Aarav Sharma", role: "crs", text: "Also, don't forget about the lab session tomorrow. Please come prepared.", time: "10:51 AM", likes: 4, reads: 60 },
  { id: "3", sender: "Admin", role: "admin", text: "Thank you for the reminder!", time: "10:53 AM", reads: 68 },
];

const targetOptions: { type: TargetType; label: string; icon: React.ReactNode; description: string; color: string }[] = [
  { type: "individual",  label: "Individual Student", icon: <GraduationCap size={20} />, description: "Search by name or roll number",         color: "bg-indigo-50 text-indigo-600" },
  { type: "multiple",    label: "Multiple Students",  icon: <Users size={20} />,          description: "Select multiple students",              color: "bg-purple-50 text-purple-600" },
  { type: "rollNumbers", label: "By Roll Numbers",    icon: <Hash size={20} />,            description: "Enter comma-separated roll numbers",    color: "bg-blue-50 text-blue-600" },
  { type: "class",       label: "Entire Class",       icon: <BookOpen size={20} />,        description: "Broadcast to a full class",             color: "bg-cyan-50 text-cyan-600" },
  { type: "section",     label: "Section",            icon: <Layers size={20} />,          description: "Message a specific section",            color: "bg-teal-50 text-teal-600" },
  { type: "department",  label: "Department",         icon: <Building2 size={20} />,       description: "All students in a department",          color: "bg-green-50 text-green-600" },
  { type: "semester",    label: "Semester",           icon: <Calendar size={20} />,        description: "All students in a semester",            color: "bg-yellow-50 text-yellow-600" },
  { type: "crs",         label: "CRS / Faculty",      icon: <UserSquare2 size={20} />,     description: "Class representatives & faculty",       color: "bg-orange-50 text-orange-600" },
  { type: "faculty",     label: "Faculty",            icon: <Users size={20} />,           description: "All or specific faculty members",       color: "bg-red-50 text-red-600" },
];

// All 48 message rows (8 shown per page)
const allMsgRows: MsgRow[] = [
  { id:"1",  title:"Lab Session Rescheduled",         subtitle:"The lab session for Data Structu...", recipients:"ECE Students",        recipientCount:120,  status:"Delivered", openPct:84, openCount:101, sentOn:"24 Jul 2025, 11:10 AM", channel:"inapp" },
  { id:"2",  title:"New Study Material Uploaded",     subtitle:"New notes for Operating System...",  recipients:"All Students",        recipientCount:2845, status:"Delivered", openPct:76, openCount:2163,sentOn:"24 Jul 2025, 10:20 AM", channel:"inapp" },
  { id:"3",  title:"Library Timing Update",           subtitle:"The library will be open till 8 PM...",recipients:"All Students",      recipientCount:2845, status:"Delivered", openPct:65, openCount:1848,sentOn:"23 Jul 2025, 07:40 PM", channel:"inapp" },
  { id:"4",  title:"Internal Marks Published",        subtitle:"Internal assessment marks are now...",recipients:"CSE 2A",             recipientCount:68,   status:"Delivered", openPct:88, openCount:60,  sentOn:"23 Jul 2025, 05:30 PM", channel:"inapp" },
  { id:"5",  title:"System Maintenance Notice",       subtitle:"System will be down from 12 AM...",  recipients:"All Students",        recipientCount:2845, status:"Failed",    openPct:0,  openCount:0,   sentOn:"23 Jul 2025, 08:40 AM", channel:"inapp" },
  { id:"6",  title:"Placement Drive Registration",    subtitle:"Register for the upcoming placement...",recipients:"Final Year Students",recipientCount:322, status:"Delivered", openPct:71, openCount:229, sentOn:"22 Jul 2025, 03:15 PM", channel:"inapp" },
  { id:"7",  title:"Event Reminder",                  subtitle:"Don't forget the technical fest...",  recipients:"All Students",        recipientCount:2845, status:"Delivered", openPct:59, openCount:1678,sentOn:"22 Jul 2025, 11:00 AM", channel:"inapp" },
  { id:"8",  title:"Semester Exam Notification",      subtitle:"End semester exams will begin from...",recipients:"All Students",       recipientCount:2845, status:"Pending",   openPct:0,  openCount:0,   sentOn:"22 Jul 2025, 09:00 AM", channel:"inapp" },
  { id:"9",  title:"Fee Reminder — Last Date",        subtitle:"Pay your semester fee before...",    recipients:"All Students",        recipientCount:2845, status:"Delivered", openPct:81, openCount:2304,sentOn:"21 Jul 2025, 10:00 AM", channel:"email" },
  { id:"10", title:"Scholarship Portal Open",         subtitle:"Apply now for merit scholarships...",recipients:"3rd Year Students",   recipientCount:640,  status:"Delivered", openPct:63, openCount:403, sentOn:"21 Jul 2025, 09:15 AM", channel:"email" },
  { id:"11", title:"Workshop Registration",           subtitle:"Register for the AI/ML workshop...", recipients:"CSE Department",      recipientCount:480,  status:"Delivered", openPct:72, openCount:346, sentOn:"20 Jul 2025, 02:00 PM", channel:"whatsapp" },
  { id:"12", title:"Holiday Announcement",            subtitle:"College will remain closed on...",   recipients:"All Students",        recipientCount:2845, status:"Delivered", openPct:91, openCount:2588,sentOn:"20 Jul 2025, 11:30 AM", channel:"whatsapp" },
  { id:"13", title:"Attendance Warning",              subtitle:"Your attendance is below 75%...",    recipients:"CSE 2A",              recipientCount:68,   status:"Delivered", openPct:100,openCount:68,   sentOn:"19 Jul 2025, 08:00 AM", channel:"sms" },
  { id:"14", title:"OTP Verification",                subtitle:"Your portal login OTP is...",        recipients:"Individual",          recipientCount:1,    status:"Delivered", openPct:100,openCount:1,    sentOn:"19 Jul 2025, 07:45 AM", channel:"sms" },
  { id:"15", title:"Result Published",                subtitle:"Semester 4 results are now live...", recipients:"All Students",        recipientCount:2845, status:"Delivered", openPct:95, openCount:2703,sentOn:"18 Jul 2025, 06:00 PM", channel:"inapp" },
  { id:"16", title:"Guest Lecture Invite",            subtitle:"Dr. Rajiv Mehta will deliver...",    recipients:"ECE Department",      recipientCount:310,  status:"Scheduled", openPct:0,  openCount:0,   sentOn:"25 Jul 2025, 10:00 AM", channel:"email" },
];

const tabFilters = ["All Messages", "Email", "WhatsApp", "In-App", "SMS"] as const;
type TabFilter = typeof tabFilters[number];

const convoTabs = ["Students", "CRS / Faculty", "Groups"] as const;
type ConvoTab = typeof convoTabs[number];

// ─── Small helpers ────────────────────────────────────────────────────────────

function Avatar({ initials, color, size = "md", online }: { initials: string; color: string; size?: "sm" | "md" | "lg"; online?: boolean }) {
  const sz = size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-12 w-12 text-base" : "h-10 w-10 text-sm";
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sz} ${color} flex items-center justify-center rounded-2xl font-bold text-white`}>{initials}</div>
      {online && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />}
    </div>
  );
}

function StatusPill({ status }: { status: MsgRow["status"] }) {
  const map: Record<MsgRow["status"], string> = {
    Delivered: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    Failed:    "bg-red-50 text-red-500 border border-red-200",
    Pending:   "bg-amber-50 text-amber-600 border border-amber-200",
    Scheduled: "bg-blue-50 text-blue-600 border border-blue-200",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${map[status]}`}>{status}</span>;
}

function OpenBar({ pct }: { pct: number }) {
  const color = pct >= 75 ? "bg-emerald-500" : pct >= 40 ? "bg-indigo-500" : "bg-red-400";
  return (
    <div className="w-28">
      <div className="mb-0.5 flex justify-between text-[11px]">
        <span className="font-semibold text-slate-700 dark:text-slate-200">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────

const msgStats = [
  { label: "Messages Sent", value: "1,482", delta: "+124 this week",    icon: <Send size={18} />,      gradient: "from-indigo-500 to-indigo-400" },
  { label: "Delivered",     value: "1,390", delta: "93.8% delivery rate", icon: <CheckCheck size={18} />, gradient: "from-emerald-500 to-teal-400" },
  { label: "Scheduled",     value: "18",    delta: "Next: 2:30 PM today", icon: <Calendar size={18} />,   gradient: "from-amber-500 to-yellow-400" },
  { label: "Failed",        value: "06",    delta: "Retry available",     icon: <Clock3 size={18} />,     gradient: "from-rose-500 to-pink-400" },
];

const recentNotifs = [
  { label: "WhatsApp Message",    sub: "To All Students",    time: "5m 28s ago", color: "bg-green-100 text-green-700",  status: "Delivered" },
  { label: "In-App Notification", sub: "To All Students",    time: "5m 28s ago", color: "bg-indigo-100 text-indigo-700",status: "Received" },
  { label: "Email",               sub: "To CSE Final Year",  time: "5m 28s ago", color: "bg-blue-100 text-blue-700",    status: "Opened" },
  { label: "Announcement",        sub: "Department-wide",    time: "5m 28s ago", color: "bg-amber-100 text-amber-700",  status: "Posted" },
];

// ─── Compose Panel (shared) ───────────────────────────────────────────────────

function ComposePanel({ onClose }: { onClose?: () => void }) {
  const [selectedTarget, setSelectedTarget] = useState<TargetType | null>(null);
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [rollInput, setRollInput] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [channels, setChannels] = useState({ inApp: true, email: true, whatsapp: false, sms: false });
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");

  const toggleChannel = (key: keyof typeof channels) => setChannels(c => ({ ...c, [key]: !c[key] }));
  const selectedOpt = targetOptions.find(o => o.type === selectedTarget);

  return (
    <div className="flex h-full flex-col rounded-[24px] border border-white/70 bg-white/85 shadow-[10px_10px_24px_rgba(15,23,42,0.08),-10px_-10px_24px_rgba(255,255,255,0.95)] dark:border-slate-800 dark:bg-slate-900/75">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {onClose && <button onClick={onClose} className="mr-1 rounded-xl p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><ArrowLeft size={16} /></button>}
          <h2 className="font-bold text-slate-900 dark:text-white">New Message</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Send To</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setShowTargetPicker(true)}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${selectedTarget && ["individual","multiple","rollNumbers","class","section","department","semester"].includes(selectedTarget) ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700"}`}>
              <div className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600"><GraduationCap size={20} /></div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Students</span>
            </button>
            <button onClick={() => { setSelectedTarget("crs"); setShowTargetPicker(false); }}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${selectedTarget === "crs" || selectedTarget === "faculty" ? "border-orange-400 bg-orange-50" : "border-slate-200 hover:border-orange-300 hover:bg-orange-50 dark:border-slate-700"}`}>
              <div className="rounded-xl bg-orange-100 p-2.5 text-orange-600"><UserSquare2 size={20} /></div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">CRS / Faculty</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 p-4 text-center transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-slate-700">
              <div className="rounded-xl bg-cyan-100 p-2.5 text-cyan-600"><Users size={20} /></div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Groups</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 p-4 text-center transition hover:border-purple-300 hover:bg-purple-50 dark:border-slate-700">
              <div className="rounded-xl bg-purple-100 p-2.5 text-purple-600"><Layers size={20} /></div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Custom List</span>
            </button>
          </div>
          <AnimatePresence>
            {showTargetPicker && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="mt-2 rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500">Select target group</p>
                  <button onClick={() => setShowTargetPicker(false)} className="text-slate-400 hover:text-slate-700"><X size={14} /></button>
                </div>
                {targetOptions.filter(o => !["crs","faculty"].includes(o.type)).map(opt => (
                  <button key={opt.type} onClick={() => { setSelectedTarget(opt.type); setShowTargetPicker(false); }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedTarget === opt.type ? "bg-indigo-50 dark:bg-indigo-500/10" : ""}`}>
                    <span className={`rounded-xl p-1.5 ${opt.color}`}>{opt.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{opt.label}</p>
                      <p className="text-xs text-slate-400">{opt.description}</p>
                    </div>
                    {selectedTarget === opt.type && <Check size={14} className="ml-auto text-indigo-500" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {selectedTarget && !showTargetPicker && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-3 py-2">
                <span className={`rounded-lg p-1 ${selectedOpt?.color}`}>{selectedOpt?.icon}</span>
                <span className="flex-1 text-sm font-semibold text-indigo-700">{selectedOpt?.label}</span>
                <button onClick={() => setSelectedTarget(null)} className="text-indigo-400 hover:text-indigo-700"><X size={14} /></button>
              </div>
              {selectedTarget === "rollNumbers" && (
                <textarea value={rollInput} onChange={e => setRollInput(e.target.value)} placeholder="Enter roll numbers separated by commas…" rows={2}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              )}
              {(selectedTarget === "individual" || selectedTarget === "multiple") && (
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input placeholder={selectedTarget === "individual" ? "Search student name or roll number…" : "Search and select multiple students…"}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-8 pr-3 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </div>
              )}
              {(["class","section","department","semester"] as TargetType[]).includes(selectedTarget) && (
                <div className="grid grid-cols-2 gap-2">
                  {(["department","class","section"] as TargetType[]).includes(selectedTarget) && (
                    <select value={department} onChange={e => setDepartment(e.target.value)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                      <option value="">Department</option>
                      {["CSE","ECE","MECH","CIVIL","MBA"].map(d => <option key={d}>{d}</option>)}
                    </select>
                  )}
                  {(["class","section","semester"] as TargetType[]).includes(selectedTarget) && (
                    <select value={semester} onChange={e => setSemester(e.target.value)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                      <option value="">Semester</option>
                      {["1","2","3","4","5","6","7","8"].map(s => <option key={s}>Sem {s}</option>)}
                    </select>
                  )}
                  {selectedTarget === "section" && (
                    <select value={section} onChange={e => setSection(e.target.value)}
                      className="col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                      <option value="">Section</option>
                      {["A","B","C","D"].map(s => <option key={s}>Section {s}</option>)}
                    </select>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Subject</p>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Message subject…"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Message</p>
          <textarea value={messageText} onChange={e => setMessageText(e.target.value)} placeholder="Write your message or announcement…" rows={3}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Channels</p>
          <div className="space-y-2">
            {([
              { key:"inApp" as const,    icon:<Bell size={14} />,           label:"In-App Notification", sub:"Send notification via app",  color:"text-indigo-500" },
              { key:"email" as const,    icon:<Mail size={14} />,           label:"Email",               sub:"Send email to recipients",   color:"text-blue-500" },
              { key:"whatsapp" as const, icon:<MessageCircle size={14} />,  label:"WhatsApp",            sub:"Send WhatsApp message",       color:"text-green-500" },
              { key:"sms" as const,      icon:<Smartphone size={14} />,     label:"SMS",                 sub:"Send SMS to gateway",         color:"text-orange-500" },
            ]).map(({ key, icon, label, sub, color }) => (
              <label key={key} className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2.5 transition ${channels[key] ? "border-indigo-200 bg-indigo-50/60 dark:border-indigo-500/30 dark:bg-indigo-500/10" : "border-slate-200 dark:border-slate-700"}`}>
                <input type="checkbox" checked={channels[key]} onChange={() => toggleChannel(key)} className="h-4 w-4 accent-indigo-600 rounded" />
                <span className={color}>{icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{label}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Schedule <span className="normal-case font-normal">(optional)</span></p>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
        <button className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-indigo-600">
          Review & Send →
        </button>
      </div>
    </div>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────

function ChatPanel({ convo }: { convo: Conversation }) {
  const [input, setInput] = useState("");
  const [msgType, setMsgType] = useState<"Message" | "Announcement">("Message");
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, []);

  return (
    <div className="flex h-full flex-col rounded-[24px] border border-white/70 bg-white/85 shadow-[10px_10px_24px_rgba(15,23,42,0.08),-10px_-10px_24px_rgba(255,255,255,0.95)] dark:border-slate-800 dark:bg-slate-900/75">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Avatar initials={convo.avatar} color={convo.avatarColor} online={convo.online} />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-slate-900 dark:text-white">{convo.name}</h2>
              {convo.type === "students" && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">Class</span>}
            </div>
            <p className="text-xs text-slate-400">{convo.meta} • {convo.online ? <span className="text-emerald-500">Online</span> : "Offline"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><Search size={16} /></button>
          <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><Info size={16} /></button>
          <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><MoreVertical size={16} /></button>
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {chatMessages.map(msg => {
          const isAdmin = msg.role === "admin";
          return (
            <div key={msg.id} className="flex gap-3">
              <Avatar initials={isAdmin ? "AD" : msg.role === "crs" ? "CR" : msg.sender.slice(0,2).toUpperCase()} color={isAdmin ? "bg-indigo-500" : msg.role === "crs" ? "bg-teal-500" : "bg-slate-400"} size="sm" />
              <div className="max-w-[75%]">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-white">{msg.sender}</span>
                  {msg.type === "announcement" && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600">Announcement</span>}
                  <span className="text-[11px] text-slate-400">{msg.time}</span>
                </div>
                <div className={`rounded-2xl px-4 py-3 text-sm ${isAdmin ? "rounded-tl-sm bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100" : "rounded-tl-sm border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"}`}>
                  {msg.text.split("\n\n").map((para, i) => <p key={i} className={i === 0 && msg.type === "announcement" ? "font-bold" : ""}>{para}</p>)}
                </div>
                {(msg.likes !== undefined || msg.reads !== undefined) && (
                  <div className="mt-1 flex gap-3 text-[11px] text-slate-400">
                    {msg.likes !== undefined && <span>👍 {msg.likes}</span>}
                    {msg.reads !== undefined && <span>👁 {msg.reads}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <div className="border-t border-slate-100 px-5 py-3 dark:border-slate-800">
        <div className="mb-2 flex gap-1">
          {(["Message","Announcement"] as const).map(t => (
            <button key={t} onClick={() => setMsgType(t)}
              className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${msgType === t ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"}`}>{t}</button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><Paperclip size={18} /></button>
          <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><Smile size={18} /></button>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message…" rows={1}
            className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setInput(""); } }} />
          <button className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700">
            Send <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Conversation List ────────────────────────────────────────────────────────

function ConversationList({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [convoTab, setConvoTab] = useState<ConvoTab>("Students");

  const tabMap: Record<ConvoTab, Conversation["type"][]> = {
    "Students":     ["students"],
    "CRS / Faculty":["crs","faculty"],
    "Groups":       ["groups"],
  };

  const filtered = conversations.filter(c => {
    const matchType  = tabMap[convoTab].includes(c.type);
    const matchQuery = c.name.toLowerCase().includes(query.toLowerCase()) || c.lastMessage.toLowerCase().includes(query.toLowerCase());
    return matchType && matchQuery;
  });

  return (
    <div className="flex h-full flex-col rounded-[24px] border border-white/70 bg-white/85 shadow-[10px_10px_24px_rgba(15,23,42,0.08),-10px_-10px_24px_rgba(255,255,255,0.95)] dark:border-slate-800 dark:bg-slate-900/75">
      <div className="border-b border-slate-100 px-4 pt-4 dark:border-slate-800">
        <h3 className="mb-3 font-bold text-slate-900 dark:text-white">Conversations</h3>
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search conversations…"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-3">
          {convoTabs.map(tab => (
            <button key={tab} onClick={() => setConvoTab(tab)}
              className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition ${convoTab === tab ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>{tab}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No conversations found</p>}
        {filtered.map(c => (
          <button key={c.id} onClick={() => onSelect(c.id)}
            className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition ${selected === c.id ? "bg-indigo-50 dark:bg-indigo-500/10" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
            <Avatar initials={c.avatar} color={c.avatarColor} size="sm" online={c.online} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{c.name}</p>
                <span className="flex-shrink-0 text-[11px] text-slate-400">{c.time}</span>
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-400">{c.lastMessage}</p>
            </div>
            {c.unread > 0 && <span className="mt-0.5 flex-shrink-0 rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{c.unread}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Channel Tab Views (In-App / Email / WhatsApp / SMS) ─────────────────────

interface ChannelTabConfig {
  label: string;
  accentColor: string;
  newBtnLabel: string;
  sentLabel: string;   sentValue: string;
  delivLabel: string;  delivValue: string; delivDelta: string;
  openLabel: string;   openValue: string;  openPct: number;
  pendLabel: string;   pendValue: string;  pendDelta: string;
  failLabel: string;   failValue: string;  failDelta: string;
  totalRecip: string;  totalDelta: string;
  composePanelTitle: string;
  recipientLabel: string;
  groupLabel?: string;
  extraFieldLabel?: string;
  analyticsTitle: string;
  openedCount: string; deliveredCount: string; pendingCount: string; failedCount: string;
  quickTemplates: string[];
  channel: MsgRow["channel"];
}

const channelConfigs: Record<string, ChannelTabConfig> = {
  "In-App": {
    label:"In-App", accentColor:"indigo", newBtnLabel:"+ New In-App Message",
    sentLabel:"Sent",      sentValue:"746",    delivLabel:"Delivered",  delivValue:"721",  delivDelta:"96.65% Delivered",
    openLabel:"Opened",    openValue:"612",    openPct:82.15,           pendLabel:"Pending",  pendValue:"25",  pendDelta:"3.33% Pending",
    failLabel:"Failed",    failValue:"13",     failDelta:"1.74% Failed",totalRecip:"18,542", totalDelta:"↑ 22% this month",
    composePanelTitle:"New In-App Message", recipientLabel:"Select Recipients", groupLabel:"Select Group (Optional)",
    analyticsTitle:"In-App Analytics",
    openedCount:"612 (82.15%)", deliveredCount:"721 (96.65%)", pendingCount:"25 (3.35%)", failedCount:"13 (1.74%)",
    quickTemplates:["General Announcement","Study Material Update","Exam Notification","Event Reminder"],
    channel:"inapp",
  },
  "Email": {
    label:"Email", accentColor:"blue", newBtnLabel:"+ New Email",
    sentLabel:"Sent",      sentValue:"1,024",  delivLabel:"Delivered",  delivValue:"998",  delivDelta:"97.46% Delivered",
    openLabel:"Opened",    openValue:"742",    openPct:72.4,            pendLabel:"Pending",  pendValue:"18",  pendDelta:"1.76% Pending",
    failLabel:"Failed",    failValue:"8",      failDelta:"0.78% Failed",totalRecip:"12,840", totalDelta:"↑ 18% this month",
    composePanelTitle:"New Email", recipientLabel:"To", groupLabel:"CC / BCC",
    extraFieldLabel:"Subject Line",
    analyticsTitle:"Email Analytics",
    openedCount:"742 (72.40%)", deliveredCount:"998 (97.46%)", pendingCount:"18 (1.76%)", failedCount:"8 (0.78%)",
    quickTemplates:["Fee Reminder","Result Notification","Admission Letter","Event Invitation"],
    channel:"email",
  },
  "WhatsApp": {
    label:"WhatsApp", accentColor:"green", newBtnLabel:"+ New WhatsApp",
    sentLabel:"Sent",      sentValue:"3,280",  delivLabel:"Delivered",  delivValue:"3,204", delivDelta:"97.68% Delivered",
    openLabel:"Read",      openValue:"2,891",  openPct:88.1,            pendLabel:"Pending",  pendValue:"52",  pendDelta:"1.59% Pending",
    failLabel:"Failed",    failValue:"24",     failDelta:"0.73% Failed",totalRecip:"22,100", totalDelta:"↑ 31% this month",
    composePanelTitle:"New WhatsApp Message", recipientLabel:"Select Recipients", groupLabel:"Select Group",
    analyticsTitle:"WhatsApp Analytics",
    openedCount:"2,891 (88.10%)", deliveredCount:"3,204 (97.68%)", pendingCount:"52 (1.59%)", failedCount:"24 (0.73%)",
    quickTemplates:["Fee Alert","Attendance Warning","Result Update","Holiday Notice"],
    channel:"whatsapp",
  },
  "SMS": {
    label:"SMS", accentColor:"orange", newBtnLabel:"+ New SMS",
    sentLabel:"Sent",      sentValue:"5,620",  delivLabel:"Delivered",  delivValue:"5,512", delivDelta:"98.08% Delivered",
    openLabel:"Clicked",   openValue:"1,240",  openPct:22.1,            pendLabel:"Pending",  pendValue:"64",  pendDelta:"1.14% Pending",
    failLabel:"Failed",    failValue:"44",     failDelta:"0.78% Failed",totalRecip:"28,300", totalDelta:"↑ 9% this month",
    composePanelTitle:"New SMS", recipientLabel:"Select Recipients", groupLabel:"Select Group",
    analyticsTitle:"SMS Analytics",
    openedCount:"1,240 (22.10%)", deliveredCount:"5,512 (98.08%)", pendingCount:"64 (1.14%)", failedCount:"44 (0.78%)",
    quickTemplates:["OTP Message","Fee Reminder","Exam Alert","Attendance Warning"],
    channel:"sms",
  },
};

// Donut SVG for analytics
function DonutChart({ pct, color }: { pct: number; color: string }) {
  const r = 44; const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={110} height={110} viewBox="0 0 110 110">
      <circle cx={55} cy={55} r={r} fill="none" stroke="#f1f5f9" strokeWidth={14} />
      <circle cx={55} cy={55} r={r} fill="none" stroke={color} strokeWidth={14}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 55 55)" />
      <text x={55} y={59} textAnchor="middle" fontSize={14} fontWeight="700" fill={color}>{pct}%</text>
      <text x={55} y={72} textAnchor="middle" fontSize={8} fill="#94a3b8">Open Rate</text>
    </svg>
  );
}

function ChannelTabView({ tab }: { tab: string }) {
  const cfg = channelConfigs[tab];
  if (!cfg) return null;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [recipFilter, setRecipFilter] = useState("All Recipients");
  const [groupFilter, setGroupFilter] = useState("All Groups");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);

  const channelRows = allMsgRows.filter(r => r.channel === cfg.channel);
  const filtered = channelRows.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.subtitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || r.status === statusFilter;
    const matchRecip  = recipFilter  === "All Recipients" || r.recipients === recipFilter;
    return matchSearch && matchStatus && matchRecip;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const pageRows   = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const allChecked = pageRows.length > 0 && pageRows.every(r => selected.includes(r.id));

  const toggleAll  = () => setSelected(allChecked ? [] : pageRows.map(r => r.id));
  const toggleRow  = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const accentMap: Record<string, string> = {
    indigo:"bg-indigo-600", blue:"bg-blue-600", green:"bg-green-600", orange:"bg-orange-600",
  };
  const dotMap: Record<string, string> = {
    indigo:"#4F46E5", blue:"#2563EB", green:"#16A34A", orange:"#EA580C",
  };
  const donutColor = dotMap[cfg.accentColor] ?? "#4F46E5";
  const accentBtn  = accentMap[cfg.accentColor] ?? "bg-indigo-600";

  // compose state
  const [composeRecip, setComposeRecip] = useState("");
  const [composeGroup, setComposeGroup] = useState("");
  const [composeTitle, setComposeTitle] = useState("");
  const [composeMsg, setComposeMsg]     = useState("");

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_300px]">

      {/* ── Left: stats + table ── */}
      <div className="space-y-4">

        {/* Stat Strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {[
            { label: cfg.sentLabel,  value: cfg.sentValue,  delta: `↑ 17% this month`,        icon: <Send size={14} />,      bg:"bg-slate-50",   text:"text-slate-700" },
            { label: cfg.delivLabel, value: cfg.delivValue, delta: cfg.delivDelta,             icon: <CheckCheck size={14} />,bg:"bg-emerald-50", text:"text-emerald-600" },
            { label: cfg.openLabel,  value: cfg.openValue,  delta: `${cfg.openPct}% ${cfg.openLabel}`, icon:<Eye size={14} />, bg:"bg-indigo-50",  text:"text-indigo-600" },
            { label: cfg.pendLabel,  value: cfg.pendValue,  delta: cfg.pendDelta,              icon: <Clock3 size={14} />,    bg:"bg-amber-50",   text:"text-amber-600" },
            { label: cfg.failLabel,  value: cfg.failValue,  delta: cfg.failDelta,              icon: <AlertCircle size={14} />,bg:"bg-red-50",    text:"text-red-500" },
            { label:"Total Recipients", value: cfg.totalRecip, delta: cfg.totalDelta,          icon: <Users size={14} />,     bg:"bg-purple-50",  text:"text-purple-600" },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl ${s.bg} px-4 py-3`}>
              <div className={`mb-1 flex items-center gap-1.5 text-xs font-semibold ${s.text}`}>{s.icon}{s.label}</div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className={`mt-0.5 text-[11px] font-medium ${s.text}`}>{s.delta}</p>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search in-${tab.toLowerCase()} messages...`}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              {["All Status","Delivered","Failed","Pending","Scheduled"].map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={recipFilter} onChange={e => { setRecipFilter(e.target.value); setPage(1); }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              {["All Recipients","All Students","ECE Students","CSE 2A","Final Year Students"].map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={groupFilter} onChange={e => { setGroupFilter(e.target.value); setPage(1); }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              {["All Groups","Academic","Events","Finance","Exams"].map(s => <option key={s}>{s}</option>)}
            </select>
            {/* Date range */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              <Calendar size={13} className="text-slate-400" />
              <span className="text-slate-600 dark:text-slate-300">24 Jul – 31 Jul 2025</span>
              <ChevronDown size={13} className="text-slate-400" />
            </div>
            <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Filter size={13} /> Filters
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 dark:border-slate-800">
                <tr className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3 w-8"><input type="checkbox" checked={allChecked} onChange={toggleAll} className="accent-indigo-600" /></th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Recipients</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Opened</th>
                  <th className="px-4 py-3">Sent On</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 && (
                  <tr><td colSpan={7} className="py-10 text-center text-sm text-slate-400">No messages found.</td></tr>
                )}
                {pageRows.map(row => (
                  <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3.5">
                      <input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleRow(row.id)} className="accent-indigo-600" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${cfg.accentColor === "indigo" ? "bg-indigo-100 text-indigo-600" : cfg.accentColor === "blue" ? "bg-blue-100 text-blue-600" : cfg.accentColor === "green" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}>
                          {cfg.accentColor === "indigo" ? <Bell size={14} /> : cfg.accentColor === "blue" ? <Mail size={14} /> : cfg.accentColor === "green" ? <MessageCircle size={14} /> : <Smartphone size={14} />}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate max-w-[200px] font-semibold text-slate-800 dark:text-white">{row.title}</p>
                          <p className="truncate max-w-[200px] text-xs text-slate-400">{row.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-700 dark:text-slate-200">{row.recipients}</p>
                      <p className="text-xs text-slate-400">{row.recipientCount.toLocaleString()} Recipients</p>
                    </td>
                    <td className="px-4 py-3.5"><StatusPill status={row.status} /></td>
                    <td className="px-4 py-3.5">
                      {row.status === "Delivered" ? (
                        <div>
                          <OpenBar pct={row.openPct} />
                          <p className="mt-0.5 text-[11px] text-slate-400">{row.openCount.toLocaleString()} Opened</p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">–</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-500">{row.sentOn}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"><MoreVertical size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Showing {filtered.length === 0 ? 0 : (page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filtered.length)} of {filtered.length} results
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-400">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(6, totalPages) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`min-w-[30px] rounded-lg border px-2 py-1 text-xs font-semibold ${page === n ? `${accentBtn} border-transparent text-white` : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"}`}>{n}</button>
              ))}
              {totalPages > 6 && <span className="px-1 text-slate-400">…</span>}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-400">
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              Rows per page
              <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                {[5,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: compose + analytics + templates ── */}
      <div className="space-y-4">

        {/* Compose Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">{cfg.composePanelTitle}</h3>
            <button className={`flex items-center gap-1.5 rounded-xl ${accentBtn} px-3 py-1.5 text-xs font-bold text-white shadow hover:opacity-90`}>
              <Plus size={13} /> {cfg.newBtnLabel.replace("+ ","")}
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-xs font-semibold text-slate-500">{cfg.recipientLabel}</p>
              <div className="relative">
                <input value={composeRecip} onChange={e => setComposeRecip(e.target.value)} placeholder="Choose recipients"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            {cfg.groupLabel && (
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-500">{cfg.groupLabel}</p>
                <div className="relative">
                  <input value={composeGroup} onChange={e => setComposeGroup(e.target.value)} placeholder={`Choose ${cfg.groupLabel.toLowerCase()}`}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            )}
            {cfg.extraFieldLabel && (
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-500">{cfg.extraFieldLabel}</p>
                <input placeholder="Enter subject line" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
            )}
            <div>
              <p className="mb-1 text-xs font-semibold text-slate-500">Message Title</p>
              <input value={composeTitle} onChange={e => setComposeTitle(e.target.value)} placeholder="Enter message title"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-slate-500">Message</p>
              <textarea value={composeMsg} onChange={e => setComposeMsg(e.target.value)} placeholder="Type your message here..." rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>
            {/* Attachment */}
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-4 text-center dark:border-slate-700">
              <div>
                <Upload size={18} className="mx-auto mb-1 text-slate-400" />
                <p className="text-xs font-medium text-slate-500">Add Attachment <span className="text-slate-400">(Optional)</span></p>
                <p className="text-[11px] text-slate-400">Drag & drop files here or click to browse</p>
              </div>
            </div>
            <button className={`w-full rounded-xl ${accentBtn} py-2.5 text-sm font-bold text-white shadow hover:opacity-90`}>
              <Send size={13} className="mr-1.5 inline" /> Preview & Send
            </button>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">{cfg.analyticsTitle}</h3>
            <span className="rounded-xl border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:border-slate-700">This Month</span>
          </div>
          <div className="flex items-center gap-4">
            <DonutChart pct={cfg.openPct} color={donutColor} />
            <div className="space-y-2 text-xs">
              {[
                { label:"Opened",    value: cfg.openedCount,     dot:"bg-indigo-500" },
                { label:"Delivered", value: cfg.deliveredCount,  dot:"bg-emerald-500" },
                { label:"Pending",   value: cfg.pendingCount,    dot:"bg-amber-500" },
                { label:"Failed",    value: cfg.failedCount,     dot:"bg-red-400" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <span className={`h-2 w-2 flex-shrink-0 rounded-full ${l.dot}`} />
                  <span className="text-slate-500 dark:text-slate-400">{l.label}</span>
                  <span className="ml-auto font-semibold text-slate-700 dark:text-slate-200">{l.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Quick Templates</h3>
            <button className="text-xs font-semibold text-indigo-500 hover:underline">View All</button>
          </div>
          <div className="space-y-2">
            {cfg.quickTemplates.map(t => (
              <button key={t} className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 flex-shrink-0 rounded-lg ${cfg.accentColor === "indigo" ? "bg-indigo-100 text-indigo-600" : cfg.accentColor === "blue" ? "bg-blue-100 text-blue-600" : cfg.accentColor === "green" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"} flex items-center justify-center`}>
                    <BookOpen size={11} />
                  </div>
                  {t}
                </div>
                <ChevronRight size={13} className="text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>("In-App");
  const [selectedConvo, setSelectedConvo] = useState("1");

  const convo = conversations.find(c => c.id === selectedConvo) ?? conversations[0];

  const tabIcons: Partial<Record<TabFilter, React.ReactNode>> = {
    "Email":    <Mail size={13} />,
    "WhatsApp": <MessageCircle size={13} />,
    "In-App":   <Bell size={13} />,
    "SMS":      <Smartphone size={13} />,
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-indigo-500">Communication</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messaging & Notifications</h1>
          <p className="mt-0.5 text-sm text-slate-500">Send announcements, notifications and messages to students and CRS.</p>
        </div>
        <button className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700">
          <Plus size={16} /> New Message
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {tabFilters.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "bg-white text-slate-500 shadow hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"}`}>
            {tabIcons[tab]}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>

          {activeTab === "All Messages" && (
            <div className="space-y-5">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {msgStats.map(s => (
                  <ClayCard key={s.label} className="flex items-center gap-4">
                    <div className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${s.gradient} text-white shadow-lg`}>{s.icon}</div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                      <p className="text-[11px] text-emerald-500">{s.delta}</p>
                    </div>
                  </ClayCard>
                ))}
              </div>
              {/* 3-col chat layout */}
              <div className="grid gap-5 xl:grid-cols-[300px_1fr_340px]">
                <div style={{ height: "600px" }}><ConversationList selected={selectedConvo} onSelect={setSelectedConvo} /></div>
                <div style={{ height: "600px" }}><ChatPanel convo={convo} /></div>
                <div style={{ height: "600px" }}><ComposePanel /></div>
              </div>
              {/* Recent Notifications Strip */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <SectionTitle eyebrow="Activity" title="Recent Notifications" />
                  <button className="text-xs font-semibold text-indigo-500 hover:underline">View all</button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {recentNotifs.map((n, i) => (
                    <ClayCard key={i} className="flex items-center gap-3">
                      <div className={`rounded-2xl px-2.5 py-1.5 text-xs font-bold ${n.color}`}>{n.label.split(" ")[0]}</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{n.label}</p>
                        <p className="truncate text-xs text-slate-400">{n.sub}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">{n.time}</p>
                      </div>
                      <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${n.color}`}>{n.status}</span>
                    </ClayCard>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(activeTab === "In-App" || activeTab === "Email" || activeTab === "WhatsApp" || activeTab === "SMS") && (
            <ChannelTabView tab={activeTab} />
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
