export function formatPublicPrice(price?: number | null): string {
  if (price == null || !Number.isFinite(price) || price <= 0) {
    return "Consultar precio";
  }

  return `$${price.toFixed(2)}`;
}

export function hasPublicPrice(price?: number | null): boolean {
  return price != null && Number.isFinite(price) && price > 0;
}
