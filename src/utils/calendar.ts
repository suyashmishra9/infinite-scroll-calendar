import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay as isSameDayFn,
  isSameMonth as isSameMonthFn,
  format,
  isLeapYear as isLeapYearFn,
} from "date-fns";


export type WeekStart = 0 | 1;


export function startOfCalendarGrid(date: Date, weekStartsOn: WeekStart = 0): Date {
  return startOfWeek(startOfMonth(date), { weekStartsOn });
}


export function endOfCalendarGrid(date: Date, weekStartsOn: WeekStart = 0): Date {
  return endOfWeek(endOfMonth(date), { weekStartsOn });
}

export function buildMonthMatrix(date: Date, weekStartsOn: WeekStart = 0): Date[][] {
  const start = startOfCalendarGrid(date, weekStartsOn);
  const weeks: Date[][] = [];
  let current = start;

  for (let row = 0; row < 6; row++) {
    const week: Date[] = [];
    for (let col = 0; col < 7; col++) {
      week.push(current);
      current = addDays(current, 1);
    }
    weeks.push(week);
  }
  return weeks;
}


export function isSameDay(a: Date, b: Date): boolean {
  return isSameDayFn(a, b);
}

export function isSameMonth(date: Date, monthDate: Date): boolean {
  return isSameMonthFn(date, monthDate);
}

export function formatMonthTitle(date: Date): string {
  return format(date, "MMMM yyyy"); 
}

export function isLeapYear(year: number): boolean {
  return isLeapYearFn(new Date(year, 0, 1));
}

export function formatAriaLabel(date: Date): string {
  return format(date, "EEEE, do MMMM yyyy");
}

export function getWeekdayLabels(weekStartsOn: WeekStart = 0): string[] {
  const base = weekStartsOn === 1
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return base;
}
