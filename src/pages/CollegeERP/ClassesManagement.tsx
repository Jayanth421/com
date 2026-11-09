import { useMemo, useState } from "react";
import { Archive, BookOpen, Copy, Eye, Filter, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { ClayCard, SectionTitle } from "../../components/ui/erp-ui";
import { classRows } from "../../data/erpData";

export default function ClassesManagement() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");

  const filteredRows = useMemo(() => {
    return classRows.filter((row) => {
      const matchesQuery = [row.name, row.id, row.faculty].some((value) => value.toLowerCase().includes(query.toLowerCase()));
      const matchesDept = department === "all" || row.department === department;
      return matchesQuery && matchesDept;
    });
  }, [department, query]);

  return (
    <div className="space-y-6">
      <ClayCard>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <SectionTitle eyebrow="Academics" title="Classes Management" description="Search, filter, and manage class sections" />
          <div className="ml-auto flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1 sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search classes" className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white" />
            </div>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
              <option value="all">All departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
            <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-indigo-500">
              <Filter size={16} /> Filter
            </button>
            <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white">
              <Plus size={16} /> Add Class
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-medium">Class</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Year</th>
                <th className="pb-3 font-medium">Semester</th>
                <th className="pb-3 font-medium">Section</th>
                <th className="pb-3 font-medium">Students</th>
                <th className="pb-3 font-medium">Faculty</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200/80 dark:border-slate-700/80">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{row.name}</p>
                        <p className="text-xs text-slate-500">{row.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4"><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">{row.department}</span></td>
                  <td className="py-4 pr-4">{row.year}</td>
                  <td className="py-4 pr-4">{row.semester}</td>
                  <td className="py-4 pr-4">{row.section}</td>
                  <td className="py-4 pr-4">{row.students}</td>
                  <td className="py-4 pr-4">{row.faculty}</td>
                  <td className="py-4 pr-4"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">{row.status}</span></td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2 text-slate-500">
                      <button className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><Eye size={16} /></button>
                      <button className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><Pencil size={16} /></button>
                      <button className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><Copy size={16} /></button>
                      <button className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><Archive size={16} /></button>
                      <button className="rounded-xl bg-rose-50 p-2 text-rose-500 dark:bg-rose-500/10"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ClayCard>
    </div>
  );
}
