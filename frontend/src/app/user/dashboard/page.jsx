'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function UserDashboard() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [confirmedOrderIds, setConfirmedOrderIds] = useState([]);
  
  // Set active tab from URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Fetch user data and orders
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please login to view your dashboard');
        }

        // Fetch user data
        const userResponse = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        setUser(userData);

        // Fetch orders
        const ordersResponse = await fetch('http://localhost:5000/api/orders/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }

        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileChange = async () => {
    try {
      setLoading(true);
      setError('');
      setUpdateSuccess(false);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to update your profile');
      }

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setUpdateSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setLoading(true);
      setError('');
      setUpdateSuccess(false);

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      if (passwordData.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to update your password');
      }

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: passwordData.newPassword
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update password');
      }

      setPasswordData({
        newPassword: '',
        confirmPassword: ''
      });
      setUpdateSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    try {
      setError('');
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete order');
      }
      // Refresh orders list
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }
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
      const productsResponse = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!productsResponse.ok) {
        throw new Error('Failed to fetch updated products');
      }

      const data = await productsResponse.json();
      const allProducts = [];
      Object.entries(data).forEach(([category, items]) => {
        items.forEach(item => {
          allProducts.push({
            ...item,
            category: category.charAt(0).toUpperCase() + category.slice(1)
          });
        });
      });
      setProductsList(allProducts);
      setStats(prev => ({ ...prev, totalProducts: allProducts.length }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmOrder = (orderId) => {
    setConfirmedOrderIds((prev) => [...prev, orderId]);
  };

  const generateWhatsappMessage = () => {
    if (!user) return '';
    let message = `Hello, my name is ${user.name} and my email is ${user.email}.%0A`;
    const confirmedOrders = orders.filter(order => confirmedOrderIds.includes(order._id));
    if (confirmedOrders.length === 0) {
      message += 'I have no confirmed orders yet.';
    } else {
      confirmedOrders.forEach((order, idx) => {
        message += `Here is my confirmed order:%0A`;
        order.items.forEach(item => {
          message += `- ${item.name} x${item.quantity} ($${item.price.toFixed(2)} each)%0A`;
        });
        message += `Total: $${order.total.toFixed(2)}%0A`;
        message += '%0A';
      });
      message += 'Thank you!';
    }
    return message;
  };
  const whatsappNumber = '212762752337';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${generateWhatsappMessage()}`;

  if (loading && !user) {
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

  if (error && !user) {
    return (
      <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold text-[#6E6E6E] mb-8">My Dashboard</h1>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {updateSuccess && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success: </strong>
            <span className="block sm:inline">Profile updated successfully!</span>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b mb-8">
          <div className="flex space-x-8">
            <button
              className={`pb-4 ${activeTab === 'overview' ? 'border-b-2 border-pink-600 text-pink-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`pb-4 ${activeTab === 'orders' ? 'border-b-2 border-pink-600 text-pink-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button
              className={`pb-4 ${activeTab === 'profile' ? 'border-b-2 border-pink-600 text-pink-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                </div>
              ) : orders.length > 0 ? (
                <>
                  {orders.slice(0, 2).map((order) => (
                    <div key={order._id} className="border-b py-4 last:border-b-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Order #{order._id}</p>
                          <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  <Link href="/user/dashboard?tab=orders" className="text-[#B76E79] hover:text-pink-700 text-sm">
                    View all orders →
                  </Link>
                </>
              ) : (
                <p className="text-gray-600">No orders found</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {user.name}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <Link href="/user/dashboard?tab=profile" className="text-[#B76E79] hover:text-pink-700 text-sm">
                    Edit profile →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors ${confirmedOrderIds.length === 0 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                tabIndex={confirmedOrderIds.length === 0 ? -1 : 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0 5.385 4.365 9.75 9.75 9.75 1.7 0 3.29-.425 4.68-1.17l3.57 1.02a.75.75 0 00.93-.93l-1.02-3.57A9.708 9.708 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12z" />
                </svg>
                Contact us on WhatsApp
              </a>
            </div>
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
                      <p className="text-sm text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                      {confirmedOrderIds.includes(order._id) && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Confirmed</span>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span>
                      <p className="mt-1 font-semibold">${order.total.toFixed(2)}</p>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 text-xs"
                        disabled={loading}
                      >
                        {loading ? 'Deleting...' : 'Delete Order'}
                      </button>
                      {!confirmedOrderIds.includes(order._id) && (
                        <button
                          onClick={() => handleConfirmOrder(order._id)}
                          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 text-xs"
                        >
                          Confirm Order
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 my-2">
                        <div className="relative w-20 h-20 my-2">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
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
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-600">No orders found</p>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl space-y-8">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                  <button
                    onClick={handleProfileChange}
                    disabled={loading}
                    className="bg-[#B76E79] text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    placeholder="Enter new password"
                  />
                  <p className="mt-1 text-sm text-gray-500">Password must be at least 6 characters long</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="bg-[#B76E79] text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
