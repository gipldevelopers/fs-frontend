import { NextResponse } from 'next/server';

// Verify reCAPTCHA token
async function verifyRecaptchaToken(token) {
  if (!token) {
    return { success: false, error: 'No reCAPTCHA token provided' };
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.warn('⚠️ RECAPTCHA_SECRET_KEY not set, skipping verification');
      // In production, we should fail if secret key is not set
      if (process.env.NODE_ENV === 'production') {
        return { success: false, error: 'reCAPTCHA configuration error' };
      }
      return { success: true }; // Allow in development only
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    
    // Log detailed error information for debugging
    if (!data.success) {
      console.error('❌ reCAPTCHA verification failed:', {
        success: data.success,
        'error-codes': data['error-codes'],
        challenge_ts: data.challenge_ts,
        hostname: data.hostname,
        action: data.action,
      });
      
      // Log specific browser-error details
      if (data['error-codes']?.includes('browser-error')) {
        console.error('🔍 Browser Error Details:', {
          message: 'This error typically occurs when:',
          reasons: [
            '1. The domain where the token was generated is not authorized in reCAPTCHA settings',
            '2. The token was generated on a different domain than where it\'s being verified',
            '3. The reCAPTCHA site key is not configured for the production domain',
          ],
          currentHostname: data.hostname,
          suggestion: 'Add your production domain (fs-frontend-six.vercel.app) to reCAPTCHA allowed domains',
        });
      }
    }
    
    if (data.success) {
      return { success: true, score: data.score };
    } else {
      // Provide more detailed error message
      const errorCodes = data['error-codes'] || [];
      let errorMessage = 'reCAPTCHA verification failed';
      
      if (errorCodes.includes('invalid-input-secret')) {
        errorMessage = 'Invalid reCAPTCHA secret key. Please check your environment variables.';
      } else if (errorCodes.includes('invalid-input-response')) {
        errorMessage = 'Invalid reCAPTCHA token. Please try again.';
      } else if (errorCodes.includes('timeout-or-duplicate')) {
        errorMessage = 'reCAPTCHA token expired. Please refresh and try again.';
      } else if (errorCodes.includes('browser-error')) {
        errorMessage = 'reCAPTCHA browser error. This usually means the domain is not authorized. Please add your production domain to reCAPTCHA settings.';
      } else if (errorCodes.length > 0) {
        errorMessage = `reCAPTCHA error: ${errorCodes.join(', ')}`;
      }
      
      return { success: false, error: errorMessage, errorCodes };
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, error: 'Failed to verify reCAPTCHA. Please try again.' };
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, recaptchaToken } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA (required)
    if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'reCAPTCHA token is required' },
        { status: 400 }
      );
    }

    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);
    if (!recaptchaResult.success) {
      console.error('❌ reCAPTCHA verification failed:', {
        error: recaptchaResult.error,
        errorCodes: recaptchaResult.errorCodes,
        hasSecretKey: !!process.env.RECAPTCHA_SECRET_KEY,
        environment: process.env.NODE_ENV,
      });
      
      return NextResponse.json(
        { 
          error: recaptchaResult.error || 'reCAPTCHA verification failed',
          details: process.env.NODE_ENV === 'development' ? recaptchaResult.errorCodes : undefined
        },
        { status: 400 }
      );
    }

    console.log('✅ reCAPTCHA verified successfully, score:', recaptchaResult.score);

    // Email configuration - using a simple approach with fetch to email service
    // You can use services like Resend, SendGrid, or Nodemailer
    // For now, we'll use a simple approach that can work with various email services
    
    // Option 1: Using Resend (recommended - add to package.json: npm install resend)
    // Option 2: Using Nodemailer with Gmail SMTP
    // Option 3: Using EmailJS or similar service
    
    // For this implementation, we'll create a simple email sending function
    // that can be configured with environment variables
    
    const emailContent = `
      New Contact Form Submission
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Subject: ${subject}
      
      Message:
      ${message}
      
      ---
      This message was sent from the Forever Security Services contact form.
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a5e 0%, #1f8fce 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1f8fce; }
            .value { margin-top: 5px; }
            .message-box { background: white; padding: 15px; border-left: 4px solid #1f8fce; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
              <p>Forever Security Services</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              ${phone ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email using Nodemailer with SMTP
    try {
      // Use MAIL_* environment variables or fallback to SMTP_*
      const smtpHost = process.env.MAIL_HOST || process.env.SMTP_HOST;
      const smtpPort = process.env.MAIL_PORT || process.env.SMTP_PORT || '465';
      const smtpUser = process.env.MAIL_USERNAME || process.env.SMTP_USER;
      const smtpPass = process.env.MAIL_PASSWORD || process.env.SMTP_PASS;
      const smtpFrom = process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME || smtpUser;
      const toEmail = process.env.TO_EMAIL || 'vraj@gohilinfotech.com';
      const useSSL = process.env.MAIL_ENCRYPTION === 'ssl' || smtpPort === '465';

      if (!smtpHost || !smtpUser || !smtpPass) {
        return NextResponse.json(
          { error: 'Email service not configured. Please set up SMTP credentials in .env.local' },
          { status: 500 }
        );
      }

      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: useSSL, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: toEmail,
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        text: emailContent,
        html: htmlContent,
      });

      console.log('✅ Email sent successfully via SMTP to', toEmail);

      return NextResponse.json(
        { success: true, message: 'Message sent successfully' },
        { status: 200 }
      );
    } catch (nodemailerError) {
      console.error('❌ Nodemailer error:', nodemailerError.message);
      console.error('Full error:', nodemailerError);
      
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

