import { Link } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import { BookOpen, Calendar, Award, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AcademicFeature() {
  const cards = [
    {
      title: "Class & Section Management",
      desc: "Organize homerooms, class batches, capacity limits, and class teachers.",
      link: "/academic/classes",
      icon: GraduationCap,
      stats: "24 Active Classes",
    },
    {
      title: "Course Catalog & Subjects",
      desc: "Curriculum requirements, syllabi, elective allocations, and course codes.",
      link: "/academic/subjects",
      icon: BookOpen,
      stats: "48 Subjects",
    },
    {
      title: "Examination Sessions",
      desc: "Midterms, term finals, grading scales, and proctored hall allocations.",
      link: "/academic/exams",
      icon: Award,
      stats: "4 Active Exam Cycles",
    },
    {
      title: "Institutional Calendar",
      desc: "Schedules, academic milestones, holidays, and examination dates.",
      link: "/calendar",
      icon: Calendar,
      stats: "Upcoming Events",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Academic Administration"
        subtitle="Manage high school curricula, classes, examination sessions, and academic calendars."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              <span>Access Module</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
