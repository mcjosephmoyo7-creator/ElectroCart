import HeroCarousel from '@/components/home/HeroCarousel';
import PerksBar from '@/components/home/PerksBar';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import BrandsSection from '@/components/home/BrandsSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoBanner from '@/components/home/PromoBanner';

export default function HomePage() {
  return (
    <div>
      <HeroCarousel />
      <PerksBar />
      <FeaturedProducts />
      <PromoBanner />
      <CategoriesGrid />
      <BrandsSection />
    </div>
  );
}