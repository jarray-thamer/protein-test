import ProductDetail from "@/components/shared/ProductDetail";
import { getProductBySlug, getRelatedProducts } from "@/services/products";

export default async function ProductPage({ params }) {
  const { slug } = params; // Remove await here
  const product = await getProductBySlug(slug);

  const relatedProducts = await getRelatedProducts(
    product?.data?.category
      ? "?category=" + product?.data?.category?.designation
      : ""
  );

  return (
    <ProductDetail
      type="products"
      item={product.data}
      relatedItems={relatedProducts.data.products}
    />
  );
}
