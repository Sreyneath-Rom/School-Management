// src/components/common/PlaceholderPage.tsx
import PageHeading from './PageHeading'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <PageHeading title={title} />

      <div className="rounded-[28px] glass-sm border border-surface p-8">
        <p className="text-fg-muted">
          {description ??
            'This page is not built yet. Content will appear here soon.'}
        </p>
        <div className="mt-6 rounded-3xl border border-dashed border-surface bg-surface p-8 text-sm text-fg-muted">
          Placeholder content for the {title} page.
        </div>
      </div>
    </div>
  )
}