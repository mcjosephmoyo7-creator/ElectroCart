'use client';

import { useState } from 'react';
import type { Brand } from '@/types';

interface BrandLogoProps {
  brand: Brand;
  size?: number;
  className?: string;
}

export default function BrandLogo({ brand, size = 28, className = '' }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);
  const fallback = !brand.logo || failed;

  if (fallback) {
    return (
      <span
        className={`flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
        style={{ width: size, height: size, backgroundColor: brand.color, fontSize: Math.round(size * 0.34), borderRadius: size * 0.28 }}
      >
        {brand.initials}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={brand.logo}
      alt={brand.name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      draggable={false}
      className={`object-contain flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
