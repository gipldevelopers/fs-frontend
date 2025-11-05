"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle } from "lucide-react";

export default function CertificationsSection() {
  // Certifications data with images
  const certifications = [
    {
      id: 1,
      title: "Gujarat State Security License",
      image: "/images/gujarat-license.jpg",
      year: "2024"
    },
    {
      id: 2,
      title: "ISO 9001:2015 Certified",
      image: "/images/iso-certified.jpg", 
      year: "2024"
    },
    {
      id: 3,
      title: "Advanced Security Training",
      image: "/images/security-training.jpg",
      year: "2024"
    },
    {
      id: 4,
      title: "Emergency Response Certified",
      image: "/images/emergency-response.jpg",
      year: "2023"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Licensed & Certified Security Excellence
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#838383] max-w-2xl mx-auto"
          >
            We maintain the highest standards of professionalism and compliance through rigorous certifications and continuous training programs.
          </motion.p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Image Placeholder */}
              <div className="w-20 h-20 bg-gradient-to-br from-[#1f8fce] to-[#1a1a5e] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-white" />
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {cert.title}
              </h3>
              
              {/* Year */}
              <div className="flex items-center justify-center text-[#1f8fce] text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Valid {cert.year}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}