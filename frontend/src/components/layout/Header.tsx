'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HiOutlineShoppingCart,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineSearch,
  HiMenu,
  HiX,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineChevronDown,
  HiOutlineTruck,
} from 'react-icons/hi';
import { cartStore, FREE_SHIPPING } from '@/store/cartStore';
import { wishlistStore } from '@/store/wishlistStore';
import { authStore } from '@/store/authStore';
import { authUiStore } from '@/store/authUiStore';
import { categories } from '@/data/categories';
import { brands } from '@/data/brands';
import BrandLogo from '@/components/ui/BrandLogo';
import { formatPrice } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Brands', href: '/shop' },
  { label: 'Deals', href: '/deals' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const items = cartStore((s) => s.items);
  const updateQuantity = cartStore((s) => s.updateQuantity);
  const removeItem = cartStore((s) => s.removeItem);
  const getSubtotal = cartStore((s) => s.getSubtotal);
  const wishlistItems = wishlistStore((s) => s.items);
  const toggleWishlist = wishlistStore((s) => s.toggleItem);
  const authStatus = authStore((s) => s.status);
  const user = authStore((s) => s.user);
  const logout = authStore((s) => s.logout);
  const openModal = authUiStore((s) => s.openModal);

  const [searchQuery, setSearchQuery] = useState('');
  const [openPanel, setOpenPanel] = useState<'search' | 'cart' | 'wishlist' | 'user' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cartBounceKey, setCartBounceKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  setMounted(true);
  }, []);

  useEffect(() => {
  const onScroll = () => {
  const currentY = window.scrollY;
  setScrolled(currentY > 4);
  if (currentY > lastScrollY && currentY > 100) {
  setIsVisible(false);
  } else {
  setIsVisible(true);
  }
  setLastScrollY(currentY);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  useEffect(() => {
  setOpenPanel(null);
  }, [pathname]);

  useEffect(() => {
  const onClickOutside = (e: MouseEvent) => {
  if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
  setOpenPanel(null);
  }
  };
  document.addEventListener('mousedown', onClickOutside);
  return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  const q = searchQuery.trim();
  router.push(q ? `/shop?search=${encodeURIComponent(q)}` : '/shop');
  setSearchQuery('');
  setOpenPanel(null);
  };

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = getSubtotal();
  const isFreeShipping = subtotal >= FREE_SHIPPING;
  const percentToFree = Math.min(100, Math.round((subtotal / FREE_SHIPPING) * 100));

  const displayItemCount = mounted ? itemCount : 0;
  const displayWishlistCount = mounted ? wishlistItems.length : 0;
  const displaySubtotal = mounted ? subtotal : 0;

  useEffect(() => {
  if (itemCount > 0) setCartBounceKey((k) => k + 1);
  }, [itemCount]);

  return (
  <header className={`sticky top-0 z-50 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>

  {/* Main header */}
  <div className={`bg-white transition-shadow ${scrolled ? 'shadow-nav' : ''}`}>
  <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
  <div className="flex items-center gap-4 h-16 lg:h-20">
  {/* Logo */}
  <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
  <span className="text-2xl font-bold tracking-tight">
  <span className="text-navy group-hover:text-accent transition-colors duration-300">Electro</span>
  <span className="text-accent group-hover:text-navy transition-colors duration-300">Cart</span>
  </span>
  </Link>

  {/* Search bar */}
  <form
  onSubmit={handleSearch}
  className="hidden md:flex flex-1 max-w-xl mx-auto relative"
  >
  <input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onFocus={() => setIsSearchFocused(true)}
  onBlur={() => setIsSearchFocused(false)}
  placeholder="Search for products, brands, and categories..."
  className={`w-full bg-white text-slateText rounded-full pl-5 pr-12 py-2.5 text-sm shadow-inner focus:outline-none transition-all duration-300 ease-in-out placeholder:text-muted focus:ring-2 focus:ring-primary/30 focus:shadow-[0_0_24px_rgba(6,182,212,0.12)] ${
  isSearchFocused ? 'scale-[1.03] shadow-lg shadow-primary/10' : ''
  }`}
  />
  <button
  type="submit"
  aria-label="Search"
  className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-accent hover:bg-accent-dark text-white rounded-full flex items-center justify-center transition-colors"
  >
  <HiOutlineSearch className="w-5 h-5" />
  </button>
  </form>

  {/* Icons */}
  <div className="flex items-center gap-1 ml-auto md:ml-0" ref={panelRef}>
  {/* Mobile search */}
  <button
  onClick={() => setOpenPanel(openPanel === 'search' ? null : 'search')}
  className="md:hidden p-2.5 text-navy/80 hover:text-accent transition-colors"
  aria-label="Search"
  >
  <HiOutlineSearch className="w-5 h-5" />
  </button>

  {/* Wishlist */}
  <div className="relative">
  <button
  onClick={() => {
  if (authStatus !== 'authenticated') {
  setOpenPanel(null);
  openModal('signin', { type: 'navigate', path: '/wishlist' });
  return;
  }
  setOpenPanel(openPanel === 'wishlist' ? null : 'wishlist');
  }}
  className="relative p-2.5 text-navy/80 hover:text-accent transition-colors"
  aria-label="Wishlist"
  >
  <HiOutlineHeart className="w-6 h-6" />
  {displayWishlistCount > 0 && (
  <span key={`w${displayWishlistCount}`} className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-once">
  {displayWishlistCount}
  </span>
  )}
  </button>
  </div>

  {/* User */}
  <div className="relative">
  <button
  onClick={() => setOpenPanel(openPanel === 'user' ? null : 'user')}
  className="p-2.5 text-navy/80 hover:text-accent transition-colors"
  aria-label="Account"
  >
  <HiOutlineUser className="w-6 h-6" />
  </button>
  </div>

  {/* Cart */}
  <div className="relative">
  <button
  onClick={() => {
  if (authStatus !== 'authenticated') {
  setOpenPanel(null);
  openModal('signin', { type: 'navigate', path: '/cart' });
  return;
  }
  setOpenPanel(openPanel === 'cart' ? null : 'cart');
  }}
  className="relative p-2.5 text-navy/80 hover:text-accent transition-colors"
  aria-label="Cart"
  >
  <HiOutlineShoppingCart className="w-6 h-6" />
  {displayItemCount > 0 && (
  <span key={`c${cartBounceKey}`} className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-once">
  {displayItemCount}
  </span>
  )}
  </button>
  </div>

  {/* Hamburger */}
  <button
  onClick={() => setMobileMenuOpen(true)}
  className="lg:hidden p-2.5 text-navy/80 hover:text-accent transition-colors"
  aria-label="Open menu"
  >
  <HiMenu className="w-6 h-6" />
  </button>
  </div>
  </div>
  </div>

  {/* Navigation */}
  <nav className="hidden lg:block border-t border-lineBorder">
  <div className="mx-auto max-w-[1400px] px-6 flex items-center">
  {navItems.map((item) => {
  const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
  const hasDropdown = item.label === 'Shop' || item.label === 'Brands';

  return (
  <div key={item.label} className="relative group">
  <Link
  href={item.href}
  className={`relative flex items-center gap-1 px-5 py-3 text-sm font-medium uppercase tracking-wide transition-colors ${
  isActive ? 'text-accent' : 'text-navy/80 hover:text-accent'
  }`}
  >
  {item.label}
  {hasDropdown && <HiOutlineChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />}
  <span
  className={`absolute bottom-0 left-5 right-5 h-0.5 bg-accent transition-all duration-300 ${
  isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
  }`}
  />
  </Link>

  {/* Dropdown */}
  {hasDropdown && (
  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
  <div className="bg-white  rounded-xl shadow-nav border border-lineBorder  py-2 w-60 overflow-hidden">
  {item.label === 'Shop' ? (
  <>
  <Link
  href="/shop"
  className="block px-4 py-2.5 text-sm font-semibold text-navy  hover:bg-primary/5 hover:text-primary transition-colors"
  >
  All Categories
  </Link>
  <div className="my-1 border-t border-lineBorder " />
  {categories.map((cat) => (
  <Link
  key={cat.slug}
  href={`/shop?category=${cat.slug}`}
  className="px-4 py-2 text-sm text-muted  flex items-center gap-2 hover:bg-primary/5 hover:text-primary transition-colors"
  >
  <cat.icon className="w-4 h-4" /> {cat.name}
  </Link>
  ))}
  </>
  ) : (
  brands.map((brand) => (
  <Link
  key={brand._id}
  href={`/shop?brand=${encodeURIComponent(brand.name)}`}
  className="px-4 py-2 text-sm text-muted  flex items-center gap-3 hover:bg-primary/5 hover:text-primary transition-colors"
  >
  <span className="flex items-center justify-center">
  <BrandLogo brand={brand} size={24} />
  </span>
  {brand.name}
  </Link>
  ))
  )}
  </div>
  </div>
  )}
  </div>
  );
  })}
  </div>
  </nav>
  </div>

  {/* Dropdown panels (cart / wishlist / user / search) */}
  <AnimatePresence>
  {(openPanel === 'cart' || openPanel === 'wishlist' || openPanel === 'user' || openPanel === 'search') && (
  <motion.div
  initial={{ opacity: 0, y: -8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  className="absolute right-4 top-full mt-2 z-50"
  >
  <div className="bg-white  rounded-2xl shadow-nav border border-lineBorder  overflow-hidden w-[360px] max-w-[calc(100vw-2rem)]">
  {openPanel === 'search' && (
  <div className="p-4">
  <form onSubmit={handleSearch} className="relative">
  <input
  type="text"
  autoFocus
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Search for products, brands..."
  className="w-full bg-body  border border-lineBorder  rounded-lg pl-4 pr-11 py-2.5 text-sm outline-none focus:border-primary"
  />
  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary" aria-label="Search">
  <HiOutlineSearch className="w-5 h-5" />
  </button>
  </form>
  </div>
  )}

  {openPanel === 'user' && (
  <div className="py-2">
  {authStatus === 'loading' ? (
  <div className="px-4 py-6 flex justify-center">
  <div className="w-7 h-7 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
  ) : authStatus === 'authenticated' && user ? (
  <>
  <div className="flex items-center gap-3 px-4 py-3 border-b border-lineBorder ">
  {user.avatar ? (
  <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
  ) : (
  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary  flex items-center justify-center font-bold">
  {user.username.charAt(0).toUpperCase()}
  </div>
  )}
  <div className="min-w-0">
  <p className="text-sm font-semibold text-slateText  truncate">{user.username}</p>
  <p className="text-xs text-muted truncate">{user.email}</p>
  </div>
  </div>
  <Link href="/account" onClick={() => setOpenPanel(null)} className="flex items-center gap-2 px-4 py-3 text-sm text-slateText  hover:bg-primary/5 hover:text-primary transition-colors">
  <HiOutlineUser className="w-4 h-4" /> My Account
  </Link>
  <Link href="/wishlist" onClick={() => setOpenPanel(null)} className="flex items-center gap-2 px-4 py-3 text-sm text-slateText  hover:bg-primary/5 hover:text-primary transition-colors">
  <HiOutlineHeart className="w-4 h-4" /> My Wishlist
  </Link>
  <button
  onClick={async () => {
  await logout();
  setOpenPanel(null);
  }}
  className="flex items-center gap-2 px-4 py-3 text-sm w-full text-red-500 hover:bg-error/5 transition-colors"
  >
  <HiOutlineTrash className="w-4 h-4" /> Sign Out
  </button>
  </>
  ) : (
  <>
  <div className="px-4 py-3 border-b border-lineBorder ">
  <p className="text-sm font-semibold text-slateText ">Welcome to ElectroCart!</p>
  <p className="text-xs text-muted">Login to manage your account.</p>
  </div>
  <Link href="/auth/login" onClick={() => setOpenPanel(null)} className="flex items-center gap-2 px-4 py-3 text-sm text-slateText  hover:bg-primary/5 hover:text-primary transition-colors">
  <HiOutlineUser className="w-4 h-4" /> Login
  </Link>
  <Link href="/auth/register" onClick={() => setOpenPanel(null)} className="flex items-center gap-2 px-4 py-3 text-sm text-slateText  hover:bg-primary/5 hover:text-primary transition-colors">
  <HiOutlineUser className="w-4 h-4" /> Register
  </Link>
  </>
  )}
  </div>
  )}

  {openPanel === 'wishlist' && (
  <div>
  <div className="flex items-center justify-between px-4 py-3 border-b border-lineBorder ">
  <h4 className="font-semibold text-slateText  text-sm">Wishlist ({wishlistItems.length})</h4>
  <Link href="/wishlist" className="text-primary text-xs font-semibold hover:underline">View all</Link>
  </div>
  {wishlistItems.length === 0 ? (
  <div className="px-4 py-10 text-center">
  <p className="text-4xl mb-2"><HiOutlineHeart className="w-14 h-14 inline-block text-muted" /></p>
  <p className="text-sm text-muted">Your wishlist is empty.</p>
  </div>
  ) : (
  <div className="max-h-72 overflow-y-auto">
  {wishlistItems.slice(0, 5).map((p) => (
  <div key={p._id} className="flex items-center gap-3 px-4 py-3 border-b border-lineBorder/60 ">
  <Link href={`/products/${p.slug}`} className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
  </Link>
  <div className="flex-1 min-w-0">
  <Link href={`/products/${p.slug}`} className="text-xs font-medium text-slateText  line-clamp-1 hover:text-primary">
  {p.name}
  </Link>
  <p className="text-xs font-semibold text-primary">{formatPrice(p.discountPrice ?? p.price)}</p>
  </div>
  <button
  onClick={() => toggleWishlist(p)}
  className="p-1.5 text-muted hover:text-red-500 transition-colors"
  aria-label="Remove"
  >
  <HiOutlineTrash className="w-4 h-4" />
  </button>
  </div>
  ))}
  </div>
  )}
  </div>
  )}

  {openPanel === 'cart' && (
  <div>
  <div className="flex items-center justify-between px-4 py-3 border-b border-lineBorder ">
  <h4 className="font-semibold text-slateText  text-sm">Shopping Cart ({displayItemCount})</h4>
  <Link href="/cart" className="text-primary text-xs font-semibold hover:underline">View Cart</Link>
  </div>

  {/* Free shipping progress */}
  <div className="px-4 pt-3">
  {isFreeShipping ? (
  <div className="flex items-center gap-2 text-xs font-semibold text-success bg-success/10 rounded-lg px-3 py-2">
  <HiOutlineTruck className="w-4 h-4" /> Free Shipping unlocked!
  </div>
  ) : (
  <div className="text-xs">
  <p className="text-muted mb-1.5">
  Add <span className="font-semibold text-navy ">{formatPrice(FREE_SHIPPING - displaySubtotal)}</span> more for{" "}
  <span className="font-semibold text-success">FREE shipping</span>
  </p>
  <div className="h-1.5 bg-lineBorder rounded-full overflow-hidden">
  <div className="h-full bg-success rounded-full transition-all" style={{ width: `${percentToFree}%` }} />
  </div>
  </div>
  )}
  </div>

  {items.length === 0 ? (
  <div className="px-4 py-10 text-center">
  <p className="text-4xl mb-2"><HiOutlineShoppingCart className="w-14 h-14 inline-block text-muted" /></p>
  <p className="text-sm text-muted">Your cart is empty.</p>
  <Link href="/shop" className="inline-block mt-3 text-primary text-xs font-semibold hover:underline">
  Start shopping →
  </Link>
  </div>
  ) : (
  <>
  <div className="max-h-64 overflow-y-auto">
  {items.map(({ product, quantity }) => (
  <div key={product._id} className="flex items-center gap-3 px-4 py-3 border-b border-lineBorder/60 ">
  <Link href={`/products/${product.slug}`} className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
  </Link>
  <div className="flex-1 min-w-0">
  <Link href={`/products/${product.slug}`} className="text-xs font-medium text-slateText  line-clamp-1 hover:text-primary">
  {product.name}
  </Link>
  <p className="text-xs font-semibold text-primary mt-0.5">
  {formatPrice(product.discountPrice ?? product.price)}
  </p>
  <div className="flex items-center gap-1.5 mt-1.5">
  <button
  onClick={() => updateQuantity(product._id, quantity - 1)}
  className="w-6 h-6 border border-lineBorder  rounded flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors"
  aria-label="Decrease"
  >
  <HiOutlineMinus className="w-3 h-3" />
  </button>
  <span className="text-xs font-semibold w-5 text-center text-slateText ">{quantity}</span>
  <button
  onClick={() => updateQuantity(product._id, quantity + 1)}
  className="w-6 h-6 border border-lineBorder  rounded flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors"
  aria-label="Increase"
  >
  <HiOutlinePlus className="w-3 h-3" />
  </button>
  </div>
  </div>
  <button
  onClick={() => removeItem(product._id)}
  className="p-1.5 text-muted hover:text-red-500 transition-colors"
  aria-label="Remove"
  >
  <HiOutlineTrash className="w-4 h-4" />
  </button>
  </div>
  ))}
  </div>
  <div className="px-4 py-3 border-t border-lineBorder ">
  <div className="flex items-center justify-between mb-3">
  <span className="text-sm text-muted">Subtotal</span>
  <span className="text-base font-bold text-slateText ">{formatPrice(displaySubtotal)}</span>
  </div>
  <Link
  href="/checkout"
  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
  >
  Checkout Now →
  </Link>
  </div>
  </>
  )}
  </div>
  )}
  </div>
  </motion.div>
  )}
  </AnimatePresence>

  {/* Mobile menu */}
  <AnimatePresence>
  {mobileMenuOpen && (
  <>
  <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  onClick={() => setMobileMenuOpen(false)}
  className="fixed inset-0 bg-black/60 z-50 lg:hidden"
  />
  <motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', damping: 26, stiffness: 220 }}
  className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white  shadow-2xl z-50 overflow-y-auto lg:hidden"
  >
  <div className="flex items-center justify-between p-4 border-b border-lineBorder ">
  <span className="text-xl font-bold text-navy ">Electro<span className="text-accent">Cart</span></span>
  <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-muted hover:text-navy " aria-label="Close">
  <HiX className="w-5 h-5" />
  </button>
  </div>

  <form onSubmit={handleSearch} className="p-4 pb-2 relative">
  <input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Search products..."
  className="w-full bg-body  border border-lineBorder  rounded-lg pl-4 pr-10 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted"
  />
  <button type="submit" className="absolute right-6 top-1/2 text-primary" aria-label="Search">
  <HiOutlineSearch className="w-5 h-5" />
  </button>
  </form>

  <nav className="p-2">
  <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-slateText  hover:bg-primary/5 hover:text-primary rounded-lg">
  Home
  </Link>
  <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-slateText  hover:bg-primary/5 hover:text-primary rounded-lg">
  Shop
  </Link>
  <Link href="/deals" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-slateText  hover:bg-primary/5 hover:text-primary rounded-lg">
  Deals
  </Link>
  <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-slateText  hover:bg-primary/5 hover:text-primary rounded-lg">
  About Us
  </Link>
  <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-slateText  hover:bg-primary/5 hover:text-primary rounded-lg">
  Contact Us
  </Link>

  <p className="px-4 pt-4 pb-2 text-xs font-bold text-muted uppercase tracking-wider">Categories</p>
  {categories.map((cat) => (
  <Link key={cat.slug} href={`/shop?category=${cat.slug}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-muted  hover:text-primary">
  <cat.icon className="w-4 h-4" /> {cat.name}
  </Link>
  ))}

  <p className="px-4 pt-4 pb-2 text-xs font-bold text-muted uppercase tracking-wider">Brands</p>
  {brands.map((brand) => (
  <Link key={brand._id} href={`/shop?brand=${encodeURIComponent(brand.name)}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-muted  hover:text-primary">
  <BrandLogo brand={brand} size={22} />
  {brand.name}
  </Link>
  ))}

  <div className="p-4 mt-2 border-t border-lineBorder ">
  <Link href="/auth/login" className="block w-full text-center bg-primary text-white py-2.5 rounded-lg text-sm font-semibold mb-2">
  Login
  </Link>
  <Link href="/auth/register" className="block w-full text-center border border-lineBorder  text-slateText  py-2.5 rounded-lg text-sm font-semibold">
  Register
  </Link>
  </div>
  </nav>
  </motion.div>
  </>
  )}
  </AnimatePresence>
  </header>
  );
}