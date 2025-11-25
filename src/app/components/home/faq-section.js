// components/faq-section.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, CreditCard, Truck, Globe, Package, Shield, Home, Building, Lock, Users, Wifi } from 'lucide-react';

const FAQItem = ({ item, isOpen, onClick }) => {
  const IconComponent = getIconComponent(item.icon);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 mb-4 last:mb-0 transition-all duration-300 hover:shadow-md"
    >
      <button
        onClick={() => onClick(item.id)}
        className="w-full cursor-pointer items-center py-6 px-6 text-left hover:no-underline rounded-xl"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-10 bg-gradient-to-br from-[#1f8fce] to-blue-600 rounded-lg items-center justify-center flex-shrink-0">
              <IconComponent className="size-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white font-montserrat">
              {item.question}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="size-5 text-gray-400" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="pb-6 px-6">
              <div className="pl-14">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600 dark:text-gray-300 text-base leading-relaxed font-poppins"
                >
                  {item.answer}
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Icon mapping function
const getIconComponent = (iconName) => {
  const iconMap = {
    'shield': Shield,
    'home': Home,
    'building': Building,
    'lock': Lock,
    'users': Users,
    'wifi': Wifi,
    'clock': Clock,
    'credit-card': CreditCard,
    'truck': Truck,
    'globe': Globe,
    'package': Package
  };
  return iconMap[iconName] || Shield;
};

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

// Animated Title Component for the FAQ section
const AnimatedFAQTitle = ({ title, highlight }) => {
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

      {/* Highlighted part (if it exists) */}
      {highlight && (
        <motion.span
          variants={highlightVariants}
          className="text-[#1f8fce] inline-block" // Apply the highlight color
        >
          {splitText(highlight)}
        </motion.span>
      )}

      {/* Second part if exists */}
      {parts[1] && splitText(parts[1])}
    </motion.span>
  );
};

export default function FAQSection() {
  const [openItem, setOpenItem] = useState('item-1');

  const faqItems = [
    {
      id: 'item-1',
      icon: 'shield',
      question: 'Are your security guards licensed and trained?',
      answer: 'Yes, all our guards are fully licensed and trained to handle various security situations professionally.',
    },
    {
      id: 'item-2',
      icon: 'building',
      question: 'What types of security services do you offer?',
      answer: 'We provide commercial security, residential security, private security guards, bodyguard services, event security, and customized protection plans tailored to your needs.',
    },
    {
      id: 'item-3',
      icon: 'globe',
      question: 'Do you provide security services across Gujarat?',
      answer: 'Yes, we serve clients throughout Gujarat, including Gandhinagar, Ahmedabad, Surat, Vadodara, Rajkot, and more.',
    },
    {
      id: 'item-4',
      icon: 'clock',
      question: 'Is your security service available 24/7?',
      answer: 'Yes, we offer round-the-clock security services to ensure you are protected at all times.',
    }
  ];

  const handleItemClick = (itemId) => {
    setOpenItem(openItem === itemId ? null : itemId);
  };

  return (
    <section className="py-32 bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Left Side - Sticky Header */}
          <div className="lg:w-2/5">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-montserrat mb-6 leading-tight">
                  <AnimatedFAQTitle 
                    title="Frequently Asked Questions" 
                    highlight="Questions" // This part will be highlighted (blue) and use the special highlight animation.
                  />
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-poppins mb-8 leading-relaxed">
                  Find answers to common questions about our security services, 
                  installation process, and support. Can&apos;t find what you&apos;re looking for?
                </p>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <p className="text-gray-600 dark:text-gray-300 font-poppins">
                    Contact our{' '}
                    <Link
                      href="/contact"
                      className="text-[#1f8fce] font-semibold hover:underline transition-colors duration-200"
                    >
                      customer support team
                    </Link>{' '}
                    for personalized assistance.
                  </p>
                </div>

                {/* Trust Badge */}
                <motion.div 
                  className="mt-8 flex items-center gap-3 p-4 bg-gradient-to-r from-[#1f8fce] to-blue-600 rounded-xl text-white"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Shield className="size-6" />
                  <div>
                    <p className="font-semibold font-montserrat">24/7 Support</p>
                    <p className="text-sm opacity-90 font-poppins">Always here to help you</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Right Side - FAQ Items */}
          <div className="lg:w-3/5">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {faqItems.map((item, index) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isOpen={openItem === item.id}
                  onClick={handleItemClick}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}