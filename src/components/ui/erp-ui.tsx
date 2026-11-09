import { motion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

export const cn = (...classes: Array<string | false | null | undefined>) =>
  clsx(classes);

interface ClayCardProps {
  children: ReactNode;
  className?: string;
}

export function ClayCard({ children, className }: ClayCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-[10px_10px_24px_rgba(15,23,42,0.08),-10px_-10px_24px_rgba(255,255,255,0.95)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-[10px_10px_30px_rgba(2,6,23,0.6),-10px_-10px_24px_rgba(30,41,59,0.35)]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  icon: ReactNode;
}

export function StatCard({ label, value, delta, icon }: StatCardProps) {
  return (
    <ClayCard className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</h3>
          <p className="mt-1 text-xs font-medium text-emerald-500">{delta}</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
          {icon}
        </div>
      </div>
    </ClayCard>
  );
}

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="space-y-1">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">{eyebrow}</p> : null}
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
      {description ? <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
    </div>
  );
}
