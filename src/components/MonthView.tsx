import {
  buildMonthMatrix,
  getWeekdayLabels,
  isSameDay,
  isSameMonth,
  formatAriaLabel,
  type WeekStart,
} from "../utils/Calendar";

type MonthViewProps = {
  date: Date;
  weekStartsOn?: WeekStart;
  innerRef?: React.Ref<HTMLDivElement>;
};

export default function MonthView({ date, weekStartsOn = 0, innerRef }: MonthViewProps) {
  const matrix = buildMonthMatrix(date, weekStartsOn);
  const weekdayLabels = getWeekdayLabels(weekStartsOn);
  const today = new Date();

  return (
    <div ref={innerRef} className="mx-auto max-w-5xl px-2 sm:px-4 py-3 sm:py-6">
     

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {matrix.flat().map((day) => {
          const outside = !isSameMonth(day, date);
          const isToday = isSameDay(day, today);

          return (
            <button
              type="button"
              aria-label={formatAriaLabel(day)}
              className={[
                "relative w-full h-20 rounded-lg p-1 sm:p-2 flex flex-col items-center",
                "text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                isToday
                  ? "bg-blue-600 text-white focus-visible:ring-blue-600"
                  : "bg-white text-gray-900 focus-visible:ring-blue-500",
                outside ? "opacity-40" : "",
                "border border-gray-200 hover:border-gray-300",
              ].join(" ")}
            >
              <span className="text-xs sm:text-sm font-medium mt-1">{day.getDate()}</span>
              {/* Other content can go here */}
            </button>

          );
        })}
      </div>
    </div>
  );
}