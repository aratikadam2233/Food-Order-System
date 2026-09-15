const Food = require('../models/Food');
const Order = require('../models/Order');

// @route GET /api/dashboard/stats (admin only)
const getStats = async (req, res, next) => {
  try {
    const [totalFoodItems, totalOrders, pendingOrders, completedOrders, revenueAgg] = await Promise.all([
      Food.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery'] } }),
      Order.countDocuments({ status: 'Delivered' }),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: { totalFoodItems, totalOrders, pendingOrders, completedOrders, totalRevenue },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
