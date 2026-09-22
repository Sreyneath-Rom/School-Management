// src/features/communication/index.tsx
import { Link } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import { Megaphone, Mail, Bell, ArrowRight } from "lucide-react";

export default function CommunicationFeature() {
  const cards = [
    {
      title: "Announcements & Bulletins",
      desc: "School-wide broadcasts, emergency alerts, and circulars for students and parents.",
      link: "/communication/announcements",
      icon: Megaphone,
      stats: "5 Active Bulletins",
    },
    {
      title: "Direct Messages & Inbox",
      desc: "Secure 1-on-1 and group messaging between parents, faculty, and administration.",
      link: "/messages",
      icon: Mail,
      stats: "Unread Messages",
    },
    {
      title: "Notification Alerts",
      desc: "Real-time system events, leave status changes, and academic reminders.",
      link: "/communication/notifications",
      icon: Bell,
      stats: "Live Alerts",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Communication & Engagement Hub"
        subtitle="Manage messaging, public bulletins, and administrative alerts across the school community."
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
              <span>Open Channel</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}