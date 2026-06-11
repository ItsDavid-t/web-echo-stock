import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import type { CatalogPageContent } from "@/src/domain/types/catalog";
import { ThemeToggle } from "@/src/ui/components/ThemeToggle";
import Image from "next/image";

export function CatalogHeader({
  activeShop,
  pageContent,
}: {
  activeShop: ShopProfile | null;
  pageContent: CatalogPageContent;
}) {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          {activeShop?.logoUrl ? (
            <img
              src={activeShop.logoUrl}
              alt={activeShop.shopName}
              className="h-12 w-12 rounded-xl object-cover"
            />
          ) : (
            <Image
              src="/app_icon.png"
              alt="Echo Stock"
              width={48}
              height={48}
              className="rounded-xl"
            />
          )}
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)]">
              {pageContent.badgeLabel}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
              {pageContent.title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
              {pageContent.description}
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
