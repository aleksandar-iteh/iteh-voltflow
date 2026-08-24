const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
});

export function formatPrice(value: string | number): string {
  return priceFormatter.format(Number(value));
}
