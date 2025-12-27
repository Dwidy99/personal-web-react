// src/utils/Date.ts
type DateInput = Date | string | number | null | undefined;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function toDate(input: DateInput): Date | null {
  if (!input) return null;

  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : input;
  }

  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Format: "27 December 2025, 14:05"
 * - kalau tidak ada jam valid → "27 December 2025"
 */
export default function formatDateTime(input: DateInput): string {
  const d = toDate(input);
  if (!d) return "-";

  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();

  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");

  // kalau jam-menit 00:00 dan kamu gak mau tampilkan jam, boleh hapus kondisi ini
  return `${day} ${month} ${year}, ${hh}:${mm}`;
}
