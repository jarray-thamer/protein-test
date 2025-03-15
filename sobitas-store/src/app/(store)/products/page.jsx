"use client";
import ProductPageContent from "@/components/productPageContent";
import { Suspense } from "react";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductPageContent />
    </Suspense>
  );
}