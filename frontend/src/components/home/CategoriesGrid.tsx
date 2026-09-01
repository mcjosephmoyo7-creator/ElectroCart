import Link from 'next/link';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { categories } from '@/data/categories';

export default function CategoriesGrid() {
  return (
    <section className="bg-white dark:bg-navy-100 py-12 lg:py-16">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">Shop by Popular Categories</h2>
            <p className="text-muted mt-1.5 text-sm">Explore products across our most loved collections.</p>
          </div>
          <Link href="/shop" className="hidden sm:flex items-center gap-1.5 text-primary hover:text-primary-dark font-semibold text-sm transition-colors">
            View All <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat.slug}`}
              className="group rounded-2xl border border-lineBorder dark:border-navy-50 bg-white dark:bg-navy-200 p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-primary"
              style={{ backgroundColor: cat.pastel }}
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/80 dark:bg-navy-100 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <cat.icon className="w-8 h-8 text-navy dark:text-primary-light" />
              </div>
              <h3 className="font-semibold text-slateText text-sm leading-snug">{cat.name}</h3>
              <p className="text-muted text-xs mt-1">({cat.count}) items Available</p>
            </Link>
          ))}
        </div>

        <Link href="/shop" className="sm:hidden flex items-center justify-center gap-1.5 text-primary font-semibold text-sm mt-6">
          View All <HiOutlineArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}