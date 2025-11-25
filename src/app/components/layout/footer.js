import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Image from 'next/image'; // Import Image for the logo

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:py-12 lg:px-8">
        {/* Main Footer Content - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          
          {/* Company Info - Column 1 (Spans full width on mobile) */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex flex-col space-y-4">
              {/* Logo/Brand */}
              <h3 className="text-xl sm:text-2xl font-bold font-montserrat text-gray-900 mb-2">
                Forever Security
              </h3>
              
              <p className="text-gray-600 font-poppins text-sm leading-relaxed max-w-md">
                Your trusted, licensed partner in security solutions across Gujarat. Protecting what matters most with trained personnel and a proactive approach.
              </p>

              {/* Social Links */}
              <div className="flex space-x-3 sm:space-x-4 mt-4">
                <a 
                  href="#" 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-[#1f8fce] hover:scale-110 transition-all duration-300 border border-gray-200 shadow-sm group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-[#1f8fce] hover:scale-110 transition-all duration-300 border border-gray-200 shadow-sm group"
                  aria-label="X (Twitter)"
                >
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-[#1f8fce] hover:scale-110 transition-all duration-300 border border-gray-200 shadow-sm group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-[#1f8fce] hover:scale-110 transition-all duration-300 border border-gray-200 shadow-sm group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links - Column 2 */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-semibold font-montserrat text-gray-900 mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/services" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/gallery" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Gallery
                </Link>
              </li>
              {/* <li>
                <Link 
                  href="/blogs" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Blogs
                </Link>
              </li> */}
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services - Column 3 */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-semibold font-montserrat text-gray-900 mb-4 sm:mb-6">Our Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link 
                  href="/services/commercial-security" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Commercial Security
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/residential-security" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Residential Security
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/event-security" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Event & Private Security
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/tech-driven" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Tech-Driven Security
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/investigation" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Private Investigation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Column 4 */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold font-montserrat text-gray-900 mb-4 sm:mb-6">Contact Info</h4>
            <ul className="space-y-3 text-gray-600 font-poppins text-sm sm:text-base">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#1f8fce] mt-0.5 flex-shrink-0" />
                <span className="break-words">246/B, Purusangit Bunglow, Sector 7a, Gandhinagar, Gujarat-382007</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#1f8fce] flex-shrink-0" />
                <span>+91 76008 04331</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#1f8fce] flex-shrink-0" />
                <span>+91 99049 70408</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#1f8fce] flex-shrink-0" />
                <span className="break-all">hr.foreversec@gmail.com</span>
              </li>
              {/* Removed 24/7 Support line as requested */}
            </ul>
          </div>
        </div>

        {/* Bottom Footer - Responsive Layout */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-300">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 text-center sm:text-left">
            {/* Left Side - Copyright */}
            <div className="text-gray-600 font-poppins text-xs sm:text-sm">
              &copy; {currentYear} Forever Security Services. All rights reserved.
            </div>

            {/* Right Side - Powered By with Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3 text-gray-600 font-poppins text-xs sm:text-sm">
              <span>Powered by:</span>
              {/* GIPL Logo Link */}
              <a 
                href="https://gohilinfotech.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Gohil Infotech Logo"
                className="flex items-center hover:opacity-80 transition-opacity duration-300"
              >
                <Image
                  src="/images/gipl-logo.png"
                  alt="Gohil Infotech Logo"
                  width={80}
                  height={30}
                  className="h-5 sm:h-6 w-auto object-contain"
                  priority={false}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}