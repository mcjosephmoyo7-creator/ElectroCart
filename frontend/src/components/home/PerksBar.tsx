import { HiOutlineTruck, HiOutlineRefresh, HiOutlineSupport, HiOutlineShieldCheck } from 'react-icons/hi';

const perks = [
  { icon: HiOutlineTruck, title: 'Free Delivery', desc: 'Free shipping over $100' },
  { icon: HiOutlineRefresh, title: 'Free Return', desc: 'Free shipping over $100' },
  { icon: HiOutlineSupport, title: 'Customer Support', desc: 'Friendly 27/7 support' },
  { icon: HiOutlineShieldCheck, title: 'Money Back Guarantee', desc: 'Quality checked by our team' },
];

export default function PerksBar() {
  return (
  <section className="bg-white  border-y border-lineBorder ">
  <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-lineBorder/70 ">
  {perks.map(({ icon: Icon, title, desc }) => (
  <div key={title} className="flex items-center gap-4 px-6 py-6 hover:bg-body  transition-colors">
  <span className="w-12 h-12 shrink-0 bg-accent/10 rounded-xl flex items-center justify-center">
  <Icon className="w-6 h-6 text-accent" />
  </span>
  <div>
  <h4 className="font-semibold text-slateText ">{title}</h4>
  <p className="text-sm text-muted">{desc}</p>
  </div>
  </div>
  ))}
  </div>
  </div>
  </section>
  );
}