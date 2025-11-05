// lib/recaptcha.js
export const verifyRecaptcha = async (token) => {
  try {
    console.log('🔄 Sending reCAPTCHA token for verification...');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-recaptcha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('📊 reCAPTCHA verification response:', result);
    return result;
  } catch (error) {
    console.error('❌ reCAPTCHA verification failed:', error);
    return { 
      success: false, 
      error: error.message || 'Verification failed' 
    };
  }
};