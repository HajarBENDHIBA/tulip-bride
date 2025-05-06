import Link from 'next/link';

const weddingFlowers = [
  {
    id: 1,
    name: "Peonies",
    price: 40,
    image: "./flowers/flower1.jpg",
    description: "Peonies bring romance and prosperity with lush, full blooms that add softness and charm."
  },
  {
    id: 2,
    name: "Hydrangeas",
    price: 60,
    image: "./flowers/flower2.jpg",
    description: "Hydrangeas express gratitude and heartfelt feelings with their delicate, voluminous petals."
  },
  {
    id: 3,
    name: "Tulips",
    price: 45,
    image: "./flowers/flower3.jpg",
    description: "Tulips represent perfect love, offering simple elegance and a chic, modern wedding touch."
  },
  {
    id: 4,
    name: "Lilies",
    price: 65,
    image: "./flowers/flower4.jpg",
    description: "Lilies add purity and beauty to weddings, with graceful shapes that stand out in every bouquet."
  },
  {
    id: 5,
    name: "Gypsophila",
    price: 50,
    image: "./flowers/flower5.jpg",
    description: "Gypsophila brings an airy, delicate touch, filling arrangements with lightness and subtle beauty."
  },
  {
    id: 6,
    name: "Cloves (Carnations)",
    price: 40,
    image: "./flowers/flower6.jpg",
    description: "Carnations show admiration and joy, adding vibrant color and rich texture to floral designs."
  },
  {
    id: 7,
    name: "Mix Flowers",
    price: 35,
    image: "./flowers/flower7.jpg",
    description: "A mix of flowers tells a unique love story, blending different shapes, colors, and feelings."
  },
  {
    id: 8,
    name: "Red Rose",
    price: 50,
    image: "./flowers/flower8.jpg",
    description: "Red Roses express deep love and passion, creating a bold, classic look for any wedding day."
  },
  {
    id: 9,
    name: "Daisy",
    price: 35,
    image: "./flowers/flower9.jpg",
    description: "Daisies bring freshness and joy with their cheerful, bright petals that light up any setting."
  }
];


export default function WeddingFlowersPage() {
  // Split into rows of 3
  const rows = [];
  for (let i = 0; i < weddingFlowers.length; i += 3) {
    rows.push(weddingFlowers.slice(i, i + 3));
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
                  className="h-130 bg-gray-200"
                  style={{ backgroundImage: `url(${flower.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{flower.name}</h2>
                  <p className="text-gray-600 mb-4">{flower.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#B76E79]">${flower.price}</span>
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


