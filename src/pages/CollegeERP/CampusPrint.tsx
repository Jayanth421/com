import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleDollarSign,
  FileUp,
  Filter,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  TrendingUp,
} from "lucide-react";
import { DocumentPreviewModal } from "../../components/ui/DocumentPreviewModal";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClayCard, SectionTitle, StatCard } from "../../components/ui/erp-ui";
import { printActivitySeries, printOrders, printQueue, printUsageByDepartment, subjectCatalog } from "../../data/erpData";

const statusTone = {
  Pending: "bg-amber-50 text-amber-600",
  Approved: "bg-emerald-50 text-emerald-600",
  Printing: "bg-cyan-50 text-cyan-600",
  Printed: "bg-indigo-50 text-indigo-600",
  Ready: "bg-violet-50 text-violet-600",
  Rejected: "bg-rose-50 text-rose-600",
};

const dashboardStats = [
  { label: "Total Print Orders", value: "326", delta: "+12% this week", icon: <Printer size={18} /> },
  { label: "Pending Orders", value: "24", delta: "4 urgent", icon: <Sparkles size={18} /> },
  { label: "Approved Orders", value: "86", delta: "+8", icon: <ShieldCheck size={18} /> },
  { label: "Printing", value: "18", delta: "2 high load", icon: <TrendingUp size={18} /> },
  { label: "Printed", value: "142", delta: "+19", icon: <CheckCircle2 size={18} /> },
  { label: "Ready for Delivery", value: "34", delta: "7 inspected", icon: <Truck size={18} /> },
  { label: "Delivered Orders", value: "96", delta: "On track", icon: <CheckCircle2 size={18} /> },
  { label: "Cancelled Orders", value: "6", delta: "2 escalated", icon: <CircleDollarSign size={18} /> },
  { label: "Today's Orders", value: "19", delta: "Live", icon: <Printer size={18} /> },
  { label: "Monthly Orders", value: "412", delta: "+14%", icon: <TrendingUp size={18} /> },
];

