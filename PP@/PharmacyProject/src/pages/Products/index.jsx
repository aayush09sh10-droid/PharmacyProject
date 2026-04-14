import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Loader2 } from 'lucide-react';
import api from '../../api';

const Products = () => {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'General',
    stock: 0,
    price: 0,
    expiry: '',
    rxRequired: false,
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProductsList(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting new medicine to catalog:", newProduct);
    try {
      await api.post('/products', newProduct);
      alert("Medicine added to catalog successfully!");
      setIsModalOpen(false);
      setNewProduct({
        name: '',
        category: 'General',
        stock: 0,
        price: 0,
        expiry: '',
        rxRequired: false,
        description: ''
      });
      fetchProducts(); 
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.message || "Failed to add medicine. Please ensure all fields are filled.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.patch(`/products/${editingProduct._id}`, editingProduct);
      alert("Medicine updated successfully!");
      setIsEditModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.response?.data?.message || "Failed to update medicine.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = productsList.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your pharmacy catalog</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-[400px]">
          <input
            type="text"
            placeholder="Search our catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
                <p>Loading catalog...</p>
            </div>
        ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 italic">
                Your catalog is currently empty.
            </div>
        ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow group">
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
                    <p>Stock: <span className={`font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-gray-900'}`}>{product.stock}</span></p>
                    <p>Expiry: <span className="font-medium text-gray-900">{product.expiry}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₹{product.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">per unit</p>
                  </div>
                  <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => {
                            setEditingProduct(product);
                            setIsEditModalOpen(true);
                        }}
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors shadow-sm bg-white"
                        title="Edit Medicine"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shadow-sm bg-white"
                        title="Delete Medicine"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <ProductModal 
            title="Add New Medicine to Catalog"
            product={newProduct}
            setProduct={setNewProduct}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddProduct}
            submitLabel="Save Medicine"
            isSubmitting={isSubmitting}
        />
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <ProductModal 
            title="Edit Medicine Details"
            product={editingProduct}
            setProduct={setEditingProduct}
            onClose={() => {
                setIsEditModalOpen(false);
                setEditingProduct(null);
            }}
            onSubmit={handleEditProduct}
            submitLabel="Update Medicine"
            isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

// Reusable Modal Component
const ProductModal = ({ title, product, setProduct, onClose, onSubmit, submitLabel, isSubmitting }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <button 
          onClick={onClose}
          disabled={isSubmitting}
          className="p-1 hover:bg-gray-200 rounded-full text-gray-400 transition-colors disabled:opacity-50"
        >
          <X size={24} />
        </button>
      </div>
      
      <form onSubmit={onSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Name</label>
            <input
              required
              disabled={isSubmitting}
              type="text"
              value={product.name}
              onChange={(e) => setProduct({...product, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all disabled:bg-gray-50"
              placeholder="e.g. Paracetamol 500mg"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
            <select
              disabled={isSubmitting}
              value={product.category}
              onChange={(e) => setProduct({...product, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all appearance-none bg-white disabled:bg-gray-50"
            >
              <option value="General">General</option>
              <option value="Antibiotic">Antibiotic</option>
              <option value="Pain Relief">Pain Relief</option>
              <option value="Vitamin">Vitamin</option>
              <option value="Skin Care">Skin Care</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price (₹)</label>
            <input
              required
              disabled={isSubmitting}
              type="number"
              step="0.01"
              value={product.price || ''}
              onChange={(e) => setProduct({...product, price: e.target.value ? parseFloat(e.target.value) : 0})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock Quantity</label>
            <input
              required
              disabled={isSubmitting}
              type="number"
              value={product.stock || ''}
              onChange={(e) => setProduct({...product, stock: e.target.value ? parseInt(e.target.value) : 0})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expiry Date</label>
            <input
              required
              disabled={isSubmitting}
              type="date"
              value={product.expiry}
              onChange={(e) => setProduct({...product, expiry: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all disabled:bg-gray-50"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
          <input
            disabled={isSubmitting}
            type="checkbox"
            id="rxRequired"
            checked={product.rxRequired}
            onChange={(e) => setProduct({...product, rxRequired: e.target.checked})}
            className="w-5 h-5 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
          />
          <label htmlFor="rxRequired" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">Prescription Required (Rx)</label>
        </div>

        <div className="pt-4 flex space-x-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors uppercase text-xs tracking-widest disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200 uppercase text-xs tracking-widest disabled:opacity-70 flex items-center justify-center space-x-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            <span>{isSubmitting ? 'Saving...' : submitLabel}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default Products;
