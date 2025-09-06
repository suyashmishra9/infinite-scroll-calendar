import { memo, useMemo } from "react";
import {
  buildMonthMatrix,
  getWeekdayLabels,
  isSameDay,
  formatAriaLabel,
  type WeekStart,
} from "../utils/calendar";
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
  selectedDate?: string | null;
  setSelectedDate?: (date: string) => void;
};

const DayCell = memo(({ 
  day, 
  isToday, 
  isFirstOfMonth, 
  isCurrentMonth, 
  textColor, 
  dayKey, 
  dayEntries, 
  isSelected, 
  setModalOpen, 
  setSelectedDate 
}: {
  day: Date;
  isToday: boolean;
  isFirstOfMonth: boolean;
  isCurrentMonth: boolean;
  textColor: string;
  dayKey: string;
  dayEntries: Entry[];
  isSelected: boolean;
  setModalOpen: (date: string) => void;
  setSelectedDate?: (date: string) => void;
}) => {
  const handleClick = () => {
    if (!isCurrentMonth) return; 

    if (isSelected && setSelectedDate) {
      setSelectedDate(""); 
    } else if (setSelectedDate) {
      setSelectedDate(dayKey); 
    }

    if (dayEntries.length > 0) setModalOpen(dayKey);
  };

  return (
    <button
      key={day.toISOString()}
      type="button"
      aria-label={formatAriaLabel(day)}
      className={[
        "relative w-full h-28 rounded-lg p-2 sm:p-3 flex flex-col items-center text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2 calendar-day-cell",
        isToday
          ? "bg-blue-600 text-white focus-visible:ring-blue-600"
          : isSelected
            ? "bg-blue-300 text-black focus-visible:ring-blue-500"
            : "bg-white focus-visible:ring-blue-500",
        "border border-gray-200 hover:border-gray-300",
      ].join(" ")}
      onClick={handleClick}
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
});

DayCell.displayName = 'DayCell';

const MonthView = memo(({
  date,
  activeMonth,
  weekStartsOn = 0,
  innerRef,
  entriesByDate,
  setModalOpen,
  selectedDate,
  setSelectedDate,
}: MonthViewProps) => {
  const { matrix, weekdayLabels, today } = useMemo(() => ({
    matrix: buildMonthMatrix(date, weekStartsOn),
    weekdayLabels: getWeekdayLabels(weekStartsOn),
    today: new Date()
  }), [date, weekStartsOn]);

  const monthKey = useMemo(() => 
    `${date.getFullYear()}-${date.getMonth()}`, 
    [date]
  );

  return (
    <div ref={innerRef} className="mx-auto max-w-5xl px-2 sm:px-4 py-3 sm:py-6 calendar-month">
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
          const isSelected = selectedDate === dayKey;

          return (
            <DayCell
              key={`${monthKey}-${dayKey}`}
              day={day}
              isToday={isToday}
              isFirstOfMonth={isFirstOfMonth}
              isCurrentMonth={isCurrentMonth}
              textColor={textColor}
              dayKey={dayKey}
              dayEntries={dayEntries}
              isSelected={isSelected}
              setModalOpen={setModalOpen}
              setSelectedDate={setSelectedDate}
            />
          );
        })}
      </div>
    </div>
  );
});

MonthView.displayName = 'MonthView';

export default MonthView;
