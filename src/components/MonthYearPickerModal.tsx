import { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  initialDate?: Date;
  onClose: () => void;
  onSelect: (year: number, month: number) => void;
};

export default function MonthYearPickerModal({ isOpen, initialDate, onClose, onSelect }: Props) {
  const today = initialDate || new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  useEffect(() => {
    if (initialDate) {
      setYear(initialDate.getFullYear());
      setMonth(initialDate.getMonth());
    }
  }, [initialDate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4">Select Month & Year</h2>

        <div className="flex justify-between mb-4">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border p-2 rounded w-1/2"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border p-2 rounded w-1/2 ml-2"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => {
              onSelect(year, month);
              onClose();
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
