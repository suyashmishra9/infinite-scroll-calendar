import type { Entry } from "../types";

const STORAGE_KEY = "journalEntries";

function getUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Parse US date string (MM/DD/YYYY) to local Date
export function parseUsDate(str: string) {
  const [m, d, y] = str.split("/").map(Number);
  return new Date(y, m - 1, d); // local date
}

// Convert Date to YMD string in local time (avoid UTC shift)
export function toYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Normalize entries to Map<YMD, Entry[]>
export function normalizeEntries(entries: Entry[] = []): Map<string, Entry[]> {
  const byDate = new Map<string, Entry[]>();
  for (const entry of entries) {
    const key = toYMD(parseUsDate(entry.date));
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push({ ...entry, id: getUUID() });
  }
  return byDate;
}

export function loadEntries(): Map<string, Entry[]> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return new Map();
  try {
    const entries: Entry[] = JSON.parse(raw);
    return normalizeEntries(entries);
  } catch {
    return new Map();
  }
}

export function saveEntries(entries: Entry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addEntry(entriesByDate: Map<string, Entry[]>, newEntry: Entry) {
  const key = toYMD(parseUsDate(newEntry.date));
  const updated = loadEntries(); // load from localStorage
  if (!updated.has(key)) updated.set(key, []);
  updated.get(key)!.push({ ...newEntry, id: getUUID() });
  saveEntries(Array.from(updated.values()).flat());
  return updated;
}
