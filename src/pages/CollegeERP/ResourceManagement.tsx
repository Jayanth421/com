import { FileText, FolderOpen, Presentation, Video } from "lucide-react";
import { ClayCard, SectionTitle } from "../../components/ui/erp-ui";
import { resources } from "../../data/erpData";

export default function ResourceManagement() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "PPT", icon: Presentation },
          { title: "PDF", icon: FileText },
          { title: "Videos", icon: Video },
          { title: "Notes", icon: FolderOpen },
        ].map((item) => (
          <ClayCard key={item.title}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Library</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white">
                <item.icon size={18} />
              </div>
            </div>
          </ClayCard>
        ))}
      </div>

      <ClayCard>
        <SectionTitle eyebrow="Library" title="Resource Library" description="Shareable learning assets and course material" />
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {resources.map((resource) => (
            <div key={resource.name} className="rounded-[22px] bg-slate-50/80 p-4 dark:bg-slate-800/60">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{resource.name}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{resource.type}</span>
                <span>{resource.size}</span>
              </div>
              <p className="mt-3 text-xs text-indigo-500">{resource.folder}</p>
            </div>
          ))}
        </div>
      </ClayCard>
    </div>
  );
}
