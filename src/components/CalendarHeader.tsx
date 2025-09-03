import { formatMonthTitle } from "../utils/Calendar";

type CalendarHeaderProps = {
  date: Date;
  headerRef?: React.Ref<HTMLDivElement>;
};


export default function CalendarHeader({ date, headerRef }: CalendarHeaderProps) {
  return (
  <div
    ref={headerRef}
    className="w-full sticky top-0 z-10 bg-white/80 backdrop-blur border-b"
  >
    <div className="mx-auto max-w-5xl px-4 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-semibold tracking-tight">
          My Calendar
        </h1>
        <h2 className="text-lg sm:text-2xl font-semibold tracking-tight">
          {formatMonthTitle(date)}
        </h2>
      </div>

    
      <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-medium text-gray-500 select-none mt-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
          <div key={idx}>{d}</div>
        ))}
      </div>
    </div>
  </div>
);

}