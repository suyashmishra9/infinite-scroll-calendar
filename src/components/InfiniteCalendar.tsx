import { useState, useRef, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import MonthView from "./MonthView";
import JournalModal from "./JournalModal";
import { addMonths, subMonths } from "date-fns";
import { loadEntries, normalizeEntries, toYMD } from "../utils/journal";
import sampleData from "../data/sampleData.json";
import type { Entry } from "../types";
import CreateEntryModal from "./CreateEntryModal";

const INITIAL_BUFFER = 3;
const LOAD_MORE_OFFSET = 300;

export default function InfiniteCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const hasScrolledToCurrent = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [months, setMonths] = useState<Date[]>(() => {
    const arr: Date[] = [];
    for (let i = -INITIAL_BUFFER; i <= INITIAL_BUFFER; i++) {
      arr.push(addMonths(today, i));
    }
    return arr;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const monthRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [loading, setLoading] = useState(true);
  const [entriesByDate, setEntriesByDate] = useState<Map<string, Entry[]>>(new Map());
  const [modalDate, setModalDate] = useState<string | null>(null);

  // Load entries from localStorage or sample data
  useEffect(() => {
    let stored = loadEntries();
    if (stored.size === 0) {
      stored = normalizeEntries(sampleData as Entry[]);
      localStorage.setItem("journalEntries", JSON.stringify(sampleData));
    }
    setEntriesByDate(stored);
  }, []);

  // Scroll to current month initially
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

  // Loading spinner delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Infinite scroll logic
  let scrollTimeout: NodeJS.Timeout;
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const scrollBottom = scrollTop + container.clientHeight;

    // Prepend months
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
        container.scrollTop = scrollTop + (newHeight - oldHeight);
      });
    }

    // Append months
    if (scrollBottom > container.scrollHeight - LOAD_MORE_OFFSET) {
      const lastMonth = months[months.length - 1];
      const newMonths: Date[] = [];
      for (let i = 1; i <= INITIAL_BUFFER; i++) {
        newMonths.push(addMonths(lastMonth, i));
      }
      setMonths(prev => [...prev, ...newMonths]);
    }

    // Update current month in viewport
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
    }, 50);
  };

  // Handle day selection (toggle)
  const handleDaySelect = (date: string) => {
    if (selectedDate === date) {
      setSelectedDate(null); // unselect if same day clicked
    } else {
      setSelectedDate(date);
    }
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
            <MonthView
              date={month}
              activeMonth={currentMonth}
              entriesByDate={entriesByDate}
              setModalOpen={setModalDate}
              selectedDate={selectedDate}
              setSelectedDate={handleDaySelect}
            />
          </div>
        ))}
      </div>

      {modalDate && (
        <JournalModal
          initialDate={modalDate}
          entriesByDate={entriesByDate}
          onClose={() => setModalDate(null)}
        />
      )}

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
        <button className="flex flex-col items-center justify-center text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m0 0h4m-4 0H5m14 0v-8m0 0l2 2m-2-2h-4" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </button>

        <button className="flex flex-col items-center justify-center text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
          </svg>
          <span className="text-xs mt-1">Search</span>
        </button>

        {/* Plus Button */}
        <button
          className="flex flex-col items-center justify-center text-gray-400"
          onClick={() => {
            const dateForModal = selectedDate ? new Date(selectedDate) : new Date();
            setSelectedDate(toYMD(dateForModal));
            setIsModalOpen(true);
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs mt-1">Add</span>
        </button>

        <button className="flex flex-col items-center justify-center text-blue-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs mt-1">Calendar</span>
        </button>

        <button className="flex flex-col items-center justify-center text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 21v-2a4 4 0 00-8 0v2m4-4a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
          <span className="text-xs mt-1">Login</span>
        </button>
      </div>

      {/* Floating Plus Button */}
      <button
        className="fixed bottom-20 right-5 bg-blue-600 w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg flex items-center justify-center z-50
          hover:scale-110 active:rotate-45 transition-transform duration-200"
        onClick={() => {
          const dateForModal = selectedDate ? new Date(selectedDate) : new Date();
          setSelectedDate(toYMD(dateForModal));
          setIsModalOpen(true);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 sm:w-10 sm:h-10 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {isModalOpen && selectedDate && (
        <CreateEntryModal
          date={new Date(selectedDate)}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
        </div>
      )}
    </>
  );
}
