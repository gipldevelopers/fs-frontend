"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  Search,
  Filter,
  Image as ImageIcon,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { apiService } from '@/app/lib/api';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 8,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    fetchBlogs(pagination.currentPage);
  }, [pagination.currentPage]);

  useEffect(() => {
    const filtered = blogs.filter(blog =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  const fetchBlogs = async (page = 1) => {
    try {
      setIsLoading(true);
      setError('');
      console.log('🔄 Fetching blogs from API...');
      
      // Add pagination parameters to API call
      const response = await apiService.getBlogs(`?page=${page}&limit=8`);
      console.log('📡 Full API Response:', response);
      
      if (response && response.success) {
        console.log('✅ Response has success structure');
        
        // Handle paginated response
        if (response.pagination) {
          setBlogs(response.data);
          setPagination(response.pagination);
        } else if (Array.isArray(response.data)) {
          // Fallback for non-paginated response
          setBlogs(response.data);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: response.data.length,
            itemsPerPage: response.data.length,
            hasNextPage: false,
            hasPrevPage: false
          });
        } else {
          setBlogs(response.data || []);
        }
      } else {
        const errorMessage = response?.error || response?.message || 'Failed to fetch blogs';
        console.error('❌ API Error:', errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('💥 Fetch blogs error:', error);
      setError(`Network error: ${error.message}. Please check if backend server is running.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      setDeleteLoading(blogId);
      await apiService.deleteBlog(blogId);
      // Refetch current page after deletion
      fetchBlogs(pagination.currentPage);
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      goToPage(pagination.currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (pagination.hasPrevPage) {
      goToPage(pagination.currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    goToPage(1);
  };

  const goToLastPage = () => {
    goToPage(pagination.totalPages);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
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

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
              <p className="text-gray-600 mt-2">Create and manage your blog posts</p>
            </div>
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
              <p className="text-gray-600 mt-2">Create and manage your blog posts</p>
              
              
            </div>
            <div className="flex items-center gap-3">
              
              <Link
                href="/admin/blogs/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Blog Post
              </Link>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Error Loading Blogs</h3>
                <p className="text-sm mt-1">{error}</p>
                <button 
                  onClick={() => fetchBlogs(1)}
                  className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        {blogs.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search blogs by title, content, or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-gray-700 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="inline-flex bg-blue-600 items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg  hover:bg-blue-700">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>
        )}

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 && !error ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first blog post'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => fetchBlogs(1)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <Link
                href="/admin/blogs/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Blog Post
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
                >
                  {/* Featured Image */}
                  <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden relative">
                    {blog.featured_image_url ? (
                      <Image
                        src={blog.featured_image_url}
                        alt={blog.title}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${blog.featured_image_url ? 'hidden' : ''}`}>
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        blog.is_published !== false 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.is_published !== false ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {blog.title || 'Untitled Blog Post'}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {blog.excerpt || 'No excerpt provided...'}
                    </p>
                    
                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(blog.published_at || blog.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{blog.read_time || '5 min read'}</span>
                      </div>
                    </div>
                    
                    {/* Author */}
                    <div className="text-sm text-gray-600 mb-4">
                      By {blog.author || 'Admin'}
                    </div>
                    
                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            +{blog.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/blogs/${blog.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/blogs/edit/${blog.id}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          disabled={deleteLoading === blog.id}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors text-sm disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deleteLoading === blog.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination - Bottom Right Corner */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-end items-center space-x-4">
                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalItems} total blogs
                </div>
                
                {/* Pagination Controls */}
                <div className="flex items-center space-x-1">
                  {/* First Page */}
                  <button
                    onClick={goToFirstPage}
                    disabled={!pagination.hasPrevPage}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="First Page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Previous Page */}
                  <button
                    onClick={goToPrevPage}
                    disabled={!pagination.hasPrevPage}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        page === pagination.currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Page */}
                  <button
                    onClick={goToNextPage}
                    disabled={!pagination.hasNextPage}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={goToLastPage}
                    disabled={!pagination.hasNextPage}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Last Page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}