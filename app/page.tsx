import { ProductCatalogPage } from "@/src/ui/pages/ProductCatalogPage";
import { ProductCatalogController } from "@/src/interfaces/controllers/productCatalogController";
import { CategoryController } from "@/src/interfaces/controllers/categoryController";
import { LoadProductCatalogUseCase } from "@/src/usecases/loadProductCatalogUseCase";
import { SupabaseProductRepository } from "@/src/infra/repositories/supabaseProductRepository";
import { SupabaseCategoryRepository } from "@/src/infra/repositories/supabaseCategoryRepository";

export default async function Home() {
  const productRepository = new SupabaseProductRepository();
  const categoryRepository = new SupabaseCategoryRepository();

  const productUseCase = new LoadProductCatalogUseCase(productRepository);
  const productController = new ProductCatalogController(productUseCase);
  const categoryController = new CategoryController(categoryRepository);

  const [products, categories] = await Promise.all([
    productController.getCatalog(),
    categoryController.getAllCategories(),
  ]);

  return <ProductCatalogPage products={products} categories={categories} />;
}
