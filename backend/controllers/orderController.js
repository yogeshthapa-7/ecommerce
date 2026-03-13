const Order = require('../models/Order');

// GET all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single order
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create order
exports.createOrder = async (req, res) => {
    try {
        const orderId = `ORD-${Date.now().toString().slice(-6)}`;
        const order = new Order({ ...req.body, orderId });
        const saved = await order.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update order
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET dashboard stats
exports.getStats = async (req, res) => {
    try {
        const orders = await Order.find();
        const totalRevenue = orders
            .filter(o => o.paymentStatus === 'Paid')
            .reduce((sum, o) => sum + o.total, 0);
        const totalOrders = orders.length;
        const paidOrders = orders.filter(o => o.paymentStatus === 'Paid').length;
        const pendingOrders = orders.filter(o => o.paymentStatus === 'Pending').length;
        const cancelledOrders = orders.filter(o => o.deliveryStatus === 'Cancelled').length;

        res.json({
            totalRevenue,
            totalOrders,
            paidOrders,
            pendingOrders,
            cancelledOrders,
            recentOrders: orders.slice(0, 5)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
