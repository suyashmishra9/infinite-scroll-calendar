import {
  buildMonthMatrix,
  getWeekdayLabels,
  isSameDay,
  formatAriaLabel,
  type WeekStart,
} from "../utils/Calendar";
import { format } from "date-fns";
import CalendarDayCell from "./CalendarDayCell";
import { toYMD } from "../utils/journal"; 
import type { Entry } from "../types";

type MonthViewProps = {
  date: Date;                          
  activeMonth: Date;                   
  weekStartsOn?: WeekStart;
  innerRef?: React.Ref<HTMLDivElement>;

  entriesByDate: Map<string, Entry[]>; 
  setModalOpen: (date: string) => void; 
};

export default function MonthView({
  date,
  activeMonth,
  weekStartsOn = 0,
  innerRef,
  entriesByDate,
  setModalOpen,
}: MonthViewProps) {
  const matrix = buildMonthMatrix(date, weekStartsOn);
  const weekdayLabels = getWeekdayLabels(weekStartsOn);
  const today = new Date();

  return (
    <div ref={innerRef} className="mx-auto max-w-5xl px-2 sm:px-4 py-3 sm:py-6">
      <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-medium text-gray-500 select-none mb-1">
        {weekdayLabels.map((d, idx) => (
          <div key={idx}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {matrix.flat().map((day, idx) => {
          if (!day) return <div key={idx} />; 

          const isToday = isSameDay(day, today);
          const isFirstOfMonth = day.getDate() === 1;

          const isCurrentMonth =
            day.getMonth() === activeMonth.getMonth() &&
            day.getFullYear() === activeMonth.getFullYear();
          const textColor = isCurrentMonth ? "text-black" : "text-gray-400";

          const dayKey = toYMD(day);
          const dayEntries = entriesByDate.get(dayKey) || [];

          return (
            <button
              key={day.toISOString()}
              type="button"
              aria-label={formatAriaLabel(day)}
              className={[
                "relative w-full h-28 rounded-lg p-2 sm:p-3 flex flex-col items-center",
                "text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                isToday
                  ? "bg-blue-600 text-white focus-visible:ring-blue-600"
                  : "bg-white focus-visible:ring-blue-500",
                "border border-gray-200 hover:border-gray-300",
              ].join(" ")}
              onClick={() => dayEntries.length > 0 && setModalOpen(dayKey)}
            >
              <span className={`text-sm sm:text-base font-medium mt-1 ${textColor}`}>
                {isFirstOfMonth ? `${format(day, "MMM")} ${day.getDate()}` : day.getDate()}
              </span>

              {dayEntries.length > 0 && (
                <CalendarDayCell
                  date={dayKey}
                  entries={dayEntries}
                  onOpen={setModalOpen}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
