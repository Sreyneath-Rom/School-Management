// src/features/setup/school/SectionHeader.tsx
interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function SectionHeader({ icon, title, description }: Props) {
  return (
    <div className="flex items-start gap-3">
      {/* Icon well: sunken into the section card, brand-tinted.
          The old gradient-bg overlay was an off-theme sticker — a
          plain brand tint reads as the same accent with less noise. */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300 shadow-sunken">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-bold text-fg">{title}</h2>
        <p className="mt-1 text-sm text-fg-muted">{description}</p>
      </div>
    </div>
  );
}