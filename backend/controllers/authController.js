const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Helper to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this based on your provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ 
      $or: [{ username: username }, { email: username.toLowerCase() }] 
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Create JWT
    const payload = {
      adminId: admin._id,
      username: admin.username,
      email: admin.email,
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_for_dev', { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      admin: payload
    });
  } catch (error) {
    console.error('[Login Error]', error.message);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin with this email not found.' });
    }

    const otp = generateOTP();
    // Valid for 15 minutes
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    admin.resetOtp = otp;
    admin.otpExpiry = expiry;
    await admin.save();

    // Send email
    const mailOptions = {
      from: `"EverWish Admin" <${process.env.EMAIL_USER}>`,
      to: admin.email,
      subject: 'Admin Password Reset OTP',
      text: `Your OTP for resetting the admin password is: ${otp}. It will expire in 15 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your admin password.</p>
          <p>Your OTP is: <strong style="font-size: 24px; color: #e11d48;">${otp}</strong></p>
          <p>This OTP will expire in 15 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.warn('⚠️ Nodemailer is not configured. Email was not sent. OTP is:', otp);
      // In dev mode if no email configured, we can return the OTP (NOT FOR PRODUCTION)
      if (process.env.NODE_ENV !== 'production') {
        return res.status(200).json({ success: true, message: 'DEV MODE: OTP generated.', otp });
      }
    }

    res.status(200).json({ success: true, message: 'OTP sent to email successfully.' });
  } catch (error) {
    console.error('[Forgot Password Error]', error.message);
    res.status(500).json({ success: false, message: 'Server error during password reset request.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required.' });
    }

    const admin = await Admin.findOne({ 
      email: email.toLowerCase(),
      resetOtp: otp,
      otpExpiry: { $gt: new Date() } // Ensure OTP has not expired
    });

    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    admin.resetOtp = null;
    admin.otpExpiry = null;
    await admin.save();

    res.status(200).json({ success: true, message: 'Password reset successfully. You can now login.' });
  } catch (error) {
    console.error('[Reset Password Error]', error.message);
    res.status(500).json({ success: false, message: 'Server error during password reset.' });
  }
};

// Route to initialize the first admin (can be disabled or removed in production once created)
exports.initAdmin = async (req, res) => {
  try {
    const { username, email, password, adminSecret } = req.body;
    
    // Simple security check so anyone can't create an admin
    if (adminSecret !== (process.env.INIT_ADMIN_SECRET || 'everwish-init-secret-123')) {
      return res.status(403).json({ success: false, message: 'Forbidden. Invalid init secret.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let admin = await Admin.findOne();
    if (admin && process.env.ALLOW_MULTIPLE_ADMINS !== 'true') {
      admin.username = username;
      admin.email = email.toLowerCase();
      admin.password = hashedPassword;
      await admin.save();
      return res.status(200).json({ success: true, message: 'Admin user updated successfully.' });
    }

    admin = new Admin({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await admin.save();
    res.status(201).json({ success: true, message: 'Admin user created successfully.' });
  } catch (error) {
    console.error('[Init Admin Error]', error.message);
    res.status(500).json({ success: false, message: 'Server error during admin init.' });
  }
};
