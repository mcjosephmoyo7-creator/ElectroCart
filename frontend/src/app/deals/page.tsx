import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { FaFire, FaTags } from 'react-icons/fa';
import { getElectronicsProducts } from '@/lib/productApi';

export const metadata = {
  title: 'Hot Deals',
  description: 'Shop the hottest discounts and clearances at ElectroCart.',
};

export default async function DealsPage() {
  const { products } = await getElectronicsProducts({ sort: 'popular' });
  const deals = products.filter((p) => p.onSale);

  const percentOf = (price: number, discount?: number) =>
  discount && discount < price ? Math.round(((price - discount) / price) * 100) : 0;

  const topDeal = [...deals].sort(
  (a, b) => percentOf(b.price, b.discountPrice) - percentOf(a.price, a.discountPrice)
  )[0];

  return (
  <div>
  <div className="bg-navy  text-white">
  <div className="container-custom py-12 lg:py-16">
  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">Home / Deals</p>
  <h1 className="text-3xl lg:text-5xl font-bold flex items-center gap-3"><FaFire className="w-9 h-9 text-accent" /> Hot Deals</h1>
  <p className="text-white/70 mt-3 max-w-2xl">
  Limited-time discounts on our most loved products. Grab them before they&apos;re gone.
  </p>
  </div>
  </div>

  <div className="container-custom py-8 lg:py-12">
  {topDeal && (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-300 via-primary-800 to-primary mb-10 text-white">
  <div className="absolute -top-10 right-10 w-60 h-60 rounded-full bg-accent/30 blur-3xl" />
  <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 px-6 sm:px-10 py-8">
  <div className="flex-1">
  <span className="inline-flex items-center gap-1.5 bg-accent text-white text-xs font-bold uppercase tracking-widest rounded-full px-4 py-1.5">
  <FaFire className="w-3.5 h-3.5" /> Deal of the Day
  </span>
  <h2 className="mt-3 text-2xl lg:text-3xl font-bold leading-tight">{topDeal.name}</h2>
  <p className="mt-2 text-white/80 text-sm max-w-md line-clamp-2">{topDeal.description}</p>
  <div className="mt-4 flex items-center gap-3">
  <span className="text-3xl font-bold text-accent">${(topDeal.discountPrice ?? topDeal.price).toFixed(2)}</span>
  <span className="text-white/60 line-through">${topDeal.price.toFixed(2)}</span>
  <span className="px-2 py-1 bg-white/15 text-white text-xs font-bold rounded">
  -{percentOf(topDeal.price, topDeal.discountPrice)}%
  </span>
  </div>
  </div>
  <Link href={`/products/${topDeal.slug}`} className="btn-accent flex-shrink-0">
  Grab This Deal <HiOutlineArrowRight className="w-5 h-5" />
  </Link>
  </div>
  </div>
  )}

  <h2 className="text-2xl font-bold text-slateText  mb-6">
  {deals.length} Products On Sale
  </h2>
  {deals.length > 0 ? (
  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
  {deals.map((product) => (
  <ProductCard key={product._id} product={product} />
  ))}
  </div>
  ) : (
  <div className="text-center py-20 bg-white  border border-lineBorder  rounded-2xl">
  <p className="mb-4"><FaTags className="w-16 h-16 inline-block text-muted/50" /></p>
  <h3 className="text-xl font-bold text-slateText  mb-2">No deals right now</h3>
  <p className="text-muted text-sm mb-6">Check back soon for new promotions.</p>
  <Link href="/shop" className="btn-primary inline-flex">
  Browse Shop
  </Link>
  </div>
  )}
  </div>
  </div>
  );
}