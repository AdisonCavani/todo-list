import type { Languages } from "dictionaries";

function addDays(date: Date, days: number): Date {
  if (!days) return date;

  date.setDate(date.getDate() + days);

  return date;
}

function getShortDayName(date: Date, lang: Languages): string {
  return Intl.DateTimeFormat(lang, {
    weekday: "short",
  }).format(date);
}

export { addDays, getShortDayName };
