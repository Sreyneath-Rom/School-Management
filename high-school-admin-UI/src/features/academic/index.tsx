// src/features/academic/index.tsx
import { Link } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import { BookOpen, Calendar, Award, GraduationCap, ArrowRight } from "lucide-react";

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
          // Was a full glassmorphism override on top of `.glass-sm`:
          // `border border-stone-200/70 ... bg-white/40 dark:bg-stone-900/40`
          // all fought the neumorphic surface. The border was invisible
          // against the page; the translucent bgs were flat; and the
          // `hover:border-brand-500/40` did nothing visible.
          //
          // `.glass-sm .glass-interactive` gives the raised surface plus
          // the neumorphic hover-lift / press-in gesture.
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
              {/* Stat chip: same treatment — a small carved-in badge */}
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-fg-muted shadow-sunken">
                {c.stats}
              </span>
            </div>

            <h3 className="text-base font-bold text-fg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
              {c.title}
            </h3>
            <p className="text-xs text-fg-muted leading-relaxed">{c.desc}</p>

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