"use client";

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const stats = [
  // REAL DATA CONTENT - Focused on professional service and regional presence
  { number: 99.8, label: "Client Satisfaction Rate", suffix: "%" },
  { number: 10, label: "Years of Professional Service", suffix: "+" }, // Changed label and number to align with About Us
  { number: 300, label: "Active Sites Secured Daily", suffix: "+" }, // Replaced "Systems Installed"
  { number: 24, label: "Vigilance & Support Available", suffix: "/7" }, // Changed label for clarity
];

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
  const title = "Your Safety is Our Track Record"; // REVISED TITLE
  const highlight = "Track Record"; // REVISED HIGHLIGHT
  
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
        className="text-[#1f8fce] inline-block" // Keep highlight color constant
      >
        {splitText(highlight)}
      </motion.span>
      
      {/* Second part if exists */}
      {parts[1] && splitText(parts[1])}
    </motion.span>
  );
};

const Counter = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const duration = 2000; // 2 seconds
          const steps = 60; // 60 steps for smooth animation
          const stepValue = value / steps;
          const stepTime = duration / steps;

          let currentStep = 0;
          const timer = setInterval(() => {
            currentStep++;
            setCount(Math.min(stepValue * currentStep, value));
            
            if (currentStep >= steps) {
              clearInterval(timer);
            }
          }, stepTime);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.1, rootMargin: '-50px' } // Better mobile viewport handling
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [value, hasAnimated]);

  return (
    <span ref={ref} className="inline-block">
      {suffix === '%' ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
};

export default function Statistics() {
  const statsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  const numberVariants = {
    hidden: { scale: 0.5 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        duration: 0.8
      }
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Responsive */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 font-montserrat mb-4">
            <AnimatedTitle />
          </h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-poppins max-w-2xl mx-auto px-4"
          >
            {/* REVISED DESCRIPTION */}
            Our commitment to safety is proven. With over a decade of experience and hundreds of active sites secured, we deliver reliable, professional security solutions across Gujarat.
          </motion.p>
        </div>

        {/* Stats Grid - Responsive with 4 columns on large screens */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          variants={statsContainerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.01,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }
              }}
              // Adjusted background, border, and shadow for light/dark mode
              className="text-center bg-white dark:bg-gray-700 rounded-lg p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg dark:hover:shadow-xl dark:shadow-gray-950/20 transition-all"
            >
              {/* Number with Counter */}
              <motion.div 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1f8fce] mb-2 sm:mb-3 lg:mb-4 font-montserrat" // Stat number color remains a vibrant blue for consistency
                variants={numberVariants}
                viewport={{ once: true }}
              >
                <Counter value={stat.number} suffix={stat.suffix} />
              </motion.div>
              
              {/* Label */}
              <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm lg:text-base font-poppins leading-tight">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}