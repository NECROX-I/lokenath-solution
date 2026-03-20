const Product = require('../models/Product');
const Order = require('../models/Order');
const ServiceRequest = require('../models/ServiceRequest');
const ContactMessage = require('../models/ContactMessage');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Parallel fetch for performance
    const [
      totalProducts,
      totalOrders,
      totalServiceRequests,
      unreadMessages,
      pendingOrders,
      newServiceRequests,
      monthlyOrders,
      lastMonthOrders,
      recentOrders,
      recentRequests,
      topProducts,
      ordersByStatus,
      requestsByService,
      lowStockProducts
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      ServiceRequest.countDocuments(),
      ContactMessage.countDocuments({ isRead: false }),
      Order.countDocuments({ status: 'pending' }),
      ServiceRequest.countDocuments({ status: 'new' }),

      // Monthly revenue
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
      ]),

      Order.find().sort('-createdAt').limit(5),
      ServiceRequest.find().sort('-createdAt').limit(5),

      // Top products by sold count
      Product.find({ isActive: true }).sort('-soldCount').limit(5).select('name soldCount price category image'),

      // Orders by status
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),

      // Service requests by type
      ServiceRequest.aggregate([
        { $group: { _id: '$serviceType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // Low stock products (stock <= 5, not out of stock)
      Product.find({ isActive: true, stock: { $gt: 0, $lte: 10 } })
        .sort('stock')
        .limit(10)
        .select('name stock category image price')
    ]);

    const thisMonthRevenue = monthlyOrders[0]?.total || 0;
    const lastMonthRevenue = lastMonthOrders[0]?.total || 0;
    const revenueGrowth = lastMonthRevenue > 0
      ? (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
      : 100;

    // Last 7 days orders for chart
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));
      const dayOrders = await Order.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
      ]);
      last7Days.push({
        date: start.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        revenue: dayOrders[0]?.total || 0,
        orders: dayOrders[0]?.count || 0
      });
    }

    const outOfStockCount = await Product.countDocuments({ isActive: true, stock: 0 });

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalServiceRequests,
        unreadMessages,
        pendingOrders,
        newServiceRequests,
        thisMonthRevenue,
        lastMonthRevenue,
        revenueGrowth: Number(revenueGrowth),
        thisMonthOrders: monthlyOrders[0]?.count || 0,
        outOfStockCount,
        lowStockCount: lowStockProducts.length
      },
      charts: {
        last7Days,
        ordersByStatus,
        requestsByService
      },
      recent: {
        orders: recentOrders,
        requests: recentRequests
      },
      topProducts,
      lowStockProducts
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };