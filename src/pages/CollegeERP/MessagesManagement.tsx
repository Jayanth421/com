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
  Hash,
  BookOpen,
  Building2,
  X,
  ArrowLeft,
  Settings,
  Info,
} from "lucide-react";
import { ClayCard, SectionTitle } from "../../components/ui/erp-ui";

// ─── Types ───────────────────────────────────────────────────────────────────

type TargetType =
  | "individual"
  | "multiple"
  | "rollNumbers"
  | "class"
  | "section"
  | "department"
  | "semester"
  | "crs"
  | "faculty";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  lastMessage: string;
  time: string;
  unread: number;
  type: "students" | "crs" | "faculty" | "groups";
  meta: string;
  online?: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  role: "admin" | "crs" | "student" | "faculty";
  text: string;
  time: string;
  type?: "message" | "announcement";
  likes?: number;
  reads?: number;
}

// ─── Static Data ─────────────────────────────────────────────────────────────

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
  { type: "individual", label: "Individual Student", icon: <GraduationCap size={20} />, description: "Search by name or roll number", color: "bg-indigo-50 text-indigo-600" },
  { type: "multiple", label: "Multiple Students", icon: <Users size={20} />, description: "Select multiple students", color: "bg-purple-50 text-purple-600" },
  { type: "rollNumbers", label: "By Roll Numbers", icon: <Hash size={20} />, description: "Enter comma-separated roll numbers", color: "bg-blue-50 text-blue-600" },
  { type: "class", label: "Entire Class", icon: <BookOpen size={20} />, description: "Broadcast to a full class", color: "bg-cyan-50 text-cyan-600" },
  { type: "section", label: "Section", icon: <Layers size={20} />, description: "Message a specific section", color: "bg-teal-50 text-teal-600" },
  { type: "department", label: "Department", icon: <Building2 size={20} />, description: "All students in a department", color: "bg-green-50 text-green-600" },
  { type: "semester", label: "Semester", icon: <Calendar size={20} />, description: "All students in a semester", color: "bg-yellow-50 text-yellow-600" },
  { type: "crs", label: "CRS / Faculty", icon: <UserSquare2 size={20} />, description: "Class representatives & faculty", color: "bg-orange-50 text-orange-600" },
  { type: "faculty", label: "Faculty", icon: <Users size={20} />, description: "All or specific faculty members", color: "bg-red-50 text-red-600" },
];

const tabFilters = ["All Messages", "Email", "WhatsApp", "In-App", "Notification Settings"] as const;
type TabFilter = typeof tabFilters[number];

