export function NumComma(num: number) {
  return num.toLocaleString("en-US");
}

export function shortenString(str: string) {
  if (str.length <= 22) return str;
  return str.slice(0, 20) + "...";
}
