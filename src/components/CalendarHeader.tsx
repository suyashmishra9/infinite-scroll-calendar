import { formatMonthTitle } from "../utils/Calendar";

type CalendarHeaderProps = {
  date: Date;
};

export default function CalendarHeader({ date }: CalendarHeaderProps) {
  return (
    <div className="w-full sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-5xl px-4 py-3 sm:py-4">
        <h1 className="text-lg sm:text-2xl font-semibold tracking-tight">
           {formatMonthTitle(date)}
        </h1>
      </div>
    </div>
  );
}
