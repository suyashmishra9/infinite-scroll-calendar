import { useState, useRef, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import MonthView from "./MonthView";
import { addMonths, subMonths } from "date-fns";

const INITIAL_BUFFER = 3;
const LOAD_MORE_OFFSET = 300;

export default function InfiniteCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const hasScrolledToCurrent = useRef(false);

  const [months, setMonths] = useState<Date[]>(() => {
    const arr: Date[] = [];
    for (let i = -INITIAL_BUFFER; i <= INITIAL_BUFFER; i++) {
      arr.push(addMonths(today, i));
    }
    return arr;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const monthRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const container = containerRef.current;
    if (!container || hasScrolledToCurrent.current) return;

    const scrollToCurrent = () => {
      const currentMonthDiv = monthRefs.current.get(months[INITIAL_BUFFER].toISOString());
      if (currentMonthDiv) {
        container.scrollTo({
          top: currentMonthDiv.offsetTop - 170,
          behavior: "auto",
        });
        hasScrolledToCurrent.current = true;
      }
    };

    const interval = setInterval(() => {
      if (container.scrollHeight > container.clientHeight) {
        scrollToCurrent();
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [months]);

  let scrollTimeout: NodeJS.Timeout;

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const scrollBottom = scrollTop + container.clientHeight;

    if (scrollTop < LOAD_MORE_OFFSET) {
      const firstMonth = months[0];
      const oldHeight = container.scrollHeight;

      const newMonths: Date[] = [];
      for (let i = 1; i <= INITIAL_BUFFER; i++) {
        newMonths.unshift(subMonths(firstMonth, i));
      }
      setMonths(prev => [...newMonths, ...prev]);

      setTimeout(() => {
        const newHeight = container.scrollHeight;
        const diff = newHeight - oldHeight;
        container.scrollTop = scrollTop + diff;
      });
    }

    if (scrollBottom > container.scrollHeight - LOAD_MORE_OFFSET) {
      const lastMonth = months[months.length - 1];
      const newMonths: Date[] = [];
      for (let i = 1; i <= INITIAL_BUFFER; i++) {
        newMonths.push(addMonths(lastMonth, i));
      }
      setMonths(prev => [...prev, ...newMonths]);
    }

    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollMiddle = container.scrollTop + container.clientHeight / 2;

      let closestMonth: Date | null = null;
      let minDistance = Infinity;

      monthRefs.current.forEach((el, key) => {
        const monthMiddle = el.offsetTop + el.offsetHeight / 2;
        const distance = Math.abs(scrollMiddle - monthMiddle);
        if (distance < minDistance) {
          minDistance = distance;
          closestMonth = new Date(key);
        }
      });

      if (closestMonth && closestMonth.getTime() !== currentMonth.getTime()) {
        setCurrentMonth(closestMonth);
      }
    }, 1);
  };


  return (
    <>
      <CalendarHeader date={currentMonth} />

      <div
        ref={containerRef}
        className="overflow-y-auto h-screen"
        onScroll={handleScroll}
      >
        {months.map((month) => (
          <div
            key={month.toISOString()}
            data-month={month.toISOString()}
            ref={el => {
              if (el) monthRefs.current.set(month.toISOString(), el);
            }}
          >
            <MonthView date={month} activeMonth={currentMonth} />
          </div>
        ))}
      </div>
    </>
  );
}
