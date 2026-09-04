import { Link } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import { Users, BookOpen, Clock, Building, ArrowRight } from "lucide-react";

export default function TeachersFeature() {
  const cards = [
    {
      title: "Faculty Directory",
      desc: "Comprehensive directory of teaching staff, profiles, departments, and credentials.",
      link: "/teachers",
      icon: Users,
      stats: "48 Faculty Members",
    },
    {
      title: "Teacher Subject Allocation",
      desc: "Assign subjects, homerooms, weekly period hours, and departmental leadership.",
      link: "/teachers/assignments",
      icon: BookOpen,
      stats: "96 Active Allocations",
    },
    {
      title: "Faculty Departments",
      desc: "Department chairs, curriculum alignment, and STEM/Humanities faculty divisions.",
      link: "/academic/departments",
      icon: Building,
      stats: "8 Academic Departments",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Faculty & Teachers Management"
        subtitle="Coordinate educator staffing, department organization, and classroom workload distributions."
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
              <span>View Directory</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
