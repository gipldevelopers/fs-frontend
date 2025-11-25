'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Upload, 
  User,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react';
import { apiService } from '@/app/lib/api';

export default function CreateTestimonialPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    testimonial: '',
    rating: 5,
    is_active: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating: rating
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validation
      if (!formData.name.trim()) {
        setError('Name is required');
        return;
      }

      if (!formData.testimonial.trim()) {
        setError('Testimonial text is required');
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('designation', formData.designation.trim());
      submitData.append('testimonial', formData.testimonial.trim());
      submitData.append('rating', formData.rating.toString());
      submitData.append('is_active', formData.is_active ? 'true' : 'false');
      
      const avatarInput = document.getElementById('avatar');
      if (avatarInput.files[0]) {
        submitData.append('avatar', avatarInput.files[0]);
      }

      // Get token for authorization
      const token = apiService.getToken();
      if (!token) {
        setError('Please login first');
        router.push('/admin/login');
        return;
      }

      console.log('🔄 Creating testimonial...');

      const response = await fetch('http://localhost:5000/api/testimonials', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const result = await response.json();
      console.log('📡 Server response:', result);

      if (response.ok) {
        setSuccess('Testimonial created successfully!');
        setFormData({
          name: '',
          designation: '',
          testimonial: '',
          rating: 5,
          is_active: true
        });
        setAvatarPreview(null);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Redirect after success
        setTimeout(() => {
          router.push('/admin/testimonials');
        }, 2000);
      } else {
        setError(result.error || 'Failed to create testimonial');
      }
    } catch (error) {
      console.error('Error creating testimonial:', error);
      setError('Network error. Please check if backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => handleRatingChange(index + 1)}
        className={`text-2xl ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        } hover:text-yellow-500 transition-colors`}
      >
        <Star className={index < rating ? 'fill-current' : ''} />
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/testimonials"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Testimonials
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Testimonial</h1>
              <p className="text-gray-600 mt-2">Create a new customer testimonial</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Testimonial Details</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Avatar Image (Optional)
              </label>
              
              {/* Avatar Preview */}
              {avatarPreview && (
                <div className="mb-4">
                  <div className="relative inline-block w-20 h-20 rounded-full overflow-hidden border border-gray-300">
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarPreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Upload Area */}
              <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors hover:border-gray-400 ${avatarPreview ? 'hidden' : ''}`}>
                <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="flex flex-col items-center justify-center gap-2">
                  <label htmlFor="avatar" className="cursor-pointer">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2 text-sm">
                      <Upload className="w-4 h-4" />
                      Choose Avatar
                    </span>
                    <input
                      ref={fileInputRef}
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Name and Designation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div>
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., CEO at Company"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex items-center gap-1">
                {renderStars(formData.rating)}
                <span className="ml-2 text-sm text-gray-600">
                  {formData.rating} out of 5
                </span>
              </div>
            </div>

            {/* Testimonial */}
            <div>
              <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700 mb-2">
                Testimonial *
              </label>
              <textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleInputChange}
                rows="6"
                className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the customer testimonial..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.testimonial.length}/1000 characters
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active (Visible on website)
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating Testimonial...
                  </>
                ) : (
                  'Create Testimonial'
                )}
              </button>
              <Link
                href="/admin/testimonials"
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Testimonial Guidelines</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use real customer names and designations for authenticity</li>
            <li>• Keep testimonials genuine and specific</li>
            <li>• Include relevant details about your services</li>
            <li>• Avatar images should be professional and clear</li>
            <li>• Active testimonials will be displayed on the website</li>
          </ul>
        </div>
      </div>
    </div>
  );
}