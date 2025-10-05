const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { sendOTPEmail, sendWelcomeEmail } = require('../utils/emailService');
const { registerSchema, loginSchema, verifyOtpSchema, resendOtpSchema } = require('../utils/validation');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'User already exists and is verified'
        });
      } else {
        // User exists but not verified, update and resend OTP
        const otp = generateOTP();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        existingUser.name = name;
        existingUser.password = password;
        existingUser.otp = otp;
        existingUser.otpExpire = otpExpire;
        await existingUser.save();

        // Send OTP email
        const emailSent = await sendOTPEmail(email, name, otp);
        if (!emailSent) {
          return res.status(500).json({
            success: false,
            message: 'Failed to send verification email'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Registration updated. Please check your email for verification code.',
          data: {
            email: existingUser.email,
            isVerified: false
          }
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpire
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email, name, otp);
    if (!emailSent) {
      // If email fails, delete the user and return error
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification code.',
      data: {
        email: user.email,
        isVerified: false
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    // Validate input
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, otp } = req.body;

    // Find user with OTP
    const user = await User.findOne({
      email,
      otp,
      otpExpire: { $gt: Date.now() }
    }).select('+otp +otpExpire');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Verify user and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    // Generate API key automatically
    user.generateApiKey();

    await user.save();

    // Send welcome email with API key
    await sendWelcomeEmail(user.email, user.name, user.apiKey);

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Welcome to Toolshub API.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: true,
          apiKey: user.apiKey,
          hitLimit: user.hitLimit,
          hitCount: user.hitCount
        }
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP verification'
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  try {
    // Validate input
    const { error } = resendOtpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, user.name, otp);
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'New verification code sent to your email'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP resend'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    // Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: true,
          apiKey: user.apiKey,
          hitLimit: user.hitLimit,
          hitCount: user.hitCount,
          hitsRemaining: user.hitLimit - user.hitCount
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login
};