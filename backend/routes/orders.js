const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, getOrder, updateOrderStatus, trackOrders, cancelOrder, deleteOrder } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/track', trackOrders);
router.post('/', placeOrder);
router.get('/', protect, adminOnly, getOrders);
router.get('/:id', protect, adminOnly, getOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/cancel', cancelOrder);
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;