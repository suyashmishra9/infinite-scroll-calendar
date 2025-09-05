import { useState, useRef, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import MonthView from "./MonthView";
import JournalModal from "./JournalModal";
import { addMonths, subMonths } from "date-fns";
import { loadEntries, toYMD, addEntry, saveEntries, normalizeEntries } from "../utils/journal";
import type { Entry } from "../types";
import CreateEntryModal from "./CreateEntryModal";
import sampleData from "../data/sampleData.json";
import { ArchiveBoxIcon } from "@heroicons/react/24/solid";
import MonthYearPickerModal from "../components/MonthYearPickerModal"




const INITIAL_BUFFER = 200;
const LOAD_MORE_OFFSET = 300;

export default function InfiniteCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const hasScrolledToCurrent = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [entriesByDate, setEntriesByDate] = useState<Map<string, Entry[]>>(new Map());
  const [showSampleButton, setShowSampleButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const monthRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const [months, setMonths] = useState<Date[]>(() => {
    const arr: Date[] = [];
    for (let i = -INITIAL_BUFFER; i <= INITIAL_BUFFER; i++) {
      arr.push(addMonths(today, i));
    }
    return arr;
  });


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); // 500ms delay
    return () => clearTimeout(timer);
  }, []);



  useEffect(() => {
    const stored = loadEntries();
    setEntriesByDate(stored);

    const totalEntries = Array.from(stored.values()).flat().length;
    setShowSampleButton(totalEntries === 0 || totalEntries > 1);
  }, []);

  const checkSampleButton = (entriesMap: Map<string, Entry[]>) => {
    const totalEntries = Array.from(entriesMap.values()).flat().length;
    return totalEntries === 0; // show button only if empty
  };

  useEffect(() => {
    const stored = loadEntries();
    setEntriesByDate(stored);
    setShowSampleButton(checkSampleButton(stored));
  }, []);


  const deleteEntry = (entryId: string) => {
    const updated = new Map(entriesByDate);
    for (const [date, entries] of updated) {
      const index = entries.findIndex(e => e.id === entryId);
      if (index !== -1) {
        entries.splice(index, 1);
        if (entries.length === 0) updated.delete(date);
        break;
      }
    }
    setEntriesByDate(updated);
    saveEntries(Array.from(updated.values()).flat());
    setModalDate(null);
  };

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
      for (let i = 1; i <= INITIAL_BUFFER; i++) newMonths.unshift(subMonths(firstMonth, i));
      setMonths(prev => [...newMonths, ...prev]);

      setTimeout(() => {
        const newHeight = container.scrollHeight;
        container.scrollTop = scrollTop + (newHeight - oldHeight);
      });
    }

    if (scrollBottom > container.scrollHeight - LOAD_MORE_OFFSET) {
      const lastMonth = months[months.length - 1];
      const newMonths: Date[] = [];
      for (let i = 1; i <= INITIAL_BUFFER; i++) newMonths.push(addMonths(lastMonth, i));
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
    }, 0);
  };

  const handleDaySelect = (date: string) => {
    setSelectedDate(selectedDate === date ? null : date);
  };

  const scrollToMonthYear = (year: number, month: number) => {
    const targetDate = new Date(year, month, 1);
    const container = containerRef.current;

    // Find the closest month element
    let closestEl: HTMLDivElement | null = null;
    let minDiff = Infinity;

    monthRefs.current.forEach((el, key) => {
      const date = new Date(key);
      const diff = Math.abs(date.getTime() - targetDate.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closestEl = el;
      }
    });

    if (closestEl && container) {
      container.scrollTo({
        top: closestEl.offsetTop - 170,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <CalendarHeader date={currentMonth} />

      <div ref={containerRef} className="overflow-y-auto h-screen" onScroll={handleScroll}>
        {months.map(month => (
          <div
            key={month.toISOString()}
            data-month={month.toISOString()}
            ref={el => { if (el) monthRefs.current.set(month.toISOString(), el); }}
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
          onDelete={deleteEntry}
        />
      )}

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
        <button className="flex flex-col items-center justify-center text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m0 0h4m-4 0H5m14 0v-8m0 0l2 2m-2-2h-4" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </button>

        <button className="flex flex-col items-center justify-center text-gray-400" onClick={() => setIsSearchOpen(true)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
          </svg>
          <span className="text-xs mt-1">Search</span>
        </button>

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

      {showSampleButton && (
        <button
          className="fixed bottom-36 right-5 bg-gray-600 w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-gray-700 transition-colors"
          title="Load Sample Data"
          onClick={() => {
            const updatedMap = normalizeEntries(sampleData);
            saveEntries(sampleData);
            setEntriesByDate(updatedMap);
            setShowSampleButton(false);
          }}
        >
          <ArchiveBoxIcon className="w-6 h-6 text-white" />
        </button>
      )}

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
          onAddEntry={(updatedEntries) => setEntriesByDate(updatedEntries)}
        />
      )}


      <MonthYearPickerModal
        isOpen={isSearchOpen}
        initialDate={currentMonth}
        onClose={() => setIsSearchOpen(false)}
        onSelect={scrollToMonthYear}
      />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
        </div>
      )}
    </>
  );
}
