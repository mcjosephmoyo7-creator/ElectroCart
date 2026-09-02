import Link from 'next/link';
import { HiOutlineTruck, HiOutlineShieldCheck, HiOutlineSupport, HiOutlineHeart } from 'react-icons/hi';

const values = [
  { icon: HiOutlineTruck, title: 'Fast Delivery', desc: 'Free shipping on orders over $100 with 3-5 day doorstep delivery.' },
  { icon: HiOutlineShieldCheck, title: 'Quality Checked', desc: 'Every product is quality checked by our team before it ships.' },
  { icon: HiOutlineSupport, title: '27/7 Support', desc: 'Friendly and responsive support around the clock, every day.' },
  { icon: HiOutlineHeart, title: 'Customer First', desc: 'Your happiness is our fuel. Money-back guarantee on every order.' },
];

const stats = [
  { value: '25K+', label: 'Happy Customers' },
  { value: '120+', label: 'Products' },
  { value: '8+', label: 'Trusted Brands' },
  { value: '4.8 / 5', label: 'Average Rating' },
];

export default function AboutPage() {
  return (
  <div>
  <div className="bg-navy  text-white">
  <div className="container-custom py-12 lg:py-16">
  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">Home / About Us</p>
  <h1 className="text-3xl lg:text-5xl font-bold">About ElectroCart</h1>
  <p className="text-white/70 mt-3 max-w-2xl">
  Upgrade your home with the latest tech at unbeatable prices.
  </p>
  </div>
  </div>

  <div className="container-custom py-12 lg:py-16">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  <div className="relative">
  <img
  src="https://picsum.photos/seed/shopcart-about/700/520"
  alt="Our team working"
  className="rounded-2xl shadow-card w-full object-cover"
  />
  <div className="absolute -bottom-5 -right-5 bg-accent text-white rounded-2xl px-6 py-5 shadow-lg hidden sm:block">
  <p className="text-3xl font-bold">2019</p>
  <p className="text-xs font-semibold uppercase tracking-wider">Founded in New Orleans</p>
  </div>
  </div>
  <div>
  <h2 className="text-3xl font-bold text-slateText  mb-5">We bring the best tech, closer to you</h2>
  <p className="text-muted leading-relaxed mb-4">
  ElectroCart is a curated online store for electronics, kitchen appliances, televisions, refrigerators,
  washing machines, tablets and gadget accessories. Based in New Orleans, USA, we hand-pick every product
  to combine quality craftsmanship with modern design — at prices everyone can love.
  </p>
  <p className="text-muted leading-relaxed mb-6">
  From next-gen gadgets to everyday essentials, our mission is to make premium technology accessible to
  everyone through a seamless, trustworthy and enjoyable shopping experience.
  </p>
  <Link href="/shop" className="btn-primary">Explore Our Collection</Link>
  </div>
  </div>

  {/* Stats */}
  <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map((stat) => (
  <div key={stat.label} className="bg-white  border border-lineBorder  rounded-2xl p-8 text-center shadow-card">
  <p className="text-3xl font-bold text-primary">{stat.value}</p>
  <p className="text-sm text-muted mt-1">{stat.label}</p>
  </div>
  ))}
  </div>

  {/* Values */}
  <div className="mt-16">
  <h2 className="text-3xl font-bold text-slateText  text-center mb-10">Why Shop With Us</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  {values.map(({ icon: Icon, title, desc }) => (
  <div key={title} className="bg-white  border border-lineBorder  rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all">
  <span className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
  <Icon className="w-6 h-6 text-primary" />
  </span>
  <h3 className="font-bold text-slateText  mb-2">{title}</h3>
  <p className="text-sm text-muted leading-relaxed">{desc}</p>
  </div>
  ))}
  </div>
  </div>
  </div>
  </div>
  );
}