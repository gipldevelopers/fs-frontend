'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

// --- Start of Title Animation Logic ---

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

// Animated Title Component for the CTA section
const AnimatedCtaTitle = ({ title, highlight }) => {
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
          className="text-cyan-300 inline-block"
        >

          {splitText(highlight)}
        </motion.span>
      )}

      {/* Second part if exists */}
      {parts[1] && splitText(parts[1])}
    </motion.span>
  );
};

// --- End of Title Animation Logic ---

export default function CtaSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content (Centered on mobile, left-aligned on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-white text-center lg:text-left"
          >
            <h2 className="text-balance text-4xl font-semibold font-montserrat mb-6">
              <AnimatedCtaTitle
                title="Elevate Your SecurityEnjoy True Peace"
                highlight="Security"
              />
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-200 mb-8 text-lg md:text-xl font-poppins leading-relaxed"
            >
              Join hundreds of satisfied clients who trust us with their security needs across Gujarat. 
              Get started today and protect what matters most with professional security solutions.
            </motion.p>

            {/* CTA Buttons (Centered on mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-row gap-2 sm:gap-4 justify-center sm:justify-start"
            >
              {/* Primary Button - Get Started */}
              <Link
                href="/get-started"
                className="rounded-md px-4 sm:px-8 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-white border-white text-[#1f8fce] hover:bg-[#1f8fce] hover:border-white hover:text-white transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-lg font-semibold flex-1 sm:flex-none sm:w-auto min-w-0 sm:min-w-[160px]"
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-[#1f8fce] top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative transition duration-300 ease font-semibold">
                  Get Started Today
                </span>
              </Link>

              {/* Secondary Button - Contact Sales */}
              <Link
                href="/contact"
                className="rounded-md px-4 sm:px-8 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium border-white text-white hover:bg-white hover:text-[#1f8fce] transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-lg font-semibold flex-1 sm:flex-none sm:w-auto min-w-0 sm:min-w-[160px]"
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative transition duration-300 ease font-semibold">
                  Contact Sales
                </span>
              </Link>
            </motion.div>

            {/* Trust Badges (Centered on mobile) */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center sm:items-center justify-center lg:justify-start gap-6 text-sm text-gray-300 font-poppins"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full border-2 border-[#1a1a5e] shadow-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-white">✓</span>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-2 border-[#1a1a5e] shadow-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-white">✓</span>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-[#1a1a5e] shadow-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-white">✓</span>
                  </div>
                </div>
                <span className="font-semibold text-[13px] sm:text-[13px]">Join 300+ Active Security Sites</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg border border-white/20">
                <ShieldCheckIcon />
                <span className="text-[13px] sm:text-[13px]">24/7 Professional Support</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Modern Security Illustration (Centered on all screen) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex justify-center items-center"
          >
            <ModernSecurityIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Modern Security Illustration Component
const ModernSecurityIllustration = () => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: 0.3 }}
    className="relative w-full max-w-sm md:max-w-md lg:max-w-lg" 
  >
    <div className="relative">
      {/* Main Container */}
      <div className="relative bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl">
        
        {/* Central Shield with Glow */}
        <div className="relative flex justify-center items-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
            className="relative"
          >
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
            
            {/* Shield Container */}
            <div className="relative bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl p-4 sm:p-6 shadow-2xl">
              {/* Shield Icon */}
              <svg className="w-16 h-16 sm:w-20 sm:h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              
              {/* Animated Checkmark */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, delay: 1 }}
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-green-500 rounded-full p-1 shadow-lg"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-center p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <div className="text-xl sm:text-2xl font-bold text-white font-montserrat">99.8%</div>
            <div className="text-cyan-200 text-xs sm:text-sm font-poppins">Satisfaction</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <div className="text-xl sm:text-2xl font-bold text-white font-montserrat">24/7</div>
            <div className="text-cyan-200 text-xs sm:text-sm font-poppins">Vigilance</div>
          </motion.div>
        </div>

        {/* Security Features */}
        <div className="space-y-2 sm:space-y-3">
          {[
            { text: "Licensed, Trained Personnel", icon: "🛡️" },
            { text: "Real-time Site Monitoring", icon: "📊" },
            { text: "Immediate Incident Response", icon: "🔔" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex items-center gap-2 sm:gap-3 text-white/90 font-poppins justify-center lg:justify-start text-sm sm:text-base"
            >
              <span className="text-base sm:text-lg">{feature.icon}</span>
              <span className="text-xs sm:text-sm">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 bg-cyan-400/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 bg-blue-400/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          className="absolute top-1/2 -right-4 sm:-right-6 w-4 h-4 sm:w-6 sm:h-6 bg-purple-400/20 rounded-full blur-sm"
        />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-600 rounded-full blur-3xl"></div>
      </div>
    </div>
  </motion.div>
);

// Icon Component
const ShieldCheckIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
  </svg>
);