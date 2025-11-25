'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Shield, Lock, Eye } from 'lucide-react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

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
  const title = "Contact Our Security Experts";
  const highlight = "Security";
  
  const parts = title.split(highlight);
  
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true, margin: "-20px" }}
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

// Modern Security Contact Illustration
const SecurityContactIllustration = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-30px" }}
    transition={{ duration: 0.8 }}
    className="relative w-full h-full"
  >
    <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 sm:p-4 md:p-6 border border-blue-100 h-full">
      {/* Main Illustration Container */}
      <div className="relative flex flex-col items-center justify-center h-full py-4 sm:py-6">
        
        {/* Animated Security Shield - Responsive */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="relative mb-4 sm:mb-6 md:mb-8"
        >
          {/* Outer Glow Effect */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -inset-3 sm:-inset-4 md:-inset-6 bg-gradient-to-r from-[#1f8fce] to-[#1a1a5e] rounded-full blur-md sm:blur-lg"
          />
          
          {/* Main Shield - Responsive Sizing */}
          <div className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-[#1f8fce] to-[#1a1a5e] rounded-t-lg sm:rounded-t-xl rounded-b-2xl sm:rounded-b-3xl flex items-center justify-center shadow-lg sm:shadow-xl z-10">
            {/* Shield Pattern */}
            <div className="absolute inset-2 sm:inset-3 md:inset-4 border-2 border-white/30 rounded-t-md sm:rounded-t-lg rounded-b-xl sm:rounded-b-2xl" />
            
            {/* Central Lock Icon - Responsive */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative z-10"
            >
              <Lock className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
            </motion.div>
            
            {/* Shield Point */}
            <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 xs:w-4 xs:h-4 bg-[#1f8fce] clip-shield-point" />
          </div>

          {/* Rotating Security Rings - Responsive */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 sm:-inset-6 md:-inset-8 border-2 border-[#1f8fce]/20 rounded-full"
          />
          
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-6 sm:-inset-8 md:-inset-10 border border-[#10b981]/20 rounded-full"
          />

          {/* Floating Security Particles - Responsive */}
          {[0, 90, 180, 270].map((angle, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: 0.8 + index * 0.2 }}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${angle}deg) translate(40px) sm:translate(50px) md:translate(60px) rotate(-${angle}deg)`
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  delay: index * 0.5
                }}
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#1f8fce] rounded-full shadow-sm sm:shadow-md"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ delay: 1.2 }}
          className="w-full max-w-md space-y-3 sm:space-y-4"
        >
          {/* Phone Card 1 - Primary Number */}
          <motion.a
            href="tel:+917600804331"
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: 1.4 }}
            className="flex items-center bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border border-green-200 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors shadow-md sm:shadow-lg flex-shrink-0">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-xs sm:text-sm">Main Contact</div>
                <div className="text-green-600 font-semibold text-sm sm:text-base truncate">+91 76008 04331</div>
                <div className="text-xs text-gray-500 mt-0.5 sm:mt-1">24/7 Available • Immediate Response</div>
              </div>
            </div>
            <div className="text-green-500 group-hover:text-green-600 transition-colors flex-shrink-0 ml-2">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </motion.a>

          {/* Phone Card 2 - Alternative Number */}
          <motion.a
            href="tel:+919904970408"
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: 1.6 }}
            className="flex items-center bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border border-green-200 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors shadow-md sm:shadow-lg flex-shrink-0">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-xs sm:text-sm">Alternative Contact</div>
                <div className="text-green-600 font-semibold text-sm sm:text-base truncate">+91 99049 70408</div>
                <div className="text-xs text-gray-500 mt-0.5 sm:mt-1">Sales & Inquiry • Support</div>
              </div>
            </div>
            <div className="text-green-500 group-hover:text-green-600 transition-colors flex-shrink-0 ml-2">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </motion.a>

          {/* Email Card */}
          <motion.a
            href="mailto:hr.foreversec@gmail.com"
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: 1.8 }}
            className="flex items-center bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border border-blue-200 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-md sm:shadow-lg flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-xs sm:text-sm">Email Support</div>
                <div className="text-blue-600 font-semibold text-xs sm:text-sm truncate">hr.foreversec@gmail.com</div>
                <div className="text-xs text-gray-500 mt-0.5 sm:mt-1">HR & General Inquiries • Secure Channel</div>
              </div>
            </div>
            <div className="text-blue-500 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </motion.a>

          {/* Location Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: 2.0 }}
            className="flex items-center bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border border-orange-200 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors shadow-md sm:shadow-lg flex-shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-xs sm:text-sm">Corporate Office (Gujarat)</div>
                <div className="text-orange-600 font-semibold text-xs sm:text-sm">246/B, Purusangit Bunglow, Sector 7a</div>
                <div className="text-xs text-gray-500 mt-0.5 sm:mt-1">Gandhinagar, Gujarat-382007, India</div>
              </div>
            </div>
            <div className="text-orange-500 group-hover:text-orange-600 transition-colors flex-shrink-0 ml-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </motion.div>
        </motion.div>

        {/* Security Status Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ delay: 2.2 }}
          className="mt-4 sm:mt-6 flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg"
        >
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"
          />
          <div className="text-center flex-1">
            <div className="font-bold text-xs sm:text-sm">SECURE CONNECTION ACTIVE</div>
            <div className="text-xs opacity-90 hidden xs:block">All communications are encrypted and protected</div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"
          />
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-[#1f8fce] rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-[#10b981] rounded-full blur-2xl sm:blur-3xl"></div>
      </div>

      {/* Custom CSS for shield point */}
      <style jsx>{`
        .clip-shield-point {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  </motion.div>
);

// Contact Form Component with reCAPTCHA
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState('');
  
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Initialize reCAPTCHA
  useEffect(() => {
    if (executeRecaptcha) {
      console.log('✅ reCAPTCHA loaded successfully');
    } else {
      console.log('🔄 reCAPTCHA loading...');
    }
  }, [executeRecaptcha]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear reCAPTCHA error when user starts typing
    if (recaptchaError) {
      setRecaptchaError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRecaptchaError('');
    
    try {
      // Verify reCAPTCHA
      if (!executeRecaptcha) {
        throw new Error('reCAPTCHA not loaded. Please refresh the page.');
      }

      console.log('🔄 Getting reCAPTCHA token...');
      const token = await executeRecaptcha('contact_form_submit');
      
      if (!token) {
        throw new Error('Failed to get reCAPTCHA token');
      }

      console.log('✅ reCAPTCHA token received');

      // Proceed with form submission to Next.js API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: token
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        alert(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error submitting form:', error);
      if (error.message.includes('reCAPTCHA')) {
        setRecaptchaError(error.message);
      } else {
        alert('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8 sm:py-12 h-full flex flex-col justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Send className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
        </motion.div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
          Message Sent!
        </h3>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          Thank you for contacting us. Our security experts will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="bg-[#1f8fce] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-[#167aac] transition-colors duration-300 cursor-pointer text-sm sm:text-base"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
          Send Us a Message
        </h3>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
          Have questions about our security services? We&apos;re here to help.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 lg:space-y-8 flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <div>
            <label htmlFor="name" className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full text-gray-700 px-3 sm:px-4 py-2 sm:py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f8fce] focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full text-gray-700 px-3 sm:px-4 py-2 sm:py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f8fce] focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <div>
            <label htmlFor="phone" className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full text-gray-700 px-3 sm:px-4 py-2 sm:py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f8fce] focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              placeholder="Enter your phone number"
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full text-gray-700 px-3 sm:px-4 py-2 sm:py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f8fce] focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              placeholder="Enter message subject"
            />
          </div>
        </div>

        <div className="flex-grow">
          <label htmlFor="message" className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1">
            Your Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full text-gray-700 px-3 sm:px-4 py-2 sm:py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f8fce] focus:border-transparent transition-all duration-300 resize-none text-sm sm:text-base"
            placeholder="Tell us about your security needs and how we can assist you..."
          />
        </div>

        {/* reCAPTCHA Error Message */}
        {recaptchaError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{recaptchaError}</p>
            <p className="text-red-500 text-xs mt-1">
              Please refresh the page and try again.
            </p>
          </div>
        )}

        {/* reCAPTCHA Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-600 text-xs">
            <Shield className="w-3 h-3 inline mr-1" />
            This site is protected by reCAPTCHA and the Google 
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline ml-1">Privacy Policy</a> and
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline ml-1">Terms of Service</a> apply.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#1f8fce] to-[#1a1a5e] text-white py-3 sm:py-4 lg:py-5 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base lg:text-lg hover:from-[#167aac] hover:to-[#141452] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Main Contact Page Component
const ContactPageContent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <section className="relative pt-6 pb-4 sm:pt-16 sm:pb-12 lg:pt-24 lg:pb-16 xl:pt-32 xl:pb-24 h-[35vh] xs:h-[40vh] sm:min-h-[50vh] lg:min-h-[60vh] xl:min-h-[70vh] bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce] overflow-hidden flex flex-col justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-2 left-2 w-8 h-8 xs:top-4 xs:left-4 xs:w-12 xs:h-12 sm:top-6 sm:left-6 sm:w-16 sm:h-16 lg:top-10 lg:left-10 lg:w-20 lg:h-20 bg-white/10 rounded-full blur-md xs:blur-lg sm:blur-xl"></div>
          <div className="absolute top-1/4 right-2 w-10 h-10 xs:top-1/3 xs:right-4 xs:w-16 xs:h-16 sm:top-1/2 sm:right-6 sm:w-20 sm:h-20 lg:top-1/2 lg:right-20 lg:w-32 lg:h-32 bg-[#1f8fce]/20 rounded-full blur-md xs:blur-lg sm:blur-xl lg:blur-2xl"></div>
          <div className="absolute bottom-2 left-1/4 w-8 h-8 xs:bottom-4 xs:left-1/4 xs:w-12 xs:h-12 sm:bottom-6 sm:left-1/3 sm:w-16 sm:h-16 lg:bottom-10 lg:left-1/3 lg:w-24 lg:h-24 bg-white/5 rounded-full blur-sm xs:blur-md sm:blur-lg"></div>
          <div className="absolute top-4 right-1/4 w-6 h-6 xs:top-6 xs:right-1/4 xs:w-10 xs:h-10 sm:top-8 sm:right-1/4 sm:w-12 sm:h-12 lg:top-20 lg:right-1/4 lg:w-16 lg:h-16 bg-[#1f8fce]/30 rounded-full blur-sm xs:blur-md sm:blur-lg"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-2 sm:py-0"
          >
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center items-center space-x-2 text-white/80 text-xs sm:text-sm md:text-base mb-3 sm:mb-6 font-poppins"
            >
              <span className="hover:text-white transition-colors duration-300 cursor-pointer">Home</span>
              <span>/</span>
              <span className="text-white font-semibold">Contact</span>
            </motion.div>

            {/* Main Title - Responsive */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-1 xs:mb-2 sm:mb-4 lg:mb-6 leading-tight"
            >
              <AnimatedTitle />
            </motion.h1>

            {/* Subtitle - Responsive */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-3 xs:mb-4 sm:mb-6 px-2 sm:px-0"
            >
              We&apos;re here to help you secure what matters most. Reach out to our security experts for personalized solutions.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information & Form Section */}
      <section className="py-6 sm:py-8 lg:py-12 xl:py-16">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
            
            {/* Left Column - Security Contact Illustration */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.8 }}
              className="flex items-stretch"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 w-full">
                <SecurityContactIllustration />
              </div>
            </motion.div>

            {/* Right Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-stretch"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 w-full">
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Full Width Map Section */}
      <section className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.8 }}
          className="w-full h-64 xs:h-80 sm:h-96 md:h-[400px] lg:h-[500px] xl:h-[600px]"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14667.593708951796!2d72.642105!3d23.210372!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2bb4e141e881%3A0xe49654da6332053f!2sSector%207%2C%20Gandhinagar%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1760352340189!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location in Sector 7, Gandhinagar"
            className="rounded-none sm:rounded-t-2xl"
          />
        </motion.div>
      </section>
    </div>
  );
};

// Main Export with reCAPTCHA Provider
export default function ContactPage() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      <ContactPageContent />
    </GoogleReCaptchaProvider>
  );
}