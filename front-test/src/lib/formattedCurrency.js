export function formatCurrency(amount, locale = "fr-TN", currency = "TND") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}
