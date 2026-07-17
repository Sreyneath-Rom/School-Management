import PageHeading from './PageHeading'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <PageHeading title={title} />

      <div className="rounded-[28px] border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 shadow-sm">
        <p className="text-stone-500 dark:text-stone-400">{description ?? 'This page is not built yet. Content will appear here soon.'}</p>
        <div className="mt-6 rounded-3xl border border-dashed border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 p-8 text-sm text-stone-500 dark:text-stone-400">
          Placeholder content for the {title} page.
        </div>
      </div>
    </div>
  )
}