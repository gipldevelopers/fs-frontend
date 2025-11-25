'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Image as ImageIcon,
  ArrowLeft,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react';
import { apiService } from '@/app/lib/api';

export default function CreateGalleryPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setError('');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index].url);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      setError('Please select at least one image');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Create FormData for multiple file upload
      const submitData = new FormData();
      
      selectedFiles.forEach((file, index) => {
        submitData.append('images', file);
      });

      // Get token for authorization
      const token = apiService.getToken();
      if (!token) {
        setError('Please login first');
        router.push('/admin/login');
        return;
      }

      console.log('🔄 Uploading gallery images...');

      const response = await fetch('http://localhost:5000/api/gallery', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const result = await response.json();
      console.log('📡 Server response:', result);

      if (response.ok) {
        setSuccess(`${selectedFiles.length} images uploaded successfully!`);
        
        // Clear selected files and previews
        previewUrls.forEach(preview => {
          URL.revokeObjectURL(preview.url);
        });
        setSelectedFiles([]);
        setPreviewUrls([]);
        
        // Redirect after success
        setTimeout(() => {
          router.push('/admin/gallery');
        }, 2000);
      } else {
        setError(result.error || 'Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Network error. Please check if backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Clean up object URLs on unmount
  useState(() => {
    return () => {
      previewUrls.forEach(preview => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Images</h1>
              <p className="text-gray-600 mt-2">Upload images to your gallery</p>
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

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Upload Images</h2>
          </div>
          
          <div className="p-6">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-gray-400">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="flex flex-col items-center justify-center gap-2">
                <label htmlFor="images" className="cursor-pointer">
                  <span className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Choose Images
                  </span>
                  <input
                    ref={fileInputRef}
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                  />
                </label>
                <p className="text-sm text-gray-500">
                  PNG, JPG, JPEG up to 10MB each
                </p>
                <p className="text-xs text-gray-400">
                  You can select multiple images at once
                </p>
              </div>
            </div>

            {/* Selected Images Preview */}
            {previewUrls.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Selected Images ({previewUrls.length})
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <AnimatePresence>
                    {previewUrls.map((preview, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                          <Image
                            src={preview.url}
                            alt={`Preview ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Remove button */}
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        
                        {/* File name */}
                        <p className="text-xs text-gray-600 truncate mt-2 text-center px-1">
                          {preview.name}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Upload Button */}
                <div className="mt-8 flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Uploading {selectedFiles.length} Images...
                      </>
                    ) : (
                      `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`
                    )}
                  </button>
                  <Link
                    href="/admin/gallery"
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Upload Guidelines</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Select multiple images at once</li>
            <li>• Supported formats: JPG, PNG, WebP</li>
            <li>• Maximum file size: 10MB per image</li>
            <li>• Images will be automatically optimized for display</li>
          </ul>
        </div>
      </div>
    </div>
  );
}