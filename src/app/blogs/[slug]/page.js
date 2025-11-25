"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Calendar, 
  User, 
  Clock, 
  ArrowLeft,
  MessageCircle,
  Tag,
} from 'lucide-react';
import { apiService } from '@/app/lib/api';

export default function BlogDetailPage({ params }) {
  const [slug, setSlug] = useState(null);
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getParams = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
      } catch (error) {
        console.error('Error resolving params:', error);
        setIsLoading(false);
      }
    };

    getParams();
  }, [params]);

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching blog post for slug:', slug);
      
      // Fetch the specific blog post
      const result = await apiService.getPublicBlogBySlug(slug);
      
      console.log('📝 Blog post API response:', result);
      
      if (result && result.success) {
        setPost(result.data);
        
        // Fetch all posts for related posts
        const relatedResult = await apiService.getAllBlogs();
        if (relatedResult && relatedResult.success) {
          // Handle different response structures
          let allPosts = [];
          
          if (Array.isArray(relatedResult.data)) {
            allPosts = relatedResult.data;
          } else if (Array.isArray(relatedResult.blogs)) {
            allPosts = relatedResult.blogs;
          } else if (Array.isArray(relatedResult)) {
            allPosts = relatedResult;
          }
          
          // Filter out current post and take first 3 published posts
          const filtered = allPosts
            .filter(p => (p.slug !== slug) && (!p.status || p.status === 'published'))
            .slice(0, 3);
          setRelatedPosts(filtered);
        }
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('❌ Error fetching blog post:', error);
      setError('Failed to load blog post');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f8fce] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-poppins">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 font-montserrat">Blog Post Not Found</h1>
          <p className="text-gray-600 mt-2">{error || 'The blog post you are looking for does not exist.'}</p>
          <Link href="/blogs" className="text-[#1f8fce] hover:underline mt-4 inline-block font-poppins">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Creative Inner Banner */}
      <section className="relative pt-10 pb-8 sm:pt-20 sm:pb-16 lg:pt-32 lg:pb-24 h-auto min-h-[45vh] sm:min-h-[70vh] lg:min-h-[500px] bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce] overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-12 h-12 sm:top-6 sm:left-6 sm:w-16 sm:h-16 lg:top-10 lg:left-10 lg:w-20 lg:h-20 bg-white/10 rounded-full blur-lg sm:blur-xl"></div>
          <div className="absolute top-1/3 right-4 w-16 h-16 sm:top-1/2 sm:right-6 sm:w-20 sm:h-20 lg:top-1/2 lg:right-20 lg:w-32 lg:h-32 bg-[#1f8fce]/20 rounded-full blur-lg sm:blur-xl lg:blur-2xl"></div>
          <div className="absolute bottom-4 left-1/4 w-12 h-12 sm:bottom-6 sm:left-1/3 sm:w-16 sm:h-16 lg:bottom-10 lg:left-1/3 lg:w-24 lg:h-24 bg-white/5 rounded-full blur-md sm:blur-lg"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-12 pb-0 sm:py-0"
          >
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center items-center space-x-2 text-white/80 text-xs sm:text-sm md:text-base mb-3 sm:mb-6 font-poppins"
            >
              <Link href="/" className="hover:text-white transition-colors duration-300">
                Home
              </Link>
              <span>/</span>
              <Link href="/blogs" className="hover:text-white transition-colors duration-300">
                Blogs
              </Link>
              <span>/</span>
              <span className="text-white font-semibold">{post.title}</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-montserrat mb-3 sm:mb-6"
            >
              {post.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-sm sm:text-lg md:text-xl text-white/90 font-poppins max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6 px-2 sm:px-0"
            >
              {post.excerpt}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-4 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 rounded-md px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                All Blog Posts
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-8"
            >
              {/* Article Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{post.author || 'Admin'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.published_at || post.created_at || post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.read_time || '5 min read'}</span>
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#1f8fce] to-[#1a1a5e] text-white rounded-full text-sm font-medium"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Featured Image */}
              {(post.featured_image_url || post.image) && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl mb-8"
                >
                  <Image
                    src={post.featured_image_url || post.image}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </motion.div>
              )}

              {/* Blog Content */}
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="prose prose-lg max-w-none"
              >
                <div 
                  className="text-gray-700 font-poppins leading-relaxed text-base sm:text-lg"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content || post.description || `
                      <p>${post.excerpt}</p>
                      <p>This blog post content is currently being updated. Please check back later for the full article.</p>
                    `
                  }}
                />
              </motion.article>

              {/* Article Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12 pt-8 border-t border-gray-200"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1f8fce] to-[#1a1a5e] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {(post.author || 'Admin').split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{post.author || 'Admin'}</h4>
                      <p className="text-gray-600 text-sm">Security Expert</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1f8fce] to-[#1a1a5e] text-white rounded-lg hover:from-[#167aac] hover:to-[#141452] transition-all duration-300">
                      <MessageCircle className="w-4 h-4" />
                      Leave a Comment
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-4 space-y-8"
            >
              <div className="sticky top-24 space-y-8">
                {/* Author Card */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    About the Author
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1f8fce] to-[#1a1a5e] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {(post.author || 'Admin').split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{post.author || 'Admin'}</h4>
                      <p className="text-[#1f8fce] text-sm font-medium">Security Specialist</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {post.author || 'Our security expert'} is a certified security professional with years of experience in security solutions. Passionate about helping families and businesses stay secure.
                  </p>
                </div>

                {/* CTA Card */}
                <div className="bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce] rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-3">Need Security Help?</h3>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">
                    Get professional security consultation tailored to your specific needs and requirements.
                  </p>
                  <Link
                    href="/contact"
                    className="w-full inline-block text-center rounded-lg px-6 py-3 bg-white text-[#1f8fce] font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
                  >
                    Get Free Consultation
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Continue Reading
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover more insights and security tips from our experts
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.article
                  key={relatedPost.id || relatedPost._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-blue-200"
                >
                  <div className="relative h-48 overflow-hidden">
                    {(relatedPost.featured_image_url || relatedPost.image) ? (
                      <Image
                        src={relatedPost.featured_image_url || relatedPost.image}
                        alt={relatedPost.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(relatedPost.published_at || relatedPost.created_at || relatedPost.date).toLocaleDateString()}</span>
                      <span>{relatedPost.read_time || '5 min read'}</span>
                    </div>
                    <Link
                      href={`/blogs/${relatedPost.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-[#1f8fce] font-semibold hover:text-[#1a1a5e] transition-colors duration-300 group-hover:gap-3"
                    >
                      Read More
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay Updated with Security Insights
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Get the latest security tips, trends, and expert advice delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-white/30 bg-white/10 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-white/70"
              />
              <button className="px-6 py-3 bg-white text-[#1f8fce] rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}