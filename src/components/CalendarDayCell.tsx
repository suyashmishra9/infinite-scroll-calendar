import type { Entry } from "../types/index";

type Props = {
  date: string;
  entries: Entry[];
  onOpen: (date: string, entryIndex?: number) => void;
};

export default function CalendarDayCell({ date, entries, onOpen }: Props) {
  const maxThumbs = 3;
  const extraCount = entries.length - maxThumbs;

  return (
    <div className="relative w-full h-full" onClick={() => onOpen(date)}>
      {entries.slice(0, maxThumbs).map((entry) => (
        <img
          key={entry.id}
          src={entry.imgUrl || "/fallback.png"}
          className="w-6 h-6 rounded-sm object-cover inline-block mr-0.5"
        />
      ))}
      {extraCount > 0 && (
        <div className="absolute top-1 right-1 text-xs bg-gray-200 rounded-full px-1">
          +{extraCount}
        </div>
      )}
    </div>
  );
}
