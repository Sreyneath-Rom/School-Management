// src/features/reports/index.tsx
import { Link } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import { TrendingUp, Users, Award, ArrowRight } from "lucide-react";

export default function ReportsFeature() {
  const cards = [
    {
      title: "Academic Performance Analytics",
      desc: "Comprehensive grade distributions, GPA percentiles, and subject pass metrics.",
      link: "/reports/academic",
      icon: TrendingUp,
      stats: "Term 2 Analytics",
    },
    {
      title: "Attendance & Truancy Reports",
      desc: "Daily homeroom registry logs, excused medical absences, and trend charts.",
      link: "/reports/attendance",
      icon: Users,
      stats: "96.4% School Rate",
    },
    {
      title: "Examination Result Moderation",
      desc: "Standardized test score breakdowns, ranking percentiles, and honors lists.",
      link: "/academic/exams",
      icon: Award,
      stats: "Exam Cycles",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Institutional Reports & Insights"
        subtitle="Generate executive data visualizations, cohort trends, and compliance metrics."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((c, i) => (
          // Was a full glassmorphism override on top of `.glass-sm`:
          // `border border-stone-200/70 ... bg-white/40 dark:bg-stone-900/40`
          // — the border was invisible against the page, the translucent
          // bgs were flat, and `hover:border-brand-500/40` did nothing
          // visible. `.glass-sm .glass-interactive` gives the raised
          // surface + the neumorphic hover-lift / press-in gesture.
          <Link
            key={i}
            to={c.link}
            className="p-6 rounded-2xl glass-sm glass-interactive space-y-3 group"
          >
            <div className="flex items-center justify-between">
              {/* Brand-tinted icon well, sunken into the card */}
              <div className="p-3 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400 shadow-sunken">
                <c.icon size={22} />
              </div>
              {/* Stat chip: carved-in badge in theme tokens */}
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-fg-muted shadow-sunken">
                {c.stats}
              </span>
            </div>

            <h3 className="text-base font-bold text-fg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
              {c.title}
            </h3>
            <p className="text-xs text-fg-muted leading-relaxed">{c.desc}</p>

            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
              <span>Generate Report</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}