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

export function buildMonthMatrix(date: Date, weekStartsOn: WeekStart = 0): (Date | null)[][] {
  const startOfMonthDate = startOfMonth(date);
  const endOfMonthDate = endOfMonth(date);

  const startWeekday = startOfMonthDate.getDay(); 
  const padding = weekStartsOn === 0 ? startWeekday : (startWeekday === 0 ? 6 : startWeekday - 1);

  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];

  for (let i = 0; i < padding; i++) {
    currentWeek.push(null);
  }

  let current = startOfMonthDate;
  while (current <= endOfMonthDate) {
    currentWeek.push(current);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    current = addDays(current, 1);
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
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

export function formatMonthShort(date: Date): string {
  return format(date, "MMM"); 
}

