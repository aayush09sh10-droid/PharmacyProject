import React, { useEffect, useState } from 'react';
import { Clock, DollarSign, AlertTriangle, Package, Eye, Truck, Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    lowStockProducts: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        const data = response.data.data;
        setStats({
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          pendingOrders: data.pendingOrders || 0,
          lowStockCount: data.lowStockCount || 0,
          lowStockProducts: data.lowStockProducts || [],
          recentOrders: data.recentOrders || []
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
            <p className="font-medium">Refreshing analytics...</p>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time pharmacy analytics and alerts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            icon={Clock} 
            value={stats.totalOrders} 
            label="Total Orders" 
            color="blue" 
        />
        <StatCard 
            icon={DollarSign} 
            value={`₹${stats.totalRevenue.toFixed(2)}`} 
            label="Total Revenue" 
            color="emerald" 
        />
        <StatCard 
            icon={AlertTriangle} 
            value={stats.lowStockCount} 
            label="Low Stock Alerts" 
            color="orange" 
        />
        <StatCard 
            icon={Package} 
            value={stats.pendingOrders} 
            label="Pending Orders" 
            color="purple" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - Left Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
                <Link to="/orders" className="text-emerald-500 hover:text-emerald-600 text-sm font-semibold flex items-center space-x-1 transition-colors">
                    <span>View All Orders</span>
                    <Package size={16} />
                </Link>
            </div>
            
            <div className="space-y-4 flex-1">
                {stats.recentOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 italic">
                        <Package size={32} className="mb-2 opacity-20" />
                        <p>No recent orders found</p>
                    </div>
                ) : (
                    stats.recentOrders.map((order, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all group">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">{order.orderId}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{order.customerName} • {order.items.length} items</p>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6">
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                                        order.status === 'Delivered' ? 'text-emerald-500 bg-emerald-50' : 
                                        order.status === 'Pending' ? 'text-orange-500 bg-orange-50' : 
                                        'text-blue-500 bg-blue-50'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <Link to="/orders" className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                                    <Eye size={18} />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Low Stock Items - Right Column */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                   <h3 className="text-lg font-bold text-gray-900">Critical Stock</h3>
                   <p className="text-xs text-gray-500 mt-1">Items below threshold (20)</p>
                </div>
                <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                    <AlertTriangle size={16} />
                </div>
            </div>

            <div className="space-y-5 flex-1">
                {stats.lowStockProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-emerald-500/60 text-center">
                        <Check size={32} className="mb-2" />
                        <p className="text-xs font-bold uppercase tracking-widest">All stock levels<br/>are optimal</p>
                    </div>
                ) : (
                    stats.lowStockProducts.map((item, i) => (
                        <div key={i} className="bg-orange-50/50 p-4 rounded-xl border border-orange-100/50 group hover:border-orange-300 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-gray-900 truncate pr-2">{item.name}</span>
                                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full whitespace-nowrap">{item.stock} left</span>
                            </div>
                            <div className="w-full bg-orange-100 h-1.5 rounded-full mb-2 overflow-hidden">
                               <div 
                                    className="bg-orange-400 h-1.5 rounded-full transition-all duration-1000" 
                                    style={{ width: `${(item.stock / 20) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] text-gray-500 font-medium italic">Type: {item.category}</p>
                                <Link to="/inventory" className="text-[10px] font-bold text-emerald-600 hover:underline">Restock</Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {stats.lowStockCount > 5 && (
                <Link to="/inventory" className="mt-4 text-center text-xs font-bold text-gray-400 hover:text-emerald-500 py-2 border-t border-gray-50 transition-colors uppercase tracking-widest">
                    + {stats.lowStockCount - 5} more alerts
                </Link>
            )}
        </div>
      </div>
    </div>
  );
};

// Sub-component for Stats Card
const StatCard = ({ icon: Icon, value, label, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-500',
        emerald: 'bg-emerald-50 text-emerald-500',
        orange: 'bg-orange-50 text-orange-500',
        purple: 'bg-purple-50 text-purple-500',
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-44 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center shadow-inner`}>
                    <Icon size={24} />
                </div>
            </div>
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
            </div>
        </div>
    );
};

export default Dashboard;
