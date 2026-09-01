'use client';

import Link from 'next/link';
import { formatCurrency } from '@/lib/dashboardUtils';
import type { DashboardProduct } from '@/types/dashboard';
import { HiOutlineCube, HiOutlineExclamation, HiOutlineArrowRight } from 'react-icons/hi';

interface StockSummaryProps {
  products: DashboardProduct[];
}

export default function StockSummary({ products }: StockSummaryProps) {
  const totalUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalStockValue = products.reduce(
    (sum, p) => sum + (p.stock || 0) * (p.discountPrice || p.price),
    0
  );
  const lowStock = products.filter((p) => p.stock < 10).sort((a, b) => a.stock - b.stock);
  const outOfStock = products.filter((p) => p.stock === 0);

  return (
    <div className="bg-white border border-lineBorder rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slateText font-heading">
            Stock Left
          </h3>
          <p className="text-xs text-muted mt-0.5">Current inventory levels</p>
        </div>
        <Link
          href="/dashboard/products"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark"
        >
          Manage <HiOutlineArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-body rounded-xl p-3 border border-lineBorder">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
            <HiOutlineCube className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xl font-bold text-slateText">
            {totalUnits.toLocaleString()}
          </p>
          <p className="text-[11px] text-muted">Units in stock</p>
        </div>
        <div className="bg-body rounded-xl p-3 border border-lineBorder">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-2">
            <HiOutlineExclamation className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-slateText">{lowStock.length}</p>
          <p className="text-[11px] text-muted">Low stock items</p>
        </div>
        <div className="bg-body rounded-xl p-3 border border-lineBorder">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center mb-2">
            <HiOutlineCube className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xl font-bold text-slateText">{outOfStock.length}</p>
          <p className="text-[11px] text-muted">Out of stock</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slateText">
            Stock Value
          </p>
          <p className="text-sm font-bold text-slateText">
            {formatCurrency(totalStockValue)}
          </p>
        </div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted">Inventory worth</p>
          <p className="text-xs text-muted">{products.length} products tracked</p>
        </div>

        {lowStock.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
              Low stock alerts
            </p>
            {lowStock.slice(0, 5).map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-amber-50/60 border border-amber-100"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                  <span className="text-sm text-slateText truncate">{product.name}</span>
                </div>
                <span
                  className={`text-xs font-bold flex-shrink-0 ml-2 ${
                    product.stock === 0 ? 'text-red-500' : 'text-amber-600'
                  }`}
                >
                  {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                </span>
              </div>
            ))}
            {lowStock.length > 0 && (
              <Link
                href="/dashboard/products"
                className="pt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark"
              >
                View all low stock <HiOutlineArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ) : (
          <div className="py-6 text-center text-sm text-muted border border-lineBorder rounded-lg">
            All products are well stocked 🎉
          </div>
        )}
      </div>
    </div>
  );
}
