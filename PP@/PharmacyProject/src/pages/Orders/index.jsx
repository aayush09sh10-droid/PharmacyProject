import React, { useEffect, useState } from 'react';
import { Eye, Check, X, Truck, Package } from 'lucide-react';
import api from '../../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        const fetchedOrders = response.data.data.map(order => ({
            id: `#${order.orderId}`,
            status: order.status,
            customer: order.customerName,
            date: new Date(order.createdAt).toLocaleDateString(),
            address: 'Address not available', // We can add address to the model if needed
            items: order.items.length,
            total: order.totalAmount,
            statusColor: getStatusColor(order.status),
            actions: getActions(order.status)
        }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-orange-600 bg-orange-50';
      case 'Processing': return 'text-blue-600 bg-blue-50';
      case 'Shipped': return 'text-purple-600 bg-purple-50';
      case 'Delivered': return 'text-emerald-600 bg-emerald-50';
      case 'Cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getActions = (status) => {
    if (status === 'Pending') return ['view', 'accept', 'deny'];
    if (status === 'Processing') return ['view', 'ship'];
    return ['view'];
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your pharmacy operations</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
            <div className="text-center py-10 text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No orders found.</div>
        ) : (
            orders.map((order, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                    <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${order.statusColor}`}>
                       {order.status === 'Pending' && <Package size={14} />}
                       {(order.status === 'Delivered' || order.status === 'Processing') && <Check size={14} />}
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
                      <p className="text-2xl font-bold text-gray-900">₹{order.total.toFixed(2)}</p>
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
            ))
        )}
      </div>
    </div>
  );
};

export default Orders;
