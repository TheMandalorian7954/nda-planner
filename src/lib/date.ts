// Local-time date helpers that never depend on the timezone offset applied
// by Date's ISO parsing. All dates are "YYYY-MM-DD" strings.

export function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayStr(): string {
  return toDateStr(new Date());
}

export function parseDateStr(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: string, n: number): string {
  const d = parseDateStr(date);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

export function daysBetween(from: string, to: string): number {
  const a = parseDateStr(from).getTime();
  const b = parseDateStr(to).getTime();
  return Math.round((b - a) / 86400000);
}

/** Monday of the week containing `date`. */
export function startOfWeek(date: string): string {
  const d = parseDateStr(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(date, diff);
}

export function fmtShort(date: string): string {
  const d = parseDateStr(date);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function fmtLong(date: string): string {
  const d = parseDateStr(date);
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function fmtDayName(date: string): string {
  return parseDateStr(date).toLocaleDateString("en-IN", { weekday: "long" });
}

export function fmtMonthYear(date: string): string {
  return parseDateStr(date).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

/** Deterministic pseudo-random 0..1 from a string seed (stable per day). */
export function seededRandom(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

/** ISO weekday index of a date string (0=Mon ... 6=Sun). */
export function weekdayIndex(date: string): number {
  const day = parseDateStr(date).getDay();
  return day === 0 ? 6 : day - 1;
}

export function lastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(addDays(todayStr(), -i));
  }
  return out;
}
