"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutSection() {
  // Split text animation variants
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

  // Render animated title with highlight - REAL CONTENT
  const AnimatedTitle = () => {
    const title = "Setting the Benchmark for Security Excellence";
    const highlight = "Security Excellence";
    
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
        
        {/* Second part if exists */}
        {parts[1] && splitText(parts[1])}
      </motion.span>
    );
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Image Section - Responsive */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl">
              <Image
                src="/images/about-section.jpg"
                alt="Security Operators Working in Control Room"
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-xl sm:rounded-2xl"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl sm:rounded-2xl"></div>
            </div>
            
            {/* Decorative Elements - Hidden on mobile */}
            <div className="hidden sm:block absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-[#1f8fce]/10 rounded-full blur-xl sm:blur-2xl z-0"></div>
            <div className="hidden sm:block absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-16 h-16 sm:w-24 sm:h-24 bg-[#1f8fce]/5 rounded-full blur-lg sm:blur-xl z-0"></div>
          </div>

          {/* Content Section - Responsive */}
          <div className="relative order-1 lg:order-2">
            {/* Section Header */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg text-[#1f8fce] font-semibold font-secondary">
                About Us
              </h2>
            </div>

            {/* Main Heading with Animation */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 font-secondary leading-tight">
              <AnimatedTitle />
            </h3>

            {/* Description - REAL CONTENT */}
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-sm sm:text-base lg:text-lg text-[#838383] leading-relaxed"
              >
                We are a licensed and reliable security agency in Gujarat, committed to proactive risk management and client empowerment. Our vision is to set regional and global benchmarks in professional security practices.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-sm sm:text-base lg:text-lg text-[#838383] leading-relaxed"
              >
                We deploy highly trained, professional guards alongside tech-driven security solutions like smart surveillance and real-time monitoring to secure your assets, property, and peace of mind 24/7.
              </motion.p>
            </div>

            {/* CTA Button - Same as Services button but left-aligned */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex justify-start"
            >
              <Link
                href="/about"
                className="rounded-md px-6 sm:px-8 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-[#1f8fce] border-white text-white hover:bg-transparent hover:border-[#1f8fce] hover:text-[#1f8fce] transition-all duration-300 inline-flex items-center text-sm sm:text-base"
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative transition duration-300 ease font-semibold">
                  Read More
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}