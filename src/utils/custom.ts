export function NumComma(num: number) {
  return num.toLocaleString("en-US");
}

export function shortenString(str: string) {
  if (str.length <= 22) return str;
  return str.slice(0, 20) + "...";
}

export function formatCurrency(amount: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${NumComma(Math.round(amount))}`;
  }
}
