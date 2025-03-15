import ProductDetail from "@/components/shared/ProductDetail";
import { getPackBySlug, getPackListPage } from "@/services/packs";

export default async function PackPage({ params }) {
  const { slug } = params; // Remove await here
  const product = await getPackBySlug(slug);

  const relatedPacks = await getPackListPage();

  return (
    <ProductDetail
      type="packs"
      item={product.data}
      relatedItems={relatedPacks.data.packs}
    />
  );
}
