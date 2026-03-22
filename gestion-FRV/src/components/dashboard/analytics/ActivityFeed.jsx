import PropTypes from "prop-types";

/**
 * Groups events by calendar day and assigns a per-day number (#1, #2…).
 * Expects each event to carry a `timestamp` ISO string.
 */
function groupByDay(events) {
  const now = new Date();
  const todayStr = now.toLocaleDateString("es");
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString("es");

  const groups = {};

  for (const ev of events) {
    const date = new Date(ev.timestamp);
    const dayKey = date.toLocaleDateString("es");

    let label;
    if (dayKey === todayStr) {
      label = "Hoy";
    } else if (dayKey === yesterdayStr) {
      label = "Ayer";
    } else {
      label = date.toLocaleDateString("es", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    }

    if (!groups[dayKey]) {
      groups[dayKey] = { label, sortDate: date, events: [] };
    }
    groups[dayKey].events.push(ev);
  }

  // Sort groups by date descending, events within each group are already sorted
  return Object.values(groups).sort((a, b) => b.sortDate - a.sortDate);
}

function formatTime(isoStr) {
  const d = new Date(isoStr);
  if (isNaN(d)) return "";
  return d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
}

export default function ActivityFeed({ events = [] }) {
  const dayGroups = groupByDay(events);

  return (
    <div className="glass-heavy rounded-2xl p-6 relative overflow-hidden flex flex-col gap-4 max-h-[420px]">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

      {/* Header */}
      <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.15em] flex items-center gap-1.5 shrink-0">
        <span className="material-symbols-outlined text-[15px]">history</span>
        Actividad Reciente
      </h3>

      {/* List */}
      <div className="flex flex-col gap-3 overflow-y-auto flex-1">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center flex-1">
            <div className="size-14 rounded-2xl glass-panel flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-3xl text-blue-400/50">
                history
              </span>
            </div>
            <p className="text-white/50 text-sm font-semibold">
              Sin actividad aún
            </p>
            <p className="text-white/30 text-xs mt-1">
              Los eventos aparecerán aquí
            </p>
          </div>
        ) : (
          dayGroups.map((group) => (
            <div key={group.label}>
              {/* Day header */}
              <div className="flex items-center gap-2 mb-2 mt-1">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                  {group.label}
                </span>
                <div className="flex-1 h-[1px] bg-white/[0.06]" />
                <span className="text-[10px] font-bold text-white/20">
                  {group.events.length}{" "}
                  {group.events.length === 1 ? "evento" : "eventos"}
                </span>
              </div>

              {/* Events for this day */}
              <div className="flex flex-col gap-1.5">
                {group.events.map((ev, i) => (
                  <div
                    key={ev.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors duration-200"
                  >
                    {/* Day number */}
                    <span className="text-[10px] font-black text-white/15 mt-2.5 w-5 text-right shrink-0">
                      #{i + 1}
                    </span>

                    {/* Icon */}
                    <div
                      className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${ev.iconBg || "bg-white/10"}`}
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${ev.iconColor || "text-white/60"}`}
                      >
                        {ev.icon}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-white truncate">
                          {ev.title}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {ev.badge && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${ev.badgeColor || "glass-badge text-white/50"}`}
                            >
                              {ev.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-white/40 mt-0.5 truncate">
                        {ev.desc}
                      </p>
                      <p className="text-[10px] text-white/25 mt-1 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[11px]">
                          schedule
                        </span>
                        {formatTime(ev.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

ActivityFeed.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      icon: PropTypes.string.isRequired,
      iconColor: PropTypes.string,
      iconBg: PropTypes.string,
      title: PropTypes.string.isRequired,
      desc: PropTypes.string,
      timestamp: PropTypes.string,
      badge: PropTypes.string,
      badgeColor: PropTypes.string,
    }),
  ),
};
