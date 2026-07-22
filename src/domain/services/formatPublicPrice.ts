export type PublicPriceParts =
  | { hasPrice: false }
  | { hasPrice: true; amount: string; currency: string };

export function getPublicPriceParts(
  price?: number | null,
  currency?: string | null
): PublicPriceParts {
  if (price == null || !Number.isFinite(price) || price <= 0) {
    return { hasPrice: false };
  }

  const amount = price.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const code = (currency ?? "USD").trim().toUpperCase() || "USD";

  return { hasPrice: true, amount, currency: code };
}

export function formatPublicPrice(
  price?: number | null,
  currency?: string | null
): string {
  const parts = getPublicPriceParts(price, currency);
  if (!parts.hasPrice) {
    return "Consultar precio";
  }

  return `${parts.amount} ${parts.currency}`;
}

export function hasPublicPrice(price?: number | null): boolean {
  return price != null && Number.isFinite(price) && price > 0;
}
