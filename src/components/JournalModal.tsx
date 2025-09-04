import { useState, useEffect } from "react";
import type { Entry } from "../types";
import { useSwipeable } from "react-swipeable";

type Props = {
  entriesByDate: Map<string, Entry[]>;
  initialDate: string;
  onClose: () => void;
};

export default function JournalModal({ entriesByDate, initialDate, onClose }: Props) {
  const sortedDates = Array.from(entriesByDate.keys()).sort();
  const [currentDateIndex, setCurrentDateIndex] = useState(
    sortedDates.indexOf(initialDate)
  );

  const currentDate = sortedDates[currentDateIndex];
  const currentEntries = entriesByDate.get(currentDate) || [];
  const currentEntry = currentEntries[0]; 

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentDateIndex(i => Math.max(i - 1, 0)),
    onSwipedRight: () =>
      setCurrentDateIndex(i => Math.min(i + 1, sortedDates.length - 1)),
    trackMouse: true,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCurrentDateIndex(i => Math.max(i - 1, 0));
      if (e.key === "ArrowRight")
        setCurrentDateIndex(i => Math.min(i + 1, sortedDates.length - 1));
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sortedDates]);

  if (!currentEntry) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      {...handlers}
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-lg max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentEntry.imgUrl || "/fallback.png"}
          className="w-full h-64 object-cover rounded"
          loading="lazy"
        />
        <div className="mt-2">
          <p className="font-medium">{currentEntry.description}</p>
          <p className="text-sm text-gray-500">Rating: {currentEntry.rating}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {currentEntry.categories.map((c) => (
              <span key={c} className="bg-gray-200 px-2 py-0.5 rounded-full text-xs">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
