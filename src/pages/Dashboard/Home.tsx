import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="College ERP Dashboard"
        description="Premium college administration dashboard redesign"
      />
      <div className="rounded-[24px] bg-white/80 p-8 text-slate-700 shadow-lg dark:bg-slate-900/80 dark:text-slate-200">
        The legacy commerce dashboard content has been removed. The ERP landing experience is now routed through the redesigned dashboard flow.
      </div>
    </>
  );
}
