interface PageHeadingProps {
  title: string
  subtitle?: string
}

export default function PageHeading({ title, subtitle }: PageHeadingProps) {
  return (
    <div className="mb-6 space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
      {subtitle ? <p className="max-w-3xl text-sm text-slate-600">{subtitle}</p> : null}
    </div>
  )
}