const convoTabs = ["Students", "CRS / Faculty", "Groups"] as const;
type ConvoTab = typeof convoTabs[number];

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ initials, color, size = "md", online }: { initials: string; color: string; size?: "sm" | "md" | "lg"; online?: boolean }) {
  const sz = size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-12 w-12 text-base" : "h-10 w-10 text-sm";
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sz} ${color} flex items-center justify-center rounded-2xl font-bold text-white`}>{initials}</div>
      {online && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />}
    </div>
  );
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────

const msgStats = [
  { label: "Messages Sent", value: "1,482", delta: "+124 this week", icon: <Send size={18} />, gradient: "from-indigo-500 to-indigo-400" },
  { label: "Delivered", value: "1,390", delta: "93.8% delivery rate", icon: <CheckCheck size={18} />, gradient: "from-emerald-500 to-teal-400" },
  { label: "Scheduled", value: "18", delta: "Next: 2:30 PM today", icon: <Calendar size={18} />, gradient: "from-amber-500 to-yellow-400" },
  { label: "Failed", value: "06", delta: "Retry available", icon: <Clock3 size={18} />, gradient: "from-rose-500 to-pink-400" },
];

// ─── Recent Notifications Strip ───────────────────────────────────────────────

const recentNotifs = [
  { label: "WhatsApp Message", sub: "To All Students", time: "5m 28s ago", color: "bg-green-100 text-green-700", status: "Delivered" },
  { label: "In-App Notification", sub: "To All Students", time: "5m 28s ago", color: "bg-indigo-100 text-indigo-700", status: "Received" },
  { label: "Email", sub: "To CSE Final Year", time: "5m 28s ago", color: "bg-blue-100 text-blue-700", status: "Opened" },
  { label: "Announcement", sub: "Department-wide", time: "5m 28s ago", color: "bg-amber-100 text-amber-700", status: "Posted" },
];

// ─── Compose Panel ────────────────────────────────────────────────────────────

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

  const toggleChannel = (key: keyof typeof channels) =>
    setChannels((c) => ({ ...c, [key]: !c[key] }));

  const selectedOpt = targetOptions.find((o) => o.type === selectedTarget);

  return (
    <div className="flex h-full flex-col rounded-[24px] border border-white/70 bg-white/85 shadow-[10px_10px_24px_rgba(15,23,42,0.08),-10px_-10px_24px_rgba(255,255,255,0.95)] dark:border-slate-800 dark:bg-slate-900/75">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {onClose && (
            <button onClick={onClose} className="mr-1 rounded-xl p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeft size={16} />
            </button>
          )}
          <h2 className="font-bold text-slate-900 dark:text-white">New Message</h2>
        </div>
        <span className="text-xs text-slate-400">←</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Send To */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Send To</p>
          <div className="grid grid-cols-2 gap-2">
            {/* Students tile */}
            <button
              onClick={() => setShowTargetPicker(true)}
              className={`group flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                selectedTarget && ["individual","multiple","rollNumbers","class","section","department","semester"].includes(selectedTarget)
                  ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700"
              }`}
            >
              <div className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600"><GraduationCap size={20} /></div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Students</span>
            </button>
            {/* CRS/Faculty tile */}
            <button
              onClick={() => { setSelectedTarget("crs"); setShowTargetPicker(false); }}
              className={`group flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                selectedTarget === "crs" || selectedTarget === "faculty"
                  ? "border-orange-400 bg-orange-50 text-orange-700"
                  : "border-slate-200 hover:border-orange-300 hover:bg-orange-50 dark:border-slate-700"
              }`}
            >
              <div className="rounded-xl bg-orange-100 p-2.5 text-orange-600"><UserSquare2 size={20} /></div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">CRS / Faculty</span>
            </button>
            {/* Groups tile */}
            <button
              className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 p-4 text-center transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-slate-700"
            >
              <div className="rounded-xl bg-cyan-100 p-2.5 text-cyan-600"><Users size={20} /></div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Groups</span>
            </button>
            {/* Custom List tile */}
            <button
              className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 p-4 text-center transition hover:border-purple-300 hover:bg-purple-50 dark:border-slate-700"
            >
              <div className="rounded-xl bg-purple-100 p-2.5 text-purple-600"><Layers size={20} /></div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Custom List</span>
            </button>
          </div>

          {/* Target Type Picker Dropdown */}
          <AnimatePresence>
            {showTargetPicker && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-2 rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500">Select target group</p>
                  <button onClick={() => setShowTargetPicker(false)} className="text-slate-400 hover:text-slate-700"><X size={14} /></button>
                </div>
                {targetOptions.filter(o => !["crs","faculty"].includes(o.type)).map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => { setSelectedTarget(opt.type); setShowTargetPicker(false); }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedTarget === opt.type ? "bg-indigo-50 dark:bg-indigo-500/10" : ""}`}
                  >
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

          {/* Dynamic target input */}
          {selectedTarget && !showTargetPicker && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-3 py-2">
                <span className={`rounded-lg p-1 ${selectedOpt?.color}`}>{selectedOpt?.icon}</span>
                <span className="flex-1 text-sm font-semibold text-indigo-700">{selectedOpt?.label}</span>
                <button onClick={() => setSelectedTarget(null)} className="text-indigo-400 hover:text-indigo-700"><X size={14} /></button>
              </div>

              {selectedTarget === "rollNumbers" && (
                <textarea
                  value={rollInput}
                  onChange={(e) => setRollInput(e.target.value)}
                  placeholder="Enter roll numbers separated by commas e.g. CS-2025-001, CS-2025-002"
                  rows={2}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              )}
              {(selectedTarget === "individual" || selectedTarget === "multiple") && (
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    placeholder={selectedTarget === "individual" ? "Search student name or roll number…" : "Search and select multiple students…"}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-8 pr-3 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              )}
              {(selectedTarget === "class" || selectedTarget === "section" || selectedTarget === "department" || selectedTarget === "semester") && (
                <div className="grid grid-cols-2 gap-2">
                  {(selectedTarget === "department" || selectedTarget === "class" || selectedTarget === "section") && (
                    <select value={department} onChange={e => setDepartment(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                      <option value="">Department</option>
                      {["CSE","ECE","MECH","CIVIL","MBA"].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  )}
                  {(selectedTarget === "class" || selectedTarget === "section" || selectedTarget === "semester") && (
                    <select value={semester} onChange={e => setSemester(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                      <option value="">Semester</option>
                      {["1","2","3","4","5","6","7","8"].map(s => <option key={s} value={s}>Sem {s}</option>)}
                    </select>
                  )}
                  {selectedTarget === "section" && (
                    <select value={section} onChange={e => setSection(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white col-span-2">
                      <option value="">Section</option>
                      {["A","B","C","D"].map(s => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                  )}
                </div>
              )}
              {(selectedTarget === "crs" || selectedTarget === "faculty") && (
                <div className="grid grid-cols-2 gap-2">
                  <select className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="">All Departments</option>
                    {["CSE","ECE","MECH","CIVIL"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="">All Semesters</option>
                    {["1","2","3","4","5","6","7","8"].map(s => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Subject */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Subject</p>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Message subject…"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Message */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Message</p>
          <textarea
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder="Write your message or announcement…"
            rows={3}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Channels */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Channels</p>
          <div className="space-y-2">
            {[
              { key: "inApp" as const, icon: <Bell size={14} />, label: "In-App Notification", sub: "Send notification via app", color: "text-indigo-500" },
              { key: "email" as const, icon: <Mail size={14} />, label: "Email", sub: "Send email to recipients", color: "text-blue-500" },
              { key: "whatsapp" as const, icon: <MessageCircle size={14} />, label: "WhatsApp", sub: "Send WhatsApp message", color: "text-green-500" },
              { key: "sms" as const, icon: <Smartphone size={14} />, label: "SMS", sub: "Send SMS to gateway", color: "text-orange-500" },
            ].map(({ key, icon, label, sub, color }) => (
              <label key={key} className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2.5 transition ${channels[key] ? "border-indigo-200 bg-indigo-50/60 dark:border-indigo-500/30 dark:bg-indigo-500/10" : "border-slate-200 dark:border-slate-700"}`}>
                <input type="checkbox" checked={channels[key]} onChange={() => toggleChannel(key)} className="accent-indigo-600 h-4 w-4 rounded" />
                <span className={color}>{icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{label}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Schedule <span className="normal-case font-normal text-slate-400">(optional)</span></p>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
          </div>
        </div>
      </div>

      {/* Footer */}
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
      {/* Chat Header */}
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

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {chatMessages.map((msg) => {
          const isAdmin = msg.role === "admin";
          return (
            <div key={msg.id} className={`flex gap-3 ${isAdmin ? "flex-row" : "flex-row"}`}>
              <Avatar
                initials={isAdmin ? "AD" : msg.role === "crs" ? "CR" : msg.sender.slice(0,2).toUpperCase()}
                color={isAdmin ? "bg-indigo-500" : msg.role === "crs" ? "bg-teal-500" : "bg-slate-400"}
                size="sm"
              />
              <div className="max-w-[75%]">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-white">{msg.sender}</span>
                  {msg.type === "announcement" && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600">Announcement</span>}
                  <span className="text-[11px] text-slate-400">{msg.time}</span>
                </div>
                <div className={`rounded-2xl px-4 py-3 text-sm ${isAdmin ? "rounded-tl-sm bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100" : "rounded-tl-sm bg-white border border-slate-200 text-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"}`}>
                  {msg.text.split("\n\n").map((para, i) => (
                    <p key={i} className={i === 0 && msg.type === "announcement" ? "font-bold" : ""}>{para}</p>
                  ))}
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

      {/* Input */}
      <div className="border-t border-slate-100 px-5 py-3 dark:border-slate-800">
        {/* Type Toggle */}
        <div className="mb-2 flex gap-1">
          {(["Message","Announcement"] as const).map(t => (
            <button
              key={t}
              onClick={() => setMsgType(t)}
              className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${msgType === t ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"}`}
            >{t}</button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><Paperclip size={18} /></button>
          <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><Smile size={18} /></button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message…"
            rows={1}
            className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setInput(""); } }}
          />
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
    "Students": ["students"],
    "CRS / Faculty": ["crs", "faculty"],
    "Groups": ["groups"],
  };

  const filtered = conversations.filter(c => {
    const matchType = tabMap[convoTab].includes(c.type);
    const matchQuery = c.name.toLowerCase().includes(query.toLowerCase()) || c.lastMessage.toLowerCase().includes(query.toLowerCase());
    return matchType && matchQuery;
  });

  return (
    <div className="flex h-full flex-col rounded-[24px] border border-white/70 bg-white/85 shadow-[10px_10px_24px_rgba(15,23,42,0.08),-10px_-10px_24px_rgba(255,255,255,0.95)] dark:border-slate-800 dark:bg-slate-900/75">
      {/* Header */}
      <div className="border-b border-slate-100 px-4 pt-4 dark:border-slate-800">
        <h3 className="mb-3 font-bold text-slate-900 dark:text-white">Conversations</h3>
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search conversations…"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        {/* Tabs */}
        <div className="flex gap-1 pb-3 overflow-x-auto">
          {convoTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setConvoTab(tab)}
              className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition ${convoTab === tab ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >{tab}</button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">No conversations found</p>
        )}
        {filtered.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition ${selected === c.id ? "bg-indigo-50 dark:bg-indigo-500/10" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <Avatar initials={c.avatar} color={c.avatarColor} size="sm" online={c.online} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{c.name}</p>
                <span className="flex-shrink-0 text-[11px] text-slate-400">{c.time}</span>
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-400">{c.lastMessage}</p>
            </div>
            {c.unread > 0 && (
              <span className="mt-0.5 flex-shrink-0 rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{c.unread}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length > 5 && (
        <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
          <button className="text-xs font-semibold text-indigo-500 hover:underline">Load more →</button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>("All Messages");
  const [selectedConvo, setSelectedConvo] = useState("1");
  const [showCompose, setShowCompose] = useState(true);

  const convo = conversations.find(c => c.id === selectedConvo) ?? conversations[0];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-indigo-500">Communication</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messaging & Notifications</h1>
          <p className="mt-0.5 text-sm text-slate-500">Send announcements, notifications and messages to students and CRS.</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700"
        >
          <Plus size={16} /> New Message
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {tabFilters.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "bg-white text-slate-500 shadow hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800"}`}
          >
            {tab === "Email" && <Mail size={13} />}
            {tab === "WhatsApp" && <MessageCircle size={13} />}
            {tab === "In-App" && <Bell size={13} />}
            {tab === "Notification Settings" && <Settings size={13} />}
            {tab}
          </button>
        ))}
      </div>

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

      {/* Main Layout */}
      <div className="grid gap-5 xl:grid-cols-[300px_1fr_340px]">
        {/* Conversation List */}
        <div style={{ height: "600px" }}>
          <ConversationList selected={selectedConvo} onSelect={setSelectedConvo} />
        </div>

        {/* Chat */}
        <div style={{ height: "600px" }}>
          <ChatPanel convo={convo} />
        </div>

        {/* Compose */}
        <div style={{ height: "600px" }}>
          <ComposePanel />
        </div>
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
  );
}
