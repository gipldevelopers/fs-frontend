"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Shield, Users, Target, Award } from "lucide-react";

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
const AnimatedTitle = ({ title, highlight }) => {
  const parts = title.split(highlight);

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true, margin: "-30px" }}
      className="inline-block"
    >
      {splitText(parts[0])}
      <motion.span
        variants={highlightVariants}
        className="text-[#1f8fce] inline-block"
      >
        {splitText(highlight)}
      </motion.span>
      {parts[1] && splitText(parts[1])}
    </motion.span>
  );
};

// Real company logos from various sources
const clientsData = [
  {
    id: 1,
    name: "Microsoft",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Microsoft-Logo.png",
    description: "Technology and cloud computing",
    industry: "Technology"
  },
  {
    id: 2,
    name: "Google",
    logo: "https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png",
    description: "Search engine and technology",
    industry: "Technology"
  },
  {
    id: 3,
    name: "Amazon",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png",
    description: "E-commerce and cloud services",
    industry: "E-commerce"
  },
  {
    id: 4,
    name: "Apple",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
    description: "Consumer electronics",
    industry: "Technology"
  },
  {
    id: 5,
    name: "Tesla",
    logo: "https://logos-world.net/wp-content/uploads/2021/09/Tesla-Logo.png",
    description: "Electric vehicles and energy",
    industry: "Automotive"
  },
  {
    id: 6,
    name: "Netflix",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png",
    description: "Streaming entertainment",
    industry: "Entertainment"
  },
  {
    id: 7,
    name: "Adobe",
    logo: "https://logos-world.net/wp-content/uploads/2020/07/Adobe-Logo.png",
    description: "Creative software solutions",
    industry: "Software"
  },
  {
    id: 8,
    name: "Spotify",
    logo: "https://logos-world.net/wp-content/uploads/2020/09/Spotify-Logo.png",
    description: "Music streaming platform",
    industry: "Entertainment"
  },
  {
    id: 9,
    name: "Uber",
    logo: "https://logos-world.net/wp-content/uploads/2022/06/Uber-Logo.png",
    description: "Ride sharing and delivery",
    industry: "Transportation"
  },
  {
    id: 10,
    name: "Airbnb",
    logo: "https://logos-world.net/wp-content/uploads/2020/08/Airbnb-Logo.png",
    description: "Vacation rentals and experiences",
    industry: "Hospitality"
  },
  {
    id: 11,
    name: "Slack",
    logo: "https://logos-world.net/wp-content/uploads/2020/10/Slack-Logo.png",
    description: "Business communication platform",
    industry: "Software"
  },
  {
    id: 12,
    name: "Salesforce",
    logo: "https://logos-world.net/wp-content/uploads/2023/12/Salesforce-Logo.png",
    description: "CRM and business solutions",
    industry: "Software"
  }
];

