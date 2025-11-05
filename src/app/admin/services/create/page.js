'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { tokenManager } from '../../../utils/token';
import Image from 'next/image';

export default function CreateService() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    features: [''],
    key_benefits: [''],
    implementation_process: [''],
    seo_title: '',
    seo_description: '',
    seo_keywords: ''
  });

  const [serviceImage, setServiceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Check authentication on component mount
  useState(() => {
    if (!tokenManager.isAuthenticated()) {
      router.push('/admin/login');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // Check authentication
      if (!tokenManager.isAuthenticated()) {
        setError('Please login first');
        router.push('/admin/login');
        return;
      }

      // Filter out empty items from arrays
      const filteredFeatures = formData.features.filter(item => item.trim() !== '');
      const filteredBenefits = formData.key_benefits.filter(item => item.trim() !== '');
      const filteredProcess = formData.implementation_process.filter(item => item.trim() !== '');

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('features', JSON.stringify(filteredFeatures));
      formDataToSend.append('key_benefits', JSON.stringify(filteredBenefits));
      formDataToSend.append('implementation_process', JSON.stringify(filteredProcess));
      formDataToSend.append('seo_title', formData.seo_title);
      formDataToSend.append('seo_description', formData.seo_description);
      formDataToSend.append('seo_keywords', formData.seo_keywords);

      // Append image if selected
      if (serviceImage) {
        formDataToSend.append('service_image', serviceImage);
      }

      const response = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenManager.getToken()}`
        },
        body: formDataToSend
      });

      if (response.status === 401) {
        tokenManager.clearToken();
        router.push('/admin/login');
        return;
      }

      const result = await response.json();

      if (response.ok) {
        router.push('/admin/services');
      } else {
        setError(result.error || 'Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      setError('Error creating service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generic functions to handle dynamic arrays
  const addArrayItem = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: [...formData[fieldName], '']
    });
  };

  const updateArrayItem = (fieldName, index, value) => {
    const newArray = [...formData[fieldName]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [fieldName]: newArray
    });
  };

  const removeArrayItem = (fieldName, index) => {
    if (formData[fieldName].length > 1) {
      const newArray = formData[fieldName].filter((_, i) => i !== index);
      setFormData({
        ...formData,
        [fieldName]: newArray
      });
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setServiceImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setServiceImage(null);
    setImagePreview('');
  };

  // Auto-generate SEO fields based on title
  const generateSEOFields = (title) => {
    if (title && !formData.seo_title) {
      setFormData(prev => ({
        ...prev,
        seo_title: `${title} | Forever Security`,
        seo_description: `Professional ${title.toLowerCase()} services with comprehensive security solutions. Protect your assets with our expert ${title.toLowerCase()} systems.`,
        seo_keywords: `${title.toLowerCase()}, security systems, protection services, ${title.toLowerCase()} solutions`
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create New Service</h1>
          <p className="text-gray-600 mt-2">Add a new security service to your offerings</p>
        </div>
        <Link
          href="/admin/services"
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          Back to Services
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Service Creation Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Service Details</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    generateSEOFields(e.target.value);
                  }}
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., CCTV Surveillance"
                  required
                />
              </div>
              
              {/* Service Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Image
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4 relative">
                    <div className="w-32 h-32 relative rounded-lg overflow-hidden border border-gray-300">
                      <Image
                        src={imagePreview}
                        alt="Service preview"
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {/* File Input */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    id="service_image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="service_image"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {imagePreview ? 'Change Image' : 'Choose Service Image'}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, WEBP (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="6"
                className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the service in detail. Include key benefits, features, and what customers can expect."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>
          </div>

          {/* Key Features Section */}
          <DynamicArraySection
            title="Key Features"
            fieldName="features"
            items={formData.features}
            onAdd={() => addArrayItem('features')}
            onUpdate={(index, value) => updateArrayItem('features', index, value)}
            onRemove={(index) => removeArrayItem('features', index)}
            placeholder="e.g., 24/7 Professional Monitoring"
          />

          {/* Key Benefits Section */}
          <DynamicArraySection
            title="Key Benefits"
            fieldName="key_benefits"
            items={formData.key_benefits}
            onAdd={() => addArrayItem('key_benefits')}
            onUpdate={(index, value) => updateArrayItem('key_benefits', index, value)}
            onRemove={(index) => removeArrayItem('key_benefits', index)}
            placeholder="e.g., Protect your family and belongings"
          />

          {/* Implementation Process Section */}
          <DynamicArraySection
            title="Implementation Process"
            fieldName="implementation_process"
            items={formData.implementation_process}
            onAdd={() => addArrayItem('implementation_process')}
            onUpdate={(index, value) => updateArrayItem('implementation_process', index, value)}
            onRemove={(index) => removeArrayItem('implementation_process', index)}
            placeholder="e.g., Free Security Assessment"
          />

          {/* SEO Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">SEO Settings</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title *
                </label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Professional CCTV Surveillance Systems | Forever Security"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.seo_title.length}/60 characters (Recommended for SEO)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description *
                </label>
                <textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  rows="3"
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description for search engines (155-160 characters recommended)"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.seo_description.length}/160 characters (Recommended for SEO)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={formData.seo_keywords}
                  onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., cctv surveillance, security cameras, home security systems"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate keywords with commas
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Service...
                </>
              ) : (
                'Create Service'
              )}
            </button>
            <Link
              href="/admin/services"
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable component for dynamic arrays (Features, Benefits, Process)
function DynamicArraySection({ title, fieldName, items, onAdd, onUpdate, onRemove, placeholder }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {title}
        </label>
        <button
          type="button"
          onClick={onAdd}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1"
        >
          <span>+</span>
          Add {title.split(' ').pop()}
        </button>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 items-center">
            <div className="flex-1 flex gap-3">
              <span className="text-gray-500 w-6 text-sm">{index + 1}.</span>
              <input
                type="text"
                value={item}
                onChange={(e) => onUpdate(index, e.target.value)}
                className="flex-1 text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={placeholder}
              />
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="px-3 py-2 text-red-500 hover:text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Add {title.toLowerCase()} that will be displayed on the service details page
      </p>
    </div>
  );
}