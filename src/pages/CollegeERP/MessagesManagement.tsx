import { motion } from "framer-motion";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  ChevronRight,
  Circle,
  Clock3,
  Eye,
  FileArchive,
  FileImage,
  FileText,
  FileUp,
  MessageSquareMore,
  Paperclip,
  Plus,
  Search,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  Users,
  Video,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClayCard, SectionTitle } from "../../components/ui/erp-ui";
import { communicationThreads, studentRecords } from "../../data/erpData";

const recipientTypes = [
  "Individual Student",
  "Multiple Students",
  "Class Representative (CR)",
  "Multiple CRs",
  "Faculty",
  "Multiple Faculty",
  "Class",
  "Section",
  "Department",
  "Entire College",
];

const filterChips = ["Department", "Academic Year", "Semester", "Section", "Subject", "Role", "Status"];

const templateLibrary = [
  "Attendance Reminder",
  "Assignment Reminder",
  "Exam Notification",
  "Campus Print Ready",
  "Fee Reminder",
  "Event Invitation",
  "Holiday Notice",
  "Emergency Alert",
  "Placement Notification",
  "Workshop Announcement",
  "Academic Update",
  "General Announcement",
];

const deliveryChannels = [
  { label: "In-App Notification", status: "Ready" },
  { label: "Email", status: "Queued" },
  { label: "WhatsApp", status: "Live" },
  { label: "Push Notification", status: "Ready" },
  { label: "SMS", status: "Optional" },
];

const scheduleOptions = ["Send Now", "Daily Recurring", "Weekly", "Monthly", "Yearly"];

const stats = [
  { label: "Recipients Selected", value: "128", meta: "Live audience" },
  { label: "Active Templates", value: "12", meta: "4 favorites" },
  { label: "Delivery Health", value: "94%", meta: "+6.1%" },
  { label: "Pending Queue", value: "08", meta: "2 Retry" },
];

const previewTimeline = [
  { time: "09:40 AM", text: "CSE Section A notification delivered" },
  { time: "08:55 AM", text: "Attendance reminder opened by 93% of recipients" },
  { time: "Yesterday", text: "Campus print update posted to faculty group" },
];

type AttachmentItem = {
  id: number;
  name: string;
  size: string;
  kind: string;
};

