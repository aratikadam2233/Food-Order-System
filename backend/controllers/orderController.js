const Order = require('../models/Order');
const Food = require('../models/Food');

const DELIVERY_FEE = 40;
const TAX_RATE = 0.05; // 5%

// @route POST /api/orders (customer)
const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, paymentMethod, discount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cannot place an order with an empty cart' });
    }
    if (!deliveryAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Delivery address and payment method are required' });
    }

    const requiredAddressFields = ['fullName', 'mobile', 'email', 'address', 'city', 'pincode'];
    for (const field of requiredAddressFields) {
      if (!deliveryAddress[field]) {
        return res.status(400).json({ success: false, message: `Delivery address is missing: ${field}` });
      }
    }

    // Re-fetch food items from DB to trust server-side prices, not client-supplied ones
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const food = await Food.findById(item.foodId || item.food);
      if (!food) {
        return res.status(404).json({ success: false, message: `Food item not found: ${item.foodId || item.food}` });
      }
      if (!food.available) {
        return res.status(400).json({ success: false, message: `${food.name} is currently unavailable` });
      }
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const lineTotal = food.price * quantity;
      subtotal += lineTotal;
      orderItems.push({
        food: food._id,
        name: food.name,
        image: food.image,
        price: food.price,
        quantity,
      });
    }

    const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
    const tax = Math.round(subtotal * TAX_RATE);
    const appliedDiscount = Number(discount) > 0 ? Number(discount) : 0;
    const totalAmount = Math.max(0, subtotal + deliveryFee + tax - appliedDiscount);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      deliveryAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      discount: appliedDiscount,
      totalAmount,
      status: 'Pending',
    });

    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/orders/my-orders (customer)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Orders fetched successfully', data: orders });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/orders (admin only - all orders)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'All orders fetched successfully', data: orders });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Customers may only view their own orders; admins may view any
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied: this is not your order' });
    }

    res.status(200).json({ success: true, message: 'Order fetched successfully', data: order });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/orders/:id/status (admin only)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order status updated successfully', data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus };
