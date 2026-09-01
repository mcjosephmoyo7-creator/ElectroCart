import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getElectronicsProducts, getProductBySlug, getRelatedProducts } from '@/lib/productApi';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = [
    product.image,
    product.images?.[1] || `https://picsum.photos/seed/${product._id}-2/600/600`,
    product.images?.[2] || `https://picsum.photos/seed/${product._id}-3/600/600`,
  ].filter(Boolean) as string[];

  const related = await getRelatedProducts(product, 4);

  const specs = [
    { key: 'Brand', value: product.brand },
    { key: 'Category', value: product.category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) },
    { key: 'Condition', value: 'Brand New' },
    { key: 'Warranty', value: '12 Months' },
    { key: 'Units Sold', value: String(product.sold) },
    { key: 'Stock Available', value: `${product.stock} in stock` },
    { key: 'Rating', value: `${product.rating} / 5 (${product.numReviews} reviews)` },
  ];

  return <ProductDetailClient product={product} images={images} specs={specs} related={related} />;
}