'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Eye,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { apiService } from '@/app/lib/api';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await apiService.getGallery();
      
      if (response && response.success) {
        setGallery(response.data);
      } else {
        setError('Failed to load gallery');
      }
    } catch (error) {
      console.error('💥 Fetch gallery error:', error);
      setError('Failed to load gallery images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      setDeleteLoading(imageId);
      await apiService.deleteImage(imageId);
      fetchGallery(); // Refresh the gallery
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePreview = (image) => {
    setSelectedImage(image);
  };

  const closePreview = () => {
    setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
              <p className="text-gray-600 mt-2">Manage your images</p>
            </div>
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
              <p className="text-gray-600 mt-2">
                {gallery.length} image{gallery.length !== 1 ? 's' : ''} in gallery
              </p>
            </div>
            <Link
              href="/admin/gallery/create"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Images
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Error Loading Gallery</h3>
                <p className="text-sm mt-1">{error}</p>
                <button 
                  onClick={fetchGallery}
                  className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {gallery.length === 0 && !error ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <ImageIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
            <p className="text-gray-500 mb-4">
              Get started by adding your first images
            </p>
            <Link
              href="/admin/gallery/create"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Images
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {gallery.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 group"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  {image.image_url ? (
                    <Image
                      src={image.image_url}
                      alt={image.image_name || 'Gallery image'}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreview(image)}
                        className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-colors"
                        title="Preview Image"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        disabled={deleteLoading === image.id}
                        className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-colors disabled:opacity-50"
                        title="Delete Image"
                      >
                        {deleteLoading === image.id ? (
                          <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-gray-700" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Image name */}
                <div className="p-3">
                  <p className="text-sm text-gray-600 truncate text-center">
                    {image.image_name || 'Untitled'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Image Preview Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
              onClick={closePreview}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={closePreview}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
                >
                  <X className="w-8 h-8" />
                </button>
                
                {/* Image */}
                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.image_name || 'Preview'}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                
                {/* Image name */}
                {selectedImage.image_name && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
                    <p className="text-sm truncate">{selectedImage.image_name}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}