interface PageHeadingProps {
  title: string
  subtitle?: string
}

export default function PageHeading({ title, subtitle }: PageHeadingProps) {
  return (
    <div className="mb-6 space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">{title}</h1>
      {subtitle ? <p className="max-w-3xl text-sm text-stone-500 dark:text-stone-400">{subtitle}</p> : null}
    </div>
  )
}