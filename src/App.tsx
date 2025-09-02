import { useState } from "react";

import InfiniteCalendar from "./components/InfiniteCalendar";


export default function App() {
  // Start with current month; for testing, you can set: new Date(2025, 8, 1)
  const [current] = useState<Date>(new Date());

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <InfiniteCalendar />
    </div>
  );
}
