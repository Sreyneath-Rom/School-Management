// src/components/common/PageHeading.tsx
interface PageHeadingProps {
  title: string
  subtitle?: string
}

export default function PageHeading({ title, subtitle }: PageHeadingProps) {
  return (
    <div className="mb-6 space-y-2">
      <h1 className="text-3xl font-bold tracking-tight text-fg">{title}</h1>
      {subtitle && (
        <p className="max-w-3xl text-sm text-fg-muted">{subtitle}</p>
      )}
    </div>
  )
}