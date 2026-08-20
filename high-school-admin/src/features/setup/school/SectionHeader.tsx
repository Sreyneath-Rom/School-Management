// src/features/setup/school/SectionHeader.tsx
interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function SectionHeader({ icon, title, description }: Props) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100/70 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}