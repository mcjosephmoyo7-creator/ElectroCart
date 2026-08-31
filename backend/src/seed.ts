import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Review from './models/Review.js';

const categories = [
  { name: 'Kitchen Appliances', description: 'Modern kitchen appliances for everyday use' },
  { name: 'Television', description: 'Latest TVs and entertainment systems' },
  { name: 'Refrigerators', description: 'Premium refrigerators and coolers' },
  { name: 'Washing Machine', description: 'Efficient washing machines and dryers' },
  { name: 'Tablets', description: 'Latest tablets and accessories' },
  { name: 'Gadget Accessories', description: 'Essential gadget accessories' },
  { name: 'Air Conditioners', description: 'Cooling solutions for your home' },
  { name: 'Smartphones', description: 'Latest smartphones and accessories' },
  { name: 'Smart Watches', description: 'Wearable technology for everyday life' },
  { name: 'Headphones', description: 'Immersive audio experiences' },
  { name: 'Cameras', description: 'Digital cameras and photography gear' },
  { name: 'Mobiles', description: 'Feature phones and basic mobiles' },
  { name: 'Appliances', description: 'Smart home appliances' },
];

const products = [
  {
    name: 'Samsung Smart Refrigerator',
    description:
      'Double-door smart refrigerator with AI-powered temperature control and built-in touch screen display. Features Twin Cooling Plus technology that keeps food fresh up to 2x longer. Wi-Fi enabled for remote temperature management via smartphone.',
    price: 1299.99,
    discountPrice: 1099.99,
    categoryIndex: 2,
    brand: 'Samsung',
    images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500'],
    specifications: [
      { key: 'Capacity', value: '620L' },
      { key: 'Type', value: 'Double Door' },
      { key: 'Energy Rating', value: '5 Star' },
      { key: 'Display', value: '21.5" Touch Screen' },
    ],
    stock: 15,
    sold: 42,
    isFeatured: true,
    tags: ['refrigerator', 'smart', 'samsung'],
  },
  {
    name: 'Hitachi Inverter Washing Machine',
    description:
      'Front-loading washing machine with advanced Inverter motor technology for quiet and efficient operation. Features 15 wash programs, steam cleaning, and AI-powered fabric detection for optimal wash results.',
    price: 899.99,
    discountPrice: 749.99,
    categoryIndex: 3,
    brand: 'Hitachi',
    images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500'],
    specifications: [
      { key: 'Capacity', value: '8kg' },
      { key: 'Type', value: 'Front Load' },
      { key: 'Motor', value: 'Inverter Direct Drive' },
      { key: 'Programs', value: '15 Wash Programs' },
    ],
    stock: 20,
    sold: 67,
    isFeatured: true,
    tags: ['washing machine', 'hitachi', 'inverter'],
  },
  {
    name: 'LG OLED Smart TV 55"',
    description:
      '55-inch OLED TV with AI-powered picture processing, Dolby Vision IQ, and Dolby Atmos audio. Features webOS smart platform with voice control and AirPlay 2 support for seamless streaming.',
    price: 1499.99,
    discountPrice: 1299.99,
    categoryIndex: 1,
    brand: 'LG',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'],
    specifications: [
      { key: 'Display', value: '55" OLED evo' },
      { key: 'Resolution', value: '4K 120Hz' },
      { key: 'HDR', value: 'Dolby Vision IQ' },
      { key: 'Audio', value: 'Dolby Atmos 40W' },
    ],
    stock: 12,
    sold: 89,
    isFeatured: true,
    tags: ['tv', 'oled', 'lg', 'smart'],
  },
  {
    name: 'IKEA Modern Kitchen Mixer',
    description:
      'High-performance kitchen mixer with 1500W motor and 6-speed settings. Features a 5L stainless steel bowl with splash guard and dough hook. Perfect for baking enthusiasts and professional chefs.',
    price: 199.99,
    categoryIndex: 0,
    brand: 'IKEA',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'],
    specifications: [
      { key: 'Power', value: '1500W' },
      { key: 'Capacity', value: '5L' },
      { key: 'Speeds', value: '6 Settings' },
      { key: 'Material', value: 'Stainless Steel' },
    ],
    stock: 35,
    sold: 112,
    tags: ['kitchen', 'mixer', 'ikea'],
  },
  {
    name: 'Sony Bravia 4K LED TV 65"',
    description:
      'Stunning 65-inch LED television with Sony X1 processor for incredible picture quality. Features Google TV, built-in Chromecast, and Alexa compatibility. Sleek design with minimal bezels.',
    price: 1799.99,
    discountPrice: 1599.99,
    categoryIndex: 1,
    brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1461151304265-385547823747?w=500'],
    specifications: [
      { key: 'Display', value: '65" LED' },
      { key: 'Resolution', value: '4K HDR' },
      { key: 'Processor', value: 'X1 Processor' },
      { key: 'Smart TV', value: 'Google TV' },
    ],
    stock: 8,
    sold: 56,
    tags: ['tv', 'sony', '4k'],
  },
  {
    name: 'Huawei Smart Air Conditioner',
    description:
      'Split air conditioner with AI-powered climate control and voice assistant integration. Features inverter compressor for energy efficiency and whisper-quiet operation. App-controlled scheduling.',
    price: 699.99,
    discountPrice: 599.99,
    categoryIndex: 6,
    brand: 'Huawei',
    images: ['https://images.unsplash.com/photo-1631545806612-03f7596d42e1?w=500'],
    specifications: [
      { key: 'Capacity', value: '1.5 Ton' },
      { key: 'Type', value: 'Split Inverter' },
      { key: 'Energy Rating', value: '5 Star' },
      { key: 'Control', value: 'Wi-Fi / Voice' },
    ],
    stock: 25,
    sold: 78,
    tags: ['air conditioner', 'huawei', 'smart'],
  },
  {
    name: 'Apple iPad Pro 12.9"',
    description:
      'Powerful tablet with M2 chip, stunning Liquid Retina XDR display, and all-day battery life. Supports Apple Pencil hover and Magic Keyboard for a versatile computing experience.',
    price: 1099.99,
    discountPrice: 999.99,
    categoryIndex: 4,
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'],
    specifications: [
      { key: 'Display', value: '12.9" Liquid Retina XDR' },
      { key: 'Processor', value: 'M2 Chip' },
      { key: 'Storage', value: '256GB' },
      { key: 'Battery', value: '10 hours' },
    ],
    stock: 18,
    sold: 145,
    isFeatured: true,
    tags: ['tablet', 'apple', 'ipad'],
  },
  {
    name: 'Hi-Tech Wireless Earbuds Pro',
    description:
      'True wireless earbuds with active noise cancellation and transparency mode. Custom 12mm drivers deliver rich, detailed sound. IPX5 water resistant with 30-hour total battery life.',
    price: 129.99,
    discountPrice: 99.99,
    categoryIndex: 5,
    brand: 'Hi-Tech Limited',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=500'],
    specifications: [
      { key: 'Driver', value: '12mm' },
      { key: 'ANC', value: 'Active Noise Cancellation' },
      { key: 'Battery', value: '8h + 24h Case' },
      { key: 'Rating', value: 'IPX5' },
    ],
    stock: 80,
    sold: 312,
    isFeatured: true,
    tags: ['earbuds', 'wireless', 'hi-tech'],
  },
  {
    name: 'HP Spectre x360 Laptop',
    description:
      'Premium 2-in-1 convertible laptop with 14-inch OLED touchscreen display and 360-degree hinge. Intel Core i7 processor, 16GB RAM, and 512GB SSD. Perfect for creative professionals.',
    price: 1499.99,
    discountPrice: 1349.99,
    categoryIndex: 4,
    brand: 'HP',
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'],
    specifications: [
      { key: 'Display', value: '14" OLED 2.8K' },
      { key: 'Processor', value: 'Intel Core i7' },
      { key: 'RAM', value: '16GB' },
      { key: 'Storage', value: '512GB SSD' },
    ],
    stock: 14,
    sold: 67,
    tags: ['laptop', 'hp', 'convertible'],
  },
  {
    name: 'A4 Tech Gaming Keyboard',
    description:
      'Mechanical gaming keyboard with customizable RGB backlighting and hot-swappable switches. Aircraft-grade aluminum frame with PBT keycaps. Programmable macros for competitive gaming.',
    price: 89.99,
    categoryIndex: 5,
    brand: 'A4 Tech',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500'],
    specifications: [
      { key: 'Switches', value: 'Hot-swap Mechanical' },
      { key: 'Keycaps', value: 'PBT Double-shot' },
      { key: 'Backlight', value: 'RGB Per-key' },
      { key: 'Connection', value: 'USB-C / Bluetooth' },
    ],
    stock: 45,
    sold: 189,
    tags: ['keyboard', 'gaming', 'a4-tech'],
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description:
      'Industry-leading noise cancelling headphones with Auto NC Optimizer and 30-hour battery life. Exceptional sound quality with LDAC Hi-Res Audio support. Multipoint connection for seamless device switching.',
    price: 349.99,
    discountPrice: 299.99,
    categoryIndex: 9,
    brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    specifications: [
      { key: 'Driver', value: '30mm' },
      { key: 'ANC', value: 'Auto NC Optimizer' },
      { key: 'Battery', value: '30 hours' },
      { key: 'Weight', value: '250g' },
    ],
    stock: 30,
    sold: 234,
    isFeatured: true,
    tags: ['headphones', 'sony', 'noise-cancelling'],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Flagship smartphone with 6.8" Dynamic AMOLED 2X display and built-in S Pen. Snapdragon 8 Gen 3 processor with 12GB RAM. 200MP camera system with AI-powered photo editing.',
    price: 1299.99,
    discountPrice: 1199.99,
    categoryIndex: 7,
    brand: 'Samsung',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'],
    specifications: [
      { key: 'Display', value: '6.8" AMOLED 120Hz' },
      { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { key: 'RAM', value: '12GB' },
      { key: 'Camera', value: '200MP Main' },
    ],
    stock: 22,
    sold: 198,
    isFeatured: true,
    tags: ['smartphone', 'samsung', 'flagship'],
  },
  {
    name: 'Canon EOS R50 Camera',
    description:
      'Compact mirrorless camera with 24.2MP APS-C sensor and 4K video recording. Features Dual Pixel CMOS AF II for fast, accurate autofocus. Perfect for content creators and vloggers.',
    price: 679.99,
    categoryIndex: 10,
    brand: 'Canon',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500'],
    specifications: [
      { key: 'Sensor', value: '24.2MP APS-C' },
      { key: 'Video', value: '4K 30fps' },
      { key: 'AF Points', value: '651 Points' },
      { key: 'Weight', value: '375g' },
    ],
    stock: 16,
    sold: 56,
    tags: ['camera', 'canon', 'mirrorless'],
  },
  {
    name: 'Hitachi Chest Freezer',
    description:
      'Energy-efficient chest freezer with 200L capacity. Features fast freeze function, adjustable temperature control, and removable storage basket. Quiet operation ideal for any room.',
    price: 449.99,
    discountPrice: 399.99,
    categoryIndex: 2,
    brand: 'Hitachi',
    images: ['https://images.unsplash.com/photo-1584568694244-44ed00467f4e?w=500'],
    specifications: [
      { key: 'Capacity', value: '200L' },
      { key: 'Type', value: 'Chest Freezer' },
      { key: 'Energy Rating', value: '4 Star' },
      { key: 'Temperature', value: '-18°C to -24°C' },
    ],
    stock: 20,
    sold: 45,
    tags: ['freezer', 'hitachi', 'chest'],
  },
  {
    name: 'Huawei Smart Band 9',
    description:
      'Slim and lightweight fitness band with 1.47" AMOLED display. Tracks heart rate, SpO2, sleep, and stress 24/7. Water-resistant to 50 meters with 14-day battery life.',
    price: 59.99,
    discountPrice: 49.99,
    categoryIndex: 8,
    brand: 'Huawei',
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500'],
    specifications: [
      { key: 'Display', value: '1.47" AMOLED' },
      { key: 'Sensors', value: 'HR, SpO2, Stress' },
      { key: 'Battery', value: '14 days' },
      { key: 'Water Resistance', value: '5 ATM' },
    ],
    stock: 100,
    sold: 456,
    tags: ['smartwatch', 'huawei', 'fitness'],
  },
  {
    name: 'IKEA Smart Coffee Maker',
    description:
      'Programmable coffee maker with built-in conical burr grinder. PID temperature control maintains optimal brewing temperature. Makes up to 12 cups with 24-hour programmable timer.',
    price: 179.99,
    discountPrice: 159.99,
    categoryIndex: 0,
    brand: 'IKEA',
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'],
    specifications: [
      { key: 'Grinder', value: 'Conical Burr' },
      { key: 'Capacity', value: '12 cups' },
      { key: 'Control', value: 'PID Temperature' },
      { key: 'Timer', value: '24-hour Programmable' },
    ],
    stock: 30,
    sold: 178,
    tags: ['coffee maker', 'ikea', 'kitchen'],
  },
  {
    name: 'Apple AirPods Pro 2',
    description:
      'Premium true wireless earbuds with adaptive noise cancellation and spatial audio. H2 chip delivers intelligent noise cancellation and immersive sound. USB-C charging with MagSafe case.',
    price: 249.99,
    categoryIndex: 9,
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500'],
    specifications: [
      { key: 'Chip', value: 'H2' },
      { key: 'ANC', value: 'Adaptive' },
      { key: 'Audio', value: 'Spatial Audio' },
      { key: 'Battery', value: '6h + 30h Case' },
    ],
    stock: 55,
    sold: 389,
    isFeatured: true,
    tags: ['earbuds', 'apple', 'airpods'],
  },
  {
    name: 'Smartmi Tower Fan',
    description:
      'Bladeless tower fan with 12 speed settings and 90-degree oscillation. Features sleep mode, timer function, and remote control. Ultra-quiet operation at just 28dB.',
    price: 149.99,
    categoryIndex: 6,
    brand: 'Smartmi',
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500'],
    specifications: [
      { key: 'Speeds', value: '12 Settings' },
      { key: 'Oscillation', value: '90 degrees' },
      { key: 'Noise', value: '28dB' },
      { key: 'Control', value: 'Remote / App' },
    ],
    stock: 40,
    sold: 112,
    tags: ['fan', 'smartmi', 'cooling'],
  },
  {
    name: 'Nokia Feature Phone 2660',
    description:
      'Classic flip phone with large 2.8" display and intuitive interface. Features big buttons, hearing aid compatibility, and long-lasting battery. Perfect for simple communication needs.',
    price: 79.99,
    categoryIndex: 11,
    brand: 'Nokia',
    images: ['https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=500'],
    specifications: [
      { key: 'Display', value: '2.8" TFT' },
      { key: 'Battery', value: '1450mAh' },
      { key: 'Camera', value: 'VGA' },
      { key: 'Features', value: 'Flip Design' },
    ],
    stock: 60,
    sold: 234,
    tags: ['mobile', 'nokia', 'feature phone'],
  },
  {
    name: 'Honeywell Air Purifier',
    description:
      'HEPA air purifier with True HEPA filter that captures 99.97% of airborne particles. Covers rooms up to 465 sq ft. Features air quality indicator and auto-adjusting fan speed.',
    price: 229.99,
    discountPrice: 199.99,
    categoryIndex: 12,
    brand: 'Honeywell',
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500'],
    specifications: [
      { key: 'Filter', value: 'True HEPA' },
      { key: 'Coverage', value: '465 sq ft' },
      { key: 'CADR', value: '160 CFM' },
      { key: 'Noise', value: '30-52 dB' },
    ],
    stock: 25,
    sold: 89,
    tags: ['air purifier', 'honeywell', 'appliance'],
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description:
      'Cordless stick vacuum with laser dust detection and piezo sensor that counts and sizes particles. Delivers 240 AW of suction power with up to 60 minutes of run time.',
    price: 649.99,
    categoryIndex: 12,
    brand: 'Dyson',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500'],
    specifications: [
      { key: 'Power', value: '240 AW' },
      { key: 'Battery', value: '60 minutes' },
      { key: 'Weight', value: '3.1 kg' },
      { key: 'Features', value: 'Laser Detect' },
    ],
    stock: 12,
    sold: 67,
    tags: ['vacuum', 'dyson', 'cordless'],
  },
  {
    name: 'Google Pixel 8 Pro',
    description:
      'Google latest flagship with Tensor G3 chip optimized for on-device AI. Features Magic Eraser, Best Take, and 7 years of OS updates. Triple camera system with 50MP main sensor.',
    price: 999.99,
    discountPrice: 899.99,
    categoryIndex: 7,
    brand: 'Google',
    images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500'],
    specifications: [
      { key: 'Display', value: '6.7" LTPO OLED' },
      { key: 'Processor', value: 'Tensor G3' },
      { key: 'Camera', value: '50MP + 48MP + 48MP' },
      { key: 'Updates', value: '7 years' },
    ],
    stock: 20,
    sold: 156,
    tags: ['smartphone', 'google', 'pixel'],
  },
];

const reviews = [
  {
    productIndex: 0,
    rating: 5,
    title: 'Best headphones I have ever owned',
    comment:
      'The noise cancellation on these is phenomenal. I use them daily on my commute and they block out everything. Sound quality is crisp and the bass is punchy without being overwhelming. Battery easily lasts a full work week.',
  },
  {
    productIndex: 5,
    rating: 4,
    title: 'Amazing display, minor quirks',
    comment:
      'The screen on this phone is absolutely gorgeous. Everything looks so vibrant and smooth at 120Hz. Camera is outstanding in good lighting. Only minor complaint is the fingerprint sensor can be finicky with wet fingers.',
  },
  {
    productIndex: 6,
    rating: 5,
    title: 'The laptop to beat in 2026',
    comment:
      'This machine handles everything I throw at it without breaking a sweat. Compiling code, running Docker containers, editing 4K video - it does it all. The battery life is genuinely impressive and the build quality is top-notch.',
  },
  {
    productIndex: 9,
    rating: 4,
    title: 'Great value wireless earbuds',
    comment:
      'For the price, these earbuds are hard to beat. The noise cancellation is solid, they fit my ears comfortably, and the sound is well-balanced. My only wish is that the touch controls were a bit more responsive.',
  },
  {
    productIndex: 20,
    rating: 5,
    title: 'Perfect morning coffee companion',
    comment:
      'This coffee maker has completely changed my morning routine. The grinder is quiet and produces consistent grounds. The temperature is spot-on every time and the programmable timer means I wake up to fresh coffee. Worth every penny.',
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Review.deleteMany({}),
    ]);

    console.log('Creating users...');
    const admin = await User.create({
      username: 'admin',
      email: 'admin@shopcart.com',
      password: 'Admin123!',
      role: 'admin',
      phone: '+1-555-0100',
    });

    const customer = await User.create({
      username: 'johndoe',
      email: 'customer@example.com',
      password: 'Customer123!',
      role: 'customer',
      phone: '+1-555-0200',
    });

    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(
      categories.map((c) => ({
        name: c.name,
        slug: c.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        description: c.description,
      }))
    );

    console.log('Creating products...');
    const createdProducts = [];
    for (const p of products) {
      const cat = createdCategories[p.categoryIndex];
      const product = await Product.create({
        name: p.name,
        slug: p.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') +
          '-' +
          Date.now().toString(36) +
          Math.random().toString(36).slice(2, 6),
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice,
        category: cat._id,
        brand: p.brand,
        images: p.images,
        specifications: p.specifications,
        stock: p.stock,
        sold: p.sold,
        isFeatured: p.isFeatured || false,
        tags: p.tags,
      });
      createdProducts.push(product);
      console.log(`  Created: ${p.name}`);
    }

    console.log('Creating reviews...');
    for (const r of reviews) {
      await Review.create({
        user: customer._id,
        product: createdProducts[r.productIndex]._id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        isVerifiedPurchase: true,
      });
      console.log(`  Review: ${r.title}`);
    }

    console.log('\nSeed completed successfully!');
    console.log(`  Users: 2 (admin@shopcart.com / Admin123!, customer@example.com / Customer123!)`);
    console.log(`  Categories: ${createdCategories.length}`);
    console.log(`  Products: ${createdProducts.length}`);
    console.log(`  Reviews: ${reviews.length}`);

    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
