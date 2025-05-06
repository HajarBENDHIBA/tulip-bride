import Link from 'next/link';
import { FaFacebook, FaInstagram, FaPinterest, FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-[#FEFEF8] font-quicksand">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Section - Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Middle Section - Newsletter */}
              <div className="flex items-start justify-between text-left space-x-8">
                 {/* Logo image on the right */}
      <div className="flex-shrink-0 ml-12">
        <Image
          src="/logo.jpg"      // your logo file in /public
          alt="Wedding Dresses Logo"
          width={250}          // adjust as needed
          height={150}
          className="object-contain"
        />
      </div>
      <div className="flex-1 ml-24">
       <h3 className="text-xl font-semibold text-[#D8A7A7] mb-4">
         Subscribe to Our Newsletter
       </h3>
       <p className="text-gray-600 mb-4">
         Get the latest updates on new collections and exclusive offers
       </p>
       <div className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-4 border border-[#D8A7A7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
              />
              <button className="bg-[#B76E79] text-white px-6 py-3 mt-4 rounded-lg hover:bg-pink-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
          </div>
          
          {/* Right Side - Three Sections in One Line */}
          <div className="grid grid-cols-3 gap-6">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-pink-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-pink-600 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-gray-600 hover:text-pink-600 transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-pink-600 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Our Services</h3>
              <ul className="space-y-2">
                <li className="text-gray-600">Wedding Dress Fitting</li>
                <li className="text-gray-600">Custom Design</li>
                <li className="text-gray-600">Bridal Accessories</li>
                <li className="text-gray-600">Bridal Party Dresses</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-[#B76E79] mt-1" />
                  <span className="text-gray-600">123 Wedding Street, New York, NY 10001</span>
                </li>
                <li className="flex items-center space-x-3">
                  <FaPhone className="text-[#B76E79]" />
                  <span className="text-gray-600">+212 762-752-337</span>
                </li>
                <li className="flex items-center space-x-3">
                  <FaEnvelope className="text-[#B76E79]" />
                  <span className="text-gray-600">info@tulipbride.com</span>
                </li>
                <li className="flex items-center space-x-3">
                  <FaClock className="text-[#B76E79]" />
                  <span className="text-gray-600">Mon-Sat: 10AM - 7PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

            <div className="my-8 flex justify-center space-x-4">
              <a href="#" className="text-[#D8A7A7] hover:text-pink-600 transition-colors">
                <FaFacebook className="h-7 w-7" />
              </a>
              <a href="#" className="text-[#D8A7A7] hover:text-pink-600 transition-colors">
                <FaInstagram className="h-7 w-7" />
              </a>
              <a href="#" className="text-[#D8A7A7] hover:text-pink-600 transition-colors">
                <FaPinterest className="h-7 w-7" />
              </a>
            </div>
            
            

        {/* Bottom Section - Copyright and Additional Links */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Wedding Dresses. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <Link href="/privacy" className="text-gray-600 hover:text-pink-600 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#B76E79]">•</span>
            <div className="flex items-center">
              <span className="text-gray-600">Made with</span>
              <FaHeart className="mx-1 text-[#B76E79]" />
              <span className="text-gray-600">in New York</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 