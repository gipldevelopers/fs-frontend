"use client";

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { apiService } from '@/app/lib/api';
import Image from 'next/image';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03
    }
  }
};

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const highlightVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "backOut"
    }
  }
};

// Split text into letters for animation
const splitText = (text) => {
  return text.split('').map((char, index) => (
    <motion.span
      key={index}
      variants={letterVariants}
      className="inline-block"
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  ));
};

// Animated Title Component
const AnimatedTitle = () => {
  const title = "Our Security Services";
  const highlight = "Security";
  
  const parts = title.split(highlight);
  
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true, margin: "-30px" }}
      className="inline-block"
    >
      {/* First part */}
      {splitText(parts[0])}
      
      {/* Highlighted part */}
      <motion.span 
        variants={highlightVariants}
        className="text-white inline-block"
      >
        {splitText(highlight)}
      </motion.span>
      
      {/* Second part if exists */}
      {parts[1] && splitText(parts[1])}
    </motion.span>
  );
};

export default function ServicesSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const carouselRef = useRef(null);
  const autorotateTiming = 5000;

  // Fetch services from API
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getAdminServices();
      
      if (response.success) {
        setServices(response.data);
      } else {
        setError(response.error || 'Failed to load services');
      }
    } catch (error) {
      console.error('💥 Error fetching services:', error);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // Update cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1); // 1 card on mobile
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2); // 2 cards on tablet
      } else {
        setCardsPerView(3); // 3 cards on desktop
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Calculate card width and translate percentage
  const cardWidthPercentage = 100 / cardsPerView;
  const translateX = currentIndex * cardWidthPercentage;

  // Auto-slide for right to left infinite carousel
  useEffect(() => {
    if (isDragging || services.length === 0) return; // Pause auto-slide when dragging or no services
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, autorotateTiming);

    return () => clearInterval(interval);
  }, [isDragging, services.length]);

  // Drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type.includes('mouse') ? e.clientX : e.touches[0].clientX);
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;
    
    const endX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    // Minimum drag distance to trigger slide change
    if (Math.abs(diffX) > 50 && services.length > 0) {
      if (diffX > 0) {
        // Drag left - next slide
        setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
      } else {
        // Drag right - previous slide
        setCurrentIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length);
      }
    }
    
    setIsDragging(false);
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-');
  };

  // Duplicate services for seamless infinite loop
  const duplicatedServices = services.length > 0 ? [...services, ...services, ...services] : [];

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-white/20 rounded w-80 mx-auto"></div>
            </div>
          </div>

          {/* Loading Carousel */}
          <div className="relative overflow-hidden">
            <div className="flex py-2 sm:py-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex-shrink-0 px-2 sm:px-3"
                  style={{ 
                    width: `${cardWidthPercentage}%`,
                    minWidth: `${cardWidthPercentage}%`
                  }}
                >
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 sm:p-6 shadow-lg flex flex-col h-full animate-pulse">
                    <div className="h-12 bg-white/20 rounded w-12 mb-4"></div>
                    <div className="h-6 bg-white/20 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-5/6 mb-4"></div>
                    <div className="h-10 bg-white/20 rounded w-32 mt-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="w-2 h-2 sm:w-3 sm:h-3 bg-white/20 rounded-full"></div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <div className="h-12 bg-white/20 rounded w-40 mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-montserrat mb-4">
            Our Security Services
          </h2>
          <p className="text-gray-200 text-sm sm:text-base max-w-2xl mx-auto mb-6">
            {error}
          </p>
          <button
            onClick={fetchServices}
            className="rounded-md px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#1f8fce] hover:bg-gray-100 transition-all duration-300 inline-flex items-center text-sm sm:text-base font-semibold"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white font-montserrat mb-4">
            Our Security Services
          </h2>
          <p className="text-gray-200 text-sm sm:text-base max-w-2xl mx-auto mb-6">
            No services available at the moment. Please check back later.
          </p>
          <Link
            href="/contact"
            className="rounded-md px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#1f8fce] hover:bg-gray-100 transition-all duration-300 inline-flex items-center text-sm sm:text-base font-semibold"
          >
            Contact Us
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white font-montserrat mb-4">
            <AnimatedTitle />
          </h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-200 text-sm sm:text-base max-w-2xl mx-auto"
          >
            Comprehensive security solutions tailored to protect your business, home, and digital assets
          </motion.p>
        </div>

        {/* Infinite Carousel Container - Responsive */}
        <div 
          className="relative overflow-hidden"
          ref={carouselRef}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          <motion.div
            className="flex py-2 sm:py-4 select-none"
            animate={{ 
              x: `-${translateX}%`
            }}
            transition={{ 
              type: "tween", 
              ease: "easeInOut",
              duration: 0.6
            }}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {duplicatedServices.map((service, index) => (
              <div
                key={`${service.id}-${index}`}
                className="flex-shrink-0 px-2 sm:px-3"
                style={{ 
                  width: `${cardWidthPercentage}%`,
                  minWidth: `${cardWidthPercentage}%`
                }}
              >
                <ServiceCard
                  service={service}
                  cardsPerView={cardsPerView}
                  generateSlug={generateSlug}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pagination - Responsive */}
        <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Buttons Container - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8 sm:mt-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* View All Services Button - Primary */}
            <Link
              href="/services"
              className="rounded-md px-6 sm:px-8 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-white border-white text-[#1f8fce] hover:bg-[#1f8fce] hover:border-white hover:text-white transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base w-full sm:w-auto min-w-[140px]"
            >
              <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-[#1f8fce] top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
              <span className="relative transition duration-300 ease font-semibold">
                View All Services
              </span>
            </Link>

            {/* Contact Button - Secondary/Outline */}
            <Link
              href="/contact"
              className="rounded-md px-6 sm:px-8 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium border-white text-white bg-transparent hover:bg-white hover:text-[#1f8fce] transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base w-full sm:w-auto min-w-[140px]"
            >
              <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
              <span className="relative transition duration-300 ease font-semibold">
                Contact Us
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ServiceCard component - Responsive
const ServiceCard = ({ service, cardsPerView, generateSlug }) => {
  return (
    <motion.div
      whileHover={{ 
        y: cardsPerView === 1 ? -5 : -10, // Smaller lift on mobile
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 sm:p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer shadow-lg flex flex-col h-full"
    >
      <div className="flex flex-col h-full">
        {/* Service Image */}
        <div className="relative w-full h-32 mb-3 sm:mb-4 rounded-lg overflow-hidden">
          {service.image_url ? (
            <Image
              src={service.image_url}
              alt={service.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-white/20 flex items-center justify-center rounded-lg">
              <span className="text-white text-2xl">🛡️</span>
            </div>
          )}
        </div>

        <div className="space-y-2 py-2 sm:py-4 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-white font-montserrat">{service.title}</h3>
          <p className="text-gray-200 text-xs sm:text-sm font-poppins leading-relaxed">
            {service.description}
          </p>
        </div>

        <div className="flex gap-3 border-t border-dashed border-white/30 pt-4 sm:pt-6 mt-auto">
          <Link
            href={`/services/${generateSlug(service.title)}`}
            className="inline-flex items-center gap-1 text-white font-medium hover:text-white border border-transparent px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-all duration-300 text-xs sm:text-sm font-poppins"
          >
            Learn More
            <ChevronRight className="ml-0 size-3 sm:size-3.5 opacity-70" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};