import PageHeading from './PageHeading'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <PageHeading title={title} />

      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-slate-500">{description ?? 'This page is not built yet. Content will appear here soon.'}</p>
        <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-sm text-slate-500">
          Placeholder content for the {title} page.
        </div>
      </div>
    </div>
  )
}
