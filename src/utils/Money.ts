export default function formatMoney(amount: number): string {
  if (isNaN(amount)) return "Rp.0,00";

  const formatted = amount
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `Rp.${formatted}`;
}
