import { Link } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import { BarChart3, TrendingUp, Users, Award, ArrowRight } from "lucide-react";

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
          <Link
            key={i}
            to={c.link}
            className="p-6 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 hover:border-brand-500/40 transition group bg-white/40 dark:bg-stone-900/40 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <c.icon size={22} />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-300">
                {c.stats}
              </span>
            </div>

            <h3 className="text-base font-bold text-stone-900 dark:text-white group-hover:text-brand-600 transition">
              {c.title}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {c.desc}
            </p>

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
