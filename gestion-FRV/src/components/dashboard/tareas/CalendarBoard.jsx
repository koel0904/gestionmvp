import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import PropTypes from "prop-types";

// Helper color map for calendar dots based on task status
const statusColors = {
  "Sin realizar": "bg-white/40",
  "En proceso": "bg-blue-400",
  "Realizada": "bg-emerald-400",
  "No se pudo completar": "bg-amber-400",
  "Fuera de tiempo": "bg-red-400",
};

export default function CalendarBoard({ tareas, isLoading }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayTasks, setSelectedDayTasks] = useState(null); // { date: Date, tasks: [] }

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToday = () => setCurrentDate(new Date());

  // Finding empty slots at start to align the first day to its DOW (Day Of Week), 
  // Assuming Sunday starts index 0. `startOfMonth(currentDate).getDay()`
  const startDay = startOfMonth(currentDate).getDay();
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-[2rem] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden bg-[#1a1b26]/60 backdrop-blur-2xl border border-white/10">
      
      {/* Background glow decorator */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-transparent via-blue-500/20 to-purple-500/30 blur-[150px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3"></div>

      {/* Header Month / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {format(currentDate, "MMMM yyyy", { locale: es })}
        </h2>
        <div className="flex bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10 w-fit">
          <button onClick={prevMonth} className="w-10 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button onClick={goToday} className="px-4 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            Today
          </button>
          <button onClick={nextMonth} className="w-10 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="w-full mb-4 px-2" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.75rem" }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center font-bold text-white/30 text-xs sm:text-sm tracking-widest">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="w-full flex-grow px-2" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.75rem" }}>
        
        {/* Empty cells before month starts */}
        {blanks.map((b) => (
           <div key={`blank-${b}`} className="w-full aspect-square" />
        ))}

        {/* Actual Days */}
        {daysInMonth.map(day => {
          // Filter tasks that fall exactly on this day
          const dayTasks = tareas.filter(t => isSameDay(new Date(t.deadline), day));

          const isCurrentDay = isToday(day);
          const hasTasks = dayTasks.length > 0;
          
          return (
            <div 
              key={day.toISOString()}
              onClick={() => hasTasks && setSelectedDayTasks({ date: day, tasks: dayTasks })}
              className={`
                relative flex flex-col items-center justify-center w-full aspect-square
                rounded-2xl transition-all duration-300
                ${isCurrentDay 
                  ? "bg-gradient-to-br from-indigo-500/40 to-purple-500/20 shadow-[0_0_30px_rgba(99,102,241,0.3)]" 
                  : "bg-white/5 hover:bg-white/10 hover:scale-105 hover:z-10"
                }
                ${hasTasks ? "cursor-pointer" : ""}
              `}
              style={{
                boxShadow: isCurrentDay ? "" : "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 6px rgba(0,0,0,0.2)"
              }}
            >
              <span className={`text-lg sm:text-2xl font-bold mb-2 ${isCurrentDay ? "text-white" : "text-white/60"}`}>
                {format(day, "d")}
              </span>
              
              {/* Task Dots Indicator */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center flex-wrap gap-1 px-1 sm:px-2">
                 {dayTasks.slice(0, 3).map((t) => (
                    <div 
                      key={t.id} 
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${statusColors[t.status] || statusColors["Sin realizar"]}`}
                      title={t.title}
                      style={{ boxShadow: "0 0 5px currentColor" }}
                    />
                 ))}
                 {dayTasks.length > 3 && (
                   <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/20 text-[6px] sm:text-[8px] font-bold text-white flex items-center justify-center">+</div>
                 )}
              </div>
            </div>
          );
        })}

      </div>

      {/* Day Tasks Detail Modal overlay */}
      {selectedDayTasks && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A0A0A]/50 backdrop-blur-md" onClick={() => setSelectedDayTasks(null)} />
          <div className="relative w-full max-w-sm glass-panel p-6 rounded-3xl shadow-2xl border border-white/10">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
               <div>
                  <h3 className="text-xl font-bold text-white">Tareas del Día</h3>
                  <p className="text-xs text-white/50">{format(selectedDayTasks.date, "PPP", { locale: es })}</p>
               </div>
               <button onClick={() => setSelectedDayTasks(null)} className="text-white/40 hover:text-white">
                 <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {selectedDayTasks.tasks.map(t => (
                <div key={t.id} className="bg-white/5 rounded-xl p-3 border border-white/5">
                   <div className="flex justify-between items-start gap-2">
                     <p className="text-sm font-bold text-white">{t.title}</p>
                     <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${statusColors[t.status] || statusColors["Sin realizar"]}`} title={t.status} />
                   </div>
                   <p className="text-[10px] text-white/40 font-mono mt-1">{format(new Date(t.deadline), "HH:mm")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

CalendarBoard.propTypes = {
  tareas: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
