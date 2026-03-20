const express = require('express');
const router = express.Router();
const { submitRequest, getRequests, getRequest, updateRequest, trackRequests, cancelRequest, deleteRequest } = require('../controllers/serviceRequestController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/track', trackRequests);                          // public — before /:id
router.post('/', submitRequest);
router.get('/', protect, adminOnly, getRequests);
router.get('/:id', protect, adminOnly, getRequest);
router.put('/:id', protect, adminOnly, updateRequest);
router.put('/:id/cancel', cancelRequest);                     // public — user cancel
router.delete('/:id', protect, adminOnly, deleteRequest);     // admin delete

module.exports = router;