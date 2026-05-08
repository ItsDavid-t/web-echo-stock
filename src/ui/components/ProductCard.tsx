import type { Product } from "@/src/domain/entities/product";

const ADMIN_WHATSAPP = "+53 51694749"; 

export function ProductCard({ product }: { product: Product }) {
  const contactMessage = encodeURIComponent(
    `Hola, estoy interesado en el producto ${product.name}. ¿Podrían contactarme por favor?`
  );
  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${contactMessage}`;

  return (
    <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] transition hover:-translate-y-1 hover:shadow-xl">
      <img
        src={product.imgUrl}
        alt={product.name}
        className="mb-5 h-48 w-full rounded-2xl object-cover"
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-[var(--muted)]">
          <span>{product.categoryName ?? product.category ?? "Sin categoría"}</span>
          <span
            className={
              product.status === "available"
                ? "text-emerald-500"
                : "text-rose-500"
            }
          >
            {product.status === "available"
              ? "Disponible"
              : product.status === "reserved"
              ? "Reservado"
              : "Agotado"}
          </span>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">{product.name}</h2>
          <p className="text-sm leading-6 text-[var(--muted)]">
            {product.description ?? "Sin descripción adicional."}
          </p>
        </div>
        <div className="grid gap-3 rounded-3xl bg-[var(--surface-alt)] p-4 text-sm text-[var(--foreground)] shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium">Clasificación</span>
            <span>{product.classification ?? "No aplica"}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium">Precio</span>
            <span>{product.price != null ? `${product.currency ?? "USD"} ${product.price.toFixed(2)}` : "Consultar"}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium">Publicado</span>
            <span>{new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--accent-dark)]"
          >
            Estoy interesado
          </a>
          <span className="text-sm text-[var(--muted)]">
            Contacta al admin para comprar o reservar este producto.
          </span>
        </div>
      </div>
    </article>
  );
}
