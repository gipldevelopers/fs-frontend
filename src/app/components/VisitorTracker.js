// components/VisitorTracker.js
'use client';
import { useEffect } from 'react';
import { apiService } from '@/app/lib/api';

const VisitorTracker = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        console.log('👀 Tracking visitor...');
        
        // Check if we've already tracked this session
        const hasTracked = sessionStorage.getItem('visitorTracked');
        
        if (!hasTracked) {
          console.log('✅ First visit this session, incrementing counter');
          const result = await apiService.incrementVisitorCount();
          
          if (result && result.success) {
            console.log('📊 Visitor count incremented:', result.data.today);
            sessionStorage.setItem('visitorTracked', 'true');
          } else {
            console.log('❌ Failed to increment visitor count');
          }
        } else {
          console.log('🔁 Already tracked this session');
        }
      } catch (error) {
        console.log('💥 Visitor tracking error (normal in demo mode):', error.message);
      }
    };

    trackVisitor();
  }, []);

  return null; // This component doesn't render anything
};

export default VisitorTracker;