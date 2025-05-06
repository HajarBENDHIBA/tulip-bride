import Link from 'next/link';

const weddingGowns = [
  {
    id: 1,
    name: "Royal Grace",
    price: 1900,
    image: "./dresses/dress1.jpg",
    description: "A luxurious satin gown with long sleeves and a flowing train, perfect for a regal entrance."
  },
  {
    id: 2,
    name: "Ivory Dream",
    price: 1500,
    image: "./dresses/dress2.jpg",
    description: "A pure white crepe gown with soft draping and a modest silhouette for timeless elegance."
  },
  {
    id: 3,
    name: "Pearl Bloom",
    price: 1350,
    image: "./dresses/dress3.jpg",
    description: "Embellished with delicate pearls and lace, this dress radiates soft romance and elegance."
  },
  {
    id: 4,
    name: "Snow Radiance",
    price: 800,
    image: "./dresses/dress4.jpg",
    description: "A satin gown in bright white with a smooth finish, perfect for a sleek and graceful appearance."
  },
  {
    id: 5,
    name: "Diamond Whisper",
    price: 880,
    image: "./dresses/dress5.jpg",
    description: "Soft tulle and hand-beaded details offer a dreamy, fairytale-like look."
  },
  {
    id: 6,
    name: "Cloud Belle",
    price: 900,
    image: "./dresses/dress6.jpg",
    description: "A white organza dress with light layers and airy movement, ideal for a romantic bridal look."
  },
  {
    id: 7,
    name: "Moonlight Charm",
    price: 380,
    image: "./dresses/dress7.jpg",
    description: "A sleek, high-neck silhouette with subtle sparkle, designed for modern brides."
  },
  {
    id: 8,
    name: "Silk Serenity",
    price: 300,
    image: "./dresses/dress8.jpg",
    description: "Minimalist silk design with clean lines and a graceful flow, perfect for a timeless look."
  },
  {
    id: 9,
    name: "Vintage Empress",
    price: 400,
    image: "./dresses/dress9.jpg",
    description: "Inspired by classic designs with lace overlays and covered buttons for an antique feel."
  }
];

export default function WeddingGownsPage() {
  // Split into rows of 3
  const rows = [];
  for (let i = 0; i < weddingGowns.length; i += 3) {
    rows.push(weddingGowns.slice(i, i + 3));
  }

  return (
    <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/shop" className="text-[#B76E79] hover:text-pink-700">
            ← Back to Categories
          </Link>
        </div>

        <h1 className="text-4xl font-serif font-bold text-center text-[#6E6E6E] mb-12 leading-tight">Bridal Gowns</h1>

        {/* Loop through rows of 3 */}
        {rows.map((row, index) => (
          <div key={index} className="flex justify-between gap-6 mb-8">
            {row.map((dress) => (
              <div key={dress.id} className="w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="h-150 bg-gray-200"
                  style={{ backgroundImage: `url(${dress.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{dress.name}</h2>
                  <p className="text-gray-600 mb-4">{dress.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#B76E79]">${dress.price}</span>
                    <button className="bg-[#B76E79] text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors">
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
