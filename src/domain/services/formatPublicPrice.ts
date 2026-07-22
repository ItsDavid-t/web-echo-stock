export function formatPublicPrice(
  price?: number | null,
  currency?: string | null
): string {
  if (price == null || !Number.isFinite(price) || price <= 0) {
    return "Consultar precio";
  }

  const code = (currency ?? "USD").trim().toUpperCase() || "USD";
  return `${code} ${price.toFixed(2)}`;
}

export function hasPublicPrice(price?: number | null): boolean {
  return price != null && Number.isFinite(price) && price > 0;
}
