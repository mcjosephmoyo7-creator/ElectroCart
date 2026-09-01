'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaFacebookF, FaTwitter, FaInstagram, FaCcVisa, FaCcMastercard, FaPaypal } from 'react-icons/fa';
import { HiOutlineTruck, HiOutlineRefresh, HiOutlineSupport, HiOutlineShieldCheck } from 'react-icons/hi';

const socials = [
  { icon: FaFacebookF, label: 'Facebook', href: '#' },
  { icon: FaTwitter, label: 'Twitter', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
];

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Deals', href: '/deals' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

const serviceLinks = ['FAQ', 'Returns Policy', 'Shipping Info', 'Privacy Policy'];

const perks = [
  { icon: HiOutlineTruck, title: 'Free Shipping', desc: 'Over $100' },
  { icon: HiOutlineSupport, title: '27/7 Support', desc: 'Friendly help' },
  { icon: HiOutlineRefresh, title: 'Free Return', desc: 'Over $100' },
  { icon: HiOutlineShieldCheck, title: 'Guarantee', desc: 'Quality checked' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Subscribed! Welcome to the ElectroCart family');
    setEmail('');
  };

  return (
    <footer className="bg-navy dark:bg-navy-900 text-white/70">
      {/* Main footer */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-white group-hover:text-accent transition-colors duration-300">Electro</span>
                <span className="text-accent group-hover:text-white transition-colors duration-300">Cart</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 mb-5">
              Discover curated collections at ElectroCart, blending the latest tech and style to elevate your home.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 bg-white/5 hover:bg-accent text-white/70 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((label) => (
                <li key={label}>
                  <Link
                    href={label.includes('Privacy') ? '/privacy' : label.includes('FAQ') ? '/contact' : '/contact'}
                    className="text-sm text-white/60 hover:text-accent transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + perks */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Newsletter</h4>
            <p className="text-sm text-white/60 mb-4">
              Subscribe to get updates and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-l-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-accent hover:bg-accent-dark text-white text-sm font-semibold rounded-r-lg transition-colors flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
            <ul className="space-y-2.5">
              {perks.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-center gap-2.5 text-xs text-white/60">
                  <span className="w-7 h-7 bg-white/5 rounded-md flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-accent" />
                  </span>
                  <span className="font-medium text-white/80">{title}</span>
                  <span className="text-white/40">· {desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">© 2026 ElectroCart. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-white/10 text-white/70 text-[11px] font-semibold px-2.5 py-1.5 rounded">
              <FaCcVisa className="w-6 h-6" /> Visa
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 text-white/70 text-[11px] font-semibold px-2.5 py-1.5 rounded">
              <FaCcMastercard className="w-6 h-6" /> Mastercard
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 text-white/70 text-[11px] font-semibold px-2.5 py-1.5 rounded">
              <FaPaypal className="w-6 h-6" /> PayPal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}