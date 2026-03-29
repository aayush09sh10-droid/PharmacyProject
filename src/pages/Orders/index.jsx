import React from 'react';
import { Bell, Eye, Check, X, Truck, Package } from 'lucide-react';

const Orders = () => {
  const ordersList = [
    {
      id: '#ORD-1234',
      status: 'Pending',
      customer: 'John Doe',
      date: '2024-02-20',
      address: '123 Main St, Downtown',
      items: 2,
      total: 43.97,
      statusColor: 'text-orange-600 bg-orange-50',
      icon: Package,
      actions: ['view', 'accept', 'deny']
    },
    {
      id: '#ORD-1233',
      status: 'Packed',
      customer: 'Sarah Smith',
      date: '2024-02-19',
      address: '456 Oak Ave, Midtown',
      items: 1,
      total: 23.97,
      statusColor: 'text-blue-600 bg-blue-50',
      icon: Check,
      actions: ['view', 'ship']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your pharmacy operations</p>
        </div>
        <button className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={24} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {ordersList.map((order, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${order.statusColor}`}>
                   {order.status === 'Pending' && <Package size={14} />}
                   {order.status === 'Packed' && <Check size={14} />}
                   <span>{order.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                 <div>
                    <span className="text-gray-400 block mb-1">Customer:</span>
                    <span className="font-medium text-gray-900">{order.customer}</span>
                 </div>
                 <div>
                    <span className="text-gray-400 block mb-1">Date:</span>
                    <span className="font-medium text-gray-900">{order.date}</span>
                 </div>
                 <div className="col-span-1 md:col-span-2 lg:col-span-2">
                    <span className="text-gray-400 block mb-1">Address:</span>
                    <span className="font-medium text-gray-900">{order.address}</span>
                 </div>
                 <div>
                    <span className="text-gray-400 block mb-1">Items:</span>
                    <span className="font-medium text-gray-900">{order.items} product(s)</span>
                 </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-4 ml-6 pl-6 border-l border-gray-100">
               <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
               </div>
               <div className="flex items-center flex-col space-y-2">
                  {order.actions.includes('view') && (
                     <button className="w-10 h-10 flex items-center justify-center text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors">
                        <Eye size={20} />
                     </button>
                  )}
                  {order.actions.includes('accept') && (
                     <button className="w-10 h-10 flex items-center justify-center text-emerald-500 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors">
                        <Check size={20} />
                     </button>
                  )}
                  {order.actions.includes('deny') && (
                     <button className="w-10 h-10 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-colors">
                        <X size={20} />
                     </button>
                  )}
                  {order.actions.includes('ship') && (
                     <button className="w-10 h-10 flex items-center justify-center text-purple-500 bg-purple-50 hover:bg-purple-100 rounded-full transition-colors">
                        <Truck size={20} />
                     </button>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
