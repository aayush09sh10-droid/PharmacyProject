import React from 'react';
import { Bell, Clock, DollarSign, AlertTriangle, Package, Eye, Truck, Check } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your pharmacy operations</p>
        </div>
        <button className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={24} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-40">
           <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                 <Clock size={24} />
              </div>
              <div className="flex items-center space-x-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full text-xs font-semibold">
                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                 </svg>
                 <span>+12%</span>
              </div>
           </div>
           <div>
              <h2 className="text-3xl font-bold text-gray-900">23</h2>
              <p className="text-sm text-gray-500">Today's Orders</p>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-40">
           <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                 <DollarSign size={24} />
              </div>
              <div className="flex items-center space-x-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full text-xs font-semibold">
                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                 </svg>
                 <span>+18%</span>
              </div>
           </div>
           <div>
              <h2 className="text-3xl font-bold text-gray-900">$12,450</h2>
              <p className="text-sm text-gray-500">Total Revenue</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-40">
           <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                 <AlertTriangle size={24} />
              </div>
              <div className="flex items-center space-x-1 text-red-500 bg-red-50 px-2 py-1 rounded-full text-xs font-semibold">
                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                 </svg>
                 <span>-3</span>
              </div>
           </div>
           <div>
              <h2 className="text-3xl font-bold text-gray-900">8</h2>
              <p className="text-sm text-gray-500">Low Stock Alerts</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-40">
           <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                 <Package size={24} />
              </div>
              <div className="flex items-center space-x-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full text-xs font-semibold">
                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                 </svg>
                 <span>+5</span>
              </div>
           </div>
           <div>
              <h2 className="text-3xl font-bold text-gray-900">15</h2>
              <p className="text-sm text-gray-500">Pending Orders</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - Left Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                <button className="text-emerald-500 hover:text-emerald-600 text-sm font-semibold flex items-center space-x-1">
                    <span>View All</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            
            <div className="space-y-4">
                {[
                    { id: '#ORD-1234', user: 'John Doe', items: 3, time: '10 mins ago', amount: 45.99, status: 'Pending', icon: Package, statusColor: 'text-orange-500 bg-orange-50' },
                    { id: '#ORD-1233', user: 'Sarah Smith', items: 2, time: '25 mins ago', amount: 32.50, status: 'Packed', icon: Truck, statusColor: 'text-blue-500 bg-blue-50' },
                    { id: '#ORD-1232', user: 'Mike Johnson', items: 5, time: '1 hour ago', amount: 78.20, status: 'Delivered', icon: Check, statusColor: 'text-emerald-500 bg-emerald-50' }
                ].map((order, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                                <Package size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">{order.id}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{order.user} • {order.items} items</p>
                                <p className="text-xs text-gray-400 mt-0.5">{order.time}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="text-right">
                                <p className="font-bold text-gray-900">${order.amount.toFixed(2)}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${order.statusColor}`}>{order.status}</span>
                            </div>
                            <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                                <Eye size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Low Stock Items - Right Column */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                   <h3 className="text-lg font-bold text-gray-900">Low Stock Items</h3>
                   <p className="text-xs text-gray-500 mt-1">Items need restocking</p>
                </div>
                <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                    <AlertTriangle size={16} />
                </div>
            </div>

            <div className="space-y-5 flex-1">
                {[
                    { name: 'Azithromycin 250mg', left: 5, threshold: 20, pct: 25 },
                    { name: 'Ibuprofen 200mg', left: 8, threshold: 30, pct: 26 },
                    { name: 'Aspirin 100mg', left: 12, threshold: 25, pct: 48 },
                ].map((item, i) => (
                    <div key={i} className="bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-900">{item.name}</span>
                            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">{item.left} left</span>
                        </div>
                        <div className="w-full bg-orange-100 h-1.5 rounded-full mb-2">
                           <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: `${item.pct}%` }}></div>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium">Reorder at: {item.threshold} units</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
