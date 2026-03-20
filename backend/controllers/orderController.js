const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Place new order
// @route   POST /api/orders
// @access  Public
const placeOrder = async (req, res, next) => {
  try {
    const { customerName, customerPhone, customerEmail, customerAddress, items, notes } = req.body;

    if (!customerName || !customerPhone) {
      return res.status(400).json({ success: false, message: 'Name and phone number are required' });
    }
    if (!/^[6-9]\d{9}$/.test(customerPhone)) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit phone number' });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product "${item.name}" is not available` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units of "${product.name}" available`
        });
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity
      });
      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      customerAddress: customerAddress || '',
      items: orderItems,
      totalAmount,
      notes: notes || '',
      status: 'pending'
    });

    // Deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, soldCount: item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed! We will call you to confirm.',
      order: {
        _id: order._id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track orders by phone (public)
// @route   GET /api/orders/track
// @access  Public
const trackOrders = async (req, res, next) => {
  try {
    const { phone, orderId } = req.query;

    if (!phone && !orderId) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }
    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit phone number' });
    }

    const query = phone ? { customerPhone: phone } : {};
    const orders = await Order.find(query)
      .sort('-createdAt')
      .select('customerName customerPhone items totalAmount status adminNotes notes createdAt')
      .limit(10);

    const filtered = orderId
      ? orders.filter(o => o._id.toString().slice(-8).toUpperCase() === orderId.toUpperCase())
      : orders;

    res.json({ success: true, count: filtered.length, orders: filtered });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (public — phone verified)
// @route   PUT /api/orders/:id/cancel
// @access  Public
const cancelOrder = async (req, res, next) => {
  try {
    const { phone, reason } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number required to cancel' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.customerPhone !== phone) {
      return res.status(403).json({ success: false, message: 'Phone number does not match this order' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Order is already cancelled' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel — order is already "${order.status}". Please call us.`
      });
    }

    order.status = 'cancelled';
    order.adminNotes = `Cancelled by customer. Reason: ${reason || 'No reason given'}`;
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, soldCount: -item.quantity }
      });
    }

    res.json({ success: true, message: 'Order cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};

// Admin endpoints
const getOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } }
      ];
    }
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort('-createdAt')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('items.product', 'name image');
    res.json({ success: true, total, pages: Math.ceil(total / Number(limit)), currentPage: Number(page), orders });
  } catch (error) { next(error); }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) { next(error); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const valid = ['pending', 'confirmed', 'processing', 'ready', 'delivered', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, ...(adminNotes && { adminNotes }) },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order updated', order });
  } catch (error) { next(error); }
};

// @desc    Delete order permanently (admin)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // If order was active (not cancelled/delivered), restore stock
    if (!['cancelled', 'delivered'].includes(order.status)) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, soldCount: -item.quantity }
        });
      }
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeOrder, trackOrders, cancelOrder, deleteOrder, getOrders, getOrder, updateOrderStatus };