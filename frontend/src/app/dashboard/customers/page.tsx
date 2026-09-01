'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { customerApi } from '@/lib/api';
import { formatDate } from '@/lib/dashboardUtils';
import type { DashboardUser } from '@/types/dashboard';
import {
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlineUsers,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import Pagination from '@/components/dashboard/Pagination';
import StatusBadge from '@/components/dashboard/StatusBadge';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customerApi.getAll({ page, limit: 10 });
      const data = res.data.data;
      setCustomers(data.users || data || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || (Array.isArray(data) ? data.length : 0));
    } catch {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = search
    ? customers.filter((c) => {
        const q = search.toLowerCase();
        return (
          c.username?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
        );
      })
    : customers;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slateText font-heading">Customers</h2>
          <p className="text-sm text-muted mt-0.5">{total} registered customers</p>
        </div>
        <div className="relative sm:w-72">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full bg-white rounded-lg pl-9 pr-4 py-2.5 text-sm text-slateText placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary border border-lineBorder"
          />
        </div>
      </div>

      <div className="bg-white border border-lineBorder rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-body">
                {['Customer', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-lineBorder">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <p className="text-sm text-muted">Loading customers...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <HiOutlineUsers className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                    <p className="text-sm text-muted">No customers found</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-body/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {customer.avatar ? (
                            <img
                              src={customer.avatar}
                              alt={customer.username}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-primary">
                              {customer.username?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium text-slateText">
                          {customer.username || 'User'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{customer.email}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={customer.role} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={customer.isActive ? 'active' : 'inactive'} />
                    </td>
                    <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/customers/${customer._id}`}
                        className="p-2 text-muted hover:text-primary transition-colors inline-flex"
                        title="View customer"
                      >
                        <HiOutlineEye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-lineBorder">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
