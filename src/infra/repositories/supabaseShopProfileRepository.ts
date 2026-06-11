import type { ShopProfile } from "@/src/domain/entities/shopProfile";
import type { ShopProfileRepository } from "@/src/domain/repositories/shopProfileRepository";
import { supabaseFetch } from "@/src/infra/supabase/supabaseClient";

function mapSupabaseShopProfile(record: Record<string, unknown>): ShopProfile {
  return {
    id: String(record["id"] ?? ""),
    shopName: String(record["shop_name"] ?? "Tienda"),
    whatsappNumber: String(record["whatsapp_number"] ?? ""),
    telegramUsername:
      record["telegram_username"] == null
        ? null
        : String(record["telegram_username"]),
    description:
      record["description"] == null ? null : String(record["description"]),
    logoUrl: record["logo_url"] == null ? null : String(record["logo_url"]),
    createdAt: String(record["created_at"] ?? new Date().toISOString()),
  };
}

export class SupabaseShopProfileRepository implements ShopProfileRepository {
  async fetchAll(): Promise<ShopProfile[]> {
    try {
      const response = await supabaseFetch<Record<string, unknown>[]>(
        "shop_profile?select=id,shop_name,whatsapp_number,telegram_username,description,logo_url,created_at&order=shop_name"
      );

      return response.map(mapSupabaseShopProfile);
    } catch {
      return [];
    }
  }

  async fetchById(id: string): Promise<ShopProfile | null> {
    try {
      const response = await supabaseFetch<Record<string, unknown>[]>(
        `shop_profile?select=id,shop_name,whatsapp_number,telegram_username,description,logo_url,created_at&eq(id,${encodeURIComponent(
          id
        )})&limit=1`
      );

      if (!response.length) {
        return null;
      }

      return mapSupabaseShopProfile(response[0]);
    } catch {
      return null;
    }
  }
}
