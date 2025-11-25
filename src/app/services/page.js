"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { staticServices } from "@/app/lib/staticServices";

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

// ServiceCard Component with Blue/Indigo Theme
const ServiceCard = ({ service, index }) => {
  // Generate slug from title
  const generateSlug = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="bg-white border border-blue-200 rounded-xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 cursor-pointer shadow-lg flex flex-col h-full"
    >
      <div className="flex flex-col h-full">
        {/* Service Image */}
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          {service.image_url ? (
            <Image
              src={service.image_url}
              alt={service.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center rounded-lg">
              <span className="text-blue-500 text-4xl">🛡️</span>
            </div>
          )}
        </div>

        <div className="space-y-3 py-2 flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-montserrat">{service.title}</h3>
          <p className="text-gray-600 text-sm sm:text-base font-poppins leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Features List */}
        <div className="mt-4 space-y-2">
          {service.features && service.features.slice(0, 3).map((feature, featureIndex) => (
            <div key={featureIndex} className="flex items-center gap-2 text-gray-500 text-sm">
              <CheckCircle className="w-4 h-4 text-[#1f8fce] flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 border-t border-dashed border-blue-200 pt-4 sm:pt-6 mt-4">
          <Link
            href={`/services/${generateSlug(service.title)}`}
            className="inline-flex items-center gap-1 text-[#1f8fce] font-semibold hover:text-[#167aac] border border-[#1f8fce] hover:border-[#167aac] px-4 sm:px-6 py-2 sm:py-3 rounded-md transition-all duration-300 text-sm sm:text-base font-poppins whitespace-nowrap"
          >
            Learn More
            <ChevronRight className="ml-1 size-4 sm:size-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default function ServicesPage() {
  const [services] = useState(staticServices);

  return (
    <div className="min-h-screen bg-white">
      {/* Creative Inner Banner */}
      <section className="relative pt-10 pb-8 sm:pt-20 sm:pb-16 lg:pt-32 lg:pb-24 h-auto min-h-[45vh] sm:min-h-[70vh] lg:min-h-[500px] bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce] overflow-hidden">
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
              <span className="text-white font-semibold">Services</span>
            </motion.div>

            {/* Main Title with Creative Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-white font-montserrat mb-3 sm:mb-6"
            >
              <motion.span
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true, margin: "-30px" }}
                className="inline-block"
              >
                {splitText("Our ")}
                <motion.span
                  variants={highlightVariants}
                  className="text-[#1f8fce] inline-block"
                >
                  {splitText("Services")}
                </motion.span>
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 font-poppins max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-6 px-2 sm:px-0"
            >
              Comprehensive, licensed security solutions tailored to protect your business, home, and digital assets across Gujarat.
            </motion.p>
            {/* Animated CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-4 sm:mt-8"
            >
              <Link
                href="/contact"
                className="rounded-md px-8 sm:px-10 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-white border-white text-[#1f8fce] hover:bg-[#1f8fce] hover:border-white hover:text-white transition-all duration-300 inline-flex items-center text-sm sm:text-base whitespace-nowrap"
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-[#1f8fce] top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative transition duration-300 ease font-semibold">
                  Get Free Consultation
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid Section with Blue/Indigo Background */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Services Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
              />
            ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Services Available</h3>
              <p className="text-gray-500">Check back later for our security services.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Services Focused - REVISED CONTENT */}
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
                title="Ready for Vigilance You Can Trust?"
                highlight="Vigilance"
              />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/90 font-poppins text-lg sm:text-xl mb-8 max-w-2xl mx-auto"
            >
              Talk to our specialists about manned guarding, surveillance, or investigation services tailored for your property in Gujarat.
            </motion.p>

            {/* Buttons inline on mobile and desktop - MODIFIED to one button */}
            <motion.div
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 w-full max-w-2xl mx-auto"
            >
              {/* Primary Button: Get Security Assessment - Longer (Now the only button) */}
              <Link
                href="/contact"
                // Class modified to ensure it centers nicely when alone
                className="w-full sm:w-auto rounded-md px-8 sm:px-12 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-[#1f8fce] border-[#1f8fce] text-white hover:bg-white hover:text-[#1f8fce] transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base whitespace-nowrap min-w-[200px]"
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative transition duration-300 ease font-semibold">
                  Get Free Security Quote
                </span>
              </Link>

              {/* Removed Secondary Button: Contact Sales Team */}

            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}