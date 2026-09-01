'use client';

import { useEffect, useState } from 'react';
import { visitApi, type VisitStats } from '@/lib/api';
import { formatNumber } from '@/lib/dashboardUtils';
import {
  HiOutlineUsers,
  HiOutlineEye,
  HiOutlineUserGroup,
  HiOutlineGlobeAlt,
} from 'react-icons/hi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function VisitorStats() {
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    visitApi
      .getStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const visitorsToday =
    stats?.visitorsToday ??
    (stats?.visitorsThisWeek != null && stats.daily
      ? stats.daily[stats.daily.length - 1]?.views ?? 0
      : 0);

  const chartData = {
    labels: (stats?.daily || []).map((d) => {
      const date = new Date(d.date + 'T00:00:00');
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Views',
        data: (stats?.daily || []).map((d) => d.views),
        backgroundColor: '#0066CC',
        borderRadius: 6,
        maxBarThickness: 28,
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
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748B', font: { size: 10 } },
      },
      y: {
        grid: { color: '#E2E8F0' },
        ticks: {
          color: '#64748B',
          font: { size: 10 },
          precision: 0,
        },
      },
    },
  };

  const cards = [
    {
      label: 'Total Visitors',
      value: stats?.totalVisitors ?? 0,
      icon: HiOutlineUsers,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Visitors Today',
      value: visitorsToday,
      icon: HiOutlineUserGroup,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Visitors This Week',
      value: stats?.visitorsThisWeek ?? 0,
      icon: HiOutlineGlobeAlt,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Total Page Views',
      value: stats?.totalViews ?? 0,
      icon: HiOutlineEye,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  if (loading) {
    return (
      <div className="bg-white border border-lineBorder rounded-xl p-5 min-h-[160px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-lineBorder rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slateText font-heading">
            Website Visitors
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Real-time storefront traffic
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slateText">
            {formatNumber(stats?.totalVisitors ?? 0)}
          </p>
          <p className="text-xs text-muted">all-time visitors</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-body rounded-xl p-3 border border-lineBorder"
          >
            <div
              className={`w-9 h-9 rounded-lg ${card.color} flex items-center justify-center mb-2`}
            >
              <card.icon className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-slateText">{formatNumber(card.value)}</p>
            <p className="text-[11px] text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="h-48">
        {(stats?.daily?.length ?? 0) > 0 ? (
          <Bar data={chartData} options={chartOptions as never} />
        ) : (
          <div className="h-full flex items-center justify-center text-muted text-sm">
            No visitor data yet. As people browse the storefront their visits will
            appear here.
          </div>
        )}
      </div>
    </div>
  );
}
