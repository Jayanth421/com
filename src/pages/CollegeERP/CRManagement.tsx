import { useMemo, useState } from "react";
import {
  BellDot,
  Filter,
  MessageSquareMore,
  Search,
  UserRoundPlus,
} from "lucide-react";
import { AddUserModal } from "../../components/ui/AddUserModal";
import { ClayCard, SectionTitle, StatCard } from "../../components/ui/erp-ui";
import { studentRecords } from "../../data/erpData";

const crStats = [
  { title: "Assigned CRs", value: "59", detail: "5 new this week" },
  { title: "Students Managed", value: "1,284", detail: "98% active" },
  { title: "Announcements", value: "09", detail: "2 pending review" },
  { title: "Meetings", value: "14", detail: "3 requested" },
];

const departments = ["All", "CSE", "ECE", "MECH", "CIVIL"];
const years = ["All", "2024", "2025", "2026"];
const sections = ["All", "A", "B", "C"];

export default function CRManagement() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [year, setYear] = useState("All");
  const [section, setSection] = useState("All");
  const [showOnlyCRs, setShowOnlyCRs] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const filteredStudents = useMemo(() => {
    return studentRecords.filter((student) => {
      const matchQuery = [student.rollNumber, student.name, student.department, student.className, student.section]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchDepartment = department === "All" || student.department === department;
      const matchYear = year === "All" || student.year === year;
      const matchSection = section === "All" || student.section === section;
      const matchCR = !showOnlyCRs || student.crAssigned;

      return matchQuery && matchDepartment && matchYear && matchSection && matchCR;
    });
  }, [department, query, section, showOnlyCRs, year]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {crStats.map((item) => (
          <StatCard key={item.title} label={item.title} value={item.value} delta={item.detail} icon={<UserRoundPlus size={18} />} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <button type="button" onClick={() => setShowAddUserModal(true)} className="rounded-[24px] border border-white/70 bg-white/85 p-5 text-left shadow-[10px_10px_24px_rgba(15,23,42,0.08),-10px_-10px_24px_rgba(255,255,255,0.95)] transition hover:-translate-y-0.5 hover:shadow-[10px_12px_28px_rgba(79,70,229,0.16),-10px_-10px_24px_rgba(255,255,255,0.95)] dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-[10px_10px_30px_rgba(2,6,23,0.6),-10px_-10px_24px_rgba(30,41,59,0.35)]">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/20">
              <UserRoundPlus className="text-indigo-500" />
            </div>
            <SectionTitle title="Assign CR" description="Maintain leadership pipeline" />
          </div>
        </button>
        <button type="button" className="rounded-[24px] border border-white/70 bg-white/85 p-5 text-left shadow-[10px_10px_24px_rgba(15,23,42,0.08),-10px_-10px_24px_rgba(255,255,255,0.95)] transition hover:-translate-y-0.5 hover:shadow-[10px_12px_28px_rgba(245,158,11,0.16),-10px_-10px_24px_rgba(255,255,255,0.95)] dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-[10px_10px_30px_rgba(2,6,23,0.6),-10px_-10px_24px_rgba(30,41,59,0.35)]">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-500/20">
              <BellDot className="text-amber-500" />
            </div>
            <SectionTitle title="Announcements" description="Quick campus comms" />
          </div>
        </button>
        <button type="button" className="rounded-[24px] border border-white/70 bg-white/85 p-5 text-left shadow-[10px_10px_24px_rgba(15,23,42,0.08),-10px_-10px_24px_rgba(255,255,255,0.95)] transition hover:-translate-y-0.5 hover:shadow-[10px_12px_28px_rgba(6,182,212,0.16),-10px_-10px_24px_rgba(255,255,255,0.95)] dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-[10px_10px_30px_rgba(2,6,23,0.6),-10px_-10px_24px_rgba(30,41,59,0.35)]">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-50 text-cyan-500 dark:bg-cyan-500/20">
              <MessageSquareMore className="text-cyan-500" />
            </div>
            <SectionTitle title="Meeting Requests" description="Feedback and coordination" />
          </div>
        </button>
      </div>
      <ClayCard className="w-full overflow-hidden">
        <SectionTitle eyebrow="Student Leadership" title="CR Assignment & Search" description="Manage CRs using Roll Number, Name, Department, Year, Section, and Class" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by Roll Number, Name, Class..." className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white" />
          </div>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
            {departments.map((item) => (
              <option key={item} value={item}>{item === "All" ? "All Departments" : item}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
            {years.map((item) => (
              <option key={item} value={item}>{item === "All" ? "All Years" : item}</option>
            ))}
          </select>
          <select value={section} onChange={(e) => setSection(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
            {sections.map((item) => (
              <option key={item} value={item}>{item === "All" ? "All Sections" : item}</option>
            ))}
          </select>
          <button onClick={() => setShowOnlyCRs((prev) => !prev)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-indigo-500">
            <Filter size={16} /> {showOnlyCRs ? "Show All" : "CR Filter"}
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-medium">Roll Number</th>
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Year</th>
                <th className="pb-3 font-medium">Section</th>
                <th className="pb-3 font-medium">Class</th>
                <th className="pb-3 font-medium">CR</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.rollNumber} className="border-t border-slate-200/80 dark:border-slate-700/80">
                  <td className="py-4 pr-4 font-semibold text-slate-900 dark:text-white">{student.rollNumber}</td>
                  <td className="py-4 pr-4">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </div>
                  </td>
                  <td className="py-4 pr-4">{student.department}</td>
                  <td className="py-4 pr-4">{student.year}</td>
                  <td className="py-4 pr-4">{student.section}</td>
                  <td className="py-4 pr-4">{student.className}</td>
                  <td className="py-4 pr-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${student.crAssigned ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                      {student.crAssigned ? "Assigned" : "Available"}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Edit</button>
                      <button className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">Send Message</button>
                      <button className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-500 dark:bg-rose-500/10">Block</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ClayCard>

      <ClayCard className="space-y-4">
        <SectionTitle eyebrow="CR Profile" title="Leadership Overview" description="Profile actions, attendance, notifications, and account controls" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[20px] bg-slate-50 p-4 dark:bg-slate-800/70">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Assigned Class</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">Data Structures</p>
          </div>
          <div className="rounded-[20px] bg-slate-50 p-4 dark:bg-slate-800/70">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Assigned Section</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">A</p>
          </div>
          <div className="rounded-[20px] bg-slate-50 p-4 dark:bg-slate-800/70">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Student Count</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">58</p>
          </div>
          <div className="rounded-[20px] bg-slate-50 p-4 dark:bg-slate-800/70">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Notifications Sent</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">24</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Edit Profile</button>
          <button className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Reset Password</button>
          <button className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">Enable Account</button>
        </div>
      </ClayCard>

      <AddUserModal isOpen={showAddUserModal} onClose={() => setShowAddUserModal(false)} defaultRole="CR" />
    </div>
  );
}
