"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // WhatsApp redirect function
  const handleWhatsAppClick = () => {
    const phoneNumber = '6351457958';
    const message = 'Hello, I would like to get more information about your services.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Hamburger icon variants for animation
  const topLineVariants = {
    open: { rotate: 45, y: 7 },
    closed: { rotate: 0, y: 0 }
  };

  const middleLineVariants = {
    open: { opacity: 0 },
    closed: { opacity: 1 }
  };

  const bottomLineVariants = {
    open: { rotate: -45, y: -7 },
    closed: { rotate: 0, y: 0 }
  };

  // Mobile menu variants
  const mobileMenuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  // Changed to bottom-to-top animation
  const menuItemVariants = {
    closed: { 
      y: 20, 
      opacity: 0,
      scale: 0.95
    },
    open: { 
      y: 0, 
      opacity: 1,
      scale: 1
    }
  };

  // Navigation Items Array (used for both menus)
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/client", label: "Our Client" },
    // { href: "/blogs", label: "Blogs" },
    // New Gallery Link
    { href: "/gallery", label: "Gallery" }, 
  ];

  // Helper function to check if a link is active
  const isActive = (href) => {
    // Special handling for the root path
    if (href === "/") {
      return pathname === href;
    }
    // Check if the current pathname starts with the item's href for nested routes
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-500 ${
            isScrolled ? 'h-16' : 'h-20'
          }`}>
            {/* Logo - UPDATED WITH WHITE VERSION FOR TRANSPARENT NAV */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className={`relative transition-all duration-300 ${
                isScrolled ? 'w-32 h-10' : 'w-40 h-12'
              }`}>
                {/* Show white logo when navbar is transparent, colored logo when scrolled */}
                {!isScrolled ? (
                  // White version for transparent navbar
                  <div className="relative w-full h-full">
                    {/* White background for logo */}
                    <div className="absolute inset-0 bg-white/90 rounded-lg backdrop-blur-sm"></div>
                    <Image
                      src="/images/logo2.png"
                      alt="Forever Security"
                      fill
                      className="object-contain mix-blend-multiply"
                      priority
                    />
                  </div>
                ) : (
                  // Normal colored logo for white navbar
                  <Image
                    src="/images/logo2.png"
                    alt="Forever Security"
                    fill
                    className="object-contain transition-transform duration-300"
                    priority
                  />
                )}
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const active = isActive(item.href); // <-- Check active status
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                      // Apply active styles or default hover styles
                      active
                        ? 'text-[#1f8fce]' // Active Text Color
                        : isScrolled 
                          ? 'text-gray-800 hover:text-[#1f8fce]' 
                          : 'text-white hover:text-blue-200'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {/* Active/Hover Underline */}
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                      // If active, always show the underline (w-full)
                      active 
                        ? 'w-full bg-[#1f8fce]' 
                        : isScrolled ? 'bg-[#1f8fce]' : 'bg-white'
                    }`}></span>
                  </Link>
                );
              })}

              {/* Contact Us Button (formerly "Free Enquiry") */}
              <Link 
                href="/contact" 
                className={`rounded-md px-5 py-2.5 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium transition-all duration-300 ${
                  isActive("/contact") // <-- Check active for button
                    ? 'bg-[#1f8fce] border-[#1f8fce] text-white' // Active style
                    : isScrolled 
                      ? 'bg-[#1f8fce] border-[#1f8fce] text-white hover:bg-transparent hover:border-[#1f8fce] hover:text-[#1f8fce]'
                      : 'bg-white/20 border-white text-white hover:bg-white hover:text-white backdrop-blur-sm'
                }`}
              >
                <span className={`absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease ${
                  isScrolled ? 'bg-white' : 'bg-[#1f8fce]'
                }`}></span>
                <span className="relative transition duration-300 ease font-medium text-sm">
                  Contact Us
                </span>
              </Link>
            </div>

            {/* Mobile menu button with animated hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                  isScrolled 
                    ? 'text-gray-800 hover:text-[#1f8fce] hover:bg-gray-100' 
                    : 'text-white hover:text-blue-200 hover:bg-white/20'
                }`}
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 flex flex-col justify-between">
                  <motion.div
                    variants={topLineVariants}
                    animate={isOpen ? "open" : "closed"}
                    className="w-full h-0.5 bg-current rounded-full origin-center"
                  />
                  <motion.div
                    variants={middleLineVariants}
                    animate={isOpen ? "open" : "closed"}
                    className="w-full h-0.5 bg-current rounded-full"
                  />
                  <motion.div
                    variants={bottomLineVariants}
                    animate={isOpen ? "open" : "closed"}
                    className="w-full h-0.5 bg-current rounded-full origin-center"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating WhatsApp Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        aria-label="Contact us on WhatsApp"
      >
        {/* WhatsApp Icon */}
        <svg 
          className="w-7 h-7 text-white" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.248-6.189-3.515-8.452"/>
        </svg>
        
        {/* Pulse animation */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </motion.button>

      {/* Offcanvas Mobile Menu - COMPLETELY FIXED */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            
            {/* Mobile Menu Panel - NO SCROLLBAR */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl z-50 md:hidden flex flex-col"
              style={{ overflow: 'hidden' }}
            >
              {/* Header with Logo - UPDATED FOR HORIZONTAL LOGO */}
              <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                    <div className="relative w-40 h-12">
                      <Image
                        src="/images/logo2.png"
                        alt="Forever Security"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </Link>
                  
                  {/* Close button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Menu Items - NO SCROLLBAR & BOTTOM-TO-TOP ANIMATION */}
              <div 
                className="flex-1 py-6 px-4"
                style={{ 
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <nav className="space-y-2">
                  {navItems.map((item, index) => {
                    const active = isActive(item.href); // <-- Check active status
                    return (
                      <motion.div
                        key={item.href}
                        variants={menuItemVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ 
                          delay: index * 0.1,
                          duration: 0.4,
                          ease: "easeOut"
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300 group ${
                            // Apply active styles
                            active 
                              ? 'text-white bg-[#1f8fce]' // Active Background and Text
                              : 'text-gray-700 hover:text-[#1f8fce] hover:bg-blue-50' // Default Hover Styles
                          }`}
                        >
                          <span className="relative">
                            {item.label}
                            {/* Active/Hover Underline (Only visible on hover if not active) */}
                            <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                              active ? 'w-full bg-white' : 'w-0 bg-[#1f8fce] group-hover:w-full'
                            }`}></span>
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Footer with CTA Button */}
              <div className="p-6 border-t border-gray-200 flex-shrink-0">
                <motion.div
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  transition={{ delay: 0.6 }}
                  className="flex justify-start"
                >
                  {/* Updated Link to /contact and text to "Contact Us" */}
                  <Link
                    href="/contact" 
                    onClick={() => setIsOpen(false)}
                    className={`rounded-md px-4 py-2.5 overflow-hidden relative group cursor-pointer border-2 font-medium transition-all duration-300 inline-flex items-center justify-center text-sm ${
                      isActive("/contact") // <-- Check active for button
                        ? 'bg-[#1f8fce] border-[#1f8fce] text-white' // Active style
                        : 'bg-[#1f8fce] border-[#1f8fce] text-white hover:bg-transparent hover:text-[#1f8fce]'
                    }`}
                  >
                    <span className="absolute w-48 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-16 bg-white top-1/2 group-hover:h-48 group-hover:-translate-y-24 ease"></span>
                    <span className="relative transition duration-300 ease font-medium">
                      Contact Us
                    </span>
                  </Link>
                </motion.div>
                
                {/* Contact Info */}
                <motion.div
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  transition={{ delay: 0.7 }}
                  className="mt-4 text-left text-sm text-gray-600"
                >
                  <p>24/7 Support Available</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}