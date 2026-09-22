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

      <div className="rounded-[28px] glass-sm p-8">
        <p className="text-fg-muted">
          {description ??
            'This page is not built yet. Content will appear here soon.'}
        </p>

        {/* Dashed well — the border is a visual "slot" affordance, so
            keep it visible by tinting against --neu-shadow-dark rather
            than the (now transparent) --glass-outline. */}
        <div className="mt-6 rounded-3xl border border-dashed border-(--neu-shadow-dark) shadow-sunken p-8 text-sm text-fg-muted">
          Placeholder content for the {title} page.
        </div>
      </div>
    </div>
  )
}