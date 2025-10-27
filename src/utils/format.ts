export function formatCents(amountCents: number, currency: string = "USD", locale: string = "en-US"): string {
  const dollars = (amountCents || 0) / 100;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(dollars);
}

