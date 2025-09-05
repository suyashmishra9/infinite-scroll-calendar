import { useState } from "react";

import InfiniteCalendar from "./components/InfiniteCalendar";


export default function App() {
  const [current] = useState<Date>(new Date());

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <InfiniteCalendar />
    </div>
  );
}
