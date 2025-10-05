const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = require('../config/config');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
};

// Send OTP email
const sendOTPEmail = async (email, name, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Toolshub API" <${EMAIL_FROM}>`,
      to: email,
      subject: 'Verify Your Email - Toolshub API',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .otp-code { font-size: 24px; font-weight: bold; color: #007bff; background: white; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0; letter-spacing: 3px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🚀 Welcome to Toolshub API</h2>
            </div>
            <div class="content">
              <h3>Hi ${name},</h3>
              <p>Thank you for registering with Toolshub API! To complete your registration, please verify your email address using the OTP code below:</p>

              <div class="otp-code">${otp}</div>

              <p><strong>Important:</strong></p>
              <ul>
                <li>This OTP is valid for 10 minutes only</li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>

              <p>After verification, you'll be able to:</p>
              <ul>
                <li>✅ Access your dashboard</li>
                <li>🔑 Generate your API key</li>
                <li>📊 Track your API usage</li>
                <li>🛠️ Use our tools and services</li>
              </ul>

              <p>Best regards,<br>Toolshub API Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 OTP email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, name, apiKey) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Toolshub API" <${EMAIL_FROM}>`,
      to: email,
      subject: 'Welcome to Toolshub API - Account Verified!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .api-key { font-family: monospace; font-size: 14px; background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 5px; margin: 15px 0; word-break: break-all; }
            .highlight { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🎉 Account Verified Successfully!</h2>
            </div>
            <div class="content">
              <h3>Congratulations ${name}!</h3>
              <p>Your Toolshub API account has been successfully verified. You can now access all our services!</p>

              ${apiKey ? `
              <h4>🔑 Your API Key:</h4>
              <div class="api-key">${apiKey}</div>

              <div class="highlight">
                <strong>⚠️ Important:</strong> Keep your API key secure and never share it publicly. You have <strong>1,000 free API calls</strong> to get started!
              </div>
              ` : ''}

              <h4>🚀 What's next?</h4>
              <ul>
                <li>📊 Visit your dashboard to monitor API usage</li>
                <li>📚 Check our documentation for available endpoints</li>
                <li>🛠️ Start building amazing applications with our tools</li>
              </ul>

              <p>Need help? Feel free to reach out to our support team.</p>

              <p>Happy coding!<br>Toolshub API Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Welcome email failed:', error);
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail
};