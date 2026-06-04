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
  if (!input) {
    return null;
  }

  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : input;
  }

  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function formatDateTime(input: DateInput): string {
  const date = toDate(input);

  if (!date) {
    return "-";
  }

  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}
