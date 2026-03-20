const ServiceRequest = require('../models/ServiceRequest');
const { sendServiceRequestNotification } = require('../utils/email');

// @desc    Submit service request
// @route   POST /api/service-requests
// @access  Public
const submitRequest = async (req, res, next) => {
  try {
    const { name, phone, email, serviceType, description, preferredDate } = req.body;

    const request = await ServiceRequest.create({
      name, phone, email, serviceType, description,
      ...(preferredDate && { preferredDate: new Date(preferredDate) })
    });

    // Send email notification (non-blocking)
    sendServiceRequestNotification({ name, phone, serviceType, description })
      .catch(err => console.error('Email notification error:', err.message));

    res.status(201).json({
      success: true,
      message: 'Your service request has been submitted. We will call you within 24 hours.',
      requestId: request._id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all service requests (admin)
// @route   GET /api/service-requests
// @access  Private/Admin
const getRequests = async (req, res, next) => {
  try {
    const { status, serviceType, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await ServiceRequest.countDocuments(query);
    const requests = await ServiceRequest.find(query)
      .sort('-createdAt')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service request
// @route   GET /api/service-requests/:id
// @access  Private/Admin
const getRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service request status
// @route   PUT /api/service-requests/:id
// @access  Private/Admin
const updateRequest = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(adminNotes && { adminNotes }) },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.json({ success: true, message: 'Request updated successfully', request });
  } catch (error) {
    next(error);
  }
};

// @desc    Track service requests by phone (public)
// @route   GET /api/service-requests/track
// @access  Public
const trackRequests = async (req, res, next) => {
  try {
    const { phone } = req.query

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' })
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit phone number' })
    }

    const requests = await ServiceRequest.find({ phone })
      .sort('-createdAt')
      .select('name phone serviceType description status adminNotes createdAt')
      .limit(10)

    res.json({ success: true, count: requests.length, requests })
  } catch (error) {
    next(error)
  }
}

// @desc    Cancel service request by user (public — phone verified)
// @route   PUT /api/service-requests/:id/cancel
// @access  Public
const cancelRequest = async (req, res, next) => {
  try {
    const { phone, reason } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required to cancel' });
    }

    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Verify phone matches — security check
    if (request.phone !== phone) {
      return res.status(403).json({ success: false, message: 'Phone number does not match this request' });
    }

    if (request.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Request is already cancelled' });
    }

    if (request.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Completed requests cannot be cancelled' });
    }

    request.status = 'cancelled';
    request.adminNotes = `Cancelled by user. Reason: ${reason || 'No reason given'}`;
    await request.save();

    res.json({ success: true, message: 'Service request cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service request permanently (admin)
// @route   DELETE /api/service-requests/:id
// @access  Private/Admin
const deleteRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.json({ success: true, message: 'Service request deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitRequest, getRequests, getRequest, updateRequest, trackRequests, cancelRequest, deleteRequest };