// Client Logo Component with fallback
const ClientLogo = ({ client, size = "medium" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const sizeClasses = {
    small: "w-16 h-16 sm:w-20 sm:h-20",
    medium: "w-20 h-20 sm:w-24 sm:h-24",
    large: "w-24 h-24 sm:w-32 sm:h-32"
  };

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
      <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-[#1f8fce] to-[#1a1a5e] flex items-center justify-center mx-auto mb-4 flex-shrink-0 shadow-lg`}>
        <span className="text-white font-bold text-lg sm:text-xl">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-xl bg-white p-3 flex items-center justify-center mx-auto mb-4 flex-shrink-0 shadow-lg border border-gray-100 relative`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#1f8fce] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={client.logo}
        alt={`${client.name} logo`}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setImageLoading(false)}
        onError={() => setImageError(true)}
      />
    </div>
  );
};

// Client Card Component
const ClientCard = ({ client, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10,
        },
      }}
      className="flex flex-col h-full bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Client Logo */}
      <ClientLogo client={client} size="medium" />

      {/* Client Name */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-3 leading-tight font-montserrat">
        {client.name}
      </h3>

      {/* Industry Badge */}
      <div className="flex justify-center mb-3">
        <span className="inline-block bg-gradient-to-r from-[#1f8fce] to-[#1a1a5e] text-white px-3 py-1 rounded-full text-xs font-semibold">
          {client.industry}
        </span>
      </div>

      {/* Client Description */}
      <p className="text-gray-600 text-sm sm:text-base text-center leading-relaxed font-poppins flex-1">
        {client.description}
      </p>

      {/* Trust Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.3 }}
        className="flex justify-center items-center mt-4 space-x-1"
      >
        <Shield className="w-4 h-4 text-[#1f8fce]" />
        <span className="text-xs text-gray-500 font-poppins">Trusted Partner</span>
      </motion.div>
    </motion.div>
  );
};

// Statistics Component
const Statistics = () => {
  const stats = [
    { number: 50, label: "Happy Clients", suffix: "+", icon: Users },
    { number: 99.8, label: "Satisfaction Rate", suffix: "%", icon: Star },
    { number: 24, label: "Support Available", suffix: "/7", icon: Shield },
    { number: 10, label: "Industries Served", suffix: "+", icon: Target },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: index * 0.1,
                    duration: 0.6,
                  },
                },
              }}
              className="text-center bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1f8fce] to-[#1a1a5e] rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#1f8fce] font-montserrat mb-2">
                {stat.number}{stat.suffix}
              </div>
              <div className="text-gray-600 text-sm font-poppins">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Logo Grid Component
const LogoGrid = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-8"
        >
          {clientsData.map((client, index) => (
            <motion.div
              key={client.id}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    delay: index * 0.05,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  },
                },
              }}
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
              className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <ClientLogo client={client} size="small" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Testimonials Carousel
const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = [
    {
      id: 1,
      name: "Microsoft Security Team",
      role: "Corporate Security",
      content: "Forever Security has been instrumental in protecting our Gujarat operations. Their professional approach and 24/7 vigilance give us complete peace of mind.",
      rating: 5
    },
    {
      id: 2,
      name: "Amazon Operations",
      role: "Facility Management",
      content: "The team's dedication and expertise in security management have significantly enhanced our operational safety across multiple locations.",
      rating: 5
    },
    {
      id: 3,
      name: "Tesla India",
      role: "Infrastructure Security",
      content: "Professional, reliable, and always responsive. Forever Security understands the unique security needs of international corporations.",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-montserrat mb-4">
            <AnimatedTitle 
              title="What Our Clients Say"
              highlight="Clients Say"
            />
          </h2>
          <p className="text-gray-600 font-poppins text-lg max-w-2xl mx-auto">
            Hear from some of the amazing companies that trust us with their security
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-lg italic mb-6 font-poppins leading-relaxed">
                "{testimonials[currentIndex].content}"
              </p>
              <div>
                <h4 className="font-bold text-gray-900 text-xl font-montserrat">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-[#1f8fce] font-poppins">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-[#1f8fce]" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 text-[#1f8fce]" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#1f8fce] scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-10 pb-8 sm:pt-20 sm:pb-16 lg:pt-32 lg:pb-24 h-auto min-h-[45vh] sm:min-h-[70vh] bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-12 h-12 sm:top-6 sm:left-6 sm:w-16 sm:h-16 lg:top-10 lg:left-10 lg:w-20 lg:h-20 bg-white/10 rounded-full blur-lg sm:blur-xl"></div>
          <div className="absolute top-1/3 right-4 w-16 h-16 sm:top-1/2 sm:right-6 sm:w-20 sm:h-20 lg:top-1/2 lg:right-20 lg:w-32 lg:h-32 bg-[#1f8fce]/20 rounded-full blur-lg sm:blur-xl lg:blur-2xl"></div>
          <div className="absolute bottom-4 left-1/4 w-12 h-12 sm:bottom-6 sm:left-1/3 sm:w-16 sm:h-16 lg:bottom-10 lg:left-1/3 lg:w-24 lg:h-24 bg-white/5 rounded-full blur-md sm:blur-lg"></div>
          <div className="absolute top-6 right-1/4 w-10 h-10 sm:top-8 sm:right-1/4 sm:w-12 sm:h-12 lg:top-20 lg:right-1/4 lg:w-16 lg:h-16 bg-[#1f8fce]/30 rounded-full blur-md sm:blur-lg"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full pt-12 pb-0 sm:py-0"
          >
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center items-center space-x-2 text-white/80 text-xs sm:text-sm md:text-base mb-3 sm:mb-6 font-poppins"
            >
              <Link
                href="/"
                className="hover:text-white transition-colors duration-300"
              >
                Home
              </Link>
              <span>/</span>
              <span className="text-white font-semibold">Our Clients</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-white font-montserrat mb-3 sm:mb-6"
            >
              <motion.span
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true, margin: "-30px" }}
                className="inline-block"
              >
                {splitText("Our Trusted ")}
                <motion.span
                  variants={highlightVariants}
                  className="text-[#1f8fce] inline-block"
                >
                  {splitText("Clients")}
                </motion.span>
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-sm sm:text-lg md:text-xl text-white/90 font-poppins max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-6 px-2 sm:px-0"
            >
              We are proud to partner with industry leaders who trust us with their security needs across Gujarat
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <Statistics />

      {/* Logo Grid Section */}
      <LogoGrid />

      {/* Featured Clients Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-montserrat mb-4">
              <AnimatedTitle 
                title="Featured Security Partners"
                highlight="Security Partners"
              />
            </h2>
            <p className="text-gray-600 font-poppins text-lg max-w-2xl mx-auto">
              Discover how we protect some of the world&apos;s most recognized brands
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clientsData.slice(0, 6).map((client, index) => (
              <ClientCard key={client.id} client={client} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsCarousel />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-montserrat mb-4">
              <AnimatedTitle
                title="Ready to Join Our Client Family?"
                highlight="Client Family"
              />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/90 font-poppins text-lg sm:text-xl mb-8 max-w-2xl mx-auto"
            >
              Experience the same level of professional security that industry leaders trust
            </motion.p>

            <motion.div
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6"
            >
              <Link
                href="/contact"
                className="rounded-md px-8 sm:px-12 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-[#1f8fce] border-[#1f8fce] text-white hover:bg-white hover:text-[#1f8fce] transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base whitespace-nowrap min-w-[200px]"
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative transition duration-300 ease font-semibold">
                  Get Protected
                </span>
              </Link>

              <Link
                href="/services"
                className="rounded-md px-8 sm:px-12 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-transparent border-white text-white hover:bg-white hover:text-[#1f8fce] transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base whitespace-nowrap min-w-[200px]"
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative transition duration-300 ease font-semibold">
                  View Services
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}