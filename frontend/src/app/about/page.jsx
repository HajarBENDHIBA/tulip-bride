export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-t from-[#FEFEF8] to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main heading */}
        <h1 className="text-4xl font-serif font-bold text-center text-[#6E6E6E] mb-12 leading-tight">
          About Tulip Bride
        </h1>

        {/* Story section */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-[#4D3925]">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              At Tulip Bride, we believe every bride deserves to shine. Since 2024, we’ve dedicated ourselves to crafting unforgettable bridal moments, offering gowns and accessories that blend timeless elegance with modern flair.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our passionate team carefully curates each collection to help brides feel radiant, confident, and unique on their special day.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="./home.jpg"
              alt="Our bridal boutique"
              className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Mission / Vision / Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-[#4D3925] mb-4">Our Mission</h3>
            <p className="text-gray-700">
              To help every bride find her dream dress with exceptional service and handpicked designs.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-[#4D3925] mb-4">Our Vision</h3>
            <p className="text-gray-700">
              To be the ultimate bridal destination for elegant, personalized, and unforgettable experiences.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-[#4D3925] mb-4">Our Values</h3>
            <p className="text-gray-700">
              Quality, passion, attention to detail, and genuine care guide everything we do.
            </p>
          </div>
        </div>

        {/* Review Title */}
        <h2 className="text-3xl font-semibold text-[#4D3925] text-center mb-8">
          Client Reviews
        </h2>

        {/* Testimonial */}
        <div className="bg-[#FFF5F5] rounded-lg py-12 px-8 text-center max-w-3xl mx-auto shadow-md mb-20">
          <p className="italic text-gray-700 text-lg leading-relaxed">
            "Finding my dress at Tulip Bride was a dream come true. The team made me feel so special and truly understood my vision!"
          </p>
          <p className="mt-4 text-[#D8A7A7] font-semibold">— Emma R., Happy Bride</p>
        </div>
      </div>
    </main>
  );
}
