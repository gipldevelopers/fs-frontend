"use client";

import React from "react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Removed API import - using hardcoded data only

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const highlightVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "backOut",
    },
  },
};

// Split text into letters for animation
const splitText = (text) => {
  return text.split("").map((char, index) => (
    <motion.span key={index} variants={letterVariants} className="inline-block">
      {char === " " ? "\u00A0" : char}
    </motion.span>
  ));
};

// Animated Title Component
const AnimatedTitle = () => {
  const title = "Trusted by Industry Leaders";
  const highlight = "Industry Leaders";

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
        className="text-[#1f8fce] inline-block"
      >
        {splitText(highlight)}
      </motion.span>

      {/* Line break after highlight on larger screens */}
      <br className="hidden lg:block" />

      {/* Second part if exists */}
      {parts[1] && (
        <>
          {/* Space between "Industry Leaders" and the rest, if any */}
          <span className="inline-block"> </span>
          {splitText(parts[1])}
        </>
      )}
    </motion.span>
  );
};

// Standalone ClientLogo component with React.memo to prevent unnecessary re-renders
const ClientLogo = React.memo(({ client }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const imgRef = useRef(null);

  // Preload image
  useEffect(() => {
    if (client.logo && !imageError && typeof window !== 'undefined') {
      const img = new window.Image();
      img.src = client.logo;
      img.onload = () => setImageLoading(false);
      img.onerror = () => {
        setImageError(true);
        setImageLoading(false);
      };
    }
  }, [client.logo, imageError]);

  if (!client.logo || imageError) {
    const initials = client.name
      ? client.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "CL";
    
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-[#1f8fce] to-blue-600 flex items-center justify-center mx-auto mb-4 flex-shrink-0 shadow-md">
        <span className="text-white font-bold text-xl sm:text-2xl">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white p-3 flex items-center justify-center mx-auto mb-4 flex-shrink-0 shadow-md border border-gray-100 relative">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#1f8fce] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={client.logo}
        alt={`${client.name} logo`}
        width={80}
        height={80}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        // Prevent image reload on swipe
        crossOrigin="anonymous"
      />
    </div>
  );
});

ClientLogo.displayName = 'ClientLogo';

// Standalone ClientCard component with React.memo
const ClientCard = React.memo(({ client }) => {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10,
        },
      }}
      className="flex flex-col h-full bg-white p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mx-2 border border-gray-100"
    >
      {/* Client Logo */}
      <ClientLogo client={client} />

      {/* Client Name */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-3 leading-tight">
        {client.name}
      </h3>

      {/* Client Description */}
      <p className="text-gray-600 text-sm sm:text-base text-center leading-relaxed">
        {client.description || "Trusted partner"}
      </p>
    </motion.div>
  );
});

ClientCard.displayName = 'ClientCard';

