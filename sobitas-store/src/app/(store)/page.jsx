import HeroSectionCarousel from "@/components/homePage/carousel";
import CategorySection from "@/components/homePage/category";

import VenteFlash from "@/components/homePage/venteFlash";

import BlogSection from "@/components/homePage/blogSection";
import MilleurVente from "@/components/homePage/milVente";
import TopPromotion from "@/components/homePage/topPromotion";
import NewProducts from "@/components/homePage/newProducts";

import Materiel from "@/components/homePage/materiel";
import PackPromo from "@/components/homePage/packsPromo";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <HeroSectionCarousel />
      <CategorySection />
      <TopPromotion />
      <NewProducts />
      <MilleurVente />
      <VenteFlash />
      <Materiel />
      <PackPromo />
      <BlogSection />
    </div>
  );
}
