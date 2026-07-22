"use client";

import { useEffect } from "react";
import type { Product } from "@/src/domain/entities/product";
import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import { formatPublicPrice } from "@/src/domain/services/formatPublicPrice";
import { WhatsAppContactService } from "@/src/domain/services/whatsappContactService";

export function ProductDetailSheet({
  product,
  shop,
  onClose,
}: {
  product: Product | null;
  shop?: ShopProfile | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!product) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [product, onClose]);

  if (!product) {
    return null;
  }

  const contact = WhatsAppContactService.build(product, shop);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Cerrar detalle"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="animate-sheet-up relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-2xl sm:max-w-lg sm:rounded-[2rem]">
        <div className="sticky top-0 z-10 flex justify-center bg-[var(--surface)] py-3 sm:hidden">
          <span className="h-1.5 w-12 rounded-full bg-[var(--border)]" />
        </div>
        <div className="space-y-5 p-5 pb-8 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                {product.categoryName ?? "Sin categoría"}
              </p>
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                {product.name}
              </h2>
              {product.shopName ? (
                <p className="text-sm text-[var(--accent)]">{product.shopName}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--muted)]"
            >
              Cerrar
            </button>
          </div>

          <img
            src={product.imgUrl}
            alt={product.name}
            className="h-56 w-full rounded-2xl object-cover sm:h-64"
          />

          <p className="text-sm leading-7 text-[var(--muted)]">
            {product.description ?? "Sin descripción adicional."}
          </p>

          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[var(--surface-alt)] p-4 text-sm">
            <div>
              <p className="font-medium">Clasificación</p>
              <p className="text-[var(--muted)]">
                {product.classification ?? "No aplica"}
              </p>
            </div>
            <div>
              <p className="font-medium">Precio</p>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {formatPublicPrice(product.price, product.currency)}
              </p>
            </div>
            <div className="col-span-2">
              <p className="font-medium">Publicado</p>
              <p className="text-[var(--muted)]">
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <a
            href={contact.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
