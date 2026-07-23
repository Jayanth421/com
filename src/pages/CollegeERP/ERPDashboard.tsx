import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarRange,
  ClipboardCheck,
  Database,
  FileStack,
  GraduationCap,
  MessageSquare,
  Printer,
  School,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
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
import {
  attendanceSeries,
  dashboardStats,
  departmentOverview,
  growthSeries,
  printAnalytics,
  recentActivities,
  resourceAnalytics,
  upcomingEvents,
} from "../../data/erpData";

const iconMap = {
  Users,
  GraduationCap,
  Building2,
  School,
  BookOpen,
  CalendarRange,
  Printer,
  MessageSquare,
  Database,
  FileStack,
  ClipboardCheck,
};

export default function ERPDashboard() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {dashboardStats.slice(0, 4).map((stat) => {
          const Icon = iconMap[stat.icon as keyof typeof iconMap];
          return <StatCard key={stat.label} label={stat.label} value={stat.value} delta={stat.delta} icon={<Icon size={18} />} />;
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <ClayCard className="overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <SectionTitle eyebrow="Analytics" title="Attendance Analytics" description="Daily attendance pulse across semesters" />
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">94.6% avg</div>
          </div>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceSeries}>
                <defs>
                  <linearGradient id="attendanceFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.4} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="attendance" stroke="#4F46E5" strokeWidth={3} fill="url(#attendanceFill)" />
                <Area type="monotone" dataKey="target" stroke="#06B6D4" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ClayCard>

        <ClayCard>
          <SectionTitle eyebrow="Signals" title="Quick Actions" description="Priority tasks" />
          <div className="mt-4 grid gap-3">
            {[
              { title: "Assign CR", meta: "28 pending approvals", icon: Users },
              { title: "Campus Print", meta: "12 unchecked records", icon: Printer },
              { title: "Message Hub", meta: "18 unread", icon: MessageSquare },
            ].map((action) => (
              <div key={action.title} className="flex items-center justify-between rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white">
                    <action.icon size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{action.title}</p>
                    <p className="text-xs text-slate-500">{action.meta}</p>
                  </div>
                </div>
                <ArrowUpRight className="text-slate-400" size={18} />
              </div>
            ))}
          </div>
        </ClayCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ClayCard className="xl:col-span-2">
          <SectionTitle eyebrow="Growth" title="Student Growth" description="Enrollment trend across the academic year" />
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthSeries}>
                <defs>
                  <linearGradient id="growthFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.4} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="students" stroke="#7C3AED" fill="url(#growthFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ClayCard>

        <ClayCard>
          <SectionTitle eyebrow="Overview" title="Department Overview" description="Student distribution by college" />
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={departmentOverview} dataKey="value" innerRadius={55} outerRadius={88} paddingAngle={4}>
                  {departmentOverview.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2">
            {departmentOverview.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                </div>
                <span className="text-sm text-slate-500">{item.value}%</span>
              </div>
            ))}
          </div>
        </ClayCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ClayCard>
          <SectionTitle eyebrow="Print" title="Print Analytics" description="Industrial printing flow and activity" />
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={printAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.4} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pending" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                <Bar dataKey="approved" fill="#22C55E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="rejected" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ClayCard>

        <ClayCard>
          <SectionTitle eyebrow="Storage" title="Resource Analytics" description="Learning materials and uploads" />
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceAnalytics} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.4} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#06B6D4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ClayCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <ClayCard>
          <SectionTitle eyebrow="Pulse" title="Recent Activities" description="Live college operations" />
          <div className="mt-4 space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.title} className="flex items-start gap-3 rounded-2xl bg-slate-50/80 px-3 py-3 dark:bg-slate-800/60">
                <div className={`mt-1 h-2.5 w-2.5 rounded-full ${activity.color === "primary" ? "bg-indigo-500" : activity.color === "success" ? "bg-emerald-500" : activity.color === "warning" ? "bg-amber-500" : "bg-cyan-500"}`} />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{activity.title}</p>
                  <p className="text-sm text-slate-500">{activity.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </ClayCard>

        <ClayCard>
          <SectionTitle eyebrow="Agenda" title="Upcoming Events" description="Campus timeline" />
          <div className="mt-4 space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.name} className="flex items-center justify-between rounded-2xl bg-slate-50/80 px-3 py-3 dark:bg-slate-800/60">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{event.name}</p>
                  <p className="text-sm text-slate-500">{event.location}</p>
                </div>
                <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">{event.time}</div>
              </div>
            ))}
          </div>
        </ClayCard>
      </div>
    </motion.div>
  );
}
