import { useState, useEffect, useRef, useMemo } from "react";
import type { Entry } from "../types";
import { FaTimes, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Props = {
  entriesByDate: Map<string, Entry[]>;
  initialDate: string;
  onClose: () => void;
  onDelete: (entryId: string) => void;
};

export default function JournalModal({ entriesByDate, initialDate, onClose, onDelete }: Props) {
  const allEntries = useMemo(
    () =>
      Array.from(entriesByDate.entries()).flatMap(([date, entries]) =>
        entries.map((entry) => ({ date, entry }))
      ),
    [entriesByDate]
  );

  const initialIndex = allEntries.findIndex((e) => e.date === initialDate) || 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to initial card instantly on first render
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const card = container.children[initialIndex] as HTMLElement;
      card?.scrollIntoView({ behavior: "auto", inline: "center" });
    }
  }, [initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) setCurrentIndex(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < allEntries.length - 1)
        setCurrentIndex(currentIndex + 1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, allEntries.length, onClose]);

  // Scroll to current card whenever index changes
  useEffect(() => {
    const container = containerRef.current;
    const card = container?.children[currentIndex] as HTMLElement;
    card?.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, [currentIndex]);

  if (!allEntries.length) return null;

  const currentEntry = allEntries[currentIndex];

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl bg-black/30 p-2 rounded-full hover:bg-black/50 transition z-20"
        >
          <FaTimes />
        </button>

        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-white text-3xl p-4 bg-black/30 hover:bg-black/50 rounded-r-full z-20 hidden md:block"
          >
            <FaChevronLeft />
          </button>
        )}

        {currentIndex < allEntries.length - 1 && (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-3xl p-4 bg-black/30 hover:bg-black/50 rounded-l-full z-20 hidden md:block"
          >
            <FaChevronRight />
          </button>
        )}

        {/* Horizontal Scroll Container */}
        <div
          ref={containerRef}
          className="flex flex-row items-center gap-6 overflow-x-auto py-8 px-4 w-full h-full snap-x snap-mandatory scrollbar-hide"
        >
          {allEntries.map((item) => (
            <div
              key={item.entry.id}
              className="snap-center flex-shrink-0 w-80 bg-white rounded-xl shadow-lg overflow-hidden relative transition-transform duration-300"
            >
              <img
                src={item.entry.imageUrl || "/fallback.png"}
                className="w-full h-64 object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback.png";
                }}
              />
              <div className="p-4">
                <p className="text-sm text-gray-500">{item.date}</p>
                <p className="font-medium mt-1">{item.entry.description}</p>
                <p className="text-sm text-gray-500 mt-1">Rating: {item.entry.rating}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.entry.categories.map((c) => (
                    <span
                      key={c}
                      className="bg-gray-200 px-2 py-0.5 rounded-full text-xs"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onDelete(currentEntry.entry.id)}
                className="mt-1 flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition mx-auto mb-4"
              >
                <FaTrash /> Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
