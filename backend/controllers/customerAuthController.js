const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../utils/email');

const generateToken = (customerId) => {
  return jwt.sign(
    { id: customerId, role: 'customer' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @desc    Request OTP — step 1
// @route   POST /api/customer/auth/request-otp
// @access  Public
const requestOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    const emailLower = email.toLowerCase().trim();

    // Rate limit: max 3 OTPs per email per 10 minutes
    const recentCount = await OTP.countDocuments({
      email: emailLower,
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }
    });

    if (recentCount >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please wait 10 minutes and try again.'
      });
    }

    // Delete any previous unused OTPs for this email
    await OTP.deleteMany({ email: emailLower, used: false });

    // Generate OTP
    const plainOTP = OTP.generateOTP();
    const otpHash = OTP.hashOTP(plainOTP);

    await OTP.create({
      email: emailLower,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Check if new or returning user
    const isExisting = await Customer.exists({ email: emailLower });

    // Send OTP email via Resend
    await sendOTPEmail({ email: emailLower, otp: plainOTP, isNew: !isExisting });

    res.json({
      success: true,
      message: `OTP sent to ${emailLower}. It expires in 10 minutes.`,
      isNewUser: !isExisting
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP & login/register — step 2
// @route   POST /api/customer/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, name } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const emailLower = email.toLowerCase().trim();
    const otpHash = OTP.hashOTP(otp.trim());

    const otpDoc = await OTP.findOne({
      email: emailLower,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpDoc) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Increment attempts
    otpDoc.attempts += 1;
    await otpDoc.save();

    // Max 5 wrong attempts
    if (otpDoc.attempts > 5) {
      await OTP.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ success: false, message: 'Too many wrong attempts. Please request a new OTP.' });
    }

    if (otpDoc.otpHash !== otpHash) {
      const left = 5 - otpDoc.attempts;
      return res.status(400).json({
        success: false,
        message: `Incorrect OTP. ${left} attempt${left !== 1 ? 's' : ''} remaining.`
      });
    }

    // Mark OTP as used
    otpDoc.used = true;
    await otpDoc.save();

    // Find or create customer
    let customer = await Customer.findOne({ email: emailLower });

    if (!customer) {
      if (!name || name.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'Please enter your name to complete registration.' });
      }
      customer = await Customer.create({ email: emailLower, name: name.trim() });
    }

    if (!customer.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact support.' });
    }

    customer.lastLogin = new Date();
    await customer.save();

    const token = generateToken(customer._id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        createdAt: customer.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current customer profile
// @route   GET /api/customer/profile
// @access  Private (customer)
const getProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.customer._id).select('-__v');
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, customer });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer profile
// @route   PUT /api/customer/profile
// @access  Private (customer)
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const updates = {};

    if (name && name.trim().length >= 2) updates.name = name.trim();
    if (phone !== undefined) {
      if (phone && !/^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).json({ success: false, message: 'Enter a valid 10-digit phone number' });
      }
      updates.phone = phone || null;
    }
    if (address !== undefined) updates.address = address.trim();

    const customer = await Customer.findByIdAndUpdate(
      req.customer._id, updates, { new: true, runValidators: true }
    ).select('-__v');

    res.json({ success: true, message: 'Profile updated!', customer });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer order history
// @route   GET /api/customer/orders
// @access  Private (customer)
const getMyOrders = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    const customer = await Customer.findById(req.customer._id);

    // Match by customerId OR by phone number (catches guest orders too)
    const query = {
      $or: [{ customerId: req.customer._id }]
    };
    if (customer.phone) {
      query.$or.push({ customerPhone: customer.phone });
    }

    const orders = await Order.find(query)
      .sort('-createdAt')
      .select('customerName items totalAmount status adminNotes notes createdAt');

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer service request history
// @route   GET /api/customer/service-requests
// @access  Private (customer)
const getMyServiceRequests = async (req, res, next) => {
  try {
    const ServiceRequest = require('../models/ServiceRequest');
    const customer = await Customer.findById(req.customer._id);

    const query = { $or: [{ customerId: req.customer._id }] };
    if (customer.phone) query.$or.push({ phone: customer.phone });

    const requests = await ServiceRequest.find(query)
      .sort('-createdAt')
      .select('name serviceType description status adminNotes createdAt');

    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    next(error);
  }
};

module.exports = { requestOTP, verifyOTP, getProfile, updateProfile, getMyOrders, getMyServiceRequests };