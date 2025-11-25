"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronRight,
  CheckCircle,
  Star,
  ArrowLeft,
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

export default function ServiceDetailPage({ params }) {
  const [slug, setSlug] = useState(null);
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getParams = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
      } catch (error) {
        console.error("Error resolving params:", error);
      }
    };

    getParams();
  }, [params]);

  useEffect(() => {
    if (slug) {
      // Find the service that matches the slug from static data
      const foundService = staticServices.find((s) => {
        // Normalize title to slug format
        const normalizedTitle = s.title
          .toLowerCase()
          .replace(/&/g, "and")
          .replace(/\s+/g, "-");
        // Also check with "and" replaced with "-"
        const altSlug = normalizedTitle.replace(/and/g, "-");
        return normalizedTitle === slug || altSlug === slug;
      });

      if (foundService) {
        setService(foundService);
        setError(null);
      } else {
        setError("Service not found");
        setService(null);
      }
      setIsLoading(false);
    }
  }, [slug]);

  

  // Default features if not provided
  const getServiceFeatures = (service) => {
    if (service.features && service.features.length > 0) {
      return service.features;
    }

    // Default features based on service type
    const defaultFeatures = {
      "Home Security": [
        "24/7 Professional Monitoring",
        "Smart Home Integration",
        "Mobile App Control",
        "HD CCTV Cameras",
        "Motion Detection",
        "Remote Access",
        "Emergency Alerts",
        "Professional Installation",
      ],
      "Business Security": [
        "Access Control Systems",
        "Video Surveillance",
        "Intrusion Detection",
        "Security Personnel",
        "Fire Safety Systems",
        "Visitor Management",
        "Perimeter Security",
        "24/7 Monitoring",
      ],
      Cybersecurity: [
        "Network Security",
        "Data Encryption",
        "Threat Monitoring",
        "Incident Response",
        "Security Audits",
        "Compliance Management",
        "Employee Training",
        "Backup Solutions",
      ],
      "Security Consulting": [
        "Risk Assessments",
        "Security Audits",
        "Compliance Consulting",
        "Policy Development",
        "Incident Response Planning",
        "Security Training",
        "Vendor Assessment",
        "Continuous Improvement",
      ],
      "Emergency Response": [
        "24/7 Dispatch Center",
        "Rapid Response Teams",
        "Emergency Planning",
        "Crisis Management",
        "First Aid Support",
        "Evacuation Assistance",
        "Coordination with Authorities",
        "Post-Incident Analysis",
      ],
      "Access Control": [
        "Biometric Access",
        "Smart Card Systems",
        "Mobile Access",
        "Visitor Management",
        "Time-based Access",
        "Remote Control",
        "Integration Capabilities",
        "Audit Trails",
      ],
    };

    return (
      defaultFeatures[service.title] || [
        "Professional Implementation",
        "24/7 Support",
        "Custom Solutions",
        "Quality Assurance",
      ]
    );
  };

  // Default benefits if not provided
  const getServiceBenefits = (service) => {
    if (service.key_benefits && service.key_benefits.length > 0) {
      return service.key_benefits;
    }

    return [
      "Enhanced security and protection",
      "Professional implementation",
      "24/7 support and monitoring",
      "Customized solutions for your needs",
      "Peace of mind and reliability",
    ];
  };

  // Default process if not provided
  const getServiceProcess = (service) => {
    if (
      service.implementation_process &&
      service.implementation_process.length > 0
    ) {
      return service.implementation_process;
    }

    return [
      "Free Security Assessment",
      "Custom Solution Design",
      "Professional Implementation",
      "Training & Support",
      "Ongoing Maintenance",
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f8fce] mx-auto"></div>
            <p className="mt-4 text-gray-600 font-poppins">
              Loading service details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-white">
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 font-montserrat">
              Service Not Found
            </h1>
            <p className="text-gray-600 mt-2 mb-4">
              {error || "The requested service could not be found."}
            </p>
            <Link
              href="/services"
              className="text-[#1f8fce] hover:underline mt-2 inline-block font-poppins"
            >
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const serviceFeatures = getServiceFeatures(service);
  const serviceBenefits = getServiceBenefits(service);
  const serviceProcess = getServiceProcess(service);

  return (
    <div className="min-h-screen bg-white">
      {/* Creative Inner Banner - Same as Services Page */}
      <section className="relative pt-8 pb-6 sm:pt-16 sm:pb-12 lg:pt-24 lg:pb-16 h-auto min-h-[40vh] sm:min-h-[50vh] lg:min-h-[450px] bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce] overflow-hidden">
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
              className="flex justify-center items-center space-x-2 text-white/80 text-xs sm:text-sm md:text-base mb-2 sm:mb-4 font-poppins"
            >
              <Link
                href="/"
                className="hover:text-white transition-colors duration-300"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/services"
                className="hover:text-white transition-colors duration-300"
              >
                Services
              </Link>
              <span>/</span>
              <span className="text-white font-semibold">{service.title}</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-montserrat mb-2 sm:mb-4"
            >
              <motion.span
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true, margin: "-30px" }}
                className="inline-block"
              >
                {splitText(service.title + " ")}
                <motion.span
                  variants={highlightVariants}
                  className="text-[#1f8fce] inline-block"
                >
                  {splitText("Solutions")}
                </motion.span>
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-sm sm:text-base md:text-lg text-white/90 font-poppins max-w-2xl mx-auto leading-relaxed mb-3 sm:mb-4 px-2 sm:px-0"
            >
              {service.description}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-4 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <Link
                href="/contact"
                className="rounded-md px-6 sm:px-8 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-white border-white text-[#1f8fce] hover:bg-[#1f8fce] hover:border-white hover:text-white transition-all duration-300 inline-flex items-center text-sm sm:text-base whitespace-nowrap"
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-[#1f8fce] top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative transition duration-300 ease font-semibold">
                  Get Free Consultation
                </span>
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-md px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                All Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Service Overview Section */}
      <section className="py-8 sm:py-10 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-montserrat mb-3">
                  About Our {service.title} Service
                </h2>
                <div className="text-gray-600 font-poppins text-sm sm:text-base leading-relaxed">
                  {service.detailedContent ? (
                    <div className="space-y-3">
                      {service.detailedContent.split('\n\n').map((paragraph, index) => (
                        paragraph.trim() && (
                          <p key={index} className="mb-3">
                            {paragraph.trim()}
                          </p>
                        )
                      ))}
                    </div>
                  ) : (
                    <p>{service.description}</p>
                  )}
                </div>
              </div>

              {/* Key Features */}
              <div className="mt-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-montserrat mb-3">
                  Key Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {serviceFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="flex items-start gap-2.5 p-2.5 bg-blue-50 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-[#1f8fce] flex-shrink-0 mt-1" />
                      <span className="text-gray-700 font-poppins text-sm leading-relaxed">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Image and Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="space-y-5 lg:sticky lg:top-20 lg:self-start"
            >
              {/* Service Image */}
              {service.image_url && (
                <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4">
                  <Image
                    src={service.image_url}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}

              {/* Benefits Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 font-montserrat mb-3">
                  Key Benefits
                </h3>
                <div className="space-y-2.5">
                  {serviceBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                      className="flex items-start gap-2.5"
                    >
                      <Star className="w-4 h-4 text-[#1f8fce] flex-shrink-0 mt-1" />
                      <span className="text-gray-700 font-poppins text-sm leading-relaxed">
                        {benefit}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-8 sm:py-10 lg:py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-6"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-montserrat mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 font-poppins text-base">
                Common questions about our {service.title} service
              </p>
            </motion.div>

            <div className="space-y-3">
              {service.faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-blue-200 shadow-sm"
                >
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 font-montserrat mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 font-poppins text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-8 sm:py-10 lg:py-12 bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-montserrat mb-3">
              Ready to Secure Your {service.title}?
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/90 font-poppins text-base sm:text-lg mb-6 max-w-2xl mx-auto"
            >
              Don&apos;t compromise on protection. Get a personalized quote and consultation for your specific {service.title.toLowerCase()} requirements in Gujarat.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full max-w-2xl mx-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto rounded-md px-6 sm:px-10 py-2.5 sm:py-3 overflow-hidden relative group cursor-pointer border-2 font-medium bg-[#1f8fce] border-[#1f8fce] text-white hover:bg-white hover:text-[#1f8fce] transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base whitespace-nowrap min-w-[180px]"
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative transition duration-300 ease font-semibold">
                  Get Free Quote
                </span>
              </Link>

              <Link
                href="/services"
                className="w-full sm:w-auto rounded-md px-6 sm:px-10 py-2.5 sm:py-3 overflow-hidden relative group cursor-pointer border-2 font-medium bg-transparent border-white text-white hover:bg-white hover:text-[#1f8fce] transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base whitespace-nowrap min-w-[180px]"
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative transition duration-300 ease font-semibold">
                  Explore All Services
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-8 sm:py-10 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-montserrat mb-2">
              Explore More Services
            </h2>
            <p className="text-gray-600 font-poppins text-sm sm:text-base">
              Discover our other comprehensive security solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {staticServices
              .filter((s) => s.title !== service.title)
              .slice(0, 3)
              .map((relatedService, index) => (
                <motion.div
                  key={relatedService.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-3xl mb-3">
                    {relatedService.icon || "🛡️"}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 font-montserrat mb-2">
                    {relatedService.title}
                  </h3>
                  <p className="text-gray-600 font-poppins text-sm mb-3 leading-relaxed">
                    {relatedService.description}
                  </p>
                  <Link
                    href={`/services/${relatedService.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-2 text-[#1f8fce] font-semibold hover:text-blue-600 transition-colors duration-300 font-poppins"
                  >
                    Learn More
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
