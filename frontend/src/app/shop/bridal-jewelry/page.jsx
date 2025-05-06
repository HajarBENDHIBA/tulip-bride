import Link from 'next/link';

const weddingJewelry = [
  {
    id: 1,
    name: "Royal Grace",
    price: 300,
    image: "./jewelry/jewelry1.jpg",
    description: "A regal set with crystal crown, teardrop earrings, and shimmering necklace."
  },
  {
    id: 2,
    name: "Petite Sparkle",
    price: 250,
    image: "./jewelry/jewelry2.jpg",
    description: "Delicate design featuring tiny crystal stones for subtle elegance."
  },
  {
    id: 3,
    name: "Diamond Whisper",
    price: 350,
    image: "./jewelry/jewelry3.jpg",
    description: "A subtle yet luxurious set with fine diamond-like accents."
  },
  {
    id: 4,
    name: "Crystal Radiance",
    price: 390,
    image: "./jewelry/jewelry4.jpg",
    description: "Sparkling crystals for a dazzling, luminous bridal statement."
  },
  {
    id: 5,
    name: "Amethyst Elegance",
    price: 420,
    image: "./jewelry/jewelry5.jpg",
    description: "A stunning set adorned with rich purple crystals for a royal touch."
  },
  {
    id: 6,
    name: "Vintage Luxe",
    price: 350,
    image: "./jewelry/jewelry6.jpg",
    description: "Old-world inspired set with antique finishes and timeless beauty."
  },
  {
    id: 7,
    name: "Golden Bloom",
    price: 290,
    image: "./jewelry/jewelry7.jpg",
    description: "Floral-inspired gold set adding warmth and elegance to your bridal look."
  },
  {
    id: 8,
    name: "Emerald Queen",
    price: 450,
    image: "./jewelry/jewelry8.jpg",
    description: "Bold emerald stones creating a majestic and unforgettable look."
  },
  {
    id: 9,
    name: "Pearl Empress",
    price: 360,
    image: "./jewelry/jewelry9.jpg",
    description: "Classic pearls woven into a delicate crown, earrings, and necklace ensemble."
  }
];



export default function WeddingJewelryPage() {
  // Split into rows of 3
  const rows = [];
  for (let i = 0; i < weddingJewelry.length; i += 3) {
    rows.push(weddingJewelry.slice(i, i + 3));
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
                  className="h-100 bg-gray-200"
                  style={{ backgroundImage: `url(${jewelry.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{jewelry.name}</h2>
                  <p className="text-gray-600 mb-4">{jewelry.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#B76E79]">${jewelry.price}</span>
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

