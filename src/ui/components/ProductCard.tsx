import type { Product } from "@/src/domain/entities/product";

const ADMIN_WHATSAPP = "+5351694749"; 

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
        className="mb-5 h-56 w-full rounded-2xl object-cover sm:h-64"
      />
      <div className="space-y-5">
        <div className="flex flex-col gap-3 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-[var(--foreground)]">{product.categoryName ?? product.category ?? "Sin categoría"}</span>
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
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">{product.name}</h2>
          <p className="text-sm leading-6 text-[var(--muted)]">
            {product.description ?? "Sin descripción adicional."}
          </p>
        </div>
        <div className="grid gap-3 rounded-3xl bg-[var(--surface-alt)] p-4 text-sm text-[var(--foreground)] shadow-sm sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="font-medium">Clasificación</span>
            <span className="text-[var(--muted)]">{product.classification ?? "No aplica"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium">Precio</span>
            <span className="text-[var(--muted)]">{product.price != null ? `${product.currency ?? "USD"} ${product.price.toFixed(2)}` : "Consultar"}</span>
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <span className="font-medium">Publicado</span>
            <span className="text-[var(--muted)]">{new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--accent-dark)] sm:w-auto"
          >
            Estoy interesado
          </a>
          <span className="text-sm leading-6 text-[var(--muted)]">
            Contacta al admin para comprar o reservar este producto.
          </span>
        </div>
      </div>
    </article>
  );
}
