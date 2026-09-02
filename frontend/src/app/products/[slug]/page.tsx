import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/productApi';
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
    ...(product.images || []).slice(1),
  ].filter(Boolean) as string[];

  const related = await getRelatedProducts(product, 4);

  const availabilityLabel =
    product.stock > 0
      ? product.stock > 10
        ? 'In Stock'
        : `Only ${product.stock} left`
      : 'Out of Stock';

  const specs = [
    { key: 'Brand', value: product.brand },
    { key: 'Category', value: product.category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) },
    ...(product.warranty ? [{ key: 'Warranty', value: product.warranty }] : []),
    ...(product.shippingInformation ? [{ key: 'Shipping', value: product.shippingInformation }] : []),
    ...(product.returnPolicy ? [{ key: 'Returns', value: product.returnPolicy }] : []),
    { key: 'Stock Available', value: `${product.stock} in stock` },
    { key: 'Rating', value: `${product.rating} / 5 (${product.numReviews} reviews)` },
    { key: 'Availability', value: availabilityLabel },
  ];

  return <ProductDetailClient product={product} images={images} specs={specs} related={related} />;
}