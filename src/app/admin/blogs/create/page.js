"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Save,
  Eye,
  Clock,
  Tag,
  Upload,
  X
} from 'lucide-react';
import { apiService } from '@/app/lib/api';

export default function CreateBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Admin',
    tags: [],
    read_time: '5 min read',
    meta_title: '',
    meta_description: '',
    is_published: true
  });

  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum size is 5MB.');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload JPG, PNG, or WEBP images.');
        return;
      }

      setFeaturedImage(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFeaturedImage(null);
    setImagePreview('');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔄 Starting blog creation...');
      
      // Check authentication
      const token = apiService.getToken();
      if (!token) {
        setError('Authentication required. Please login first.');
        setIsLoading(false);
        return;
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Append all form fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('excerpt', formData.excerpt);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('read_time', formData.read_time);
      formDataToSend.append('meta_title', formData.meta_title);
      formDataToSend.append('meta_description', formData.meta_description);
      formDataToSend.append('is_published', formData.is_published.toString());
      
      // Append featured image if selected
      if (featuredImage) {
        formDataToSend.append('featured_image', featuredImage);
        console.log('📸 Image attached:', featuredImage.name);
      }

      console.log('📤 Sending FormData with image support...');

      // Use direct fetch with FormData for file upload
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/blogs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData - let browser set it with boundary
        },
        body: formDataToSend
      });

      const data = await response.json();
      console.log('📡 Create blog response:', data);

      if (data.success) {
        console.log('✅ Blog created successfully');
        router.push('/admin/blogs');
      } else {
        setError(data.error || 'Failed to create blog');
      }
    } catch (error) {
      console.error('💥 Error creating blog:', error);
      setError('Failed to create blog: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
          <p className="text-gray-600 mt-2">Fill in the details to create a new blog post</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-start">
              <div>
                <p>{error}</p>
                {error.includes('Authentication failed') && (
                  <Link
                    href="/admin/login"
                    className="inline-block mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Go to Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content - 3/4 width */}
            <div className="xl:col-span-3 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-lg shadow p-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter blog post title..."
                />
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-lg shadow p-6">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the blog post..."
                />
              </div>

              {/* Content */}
              <div className="bg-white rounded-lg shadow p-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows="15"
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your blog content here..."
                />
              </div>
            </div>

            {/* Sidebar - 1/4 width */}
            <div className="space-y-6">
              {/* Publish */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Publish</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_published"
                      name="is_published"
                      checked={formData.is_published}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                      Published
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Publishing...' : 'Publish Blog'}
                  </button>
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Featured Image
                </h3>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Featured preview"
                      width={800}
                      height={192}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {/* File Input */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    id="featured_image"
                    accept="image/jpeg, image/jpg, image/png, image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="featured_image"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {imagePreview ? 'Change Image' : 'Choose Image'}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, WEBP (Max 5MB)
                  </p>
                  {featuredImage && (
                    <p className="text-xs text-green-600 mt-1">
                      Selected: {featuredImage.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Add tag..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-blue-900 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {formData.tags.length === 0 && (
                      <p className="text-gray-500 text-sm">No tags added</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Meta Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Meta Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="read_time" className="block text-sm font-medium text-gray-700 mb-1">
                      Read Time
                    </label>
                    <input
                      type="text"
                      id="read_time"
                      name="read_time"
                      value={formData.read_time}
                      onChange={handleInputChange}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="5 min read"
                    />
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      id="meta_title"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleInputChange}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      id="meta_description"
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}