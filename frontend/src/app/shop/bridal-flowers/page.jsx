'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';

export default function WeddingFlowersPage() {
  const { addToCart } = useCart();
  
  // Split into rows of 3
  const rows = [];
  for (let i = 0; i < products.flowers.length; i += 3) {
    rows.push(products.flowers.slice(i, i + 3));
  }

  return (
    <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/shop" className="text-[#B76E79] hover:text-pink-700">
            ← Back to Categories
          </Link>
        </div>

        <h1 className="text-4xl font-serif font-bold text-center text-[#6E6E6E] mb-12 leading-tight">Bridal Flowers</h1>

        {/* Loop through rows of 3 */}
        {rows.map((row, index) => (
          <div key={index} className="flex justify-between gap-6 mb-8">
            {row.map((flower) => (
              <div key={flower.id} className="w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="h-150 bg-gray-200"
                  style={{ backgroundImage: `url(${flower.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{flower.name}</h2>
                  <p className="text-gray-600 mb-4">{flower.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#B76E79]">${flower.price}</span>
                    <button 
                      onClick={() => addToCart(flower)}
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


