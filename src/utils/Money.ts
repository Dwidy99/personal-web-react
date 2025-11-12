//money thousands
export default function MoneyFormat(number) {
  let val = (number / 1).toFixed(2).replace(".", ",");
  return "Rp." + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