export default function MessagesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipientType, setSelectedRecipientType] = useState("Multiple Students");
  const [selectedTemplate, setSelectedTemplate] = useState("Attendance Reminder");
  const [messageTitle, setMessageTitle] = useState("Semester Attendance Sync");
  const [subject, setSubject] = useState("Academic Reminder");
  const [messageBody, setMessageBody] = useState(
    "Dear students, attendance compliance for the current week has been finalized. Please review the updated attendance summary and confirm any discrepancies before 5 PM today.",
  );
  const [priority, setPriority] = useState("Important");
  const [scheduleMode, setScheduleMode] = useState("Send Now");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([
    "CS-2025-014",
    "EC-2025-027",
    "ME-2024-103",
    "CS-2026-041",
  ]);
  const [attachments, setAttachments] = useState<AttachmentItem[]>([
    { id: 1, name: "Attendance_Summary.pdf", size: "2.4 MB", kind: "PDF" },
    { id: 2, name: "Schedule_Overview.png", size: "480 KB", kind: "Image" },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredRecipients = useMemo(() => {
    return studentRecords.filter((record) => {
      const haystack = [
        record.name,
        record.rollNumber,
        record.email,
        record.phone,
        record.department,
        record.year,
        record.section,
        record.className,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  const selectedRecipientDetails = useMemo(() => {
    return studentRecords.filter((record) => selectedRecipients.includes(record.rollNumber));
  }, [selectedRecipients]);

  const toggleRecipient = (rollNumber: string) => {
    setSelectedRecipients((current) =>
      current.includes(rollNumber)
        ? current.filter((item) => item !== rollNumber)
        : [...current, rollNumber],
    );
  };

  const selectAll = () => {
    setSelectedRecipients(filteredRecipients.map((record) => record.rollNumber));
  };

  const clearSelections = () => {
    setSelectedRecipients([]);
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const nextFiles = Array.from(fileList).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      kind: file.type.startsWith("image/") ? "Image" : file.type.includes("pdf") ? "PDF" : file.type.includes("zip") ? "ZIP" : file.type.includes("video/") ? "Video" : "Document",
    }));

    setAttachments((current) => [...current, ...nextFiles]);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = "";
  };

  const removeAttachment = (id: number) => {
    setAttachments((current) => current.filter((item) => item.id !== id));
  };

  const activeTemplatePreview = `Template: ${selectedTemplate} • ${messageBody}`;

  return (
    <div className="min-h-[calc(100vh-5rem)] space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <ClayCard key={item.label} className="min-h-[118px]">
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</h3>
            <p className="mt-1 text-xs font-semibold text-emerald-500">{item.meta}</p>
          </ClayCard>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-[26px] border border-white/70 bg-white/85 p-4 shadow-[10px_10px_24px_rgba(15,23,42,0.08),-10px_-10px_24px_rgba(255,255,255,0.95)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-[10px_10px_30px_rgba(2,6,23,0.6),-10px_-10px_24px_rgba(30,41,59,0.35)] xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold dark:bg-slate-800">ClassCom</span>
          <ChevronRight size={14} />
          <span>College ERP</span>
          <ChevronRight size={14} />
          <span className="font-semibold text-slate-900 dark:text-white">Send Message</span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-[230px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, roll number, email..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
            />
          </div>
          <button className="rounded-2xl bg-slate-100 p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Bell size={16} />
          </button>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xs font-semibold text-white">CA</div>
            <div className="text-sm">
              <p className="font-semibold text-slate-900 dark:text-white">Class Admin</p>
              <p className="text-[11px] text-slate-500">Admin Access</p>
            </div>
          </div>
          <button className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Dark / Light</button>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white">
            <Plus size={16} /> New Message
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <ClayCard className="h-full">
          <SectionTitle eyebrow="Recipient Selection" title="Audience Studio" description="Filter recipients by role, department, class, or section." />

          <div className="mt-4 rounded-[22px] bg-slate-50 p-3 dark:bg-slate-800/60">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Recipient Type</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {recipientTypes.map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedRecipientType(item)}
                  className={`rounded-2xl px-2 py-2 text-xs font-semibold transition ${selectedRecipientType === item ? "bg-indigo-600 text-white" : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[22px] bg-slate-50 p-3 dark:bg-slate-800/60">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Advanced Filters</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {filterChips.map((chip) => (
                <span key={chip} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <button onClick={selectAll} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Select All</button>
            <button onClick={clearSelections} className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Clear</button>
          </div>

          <div className="mt-4 max-h-[540px] space-y-2 overflow-y-auto pr-1">
            {filteredRecipients.map((record) => {
              const selected = selectedRecipients.includes(record.rollNumber);
              return (
                <motion.button
                  key={record.rollNumber}
                  whileHover={{ y: -2 }}
                  onClick={() => toggleRecipient(record.rollNumber)}
                  className={`flex w-full items-start gap-3 rounded-[22px] border p-3 text-left transition ${selected ? "border-indigo-500 bg-indigo-50/70 dark:border-indigo-500 dark:bg-indigo-500/10" : "border-transparent bg-slate-50/80 dark:bg-slate-800/60"}`}
                >
                  <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-bold text-white">
                    {record.name.charAt(0)}
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${record.status === "Active" ? "bg-emerald-500" : "bg-slate-300"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-semibold text-slate-900 dark:text-white">{record.name}</p>
                      <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${record.status === "Active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>{record.status}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{record.rollNumber} • {record.department}</p>
                    <p className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-300">{record.className} • Section {record.section}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">{record.crAssigned ? "CR" : "Student"}</span>
                      <span className="text-xs text-slate-500">{record.activity}</span>
                    </div>
                  </div>
                  <input type="checkbox" checked={selected} readOnly className="mt-1 h-4 w-4 rounded accent-indigo-600" />
                </motion.button>
              );
            })}
          </div>
        </ClayCard>

        <ClayCard className="h-full">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-500">Composer</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">Send Message</h3>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">Draft Saved</div>
          </div>

          <div className="mt-4 grid gap-4 2xl:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-4">
              <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-800/60">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Message Title</label>
                    <input
                      value={messageTitle}
                      onChange={(event) => setMessageTitle(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                    <input
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Rich Text Message Editor</label>
                  <textarea
                    value={messageBody}
                    onChange={(event) => setMessageBody(event.target.value)}
                    rows={7}
                    className="w-full rounded-[22px] border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button className="rounded-2xl bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200"><Smile size={16} /></button>
                    <button className="rounded-2xl bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200"><Sparkles size={16} /></button>
                    <button className="rounded-2xl bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200"><MessageSquareMore size={16} /></button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                    <select value={priority} onChange={(event) => setPriority(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                      <option>Normal</option>
                      <option>Important</option>
                      <option>Urgent</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Scheduling</label>
                    <select value={scheduleMode} onChange={(event) => setScheduleMode(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                      {scheduleOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-800/60">
                <div className="flex items-center justify-between gap-3">
                  <SectionTitle eyebrow="Attachments" title="Upload Assets" description="Images, pdf, docs, videos, audio, and archives." />
                  <button onClick={() => fileInputRef.current?.click()} className="rounded-2xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <FileUp size={14} /> Add Files
                    </div>
                  </button>
                </div>

                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onFileChange} />

                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    handleFiles(event.dataTransfer.files);
                  }}
                  className={`mt-4 rounded-[22px] border border-dashed p-4 text-center text-sm ${isDragging ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" : "border-slate-300 dark:border-slate-700"}`}
                >
                  Drag and drop files here or click Add Files.
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {attachments.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-[20px] bg-white p-3 dark:bg-slate-950">
                      <div className="flex min-w-0 items-center gap-2">
                        {item.kind === "PDF" ? <FileText size={16} className="text-rose-500" /> : item.kind === "Image" ? <FileImage size={16} className="text-cyan-500" /> : item.kind === "Video" ? <Video size={16} className="text-violet-500" /> : item.kind === "ZIP" ? <FileArchive size={16} className="text-amber-500" /> : <Paperclip size={16} className="text-slate-500" />}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                          <p className="text-[11px] text-slate-500">{item.size} • {item.kind}</p>
                        </div>
                      </div>
                      <button onClick={() => removeAttachment(item.id)} className="rounded-xl bg-slate-100 p-2 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-800/60">
                <SectionTitle eyebrow="Delivery Channels" title="Send Through" description="Push to every channel simultaneously." />
                <div className="mt-3 space-y-2">
                  {deliveryChannels.map((channel) => (
                    <div key={channel.label} className="flex items-center justify-between rounded-[18px] bg-white px-3 py-2 dark:bg-slate-950">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                        <Circle size={12} className="text-emerald-500" />
                        {channel.label}
                      </div>
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">{channel.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-800/60">
                <SectionTitle eyebrow="Message Templates" title="Reusable Stacks" description="Save, favorite, edit, duplicate, and delete templates." />
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {templateLibrary.map((template) => (
                    <button
                      key={template}
                      onClick={() => setSelectedTemplate(template)}
                      className={`rounded-2xl px-3 py-2 text-xs font-semibold ${selectedTemplate === template ? "bg-indigo-600 text-white" : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300"}`}
                    >
                      {template}
                    </button>
                  ))}
                </div>
                <div className="mt-3 rounded-[18px] bg-white p-3 text-xs text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                  <p className="font-semibold text-slate-900 dark:text-white">Template Preview</p>
                  <p className="mt-1">{activeTemplatePreview}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Save</button>
                  <button className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Edit</button>
                  <button className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Duplicate</button>
                  <button className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Favorite</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white">Send Message</button>
            <button className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Save as Draft</button>
            <button className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Schedule</button>
            <button className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Preview</button>
            <button className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Clear Form</button>
          </div>
        </ClayCard>

        <ClayCard className="h-full">
          <SectionTitle eyebrow="Preview & Tracking" title="Broadcast Summary" description="Recipient count, timing, visibility, and delivery state." />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] bg-slate-50 p-3 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Recipient Count</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{selectedRecipientDetails.length}</p>
            </div>
            <div className="rounded-[22px] bg-slate-50 p-3 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Priority</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{priority}</p>
            </div>
          </div>

          <div className="mt-4 rounded-[22px] bg-slate-50 p-3 dark:bg-slate-800/60">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Recipient List</p>
            <div className="mt-3 space-y-2">
              {selectedRecipientDetails.map((recipient) => (
                <div key={recipient.rollNumber} className="rounded-[18px] bg-white p-3 dark:bg-slate-950">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{recipient.name}</p>
                      <p className="text-xs text-slate-500">{recipient.rollNumber} • {recipient.department}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">{recipient.section}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[22px] bg-slate-50 p-3 dark:bg-slate-800/60">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Summary</p>
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <div className="flex items-center justify-between"><span>Subject</span><span className="font-semibold text-slate-900 dark:text-white">{subject}</span></div>
              <div className="flex items-center justify-between"><span>Schedule</span><span className="font-semibold text-slate-900 dark:text-white">{scheduleMode}</span></div>
              <div className="flex items-center justify-between"><span>Channels</span><span className="font-semibold text-slate-900 dark:text-white">5 Active</span></div>
              <div className="flex items-center justify-between"><span>Attachments</span><span className="font-semibold text-slate-900 dark:text-white">{attachments.length}</span></div>
            </div>
          </div>

          <div className="mt-4 rounded-[22px] bg-slate-50 p-3 dark:bg-slate-800/60">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Message Preview</p>
            <div className="mt-3 rounded-[18px] bg-white p-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">{messageBody}</div>
          </div>

          <div className="mt-4 rounded-[22px] bg-slate-50 p-3 dark:bg-slate-800/60">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Delivery Tracking</p>
            <div className="mt-3 space-y-2">
              {[
                { label: "Sending Progress", value: "72%", icon: <Clock3 size={14} /> },
                { label: "Delivered", value: "84", icon: <CheckCheck size={14} /> },
                { label: "Failed", value: "3", icon: <Trash2 size={14} /> },
                { label: "Pending", value: "11", icon: <Clock3 size={14} /> },
                { label: "Read", value: "68", icon: <Eye size={14} /> },
                { label: "Unread", value: "16", icon: <Bell size={14} /> },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-[18px] bg-white px-3 py-2 text-xs text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  <div className="flex items-center gap-2 font-semibold">{item.icon} {item.label}</div>
                  <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[22px] bg-slate-50 p-3 dark:bg-slate-800/60">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Activity Timeline</p>
            <div className="mt-3 space-y-2">
              {previewTimeline.map((item) => (
                <div key={item.time} className="rounded-[18px] bg-white p-3 dark:bg-slate-950">
                  <p className="text-[11px] font-semibold text-indigo-500">{item.time}</p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </ClayCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <ClayCard>
          <SectionTitle eyebrow="Analytics" title="Campaign Metrics" description="Daily and weekly communication performance." />
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={communicationThreads.map((item) => ({ audience: item.audience, readRate: Number(item.readRate.replace("%", "")) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.35} />
                  <XAxis dataKey="audience" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="readRate" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={communicationThreads.map((_item, index) => ({ name: `T${index + 1}`, messages: 70 + index * 8 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.35} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="messages" stroke="#06B6D4" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ClayCard>

        <ClayCard>
          <SectionTitle eyebrow="Security" title="Role-Based Access" description="Admin, faculty, and CR moderation controls." />
          <div className="mt-4 space-y-3">
            {[
              { label: "Admin can message everyone", icon: <ShieldCheck size={16} /> },
              { label: "Faculty can message assigned students", icon: <Users size={16} /> },
              { label: "CR can message their assigned class", icon: <UserRound size={16} /> },
              { label: "Students only receive messages unless replies are enabled", icon: <MessageSquareMore size={16} /> },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-[20px] bg-slate-50 p-3 dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">{item.icon} {item.label}</div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">Protected</span>
              </div>
            ))}
          </div>
        </ClayCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ClayCard>
          <SectionTitle eyebrow="Templates" title="Favorites" description="Pinned templates for quick sends." />
          <div className="mt-4 space-y-2">
            {templateLibrary.slice(0, 3).map((item) => (
              <div key={item} className="flex items-center justify-between rounded-[18px] bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/60">
                <span className="font-semibold text-slate-900 dark:text-white">{item}</span>
                <Star size={14} className="text-amber-500" />
              </div>
            ))}
          </div>
        </ClayCard>

        <ClayCard>
          <SectionTitle eyebrow="History" title="Delivery Logs" description="Recent message outcomes and retry actions." />
          <div className="mt-4 space-y-2">
            {communicationThreads.map((thread) => (
              <div key={thread.audience} className="rounded-[20px] bg-slate-50 p-3 dark:bg-slate-800/60">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900 dark:text-white">{thread.audience}</p>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">{thread.status}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{thread.delivery}</p>
              </div>
            ))}
          </div>
        </ClayCard>

        <ClayCard>
          <SectionTitle eyebrow="Actions" title="Quick Controls" description="Manage draft, preview, schedule, and retry queue." />
          <div className="mt-4 grid gap-2">
            <button className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Retry Failed Messages</button>
            <button className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Export Delivery Report</button>
            <button className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Open Audit Trail</button>
            <button className="rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-3 py-2 text-sm font-semibold text-white">Dispatch Now</button>
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
