import { Product } from '@/types';

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;

interface ProductSeed {
  name: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  rating: number;
  numReviews: number;
  stock: number;
  sold: number;
  isFeatured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
  tags: string[];
  description: string;
}

const seeds: ProductSeed[] = [
  // ---- Gadget Accessories (12) ----
  {
    name: 'Hi-Tech Wireless Earbuds Pro',
    price: 129.99, discountPrice: 89.99, category: 'gadget-accessories', brand: 'Hi-Tech Limited',
    rating: 4.8, numReviews: 214, stock: 85, sold: 512, isFeatured: true, isNew: true, onSale: true,
    tags: ['earbuds', 'wireless', 'audio'],
    description: 'True wireless earbuds with active noise cancellation, transparency mode and a 36-hour total battery life in a pocketable charging case.',
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    price: 349.99, discountPrice: 299.99, category: 'gadget-accessories', brand: 'Sony Limited',
    rating: 4.9, numReviews: 342, stock: 40, sold: 621, isFeatured: true, onSale: true,
    tags: ['headphones', 'wireless', 'noise-cancelling'],
    description: 'Industry-leading noise cancellation with crystal-clear call quality and 30-hour battery life. Premium comfort for all-day listening.',
  },
  {
    name: 'Huawei Smart Band 9',
    price: 59.99, discountPrice: 49.99, category: 'gadget-accessories', brand: 'Huawei Company',
    rating: 4.6, numReviews: 158, stock: 120, sold: 834, isFeatured: true, isNew: true, onSale: true,
    tags: ['fitness', 'band', 'smartwatch'],
    description: 'Slim fitness band with a vivid AMOLED display, 14-day battery life and 100+ workout modes to keep you moving.',
  },
  {
    name: 'A4 Tech Mechanical Gaming Keyboard',
    price: 89.99, category: 'gadget-accessories', brand: 'A4 Tech',
    rating: 4.5, numReviews: 96, stock: 64, sold: 310, isFeatured: true,
    tags: ['keyboard', 'gaming', 'rgb'],
    description: 'Mechanical gaming keyboard with per-key RGB backlighting, hot-swappable switches and a durable aluminium frame.',
  },
  {
    name: 'Logic Gaming Mouse X7',
    price: 49.99, discountPrice: 39.99, category: 'gadget-accessories', brand: 'A4 Tech',
    rating: 4.4, numReviews: 88, stock: 150, sold: 421, onSale: true,
    tags: ['mouse', 'gaming', 'rgb'],
    description: 'High-precision 16,000 DPI gaming mouse with programmable buttons, adjustable weights and fast RGB lighting.',
  },
  {
    name: 'Anker 100W GaN Fast Charger',
    price: 59.99, discountPrice: 45.99, category: 'gadget-accessories', brand: 'Hi-Tech Limited',
    rating: 4.7, numReviews: 273, stock: 200, sold: 987, isNew: true, onSale: true,
    tags: ['charger', 'usb-c', 'gan'],
    description: 'Compact 100W GaN wall charger with three ports to fast-charge your laptop, phone and tablet at once.',
  },
  {
    name: 'PowerCore 20000mAh Power Bank',
    price: 69.99, category: 'gadget-accessories', brand: 'Hi-Tech Limited',
    rating: 4.6, numReviews: 194, stock: 98, sold: 356, isFeatured: true,
    tags: ['power-bank', 'battery', 'portable'],
    description: '20,000mAh portable charger with dual USB ports and USB-C power delivery for on-the-go charging.',
  },
  {
    name: 'Sony Extra Bass Portable Speaker',
    price: 119.99, discountPrice: 99.99, category: 'gadget-accessories', brand: 'Sony Limited',
    rating: 4.7, numReviews: 141, stock: 55, sold: 288, onSale: true,
    tags: ['speaker', 'bluetooth', 'audio'],
    description: 'Rugged, waterproof Bluetooth speaker with deep Extra Bass and a 24-hour battery for non-stop tunes.',
  },
  {
    name: 'Huawei 4K Webcam Studio',
    price: 79.99, category: 'gadget-accessories', brand: 'Huawei Company',
    rating: 4.3, numReviews: 67, stock: 72, sold: 176, isNew: true,
    tags: ['webcam', 'hd', 'streaming'],
    description: 'Crystal-clear 4K webcam with autofocus, low-light correction and dual noise-reducing microphones.',
  },
  {
    name: 'HP Wireless Charging Pad',
    price: 34.99, discountPrice: 29.99, category: 'gadget-accessories', brand: 'HP Limited',
    rating: 4.5, numReviews: 202, stock: 240, sold: 743, onSale: true,
    tags: ['charger', 'wireless', 'qi'],
    description: 'Slim Qi-certified wireless charging pad delivering fast, safe charging to your smartphone nightly.',
  },
  {
    name: 'Sony WF-C500 Hi-Res Earbuds',
    price: 99.99, category: 'gadget-accessories', brand: 'Sony Limited',
    rating: 4.4, numReviews: 129, stock: 88, sold: 264,
    tags: ['earbuds', 'wireless', 'audio'],
    description: 'Hi-Res certified earbuds with a secure fit, IPX4 water resistance and a compact charging case.',
  },
  {
    name: 'Hi-Tech RGB Streaming Microphone',
    price: 109.99, discountPrice: 89.99, category: 'gadget-accessories', brand: 'Hi-Tech Limited',
    rating: 4.6, numReviews: 154, stock: 46, sold: 198, isNew: true, onSale: true,
    tags: ['microphone', 'streaming', 'usb'],
    description: 'Studio-quality USB condenser mic with cardioid pickup, mute button and gradient RGB styling.',
  },

  // ---- Kitchen Appliances (6) ----
  {
    name: 'IKEA Stainless Steel Blender 1500W',
    price: 79.99, discountPrice: 64.99, category: 'kitchen-appliances', brand: 'IKEA Limited',
    rating: 4.6, numReviews: 187, stock: 92, sold: 435, isFeatured: true, onSale: true,
    tags: ['blender', 'kitchen'],
    description: 'High-performance 1500W blender with a durable stainless steel jar, variable speeds and crush-ice programme.',
  },
  {
    name: 'IKEA Air Fryer 5L Smart',
    price: 129.99, category: 'kitchen-appliances', brand: 'IKEA Limited',
    rating: 4.7, numReviews: 223, stock: 61, sold: 389, isFeatured: true, isNew: true,
    tags: ['air-fryer', 'kitchen', 'healthy'],
    description: '5-litre smart air fryer with 10 presets, touch controls and rapid air technology for crispy food with little oil.',
  },
  {
    name: 'Hitachi Digital Microwave Oven',
    price: 149.99, discountPrice: 119.99, category: 'kitchen-appliances', brand: 'The Hitachi Limited',
    rating: 4.5, numReviews: 139, stock: 48, sold: 251, onSale: true,
    tags: ['microwave', 'kitchen'],
    description: '28-litre digital microwave with convection, grill and 8 auto-cook menus for effortless meals.',
  },
  {
    name: 'A4 Tech Coffee Maker Deluxe',
    price: 89.99, category: 'kitchen-appliances', brand: 'A4 Tech',
    rating: 4.3, numReviews: 92, stock: 77, sold: 203,
    tags: ['coffee', 'kitchen', 'maker'],
    description: 'Programmable 12-cup coffee maker with a reusable filter, keep-warm plate and an automatic shut-off.',
  },
  {
    name: 'Hitachi Electric Kettle 2L',
    price: 39.99, discountPrice: 29.99, category: 'kitchen-appliances', brand: 'The Hitachi Limited',
    rating: 4.6, numReviews: 301, stock: 210, sold: 842, onSale: true,
    tags: ['kettle', 'kitchen'],
    description: '2-litre BPA-free electric kettle with rapid boil, concealed heating element and a 360° swivel base.',
  },
  {
    name: 'IKEA Toaster - 2 Slice',
    price: 49.99, category: 'kitchen-appliances', brand: 'IKEA Limited',
    rating: 4.2, numReviews: 78, stock: 120, sold: 176,
    tags: ['toaster', 'kitchen'],
    description: 'Modern 2-slice toaster with 6 browning levels, extra-wide slots and a defrost function.',
  },

  // ---- Television (5) ----
  {
    name: 'Sony Bravia 4K Smart TV 55"',
    price: 799.99, discountPrice: 649.99, category: 'television', brand: 'Sony Limited',
    rating: 4.8, numReviews: 264, stock: 25, sold: 187, isFeatured: true, isNew: true, onSale: true,
    tags: ['tv', '4k', 'smart'],
    description: '55-inch 4K HDR smart TV with the cognitive processor XR, Dolby Vision and Google TV built in.',
  },
  {
    name: 'Hi-Tech 43" Full HD LED TV',
    price: 349.99, category: 'television', brand: 'Hi-Tech Limited',
    rating: 4.4, numReviews: 118, stock: 40, sold: 210, isFeatured: true,
    tags: ['tv', 'led', 'fullhd'],
    description: '43-inch Full HD LED smart TV with a slim bezel, multiple MEMC and built-in streaming apps.',
  },
  {
    name: 'Hitachi 65" 4K OLED TV',
    price: 1299.99, discountPrice: 1099.99, category: 'television', brand: 'The Hitachi Limited',
    rating: 4.9, numReviews: 149, stock: 15, sold: 78, onSale: true,
    tags: ['tv', '4k', 'oled'],
    description: '65-inch 4K OLED television with perfect blacks, deep contrast and a 120Hz refresh for cinema-like action.',
  },
  {
    name: 'The Apple Limited HD Mini TV 32"',
    price: 199.99, discountPrice: 175.99, category: 'television', brand: 'The Apple Limited',
    rating: 4.2, numReviews: 64, stock: 55, sold: 132, onSale: true,
    tags: ['tv', 'hd', 'mini'],
    description: 'Compact 32-inch HD TV ideal for bedrooms and kitchens, with dual HDMI inputs and VESA mounting.',
  },
  {
    name: 'HP 50" QLED Gaming TV',
    price: 549.99, category: 'television', brand: 'HP Limited',
    rating: 4.5, numReviews: 88, stock: 30, sold: 105, isNew: true,
    tags: ['tv', 'qled', 'gaming'],
    description: '50-inch QLED gaming TV with Game Mode, 6ms input lag, ALLM and vivid quantum-dot colour.',
  },

  // ---- Refrigerators (4) ----
  {
    name: 'Hitachi Double Door Refrigerator 440L',
    price: 1399.99, discountPrice: 1199.99, category: 'refrigerators', brand: 'The Hitachi Limited',
    rating: 4.7, numReviews: 132, stock: 18, sold: 96, isFeatured: true, onSale: true,
    tags: ['refrigerator', 'double-door'],
    description: '440-litre double-door refrigerator with inverter compressor, frost-free cooling and smart energy saving.',
  },
  {
    name: 'IKEA Compact Mini Fridge 45L',
    price: 179.99, category: 'refrigerators', brand: 'IKEA Limited',
    rating: 4.3, numReviews: 205, stock: 60, sold: 348,
    tags: ['refrigerator', 'mini'],
    description: 'Space-saving 45-litre mini fridge perfect for dorms and offices, with a small freezer compartment.',
  },
  {
    name: 'Hi-Tech Side-by-Side Refrigerator 520L',
    price: 1899.99, discountPrice: 1599.99, category: 'refrigerators', brand: 'Hi-Tech Limited',
    rating: 4.8, numReviews: 87, stock: 10, sold: 42, isNew: true, onSale: true,
    tags: ['refrigerator', 'side-by-side'],
    description: 'Premium 520-litre side-by-side refrigerator with a built-in water dispenser and smart freshness sensors.',
  },
  {
    name: 'HP Advanced 3-Door Fridge 380L',
    price: 1149.99, category: 'refrigerators', brand: 'HP Limited',
    rating: 4.5, numReviews: 76, stock: 22, sold: 59,
    tags: ['refrigerator', '3-door'],
    description: '380-litre three-door refrigerator with a convertible zone, anti-bacterial seals and low-noise operation.',
  },

  // ---- Washing Machine (4) ----
  {
    name: 'Hitachi Front Load Washer 8kg',
    price: 749.99, discountPrice: 599.99, category: 'washing-machine', brand: 'The Hitachi Limited',
    rating: 4.6, numReviews: 164, stock: 28, sold: 143, isFeatured: true, onSale: true,
    tags: ['washing-machine', 'front-load'],
    description: '8kg front-load washing machine with AI fabric detection, steam care and a rapid 15-minute cycle.',
  },
  {
    name: 'Hi-Tech Top Load Washing Machine 10kg',
    price: 599.99, category: 'washing-machine', brand: 'Hi-Tech Limited',
    rating: 4.4, numReviews: 191, stock: 34, sold: 217, isFeatured: true,
    tags: ['washing-machine', 'top-load'],
    description: 'Powerful 10kg top-load washer with a fuzzy logic system, soak wash and a rust-proof tub.',
  },
  {
    name: 'Sony Ultra Slim Washer Dryer 9kg',
    price: 999.99, discountPrice: 849.99, category: 'washing-machine', brand: 'Sony Limited',
    rating: 4.7, numReviews: 88, stock: 16, sold: 64, isNew: true, onSale: true,
    tags: ['washing-machine', 'washer-dryer'],
    description: 'Compact 9kg washer dryer combo with inverter motor, 1400rpm spin and auto dry sensing.',
  },
  {
    name: 'IKEA Smart Drum Washer 6kg',
    price: 449.99, category: 'washing-machine', brand: 'IKEA Limited',
    rating: 4.2, numReviews: 121, stock: 45, sold: 176,
    tags: ['washing-machine', 'smart'],
    description: 'Smart 6kg washing machine with app control, 12 programmes and an energy-efficient Eco mode.',
  },

  // ---- Tablets (5) ----
  {
    name: 'The Apple Limited Pro Tablet 12.9"',
    price: 1099.99, discountPrice: 999.99, category: 'tablets', brand: 'The Apple Limited',
    rating: 4.9, numReviews: 308, stock: 20, sold: 245, isFeatured: true, isNew: true, onSale: true,
    tags: ['tablet', 'apple'],
    description: '12.9-inch Pro tablet with the M-series chip, Liquid Retina XDR display and Apple Pencil support.',
  },
  {
    name: 'The Apple Limited Air Tablet 10.9"',
    price: 599.99, category: 'tablets', brand: 'The Apple Limited',
    rating: 4.8, numReviews: 256, stock: 50, sold: 389, isFeatured: true,
    tags: ['tablet', 'apple'],
    description: 'Light and fast 10.9-inch tablet with a stunning display, all-day battery and a slim aluminium design.',
  },
  {
    name: 'Huawei MatePad 11"',
    price: 449.99, discountPrice: 399.99, category: 'tablets', brand: 'Huawei Company',
    rating: 4.5, numReviews: 174, stock: 60, sold: 287, onSale: true,
    tags: ['tablet', 'android'],
    description: '11-inch 2K tablet with a 120Hz display, quad speakers and a full-screen multi-window experience.',
  },
  {
    name: 'HP Tab Pro 10"',
    price: 299.99, category: 'tablets', brand: 'HP Limited',
    rating: 4.3, numReviews: 142, stock: 75, sold: 301,
    tags: ['tablet', 'productivity'],
    description: 'Reliable 10-inch tablet for reading and productivity, with a long-lasting battery and 64GB of storage.',
  },
  {
    name: 'A4 Tech Kids Tablet 8"',
    price: 199.99, discountPrice: 149.99, category: 'tablets', brand: 'A4 Tech',
    rating: 4.4, numReviews: 218, stock: 90, sold: 512, isNew: true, onSale: true,
    tags: ['tablet', 'kids'],
    description: 'Kid-friendly 8-inch tablet with a robust build, parental controls and a pre-loaded learning suite.',
  },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/["'“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const products: Product[] = seeds.map((p, i) => ({
  _id: `prod-${i + 1}`,
  name: p.name,
  slug: slugify(p.name),
  description: p.description,
  price: p.price,
  discountPrice: p.discountPrice,
  categorySlug: p.category,
  category: p.category,
  brand: p.brand,
  image: img(`shopcart-${i + 1}`),
  rating: p.rating,
  numReviews: p.numReviews,
  stock: p.stock,
  sold: p.sold,
  isFeatured: p.isFeatured ?? false,
  isNew: p.isNew ?? false,
  onSale: p.onSale ?? false,
  tags: p.tags,
  createdAt: new Date(Date.UTC(2026, 7, 1 + (i % 20))).toISOString(),
}));

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p._id === id);
}