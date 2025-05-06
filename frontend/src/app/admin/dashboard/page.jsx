'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats] = useState({
    totalOrders: 156,
    totalRevenue: 45678.90,
    totalUsers: 89,
    totalProducts: 45
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

  const [products] = useState([
    {
      id: 1,
      name: 'Elegant Wedding Dress',
      category: 'Bridal Gowns',
      price: 1299.99,
      stock: 5,
      image: '/images/dress1.jpg'
    },
    {
      id: 2,
      name: 'Pearl Bridal Pumps',
      category: 'Bridal Shoes',
      price: 120.00,
      stock: 10,
      image: '/images/shoe1.jpg'
    }
  ]);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
              <p className="text-3xl font-bold text-[#B76E79]">{stats.totalUsers}</p>
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
              <button className="bg-[#B76E79] text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors flex items-center">
                <FaPlus className="mr-2" />
                Add Product
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.stock}</div>
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
                  {order.shippingAddress && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.street}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  )}
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">User management features will be implemented here.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 