'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Wedding Street, Bridal City, BC 12345'
  });
  const [orders, setOrders] = useState([]);
  
  // Fetch user data and orders (replace with real API calls)
  useEffect(() => {
    // Simulate fetching user data and orders
    // You can replace this with an actual API call to fetch user data
    setUser({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1 234 567 8900',
      address: '123 Wedding Street, Bridal City, BC 12345'
    });

    setOrders([
      {
        id: 'ORD001',
        date: '2024-03-15',
        status: 'Delivered',
        total: 1299.99,
        items: [
          {
            name: 'Elegant Wedding Dress',
            image: '/images/dress1.jpg',
            quantity: 1,
            price: 1299.99
          }
        ]
      },
      {
        id: 'ORD002',
        date: '2024-04-20',
        status: 'Pending',
        total: 899.99,
        items: [
          {
            name: 'Bridal Shoes',
            image: '/images/shoes1.jpg',
            quantity: 1,
            price: 899.99
          }
        ]
      }
    ]);
  }, []);

  const handleProfileChange = () => {
    // Here you can update the user data via an API request
    alert('Profile updated!');
  };

  return (
    <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold text-[#6E6E6E] mb-8">My Dashboard</h1>

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
              {orders.slice(0, 2).map((order) => (
                <div key={order.id} className="border-b py-4 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
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
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {user.name}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Phone:</span> {user.phone}</p>
                <Link href="/user/dashboard?tab=profile" className="text-[#B76E79] hover:text-pink-700 text-sm">
                  Edit profile →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">Placed on {order.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.status}
                    </span>
                    <p className="mt-1 font-semibold">${order.total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="relative w-20 h-20">
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
            ))}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={user.address}
                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <button
                  onClick={handleProfileChange}
                  className="bg-[#B76E79] text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
