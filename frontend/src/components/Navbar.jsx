import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart } from 'react-icons/fa';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  return (
    <nav className="bg-[#FCFCFC] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src="/logo.jpg"
                alt="Your Brand Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-[#B76E79] px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-[#B76E79] px-3 py-2 rounded-md text-sm font-medium">
              About Us
            </Link>
            <Link href="/shop" className="text-gray-600 hover:text-[#B76E79] px-3 py-2 rounded-md text-sm font-medium">
              Shop
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#B76E79] px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-gray-600 hover:text-[#B76E79]">
              <FaShoppingCart className="h-6 w-6" />
            </Link>
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 