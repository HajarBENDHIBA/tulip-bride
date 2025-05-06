import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
      {/* Background Image */}
      <div className="relative w-full h-[500px] group overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30 z-0" /> {/* Darker Overlay */}

        <Image
          src="/home.jpg" // make sure this image is in /public folder
          alt="Bridal Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="transition-all duration-300 ease-in-out group-hover:brightness-100 group-hover:scale-110 transform"
          priority
        />
        
        {/* Discount Badge */}
        <div className="absolute top-4 right-4 bg-[#D8A7A7] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md z-10">
          25% OFF
        </div>

        {/* Parallax Effect (Add scrolling effect on the image) */}
        <div className="absolute inset-0 bg-fixed bg-cover bg-center z-0" style={{ backgroundImage: "url('/home.jpg')" }} />
        
{/* Text on Image */}
<div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-6">
  <div className="bg-transparent backdrop-blur-md p-8 rounded-xl border-opacity-30 max-w-4xl">
    <h1 className="text-5xl md:text-6xl font-serif text-white font-semibold leading-tight text-shadow-md">
      Your Dream Bridal Look Awaits
    </h1>
    <p className="text-lg md:text-xl text-white mt-4 opacity-80 max-w-xl mx-auto">
      Step into the perfect dress, shoes, and flowers for your unforgettable day. Discover elegance like never before.
    </p>
  </div>
</div>


      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 fade-in">
        <div className="max-w-2xl text-left space-y-8 bg-white bg-opacity-80 p-8 rounded-lg shadow-xl">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#EED9D0] rounded-full"></div>
            <span className="text-[#7A5C58] uppercase tracking-widest font-semibold">
             Tulip Bride
            </span>
          </div>

       {/* Heading */}
<h1 className="text-5xl md:text-6xl font-serif text-[#4D3925] leading-tight text-gradient bg-clip-text">
  Everything You Need for Your Special Day
</h1>

{/* Subheading */}
<h2 className="text-md uppercase text-gray-500 tracking-wider">
  Exclusive Weekend Sale
</h2>

{/* Date */}
<p className="text-gray-600 font-medium">Celebrate Love with Exclusive Savings</p>

{/* Description */}
<p className="text-gray-500 max-w-md">
  Discover a curated collection of bridal essentials, designed to make your wedding day truly unforgettable.
</p>

{/* CTA Button */}
<Link href="/shop" legacyBehavior>
  <a className="inline-block bg-[#D8A7A7] text-white px-6 py-3 rounded-md shadow-lg hover:shadow-xl hover:bg-[#c28e8e] transition duration-300 ease-in-out transform hover:scale-105">
    Shop the Collection
  </a>
</Link>

        </div>
      </div>
    </main>
  );
}
