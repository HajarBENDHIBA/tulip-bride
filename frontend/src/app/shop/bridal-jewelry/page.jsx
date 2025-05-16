'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function WeddingJewelryPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.jewelry || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Split into rows of 3
  const rows = [];
  for (let i = 0; i < products.length; i += 3) {
    rows.push(products.slice(i, i + 3));
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">Loading...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/shop" className="text-[#B76E79] hover:text-pink-700">
            ← Back to Categories
          </Link>
        </div>

        <h1 className="text-4xl font-serif font-bold text-center text-[#6E6E6E] mb-12 leading-tight">Bridal Jewelry</h1>

        {/* Loop through rows of 3 */}
        {rows.map((row, index) => (
          <div key={index} className="flex justify-between gap-6 mb-8">
            {row.map((jewelry) => (
              <div key={jewelry.id} className="w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="h-150 bg-gray-200"
                  style={{ backgroundImage: `url(${jewelry.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{jewelry.name}</h2>
                  <p className="text-gray-600 mb-4">{jewelry.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#B76E79]">${jewelry.price}</span>
                    <button 
                      onClick={() => addToCart(jewelry)}
                      className="bg-[#B76E79] text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}

