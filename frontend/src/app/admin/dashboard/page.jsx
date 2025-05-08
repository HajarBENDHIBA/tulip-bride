'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { products } from '@/data/products';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeCategory, setActiveCategory] = useState('all');
  const [stats] = useState({
    totalOrders: 156,
    totalRevenue: 45678.90,
    totalUsers: 89,
    totalProducts: Object.values(products).flat().length
  });

  const [recentOrders] = useState([
    {
      id: 'ORD001',
      customer: 'Jane Doe',
      date: '2024-03-15',
      status: 'Delivered',
      total: 1299.99
    },
    {
      id: 'ORD002',
      customer: 'John Smith',
      date: '2024-03-14',
      status: 'Processing',
      total: 899.99
    }
  ]);

  // Combine all products into a single array with category information
  const [productsList] = useState(() => {
    const allProducts = [];
    Object.entries(products).forEach(([category, items]) => {
      items.forEach(item => {
        allProducts.push({
          ...item,
          category: category.charAt(0).toUpperCase() + category.slice(1)
        });
      });
    });
    return allProducts;
  });

  // Filter products based on active category
  const filteredProducts = activeCategory === 'all' 
    ? productsList 
    : productsList.filter(product => product.category.toLowerCase() === activeCategory);

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'flowers'
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (!token || !user) {
          router.push('/login');
          return;
        }

        if (user.role !== 'admin') {
          router.push('/user/dashboard');
          return;
        }

        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth check error:', err);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || activeTab !== 'orders') return;

      try {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Fetch orders error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated || activeTab !== 'users') return;

      try {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Fetch users error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated, activeTab]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setError('');
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update the order in the local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageUpload = async (file, category) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', category);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/products/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.imagePath;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');

      // Upload image first if there's a file
      let imagePath = newProduct.image;
      if (imagePreview) {
        const uploadedPath = await handleImageUpload(imagePreview, newProduct.category);
        if (!uploadedPath) return;
        imagePath = uploadedPath;
      }

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: newProduct.category,
          product: {
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            description: newProduct.description,
            image: imagePath
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      // Refresh products list
      const updatedProducts = await fetch('http://localhost:5000/api/products').then(res => res.json());
      setProductsList(Object.entries(updatedProducts).flatMap(([category, items]) => 
        items.map(item => ({ ...item, category: category.charAt(0).toUpperCase() + category.slice(1) }))
      ));

      setShowAddModal(false);
      setNewProduct({
        name: '',
        price: '',
        description: '',
        image: '',
        category: 'flowers'
      });
      setImagePreview(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProduct = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');

      // Upload new image if there's a file
      let imagePath = selectedProduct.image;
      if (imagePreview) {
        const uploadedPath = await handleImageUpload(imagePreview, selectedProduct.category.toLowerCase());
        if (!uploadedPath) return;
        imagePath = uploadedPath;
      }

      const response = await fetch(`http://localhost:5000/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: selectedProduct.category.toLowerCase(),
          product: {
            name: selectedProduct.name,
            price: parseFloat(selectedProduct.price),
            description: selectedProduct.description,
            image: imagePath
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // Refresh products list
      const updatedProducts = await fetch('http://localhost:5000/api/products').then(res => res.json());
      setProductsList(Object.entries(updatedProducts).flatMap(([category, items]) => 
        items.map(item => ({ ...item, category: category.charAt(0).toUpperCase() + category.slice(1) }))
      ));

      setShowEditModal(false);
      setSelectedProduct(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setError('');
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: product.category.toLowerCase()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Refresh products list
      const updatedProducts = await fetch('http://localhost:5000/api/products').then(res => res.json());
      setProductsList(Object.entries(updatedProducts).flatMap(([category, items]) => 
        items.map(item => ({ ...item, category: category.charAt(0).toUpperCase() + category.slice(1) }))
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold text-[#6E6E6E] mb-8">Admin Dashboard</h1>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b mb-8">
          <div className="flex space-x-8">
            <button
              className={`pb-4 ${
                activeTab === 'overview'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`pb-4 ${
                activeTab === 'products'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button
              className={`pb-4 ${
                activeTab === 'orders'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button
              className={`pb-4 ${
                activeTab === 'users'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
              <p className="text-3xl font-bold text-[#B76E79]">{orders.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
              <p className="text-3xl font-bold text-[#B76E79]">
                ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
              <p className="text-3xl font-bold text-[#B76E79]">{users.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-600">Total Products</h3>
              <p className="text-3xl font-bold text-[#B76E79]">{stats.totalProducts}</p>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Products</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-[#B76E79] text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Product
              </button>
            </div>

            {/* Category Tabs */}
            <div className="mb-6 border-b">
              <div className="flex space-x-4">
                <button
                  className={`pb-4 px-2 ${
                    activeCategory === 'all'
                      ? 'border-b-2 border-pink-600 text-pink-600'
                      : 'text-gray-600 hover:text-pink-600'
                  }`}
                  onClick={() => setActiveCategory('all')}
                >
                  All Products
                </button>
                <button
                  className={`pb-4 px-2 ${
                    activeCategory === 'flowers'
                      ? 'border-b-2 border-pink-600 text-pink-600'
                      : 'text-gray-600 hover:text-pink-600'
                  }`}
                  onClick={() => setActiveCategory('flowers')}
                >
                  Flowers
                </button>
                <button
                  className={`pb-4 px-2 ${
                    activeCategory === 'gowns'
                      ? 'border-b-2 border-pink-600 text-pink-600'
                      : 'text-gray-600 hover:text-pink-600'
                  }`}
                  onClick={() => setActiveCategory('gowns')}
                >
                  Gowns
                </button>
                <button
                  className={`pb-4 px-2 ${
                    activeCategory === 'shoes'
                      ? 'border-b-2 border-pink-600 text-pink-600'
                      : 'text-gray-600 hover:text-pink-600'
                  }`}
                  onClick={() => setActiveCategory('shoes')}
                >
                  Shoes
                </button>
                <button
                  className={`pb-4 px-2 ${
                    activeCategory === 'jewelry'
                      ? 'border-b-2 border-pink-600 text-pink-600'
                      : 'text-gray-600 hover:text-pink-600'
                  }`}
                  onClick={() => setActiveCategory('jewelry')}
                >
                  Jewelry
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 relative">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowEditModal(true);
                          }}
                          className="text-[#B76E79] hover:text-pink-700 mr-4"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      >
                        <option value="flowers">Flowers</option>
                        <option value="gowns">Gowns</option>
                        <option value="shoes">Shoes</option>
                        <option value="jewelry">Jewelry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setImagePreview(file);
                            setNewProduct({ ...newProduct, image: URL.createObjectURL(file) });
                          }
                        }}
                        className="mt-1 block w-full"
                      />
                      {newProduct.image && (
                        <div className="mt-2">
                          <img
                            src={newProduct.image}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setShowAddModal(false);
                          setImagePreview(null);
                        }}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddProduct}
                        disabled={uploading}
                        className="px-4 py-2 text-white bg-[#B76E79] rounded-md hover:bg-pink-700 disabled:opacity-50"
                      >
                        {uploading ? 'Uploading...' : 'Add Product'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Product Modal */}
            {showEditModal && selectedProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        value={selectedProduct.category.toLowerCase()}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      >
                        <option value="flowers">Flowers</option>
                        <option value="gowns">Gowns</option>
                        <option value="shoes">Shoes</option>
                        <option value="jewelry">Jewelry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={selectedProduct.name}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        value={selectedProduct.price}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={selectedProduct.description}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setImagePreview(file);
                            setSelectedProduct({ ...selectedProduct, image: URL.createObjectURL(file) });
                          }
                        }}
                        className="mt-1 block w-full"
                      />
                      {selectedProduct.image && (
                        <div className="mt-2">
                          <img
                            src={selectedProduct.image}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setShowEditModal(false);
                          setImagePreview(null);
                        }}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleEditProduct}
                        disabled={uploading}
                        className="px-4 py-2 text-white bg-[#B76E79] rounded-md hover:bg-pink-700 disabled:opacity-50"
                      >
                        {uploading ? 'Uploading...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
              </div>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold">Order #{order._id}</h3>
                      <p className="text-sm text-gray-600">
                        Customer: {order.user?.name || 'N/A'} ({order.user?.email || 'N/A'})
                      </p>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <p className="mt-1 font-semibold">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 mb-4">
                        <div className="relative w-20 h-20">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover rounded-md w-full h-full"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No orders found</p>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">User Management</h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
              </div>
            ) : users.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-[#B76E79] hover:text-pink-700 mr-4">
                            <FaEdit />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-600">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 