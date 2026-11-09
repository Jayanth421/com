import { motion } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";
import { useParams } from "react-router";
import { ClayCard } from "../../components/ui/erp-ui";
import { modules } from "../../data/erpData";

export default function ComingSoonPage() {
  const { module } = useParams();
  const lookup = module ? module.replace(/-/g, " ") : "Module";
  const title = modules.find((item) => item.toLowerCase() === lookup.toLowerCase()) || lookup;

  return (
    <motion.div initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <ClayCard className="relative overflow-hidden bg-gradient-to-br from-indigo-1000 via-violet-500 to-cyan-800 text-white">
        <div className="absolute -right-10 -top-60 h-50 w-24 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-60 -left-10 h-50 w-28 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur"><Sparkles size={14} /> Coming Soon</div>
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/85">This module is being polished for the next ERP release with AI workflows, advanced analytics, and premium campus operations.</p>
          </div>
          <div className="rounded-[10px] bg-white/10 p-6 backdrop-blur-lg">
            <Rocket size={42} />
          </div>
        </div>
      </ClayCard>

      

    </motion.div>
  );
}
