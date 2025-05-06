import Link from 'next/link';

const weddingShoes = [
  {
    id: 1,
    name: "Pearl Bridal Pumps",
    price: 120,
    image: "./shoes/shoe1.jpg",
    description: "Graceful pumps adorned with pearls, perfect for a luxurious bridal look."
  },
  {
    id: 2,
    name: "Low-Heel Bridal Pumps",
    price: 90,
    image: "./shoes/shoe2.jpg",
    description: "Delicate and comfortable, ideal for brides who plan to celebrate all day."
  },
  {
    id: 3,
    name: "Tulle Bridal Pumps",
    price: 100,
    image: "./shoes/shoe3.jpg",
    description: "Soft tulle accents for a fairytale-inspired wedding moment."
  },
  {
    id: 4,
    name: "Embroidered Bridal Pumps",
    price: 200,
    image: "./shoes/shoe4.jpg",
    description: "Intricate embroidery to complement the finest wedding dresses."
  },
  {
    id: 5,
    name: "Crystal Bridal Pumps",
    price: 180,
    image: "./shoes/shoe5.jpg",
    description: "Sparkling pumps to light up every step down the aisle."
  },
  {
    id: 6,
    name: "Crystal-Kissed Pumps",
    price: 160,
    image: "./shoes/shoe6.jpg",
    description: "Delicate crystals add just the right sparkle for a refined bridal glow."
  },
  {
    id: 7,
    name: "Brilliant Bridal Pumps",
    price: 200,
    image: "./shoes/shoe7.jpg",
    description: "Fully embellished with shimmer, perfect for a dazzling bridal entrance."
  },
  {
    id: 8,
    name: "Minimal Chic Pumps",
    price: 130,
    image: "./shoes/shoe8.jpg",
    description: "Sleek white pumps with a clean design for the modern minimalist bride."
  },
  {
    id: 9,
    name: "Lace Bridal Pumps",
    price: 150,
    image: "./shoes/shoe9.jpg",
    description: "Romantic lace-covered heels to match the charm of your wedding gown."
  },
];

export default function WeddingShoesPage() {
  // Split into rows of 3
  const rows = [];
  for (let i = 0; i < weddingShoes.length; i += 3) {
    rows.push(weddingShoes.slice(i, i + 3));
  }

  return (
    <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/shop" className="text-[#B76E79] hover:text-pink-700">
            ← Back to Categories
          </Link>
        </div>

        <h1 className="text-4xl font-serif font-bold text-center text-[#6E6E6E] mb-12 leading-tight">Bridal Shoes</h1>

        {/* Loop through rows of 3 */}
        {rows.map((row, index) => (
          <div key={index} className="flex justify-between gap-6 mb-8">
            {row.map((shoe) => (
              <div key={shoe.id} className="w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="h-150 bg-gray-200"
                  style={{ backgroundImage: `url(${shoe.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{shoe.name}</h2>
                  <p className="text-gray-600 mb-4">{shoe.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#B76E79]">${shoe.price}</span>
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
