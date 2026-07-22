import {
  getPublicPriceParts,
  type PublicPriceParts,
} from "@/src/domain/services/formatPublicPrice";

type PublicPriceSize = "sm" | "md" | "lg";

const amountSizeClass: Record<PublicPriceSize, string> = {
  sm: "text-sm font-semibold",
  md: "text-lg font-semibold",
  lg: "text-2xl font-bold",
};

const currencySizeClass: Record<PublicPriceSize, string> = {
  sm: "text-[10px] font-semibold tracking-wide",
  md: "text-xs font-semibold tracking-wide",
  lg: "text-sm font-semibold tracking-wide",
};

export function PublicPrice({
  price,
  currency,
  size = "md",
  className = "",
}: {
  price?: number | null;
  currency?: string | null;
  size?: PublicPriceSize;
  className?: string;
}) {
  const parts: PublicPriceParts = getPublicPriceParts(price, currency);

  if (!parts.hasPrice) {
    return (
      <span className={`text-[var(--muted)] ${className}`.trim()}>
        Consultar precio
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-baseline gap-1.5 ${className}`.trim()}
    >
      <span className={`text-[var(--foreground)] ${amountSizeClass[size]}`}>
        {parts.amount}
      </span>
      <span
        className={`uppercase text-[var(--accent)] ${currencySizeClass[size]}`}
      >
        {parts.currency}
      </span>
    </span>
  );
}
