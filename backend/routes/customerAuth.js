const express = require('express');
const router = express.Router();
const {
  requestOTP, verifyOTP, getProfile, updateProfile,
  getMyOrders, getMyServiceRequests
} = require('../controllers/customerAuthController');
const { customerProtect } = require('../middleware/customerAuth');

// OTP auth flow (public)
router.post('/auth/request-otp', requestOTP);
router.post('/auth/verify-otp', verifyOTP);

// Protected customer routes
router.get('/profile', customerProtect, getProfile);
router.put('/profile', customerProtect, updateProfile);
router.get('/orders', customerProtect, getMyOrders);
router.get('/service-requests', customerProtect, getMyServiceRequests);

module.exports = router;