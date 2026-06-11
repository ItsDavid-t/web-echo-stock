import type { Product } from "@/src/domain/entities/product";
import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import type { WhatsAppContact } from "@/src/domain/types/catalog";

const FALLBACK_WHATSAPP = "5351694749";

export class WhatsAppContactService {
  static build(product: Product, shop?: ShopProfile | null): WhatsAppContact {
    const phoneNumber = (shop?.whatsappNumber || FALLBACK_WHATSAPP).replace(
      /\D/g,
      ""
    );
    const message = `Hola, estoy interesado en el producto ${product.name}. ¿Podrían contactarme por favor?`;

    return {
      phoneNumber,
      message,
      url: `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
    };
  }
}
