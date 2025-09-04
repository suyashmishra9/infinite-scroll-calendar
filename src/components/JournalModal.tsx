import { useState, useEffect } from "react";
import type { Entry } from "../types";
import { useSwipeable } from "react-swipeable";

type Props = {
  entriesByDate: Map<string, Entry[]>;
  initialDate: string;
  onClose: () => void;
};

export default function JournalModal({ entriesByDate, initialDate, onClose }: Props) {
  // Flatten all entries into a single array with date info
  const allEntries = Array.from(entriesByDate.entries())
    .flatMap(([date, entries]) => entries.map(entry => ({ date, entry })));

  const initialIndex = allEntries.findIndex(e => e.date === initialDate) || 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const currentItem = allEntries[currentIndex];
  if (!currentItem) return null;

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex(i => Math.min(i + 1, allEntries.length - 1)),
    onSwipedRight: () => setCurrentIndex(i => Math.max(i - 1, 0)),
    trackMouse: true,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCurrentIndex(i => Math.max(i - 1, 0));
      if (e.key === "ArrowRight") setCurrentIndex(i => Math.min(i + 1, allEntries.length - 1));
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [allEntries]);

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
          src={currentItem.entry.imgUrl || "/fallback.png"}
          className="w-full h-64 object-cover rounded"
          loading="lazy"
        />
        <div className="mt-2">
          <p className="text-sm text-gray-500">{currentItem.date}</p>
          <p className="font-medium">{currentItem.entry.description}</p>
          <p className="text-sm text-gray-500">Rating: {currentItem.entry.rating}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {currentItem.entry.categories.map((c) => (
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
