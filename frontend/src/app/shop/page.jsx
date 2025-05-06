import Link from 'next/link';

export default function Shop() {
  const categories = [
    {
      name: "Bridal Gowns",
      image: "/gowns1.jpg",
      description: "Stunning gowns for your perfect day",
      link: "/shop/bridal-gowns"
    },
    {
      name: "Bridal Shoes",
      image: "/shoes.jpg",
      description: "Chic and comfortable bridal shoes",
      link: "/shop/bridal-shoes"
    },
    {
      name: "Bridal Flowers",
      image: "./flowers/flower3.jpg",
      description: "Fresh, elegant blooms for every bride",
      link: "/shop/bridal-flowers"
    },
    {
      name: "Bridal Jewelry",
      image: "./jewelry.jpg",
      description: "Timeless jewelry to complete your look",
      link: "/shop/bridal-jewelry"
    }
  ];


  return (
    // <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white px-4 py-12">
    <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
      <h1 className="text-4xl font-serif font-bold text-center text-[#6E6E6E] mt-12 leading-tight">Our Categories</h1>

      <div className="w-full overflow-x-auto">
  <div className="flex flex-row flex-nowrap gap-6 my-18 w-max mx-auto">
          {categories.map((category) => (
            <Link 
              href={category.link}
              key={category.name}
              className="min-w-[350px] w-[300px] group"
            >
               <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative hover:shadow-xl transition-all transform group-hover:-translate-y-2 group-hover:scale-105 duration-300">
                <div 
                  className="h-96 bg-gray-200 relative"
                  style={{ backgroundImage: `url(${category.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                 {/* gradient overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 group-hover:from-black/40"></div>

{/* blur/glassmorphism hover effect */}
<div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

{/* Title */}
<h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white drop-shadow-lg tracking-wide">
  {category.name}
</h2>
</div>

<div className="p-4">
<p className="text-gray-600 text-lg leading-relaxed">{category.description}</p>
<div className="mt-4">
  <span className="inline-block text-sm uppercase tracking-widest text-[#6E6E6E] group-hover:text-black transition-colors">
    Explore →
  </span>
</div>
</div>
</div>
</Link>
))}
</div>
</div>
</main>
);
}