export default function OurClientsSection() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autorotate, setAutorotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const carouselRef = useRef(null);
  const autorotateTiming = 3000;

  // Real company logos from various sources
  const realClients = [
    {
      id: 1,
      name: "Microsoft",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Microsoft-Logo.png",
      description: "Technology and cloud computing"
    },
    {
      id: 2,
      name: "Google",
      logo: "https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png",
      description: "Search engine and technology"
    },
    {
      id: 3,
      name: "Amazon",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png",
      description: "E-commerce and cloud services"
    },
    {
      id: 4,
      name: "Apple",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
      description: "Consumer electronics"
    },
    {
      id: 5,
      name: "Tesla",
      logo: "https://logos-world.net/wp-content/uploads/2021/09/Tesla-Logo.png",
      description: "Electric vehicles and energy"
    },
    {
      id: 6,
      name: "Netflix",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png",
      description: "Streaming entertainment"
    },
    {
      id: 7,
      name: "Adobe",
      logo: "https://logos-world.net/wp-content/uploads/2020/07/Adobe-Logo.png",
      description: "Creative software solutions"
    },
    {
      id: 8,
      name: "Spotify",
      logo: "https://logos-world.net/wp-content/uploads/2020/09/Spotify-Logo.png",
      description: "Music streaming platform"
    },
    {
      id: 9,
      name: "Uber",
      logo: "https://logos-world.net/wp-content/uploads/2022/06/Uber-Logo.png",
      description: "Ride sharing and delivery"
    },
    {
      id: 10,
      name: "Airbnb",
      logo: "https://logos-world.net/wp-content/uploads/2020/08/Airbnb-Logo.png",
      description: "Vacation rentals and experiences"
    },
    {
      id: 11,
      name: "Slack",
      logo: "https://logos-world.net/wp-content/uploads/2020/10/Slack-Logo.png",
      description: "Business communication platform"
    },
    {
      id: 12,
      name: "Salesforce",
      logo: "https://logos-world.net/wp-content/uploads/2023/12/Salesforce-Logo.png",
      description: "CRM and business solutions"
    }
  ];

  // Image preloading function
  const preloadImages = (clients) => {
    if (typeof window === 'undefined') return;
    clients.forEach(client => {
      if (client.logo) {
        const img = new window.Image();
        img.src = client.logo;
      }
    });
  };

  // Load hardcoded clients data
  useEffect(() => {
    const loadClients = () => {
      try {
        setLoading(true);
        setError(null);

        // Use hardcoded clients data
        const clientsData = realClients;

        // Preload all images before setting state
        preloadImages(clientsData);
        setClients(clientsData);
        
      } catch (error) {
        console.error("Error loading clients:", error);
        setError("Failed to load clients: " + error.message);
        setClients(realClients);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  // Calculate total slides based on actual clients length
  const totalSlides = Math.ceil(clients.length / cardsPerView);

  // Auto-scroll logic with proper boundaries
  useEffect(() => {
    if (!autorotate || isDragging || clients.length === 0 || totalSlides <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, autorotateTiming);
    
    return () => clearInterval(interval);
  }, [currentIndex, autorotate, clients.length, isDragging, totalSlides, cardsPerView]);

  // Drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    setAutorotate(false);
    setStartX(e.type.includes("mouse") ? e.clientX : e.touches[0].clientX);
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;

    const endX = e.type.includes("mouse")
      ? e.clientX
      : e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (Math.abs(diffX) > 50 && clients.length > 0 && totalSlides > 1) {
      if (diffX > 0) {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      } else {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
      }
    }

    setIsDragging(false);
    setTimeout(() => setAutorotate(true), 5000);
  };

  // Navigation handlers
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setAutorotate(false);
    setTimeout(() => setAutorotate(true), 5000);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setAutorotate(false);
    setTimeout(() => setAutorotate(true), 5000);
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Loading Header */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-12">
            <div className="lg:w-1/2 mb-6 lg:mb-0 text-center lg:text-left">
              <div className="animate-pulse">
                <div className="h-10 bg-gray-300 rounded w-3/4 mb-4 mx-auto lg:mx-0"></div>
                <div className="h-4 bg-gray-300 rounded w-full max-w-2xl"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6 mt-2 max-w-2xl"></div>
              </div>
            </div>

            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="flex space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Loading Carousel */}
          <div className="relative overflow-hidden">
            <div className="flex py-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex-shrink-0 px-3"
                  style={{
                    width: `${100 / cardsPerView}%`,
                    minWidth: `${100 / cardsPerView}%`,
                  }}
                >
                  <div className="flex flex-col h-full bg-white p-6 rounded-xl shadow-lg animate-pulse">
                    <div className="w-20 h-20 bg-gray-300 rounded-xl mx-auto mb-4"></div>
                    <div className="h-7 bg-gray-300 rounded w-4/5 mx-auto mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Our Clients
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              setTimeout(() => {
                preloadImages(realClients);
                setClients(realClients);
                setLoading(false);
              }, 500);
            }}
            className="bg-[#1f8fce] text-white px-6 py-3 rounded-lg hover:bg-[#167aac] transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (clients.length === 0) {
    return (
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">🤝</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Our Valued Clients
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We&apos;re proud to partner with amazing organizations. Our client portfolio will be updated soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-12">
          <div className="lg:w-1/2 mb-6 lg:mb-0 text-center lg:text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                <AnimatedTitle />
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0"
              >
                We&apos;re honored to work with some of the most innovative and respected companies across various industries. 
                Their trust in our security services drives us to deliver excellence every day.
              </motion.p>
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="flex space-x-4">
              <button
                className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePrev}
                disabled={clients.length === 0 || totalSlides <= 1}
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNext}
                disabled={clients.length === 0 || totalSlides <= 1}
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
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
            className="flex"
            animate={{
              x: `-${currentIndex * (100 / cardsPerView)}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            style={{ 
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex-shrink-0 px-3 py-4"
                style={{
                  width: `${100 / cardsPerView}%`,
                  minWidth: `${100 / cardsPerView}%`,
                }}
              >
                <ClientCard client={client} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pagination Dots */}
        {totalSlides > 1 && (
          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setAutorotate(false);
                  setTimeout(() => setAutorotate(true), 5000);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#1f8fce] scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}