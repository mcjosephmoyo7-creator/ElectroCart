import Link from 'next/link';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { brands } from '@/data/brands';
import BrandLogo from '@/components/ui/BrandLogo';

export default function BrandsSection() {
  return (
  <section className="container-custom py-12 lg:py-16">
  <div className="flex items-end justify-between mb-8">
  <div>
  <h2 className="section-title">Shop By Brands</h2>
  <p className="text-muted mt-1.5 text-sm">Discover products from the world&apos;s leading brands.</p>
  </div>
  <Link href="/shop" className="hidden sm:flex items-center gap-1.5 text-primary hover:text-primary-dark font-semibold text-sm transition-colors">
  View All <HiOutlineArrowRight className="w-4 h-4" />
  </Link>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
  {brands.map((brand) => (
  <Link
  key={brand._id}
  href={`/shop?brand=${encodeURIComponent(brand.name)}`}
  className="group flex items-center gap-4 bg-white  border border-lineBorder  rounded-2xl p-4 hover:border-accent hover:shadow-card-hover transition-all duration-300"
  >
  <span className="w-12 h-12 rounded-xl bg-body  flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
  <BrandLogo brand={brand} size={34} />
  </span>
  <span className="font-semibold text-slateText  text-sm truncate">{brand.name}</span>
  </Link>
  ))}
  </div>

  <Link href="/shop" className="sm:hidden flex items-center justify-center gap-1.5 text-primary font-semibold text-sm mt-6">
  View All <HiOutlineArrowRight className="w-4 h-4" />
  </Link>
  </section>
  );
}