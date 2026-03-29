import React from 'react';
import { Bell, Plus, Edit2, Trash2, Search } from 'lucide-react';

const Inventory = () => {
  const inventoryList = [
    {
      id: 1,
      name: 'Azithromycin 250mg',
      rxRequired: true,
      category: 'Antibiotic',
      stock: 45,
      expiry: '2025-12-31',
      price: 15.99,
    },
    {
      id: 2,
      name: 'Ibuprofen 200mg',
      rxRequired: false,
      category: 'Pain Relief',
      stock: 120,
      expiry: '2026-06-30',
      price: 11.99,
    },
    {
      id: 3,
      name: 'Aspirin 100mg',
      rxRequired: false,
      category: 'Pain Relief',
      stock: 89,
      expiry: '2025-09-15',
      price: 7.99,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your pharmacy operations</p>
        </div>
        <button className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={24} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-[400px]">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
        <button className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Inventory List (Similar to Products) */}
      <div className="space-y-4">
        {inventoryList.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                {product.rxRequired && (
                  <span className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 rounded-full">
                    Rx Required
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <p>Category: <span className={product.category === 'Antibiotic' ? 'text-emerald-600 font-medium' : 'text-emerald-500 font-medium'}>{product.category}</span></p>
                <p>Stock: <span className="font-bold text-gray-900">{product.stock}</span></p>
                <p>Expiry: <span className="font-medium text-gray-900">{product.expiry}</span></p>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                <p className="text-xs text-gray-400">per unit</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                  <Edit2 size={20} />
                </button>
                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
