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
};

export default function MonthView({ date, weekStartsOn = 0 }: MonthViewProps) {
    const matrix = buildMonthMatrix(date, weekStartsOn);
    const weekdayLabels = getWeekdayLabels(weekStartsOn);
    const today = new Date();

    return (
        <div className="mx-auto max-w-5xl px-2 sm:px-4 py-3 sm:py-6">

            <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-medium text-gray-500 select-none">
                {weekdayLabels.map((d) => (
                    <div key={d} className="py-1 sm:py-2">{d}</div>
                ))}
            </div>


            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {matrix.flat().map((day) => {
                    const outside = !isSameMonth(day, date);
                    const isToday = isSameDay(day, today);

                    return (
                        <button
                            key={day.toISOString()}
                            type="button"
                            aria-label={formatAriaLabel(day)}
                            className={[
                                "relative w-full aspect-square rounded-lg p-1 sm:p-2",
                                "text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                isToday
                                    ? "bg-blue-600 text-white focus-visible:ring-blue-600"
                                    : "bg-white text-gray-900 focus-visible:ring-blue-500",
                                outside ? "opacity-40" : "",
                                "border border-gray-200 hover:border-gray-300",
                            ].join(" ")}
                        >
                            <span className="text-xs sm:text-sm font-medium">
                                {day.getDate()}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
