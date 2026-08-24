// src/features/setup/school/SectionHeader.tsx
interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function SectionHeader({ icon, title, description }: Props) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to from-brand-100 to-brand-200/60 text-brand-700 dark:from-brand-900/30 dark:to-brand-800/20 dark:text-brand-300">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}