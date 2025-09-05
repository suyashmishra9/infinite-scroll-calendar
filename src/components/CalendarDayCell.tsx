import { memo, useState } from "react";
import type { Entry } from "../types/index";

type Props = {
  date: string;
  entries: Entry[];
  onOpen: (date: string, entryIndex?: number) => void;
};

const OptimizedImage = memo(({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={hasError ? "/fallback.png" : (src || "/fallback.png")}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy" 
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

const CalendarDayCell = memo(({ date, entries, onOpen }: Props) => {
  const maxThumbs = 3;
  const extraCount = entries.length - maxThumbs;

  return (
    <div className="relative w-full h-full" onClick={() => onOpen(date)}>
      {entries.slice(0, maxThumbs).map((entry) => (
        <OptimizedImage
          key={entry.id}
          src={entry.imageUrl || "/fallback.png"}
          alt={`Entry ${entry.id}`}
          className="w-6 h-6 rounded-sm object-cover inline-block mr-0.5 calendar-image"
        />
      ))}
      {extraCount > 0 && (
        <div className="absolute top-1 right-1 text-xs bg-gray-200 rounded-full px-1">
          +{extraCount}
        </div>
      )}
    </div>
  );
});

CalendarDayCell.displayName = 'CalendarDayCell';

export default CalendarDayCell;
