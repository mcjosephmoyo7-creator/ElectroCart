'use client';

import { useEffect, useState, useCallback } from 'react';
import { dashboardApi, productApi, orderApi, categoryApi } from '@/lib/api';
import { formatCurrency, formatNumber, getPerformanceLabel, getPerformanceColor, formatDate } from '@/lib/dashboardUtils';
import type { DashboardStats, DashboardProduct, DashboardOrder, SalesChartData } from '@/types/dashboard';
import {
  HiOutlineCheckCircle,
  HiOutlineSparkles,
  HiOutlineTrendingUp,
  HiOutlineShoppingCart,
  HiOutlineArrowLeft,
  HiOutlineStar,
} from 'react-icons/hi';
import { FaStar } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Pagination from '@/components/dashboard/Pagination';
import VisitorStats from '@/components/dashboard/VisitorStats';
import StockSummary from '@/components/dashboard/StockSummary';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [salesChart, setSalesChart] = useState<SalesChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockPage, setStockPage] = useState(1);
  const [stockTotalPages, setStockTotalPages] = useState(1);
  const [allProducts, setAllProducts] = useState<DashboardProduct[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, chartRes, productsRes, ordersRes, catRes] = await Promise.allSettled([
        dashboardApi.getStats(),
        dashboardApi.getSalesChart(),
        productApi.getAll({ limit: '50' }),
        orderApi.getAll({ limit: '50' }),
        categoryApi.getAll(),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.data);
      if (chartRes.status === 'fulfilled') setSalesChart(chartRes.value.data.data);
      if (productsRes.status === 'fulfilled') {
        const prods = productsRes.value.data.data.products || [];
        setProducts(prods);
        setAllProducts(prods);
        setStockTotalPages(productsRes.value.data.data.pages || 1);
      }
      if (ordersRes.status === 'fulfilled') {
        setOrders(ordersRes.value.data.data.orders || []);
      }
      if (catRes.status === 'fulfilled') setCategories(catRes.value.data.data || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleStockPageChange = (page: number) => {
    setStockPage(page);
  };

  const topProduct = products.length > 0
    ? [...products].sort((a, b) => b.sold - a.sold)[0]
    : null;

  const totalSold = products.reduce((sum, p) => sum + (p.sold || 0), 0);

  const avgRating = products.length > 0
    ? products.reduce((sum, p) => sum + (p.ratings || 0), 0) / products.length
    : 0;

  const performanceLabel = getPerformanceLabel(avgRating);

  const ratingDistribution = {
    excellent: products.filter((p) => (p.ratings || 0) >= 4.5).length,
    good: products.filter((p) => (p.ratings || 0) >= 4.0 && (p.ratings || 0) < 4.5).length,
    veryGood: products.filter((p) => (p.ratings || 0) >= 3.5 && (p.ratings || 0) < 4.0).length,
    average: products.filter((p) => (p.ratings || 0) >= 2.5 && (p.ratings || 0) < 3.5).length,
    bad: products.filter((p) => (p.ratings || 0) < 2.5).length,
  };

  const performanceItems = [
    { label: 'Performance Excellent', rating: 5, count: ratingDistribution.excellent, color: 'bg-emerald-500' },
    { label: 'Performance Good', rating: 4, count: ratingDistribution.good, color: 'bg-blue-500' },
    { label: 'Performance Very Good', rating: 3.5, count: ratingDistribution.veryGood, color: 'bg-purple-500' },
    { label: 'Performance Average', rating: 3, count: ratingDistribution.average, color: 'bg-amber-500' },
    { label: 'Performance Bad', rating: 2, count: ratingDistribution.bad, color: 'bg-red-500' },
  ];

  const chartData = {
    labels: salesChart.map((d) => {
      const date = new Date(d._id);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Revenue',
        data: salesChart.map((d) => d.totalSales),
        borderColor: '#0066CC',
        backgroundColor: 'rgba(0, 102, 204, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#0066CC',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0A1A2F',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (ctx: { parsed: { y: number } }) => `Revenue: $${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748B', font: { size: 11 } },
      },
      y: {
        grid: { color: '#E2E8F0' },
        ticks: {
          color: '#64748B',
          font: { size: 11 },
          callback: (v: string | number) => `$${Number(v).toLocaleString()}`,
        },
      },
    },
  };

  const statCards = [
    {
      label: 'Active Products',
      value: stats?.totalProducts || products.length,
      suffix: 'Products',
      icon: HiOutlineCheckCircle,
      color: 'bg-emerald-50 text-emerald-600',
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Winning Product',
      value: topProduct ? topProduct.name.slice(0, 20) + (topProduct.name.length > 20 ? '...' : '') : 'N/A',
      suffix: topProduct ? `${topProduct.sold} sold` : '',
      icon: HiOutlineSparkles,
      color: 'bg-amber-50 text-amber-600',
      iconColor: 'text-amber-500',
      isText: true,
    },
    {
      label: 'Average Performance',
      value: performanceLabel,
      suffix: `${avgRating.toFixed(1)} avg`,
      icon: HiOutlineTrendingUp,
      color: 'bg-blue-50 text-blue-600',
      iconColor: getPerformanceColor(performanceLabel).replace('text-', 'text-'),
      isText: true,
    },
    {
      label: 'Product Sold',
      value: formatNumber(totalSold),
      suffix: 'Items',
      icon: HiOutlineShoppingCart,
      color: 'bg-purple-50 text-purple-600',
      iconColor: 'text-purple-500',
    },
    {
      label: 'Product Returned',
      value: '0',
      suffix: 'Items',
      icon: HiOutlineArrowLeft,
      color: 'bg-red-50 text-red-600',
      iconColor: 'text-red-500',
    },
  ];

  const stockProducts = allProducts.slice((stockPage - 1) * 10, stockPage * 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-lineBorder rounded-xl p-4 hover:shadow-card transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>
            <p className="text-xs text-muted font-medium mb-1">{card.label}</p>
            {card.isText ? (
              <p className="text-lg font-bold text-slateText">{card.value}</p>
            ) : (
              <p className="text-2xl font-bold text-slateText">{card.value}</p>
            )}
            {card.suffix && (
              <p className="text-xs text-muted mt-0.5">{card.suffix}</p>
            )}
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-lineBorder rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slateText font-heading">Revenue Overview</h3>
            <p className="text-xs text-muted mt-0.5">Last 30 days performance</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slateText">{formatCurrency(stats?.totalSales || 0)}</p>
            <p className="text-xs text-success font-semibold">Total Revenue</p>
          </div>
        </div>
        <div className="h-64">
          {salesChart.length > 0 ? (
            <Line data={chartData} options={chartOptions as never} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted text-sm">
              No sales data available yet
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance List */}
        <div className="bg-white border border-lineBorder rounded-xl p-5">
          <h3 className="text-lg font-bold text-slateText font-heading mb-4">
            Performance Product List
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {products.slice(0, 10).map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-body transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-body">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-lineBorder flex items-center justify-center text-xs text-muted">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slateText truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FaStar
                          key={s}
                          className={`w-3 h-3 ${
                            s <= Math.round(product.ratings || 0) ? 'text-star' : 'text-gray-200'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-semibold text-slateText ml-1">
                        {(product.ratings || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted flex-shrink-0 ml-2">
                  {product.sold || 0} sold
                </span>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-center text-muted text-sm py-8">No products found</p>
            )}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white border border-lineBorder rounded-xl p-5">
          <h3 className="text-lg font-bold text-slateText font-heading mb-4">
            Performance Rating Distribution
          </h3>
          <div className="space-y-3">
            {performanceItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs font-medium text-slateText w-36 flex-shrink-0">
                  {item.label}
                </span>
                <div className="flex-1 h-8 bg-body rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-lg transition-all duration-500 flex items-center justify-end pr-3`}
                    style={{
                      width: `${products.length > 0 ? (item.count / products.length) * 100 : 0}%`,
                      minWidth: item.count > 0 ? '3rem' : '0',
                    }}
                  >
                    <span className="text-xs font-bold text-white">{item.count}</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FaStar
                      key={s}
                      className={`w-3 h-3 ${
                        s <= Math.round(item.rating) ? 'text-star' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-lineBorder">
            <h4 className="text-sm font-bold text-slateText mb-3">Top Reviews</h4>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {orders.slice(0, 3).map((order) => (
                <div key={order._id} className="text-xs text-muted">
                  <p className="font-medium text-slateText">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p>{formatDate(order.createdAt)} - {formatCurrency(order.total)}</p>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-muted py-4">No orders yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stock & Price Table */}
      <div className="bg-white border border-lineBorder rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-lineBorder">
          <h3 className="text-lg font-bold text-slateText font-heading">
            Stock &amp; Price Table
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-body">
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">
                  Product Name
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">
                  Product Price
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">
                  Stock
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-5 py-3">
                  Visibility
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lineBorder">
              {stockProducts.map((product) => (
                <tr key={product._id} className="hover:bg-body/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-body">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-lineBorder flex items-center justify-center text-[10px] text-muted">
                            N/A
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-slateText truncate max-w-[200px]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-semibold text-slateText">
                      {formatCurrency(product.discountPrice || product.price)}
                    </span>
                    {product.discountPrice && (
                      <span className="text-xs text-muted line-through ml-2">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-500' : 'text-slateText'}`}>
                      {product.stock} units
                    </span>
                    {product.stock < 10 && (
                      <span className="ml-2 text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                        LOW
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        product.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
              {stockProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted text-sm">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-lineBorder">
          <Pagination
            currentPage={stockPage}
            totalPages={stockTotalPages}
            onPageChange={handleStockPageChange}
          />
        </div>
      </div>

      {/* Website visitors + stock left */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VisitorStats />
        </div>
        <StockSummary products={allProducts} />
      </div>
    </div>
  );
}
