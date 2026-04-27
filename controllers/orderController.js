const Order = require("../models/Order");
const Cart = require("../models/Cart");

// @route   POST /api/orders
// @desc    Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, phone } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const order = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      phone,
      status: "pending",
    });

    await order.save();

    // Clear cart
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/orders
// @desc    Get user orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/orders/:id
// @desc    Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user owns this order
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
