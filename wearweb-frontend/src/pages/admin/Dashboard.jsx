import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { fetchAllProducts, fetchAllUsers, fetchAllOrders } from '../../services/api';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStatusCounts, setOrderStatusCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.allSettled([
          fetchAllProducts(),
          fetchAllUsers(),
          fetchAllOrders()
        ]);

        const productsData = productsRes.status === 'fulfilled' ? (productsRes.value.data.data || productsRes.value.data || []) : [];
        const usersData = usersRes.status === 'fulfilled' ? (usersRes.value.data.data || usersRes.value.data || []) : [];
        const ordersData = ordersRes.status === 'fulfilled' ? (ordersRes.value.data.data || ordersRes.value.data || []) : [];

        const totalSales = ordersData.reduce((sum, order) => {
          if (order.paymentStatus === 'Paid') {
            return sum + (order.totalPrice || 0);
          }
          return sum;
        }, 0);

        setStats({
          totalProducts: productsData.length,
          totalUsers: usersData.length,
          totalOrders: ordersData.length,
          totalSales: totalSales
        });

        // Calculate order status counts from real data
        // DB uses orderStatus field with values: 'placed', 'shipped', 'delivered', 'cancelled'
        // Map 'placed' → 'Pending' for display
        const STATUS_DISPLAY_MAP = {
          placed: 'Pending',
          pending: 'Pending',
          processing: 'Processing',
          shipped: 'Shipped',
          delivered: 'Delivered',
          cancelled: 'Cancelled',
        };

        const COLOR_MAP = {
          Pending: '#f59e0b',
          Processing: '#3b82f6',
          Shipped: '#8b5cf6',
          Delivered: '#16a34a',
          Cancelled: '#ef4444',
        };

        // Always include these 4 core statuses
        const coreStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
        const statusMap = {};
        coreStatuses.forEach((s) => { statusMap[s] = 0; });

        ordersData.forEach((order) => {
          const rawStatus = (order.orderStatus || order.status || 'placed').toLowerCase();
          const displayName = STATUS_DISPLAY_MAP[rawStatus] || rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
          statusMap[displayName] = (statusMap[displayName] || 0) + 1;
        });

        const statusArr = Object.entries(statusMap).map(([name, value]) => ({
          name,
          value,
          color: COLOR_MAP[name] || '#94a3b8',
        }));

        setOrderStatusCounts(statusArr);

        setRecentOrders(ordersData.slice(-5));
      } catch (error) {
        console.error('FETCH ERROR in [Dashboard]:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'processing') return 'bg-blue-100 text-blue-700';
    if (s === 'shipped') return 'bg-purple-100 text-purple-700';
    if (s === 'delivered') return 'bg-green-100 text-green-700';
    if (s === 'cancelled') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700'; // pending / placed default
  };

  // Map DB orderStatus to display name
  const getDisplayStatus = (status) => {
    const s = status?.toLowerCase();
    if (s === 'placed') return 'Pending';
    return status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() || 'Pending';
  };

  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 7000 },
  ];

  const totalOrderCount = orderStatusCounts.reduce((sum, d) => sum + d.value, 0);



  // Custom legend
  const renderDonutLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4">
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2 text-[13px] font-medium text-slate-600">
            <span
              className="w-3 h-3 rounded-full inline-block shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            {entry.value} ({orderStatusCounts.find(d => d.name === entry.value)?.value || 0})
          </div>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2 font-medium">Welcome back, here's what's happening with your store today.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Card 1 - Total Sales */}
            <Link to="/admin/orders" className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 group">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-green-100">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Sales</p>
                <p className="text-3xl font-black text-slate-800">₹{stats.totalSales.toLocaleString()}</p>
              </div>
            </Link>

            {/* Card 2 - Total Orders */}
            <Link to="/admin/orders" className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 group">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-blue-100">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
                <p className="text-3xl font-black text-slate-800">{stats.totalOrders}</p>
              </div>
            </Link>

            {/* Card 3 - Total Products */}
            <Link to="/admin/products" className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 group">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-purple-100">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Products</p>
                <p className="text-3xl font-black text-slate-800">{stats.totalProducts}</p>
              </div>
            </Link>

            {/* Card 4 - Total Users */}
            <Link to="/admin/users" className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 group">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-orange-100">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Users</p>
                <p className="text-3xl font-black text-slate-800">{stats.totalUsers}</p>
              </div>
            </Link>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Chart 1: Sales Overview (Bar) */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Sales Overview</h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Orders by Status (Donut) */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Orders by Status</h2>
              <p className="text-sm text-slate-400 mb-4">Distribution of all orders</p>
              <div className="h-96 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusCounts}
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {orderStatusCounts.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '10px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgb(0 0 0 / 0.12)',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                      formatter={(value, name) => [`${value} orders`, name]}
                    />
                    <Legend content={renderDonutLegend} />
                    {/* Center label */}
                    <text
                      x="50%"
                      y="42%"
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fontSize: '28px', fontWeight: 800, fill: '#1e293b' }}
                    >
                      {totalOrderCount}
                    </text>
                    <text
                      x="50%"
                      y="51%"
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fontSize: '12px', fontWeight: 500, fill: '#94a3b8' }}
                    >
                      Total
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Orders</h2>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b-2 border-slate-100 text-slate-500 uppercase tracking-wider text-xs">
                    <th className="py-4 px-4 font-bold">Order ID</th>
                    <th className="py-4 px-4 font-bold">Customer</th>
                    <th className="py-4 px-4 font-bold">Date</th>
                    <th className="py-4 px-4 font-bold">Status</th>
                    <th className="py-4 px-4 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order._id || order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-mono font-medium text-slate-600">
                          #{(order._id || order.id || '0000').slice(-6).toUpperCase()}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-slate-800">{order.customerId?.name || 'Guest'}</td>
                        <td className="py-4 px-4 text-sm font-medium text-slate-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${getStatusBadge(order.orderStatus || order.status)}`}>
                            {getDisplayStatus(order.orderStatus || order.status)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm font-black text-slate-800 text-right">₹{order.totalPrice}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="py-8 text-center text-sm font-medium text-slate-500 bg-slate-50/50">No recent orders yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};
