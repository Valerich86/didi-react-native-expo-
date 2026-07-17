import { Note } from "./types";

const pad = (n: number) => String(n).padStart(2, "0");

export function getFormattedDate(date: Date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getFormattedTime(date: Date = new Date()) {
  const timeNow = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return timeNow;
}

interface DateHeaderItem {
  type: "date";
  date: string;
}

interface NoteItem {
  type: "note";
  note: Note;
}

export function groupNotesByDate(notes: Note[]) {
  if (!notes || notes.length === 0) return [];

  // Сортируем по дате (новые сверху)
  const sorted = [...notes].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
  const grouped: (DateHeaderItem | NoteItem)[] = [];
  let currentDate: string | null = null;
  for (const note of sorted) {
    const noteDate = note.date.split("T")[0];
    if (noteDate !== currentDate) {
      currentDate = noteDate;
      grouped.push({ type: "date", date: currentDate });
    }
    grouped.push({ type: "note", note });
  }
  return grouped;
}
