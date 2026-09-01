'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { HiOutlineArrowRight, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineSparkles } from 'react-icons/hi';

interface Slide {
  id: number;
  eyebrow: string;
  headline: string;
  highlight: string;
  subtext: string;
  cta: string;
  href: string;
  gradient: string;
  icon: React.ReactNode;
  imageSeed: string;
  productLabel: string;
}

const slides: Slide[] = [
  {
    id: 1,
    eyebrow: 'New Season · New Tech',
    headline: 'Next-Gen Gadgets &',
    highlight: 'Appliances',
    subtext: 'Upgrade your home with the latest tech at unbeatable prices.',
    cta: 'Shop Now',
    href: '/shop',
    gradient: 'from-navy-300 via-primary-800 to-primary',
    icon: <HiOutlineSparkles className="w-7 h-7" />,
    imageSeed: 'shopcart-hero-tv',
    productLabel: 'Smart TV',
  },
  {
    id: 2,
    eyebrow: 'Limited Time Offer',
    headline: 'Free Shipping On All',
    highlight: 'Orders Over $100',
    subtext: 'Enjoy free doorstep delivery on every order above $100 across the USA.',
    cta: 'Start Shopping',
    href: '/shop',
    gradient: 'from-navy-300 via-navy to-accent-dark',
    icon: <HiOutlineTruck className="w-7 h-7" />,
    imageSeed: 'shopcart-hero-shipping',
    productLabel: 'Free Delivery',
  },
  {
    id: 3,
    eyebrow: 'Buy With Confidence',
    headline: '100% Money Back',
    highlight: 'Guarantee',
    subtext: 'Not satisfied? Return any product within 30 days for a full refund.',
    cta: 'Learn More',
    href: '/shop',
    gradient: 'from-navy-300 via-primary-900 to-primary-dark',
    icon: <HiOutlineShieldCheck className="w-7 h-7" />,
    imageSeed: 'shopcart-hero-guarantee',
    productLabel: '30-Day Guarantee',
  },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive((i) => (i + 1) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative overflow-hidden">
      <div className="container-custom py-6 lg:py-10">
        <div
          className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-gradient-to-br shadow-card"
          style={{ minHeight: '420px' }}
        >
          {/* Slides */}
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${active === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}>
                {/* Decorative circles */}
                <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
              </div>

              {/* Floating product image */}
              <div className="absolute right-0 top-0 bottom-0 hidden lg:flex items-center justify-center pr-24">
                <div className="relative w-80 h-80">
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-md" />
                  <img
                    src={`https://picsum.photos/seed/${slide.imageSeed}/480/480`}
                    alt={slide.productLabel}
                    className="relative w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white/20 rotate-3 hover:rotate-0 transition-transform duration-500"
                  />
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-navy text-xs font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                    <span className="text-accent">{slide.icon}</span> {slide.productLabel}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-20 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-16 lg:max-w-[58%] min-h-[420px]">
                <span className="inline-flex items-center gap-2 text-white bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest w-fit">
                  {slide.eyebrow}
                </span>
                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
                  {slide.headline}{' '}
                  <span className="text-white">{slide.highlight}</span>
                </h1>
                <p className="mt-4 text-base lg:text-lg text-white/80 max-w-md leading-relaxed">{slide.subtext}</p>
                <div className="mt-8">
                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-7 py-3.5 rounded-lg font-semibold shadow-lg shadow-black/10 transition-all hover:scale-105"
                  >
                    {slide.cta} <HiOutlineArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Indicators */}
          <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-2.5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  active === i ? 'w-8 bg-accent' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}