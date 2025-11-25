'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Star,
  User,
  RefreshCw,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { apiService } from '@/app/lib/api';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await apiService.getTestimonials();
      
      if (response && response.success) {
        setTestimonials(response.data);
      } else {
        setError('Failed to load testimonials');
      }
    } catch (error) {
      console.error('💥 Fetch testimonials error:', error);
      setError('Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (testimonialId) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      setDeleteLoading(testimonialId);
      await apiService.deleteTestimonial(testimonialId);
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleToggleStatus = async (testimonialId, currentStatus) => {
    try {
      setToggleLoading(testimonialId);
      await apiService.request(`api/testimonials/${testimonialId}/toggle`, {
        method: 'PATCH'
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling testimonial status:', error);
      alert('Failed to update testimonial status');
    } finally {
      setToggleLoading(null);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
              <p className="text-gray-600 mt-2">Manage customer testimonials</p>
            </div>
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
              <p className="text-gray-600 mt-2">
                {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}
              </p>
              
              
            </div>
            <div className="flex items-center gap-3">
              
              <Link
                href="/admin/testimonials/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Testimonial
              </Link>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Error Loading Testimonials</h3>
                <p className="text-sm mt-1">{error}</p>
                <button 
                  onClick={fetchTestimonials}
                  className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Grid */}
        {testimonials.length === 0 && !error ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <User className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials found</h3>
            <p className="text-gray-500 mb-4">
              Get started by adding your first testimonial
            </p>
            <Link
              href="/admin/testimonials/create"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Testimonial
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="p-6">
                  {/* Header with avatar and info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border border-gray-200 relative">
                      {testimonial.avatar_url ? (
                        <Image
                          src={testimonial.avatar_url}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {testimonial.designation}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        testimonial.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {testimonial.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Testimonial text */}
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 mb-4">
                    &quot;{testimonial.testimonial}&quot;
                  </p>

                  {/* Footer with date and actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      {formatDate(testimonial.created_at)}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(testimonial.id, testimonial.is_active)}
                        disabled={toggleLoading === testimonial.id}
                        className={`inline-flex items-center gap-1 text-sm transition-colors ${
                          testimonial.is_active 
                            ? 'text-green-600 hover:text-green-700' 
                            : 'text-gray-600 hover:text-gray-700'
                        } disabled:opacity-50`}
                      >
                        {toggleLoading === testimonial.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : testimonial.is_active ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                        {toggleLoading === testimonial.id ? 'Updating...' : testimonial.is_active ? 'Active' : 'Inactive'}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        disabled={deleteLoading === testimonial.id}
                        className="text-red-600 hover:text-red-700 transition-colors p-1 disabled:opacity-50"
                        title="Delete testimonial"
                      >
                        {deleteLoading === testimonial.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}