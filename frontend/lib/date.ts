"use client";

function addDays(date: Date, days: number): Date {
  if (!days) return date;

  date.setDate(date.getDate() + days);

  return date;
}

function getShortDayName(date: Date): string {
  return Intl.DateTimeFormat(navigator.language, {
    weekday: "short",
  }).format(date);
}

export { addDays, getShortDayName };
