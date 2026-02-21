const MONTHS: Record<string, number> = {
  jan: 0,
  ene: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  abr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  ago: 7,
  sep: 8,
  sept: 8,
  oct: 9,
  nov: 10,
  dec: 11,
  dic: 11,
};

export function parseDisplayDate(date: string): number {
  // Expected: "08 Feb 2026"
  const m = date.trim().match(/^(\d{1,2})\s+([A-Za-zÁÉÍÓÚáéíóú]{3,4})\s+(\d{4})$/);
  if (!m) return Number.NaN;
  const day = Number(m[1]);
  const monthKey = m[2]!.toLowerCase();
  const year = Number(m[3]);
  const month = MONTHS[monthKey];
  if (!Number.isFinite(day) || !Number.isFinite(year) || month == null) return Number.NaN;
  return new Date(Date.UTC(year, month, day, 12, 0, 0)).getTime();
}

export function formatDisplayDate(d: Date): string {
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getUTCMonth()]!;
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