export default function CampusPrint() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [subject, setSubject] = useState("All");
  const [status, setStatus] = useState("All");
  const [date, setDate] = useState("");
  const [previewOrder, setPreviewOrder] = useState<any>(null);

  const filteredOrders = useMemo(() => {
    return printOrders.filter((order) => {
      const searchText = [order.studentName, order.rollNumber, order.department, order.subject, order.section, order.className]
        .join(" ")
        .toLowerCase();
      const matchesQuery = searchText.includes(query.toLowerCase());
      const matchesDepartment = department === "All" || order.department === department;
      const matchesClass = classFilter === "All" || order.className === classFilter;
      const matchesSubject = subject === "All" || order.subject === subject;
      const matchesStatus = status === "All" || order.printStatus === status;
      const matchesDate = !date || order.requestDate === date;
      return matchesQuery && matchesDepartment && matchesClass && matchesSubject && matchesStatus && matchesDate;
    });
  }, [classFilter, date, department, query, status, subject]);

  const subjectOptions = ["All", ...new Set(subjectCatalog.map((item) => item.subject))];
  const departments = ["All", ...new Set(printOrders.map((item) => item.department))];
  const classOptions = ["All", ...new Set(printOrders.map((item) => item.className))];
  const statuses = ["All", "Pending", "Approved", "Printing", "Printed", "Ready", "Rejected"];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} delta={stat.delta} icon={stat.icon} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <ClayCard>
          <SectionTitle eyebrow="Workflow" title="Subject & Print Administration" description="Create, assign, review, and manage every print request from one dashboard" />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {subjectCatalog.map((subjectItem) => (
              <div key={subjectItem.subject} className="rounded-[22px] bg-slate-50/80 p-4 shadow-sm dark:bg-slate-800/60">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{subjectItem.subject}</p>
                    <p className="text-sm text-slate-500">{subjectItem.faculty} • {subjectItem.department}</p>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">{subjectItem.status}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                  <span>{subjectItem.className}</span>
                  <span>{subjectItem.printRequests} requests</span>
                </div>
              </div>
            ))}
          </div>
        </ClayCard>

        <ClayCard>
          <SectionTitle eyebrow="Analytics" title="Print Activity & Department Usage" description="Real-time workflow analytics with clear department demand" />
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={printActivitySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.4} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={printUsageByDepartment} dataKey="value" innerRadius={45} outerRadius={78} paddingAngle={4}>
                  {printUsageByDepartment.map((entry, index) => (
                    <Cell key={entry.name} fill={index % 2 === 0 ? "#4F46E5" : "#06B6D4"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ClayCard>
      </div>

      <ClayCard>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SectionTitle eyebrow="Operations" title="Campus Print Dashboard" description="Advanced filters for Department, Subject, Class, Status, and Date" />
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search student or roll number" className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white" />
            </div>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
              {departments.map((item) => <option key={item} value={item}>{item === "All" ? "All Departments" : item}</option>)}
            </select>
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
              {classOptions.map((item) => <option key={item} value={item}>{item === "All" ? "All Classes" : item}</option>)}
            </select>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
              {subjectOptions.map((item) => <option key={item} value={item}>{item === "All" ? "All Subjects" : item}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
              {statuses.map((item) => <option key={item} value={item}>{item === "All" ? "All Status" : item}</option>)}
            </select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white" />
            <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-indigo-500">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Roll Number</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Year</th>
                <th className="pb-3 font-medium">Section</th>
                <th className="pb-3 font-medium">Subject</th>
                <th className="pb-3 font-medium">Pages</th>
                <th className="pb-3 font-medium">Copies</th>
                <th className="pb-3 font-medium">Print Type</th>
                <th className="pb-3 font-medium">Payment</th>
                <th className="pb-3 font-medium">Print Status</th>
                <th className="pb-3 font-medium">Delivery</th>
                <th className="pb-3 font-medium">Request Date</th>
                <th className="pb-3 font-medium">Preview</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={`${order.rollNumber}-${order.requestDate}`} className="border-t border-slate-200/80 dark:border-slate-700/80">
                  <td className="py-4 pr-4 font-semibold text-slate-900 dark:text-white">{order.studentName}</td>
                  <td className="py-4 pr-4">{order.rollNumber}</td>
                  <td className="py-4 pr-4">{order.department}</td>
                  <td className="py-4 pr-4">{order.year}</td>
                  <td className="py-4 pr-4">{order.section}</td>
                  <td className="py-4 pr-4">{order.subject}</td>
                  <td className="py-4 pr-4">{order.pages}</td>
                  <td className="py-4 pr-4">{order.copies}</td>
                  <td className="py-4 pr-4">{order.printType}</td>
                  <td className="py-4 pr-4">{order.paymentStatus}</td>
                  <td className="py-4 pr-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[order.printStatus as keyof typeof statusTone]}`}>{order.printStatus}</span></td>
                  <td className="py-4 pr-4">{order.deliveryStatus}</td>
                  <td className="py-4 pr-4">{order.requestDate}</td>
                  <td className="py-4 pr-4">
                    <button
                      onClick={() => setPreviewOrder({
                        ...order,
                        fileName: `${order.subject}.pdf`,
                        fileSize: `${Math.max(order.pages * 0.8, 1.1).toFixed(1)} MB`,
                        uploadedBy: "Admin Office",
                        uploadDate: order.requestDate,
                        previewType: order.printType === "Color" ? "pdf" : "docx",
                      })}
                      className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300"
                    >
                      Open Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ClayCard>

      <DocumentPreviewModal isOpen={Boolean(previewOrder)} onClose={() => setPreviewOrder(null)} order={previewOrder ?? {
        studentName: "",
        rollNumber: "",
        department: "",
        section: "",
        className: "",
        subject: "",
        fileName: "",
        fileSize: "",
        pages: 1,
        uploadedBy: "",
        uploadDate: "",
        previewType: "pdf",
      }} />

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <ClayCard>
          <SectionTitle eyebrow="Print Queue" title="Approval Workflow" description="Review outstanding campus print requests and assign them to subject stream" />
          <div className="mt-4 space-y-3">
            {printQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-800/60">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.owner}</p>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-semibold ${item.color === "warning" ? "bg-amber-50 text-amber-600" : item.color === "success" ? "bg-emerald-50 text-emerald-600" : item.color === "info" ? "bg-cyan-50 text-cyan-600" : "bg-rose-50 text-rose-600"}`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </ClayCard>

        <ClayCard>
          <SectionTitle eyebrow="Document Handling" title="Preview & Upload Controls" description="Uploaded file previews, review states, and print readiness" />
          <div className="mt-4 grid gap-3">
            {[
              { title: "Assignment Notes.pdf", meta: "12 pages • 2 copies" },
              { title: "Exam Spec Sheet.docx", meta: "Preview ready" },
              { title: "Lab Record.PPT", meta: "Faculty review pending" },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-2xl bg-slate-50/80 p-3 dark:bg-slate-800/60">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.meta}</p>
                </div>
                <button className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><FileUp size={16} /></button>
              </div>
            ))}
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
