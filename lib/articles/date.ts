const MONTHS: Record<string, number> = {
  jan: 0,
  ene: 0,
  enero: 0,
  feb: 1,
  febrero: 1,
  mar: 2,
  marzo: 2,
  apr: 3,
  abr: 3,
  abril: 3,
  may: 4,
  mayo: 4,
  jun: 5,
  junio: 5,
  jul: 6,
  julio: 6,
  aug: 7,
  ago: 7,
  agosto: 7,
  sep: 8,
  sept: 8,
  septiembre: 8,
  oct: 9,
  octubre: 9,
  nov: 10,
  noviembre: 10,
  dec: 11,
  dic: 11,
  diciembre: 11,
};

export function parseDisplayDate(date: string): number {
  const trimmed = date.trim();
  const fullDate = trimmed.match(/^(\d{1,2})\s+([A-Za-zÁÉÍÓÚáéíóúñÑ]+)\s+(\d{4})$/);
  const monthYear = trimmed.match(/^([A-Za-zÁÉÍÓÚáéíóúñÑ]+)\s+(\d{4})$/);
  if (!fullDate && !monthYear) return Number.NaN;
  const day = fullDate ? Number(fullDate[1]) : 1;
  const monthKey = (fullDate ? fullDate[2] : monthYear?.[1])!.toLowerCase();
  const year = Number((fullDate ? fullDate[3] : monthYear?.[2])!);
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
