const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// GET orders by user ID

// GET orders by user ID
exports.getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const User = require('../models/User');

        let orders = [];
        let userEmail = null;

        // First, try to get user's email for fallback matching
        try {
            const user = await User.findById(userId);
            if (user && user.email) {
                userEmail = user.email;
            }
        } catch (e) {
            // User lookup failed
        }

        // Check if userId is a valid MongoDB ObjectId format
        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);

        if (isValidObjectId && userEmail) {
            // Query: match userId OR customerEmail
            orders = await Order.find({
                $or: [
                    { userId: new mongoose.Types.ObjectId(userId) },
                    { customerEmail: userEmail }
                ]
            }).sort({ createdAt: -1 });
        } else if (isValidObjectId) {
            // If valid ObjectId but no email found, match by userId
            orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
        } else if (userEmail) {
            // If invalid ObjectId, just match by email
            orders = await Order.find({ customerEmail: userEmail }).sort({ createdAt: -1 });
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

        // Extract customer info from the request body
        const { customer, items, total, paymentMethod, shippingInfo, userId } = req.body;

        // Determine customer name and email
        let customerName = '';
        let customerEmail = '';

        if (typeof customer === 'object' && customer !== null) {
            customerName = customer.name || '';
            customerEmail = customer.email || '';
        } else if (typeof customer === 'string') {
            customerName = customer;
        }

        // If shippingInfo exists, use that as fallback
        if (shippingInfo) {
            if (!customerName && shippingInfo.fullName) customerName = shippingInfo.fullName;
            if (!customerEmail && shippingInfo.email) customerEmail = shippingInfo.email;
        }

        // Create the order
        const order = new Order({
            orderId,
            userId: userId || null,
            customer: customerName,
            customerEmail: customerEmail,
            items: items || [],
            total: total || 0,
            paymentStatus: 'Paid', // Payment is successful when order is created
            deliveryStatus: 'Processing',
            paymentMethod: paymentMethod || 'card',
            shippingInfo: shippingInfo || {},
            date: new Date().toISOString().split('T')[0]
        });

        const saved = await order.save();

        // Update or create customer record
        if (customerEmail) {
            const existingCustomer = await Customer.findOne({ email: customerEmail });

            if (existingCustomer) {
                // Update existing customer
                existingCustomer.orders = (existingCustomer.orders || 0) + 1;
                existingCustomer.totalSpent = (existingCustomer.totalSpent || 0) + (total || 0);
                existingCustomer.name = customerName || existingCustomer.name;
                await existingCustomer.save();
            } else {
                // Create new customer
                await Customer.create({
                    name: customerName || 'Unknown',
                    email: customerEmail,
                    phone: shippingInfo?.phone || '',
                    orders: 1,
                    totalSpent: total || 0,
                    status: 'Active'
                });
            }
        }

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

        // Total revenue from paid orders
        const totalRevenue = orders
            .filter(o => o.paymentStatus === 'Paid')
            .reduce((sum, o) => sum + o.total, 0);

        const totalOrders = orders.length;
        const paidOrders = orders.filter(o => o.paymentStatus === 'Paid').length;
        const pendingOrders = orders.filter(o => o.paymentStatus === 'Pending').length;
        const cancelledOrders = orders.filter(o => o.deliveryStatus === 'Cancelled').length;

        // Count customers and products
        const totalCustomers = await Customer.countDocuments();
        const totalProducts = await Product.countDocuments();

        res.json({
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProducts,
            paidOrders,
            pendingOrders,
            cancelledOrders,
            recentOrders: orders.slice(0, 5)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
