const Cancellation = require('../models/Cancellation');
const Order = require('../models/Order');
const User = require('../models/User');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const createTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const sendCancellationEmail = async (to, subject, html) => {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('Gmail credentials missing, skipping email');
        return;
    }
    const transporter = createTransporter();
    await transporter.sendMail({
        from: `"Nike Store" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html
    });
};

// GET all cancellations (admin, paginated)
exports.getCancellations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status) filter.status = req.query.status;

        const [total, cancellations] = await Promise.all([
            Cancellation.countDocuments(filter),
            Cancellation.find(filter)
                .populate('orderId', 'orderId total customer customerEmail date deliveryStatus items')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ]);

        res.json({
            cancellations,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET cancellations for a specific user
exports.getCancellationsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        let cancellations = [];

        if (mongoose.Types.ObjectId.isValid(userId)) {
            cancellations = await Cancellation.find({ userId: new mongoose.Types.ObjectId(userId) })
                .populate('orderId', 'orderId total deliveryStatus')
                .sort({ createdAt: -1 });
        }

        res.json(cancellations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single cancellation
exports.getCancellation = async (req, res) => {
    try {
        const cancellation = await Cancellation.findById(req.params.id)
            .populate('orderId', 'orderId total customer customerEmail date items deliveryStatus')
            .populate('userId', 'firstName lastName email');
        if (!cancellation) return res.status(404).json({ message: 'Cancellation not found' });
        res.json(cancellation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create cancellation request
exports.createCancellation = async (req, res) => {
    try {
        const { orderId, reason, customerName, customerEmail, userId, description } = req.body;

        if (!orderId || !reason) {
            return res.status(400).json({ message: 'Order id and reason are required' });
        }

        // Validate the referenced order exists
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.deliveryStatus === 'Delivered' || order.deliveryStatus === 'Cancelled') {
            return res.status(400).json({ message: 'Cannot cancel a delivered or already cancelled order' });
        }

        // Check if there's already a pending cancellation for this order
        const existingCancellation = await Cancellation.findOne({ orderId, status: 'Requested' });
        if (existingCancellation) {
            return res.status(400).json({ message: 'A cancellation request is already pending for this order' });
        }

        const cancellationId = `CAN-${Date.now().toString().slice(-6)}`;

        const cancellation = new Cancellation({
            cancellationId,
            orderId,
            userId: userId || order.userId || null,
            customerName: customerName || order.customer || '',
            customerEmail: customerEmail || order.customerEmail || '',
            reason,
            description: description || '',
            status: 'Requested'
        });

        const saved = await cancellation.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update cancellation status (admin action)
exports.updateCancellation = async (req, res) => {
    try {
        const { status, resolution } = req.body;

        const update = {};
        if (status) update.status = status;
        if (resolution !== undefined) update.resolution = resolution;

        if (status && ['Approved', 'Rejected'].includes(status)) {
            update.resolvedBy = req.user?.id || req.user?._id;
            update.resolvedAt = new Date();
        }

        const cancellation = await Cancellation.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        );

        if (!cancellation) return res.status(404).json({ message: 'Cancellation not found' });

        // Update order status if approved
        if (status === 'Approved') {
            await Order.findByIdAndUpdate(cancellation.orderId, { deliveryStatus: 'Cancelled' });
        }

        // Send email notification
        if (status === 'Approved' || status === 'Rejected') {
            try {
                const user = await User.findById(cancellation.userId).select('firstName lastName email');
                const recipientEmail = user?.email || cancellation.customerEmail;
                const recipientName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : cancellation.customerName;

                if (recipientEmail) {
                    const statusColor = status === 'Approved' ? '#22c55e' : '#ef4444';
                    const statusTitle = status === 'Approved' ? 'Cancellation Approved' : 'Cancellation Rejected';

                    const html = `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #111;">
                            <div style="background: #111; padding: 32px; text-align: center;">
                                <h1 style="font-family: Arial, sans-serif; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; margin: 0; color: #ffffff;">NIKE STORE</h1>
                            </div>
                            <div style="padding: 40px 32px;">
                                <div style="background: #f9fafb; border-left: 4px solid ${statusColor}; padding: 20px; margin-bottom: 32px; border-radius: 4px;">
                                    <h2 style="font-family: Arial, sans-serif; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; color: ${statusColor};">${statusTitle}</h2>
                                    <p style="margin: 0; font-size: 14px; color: #374151;">Hi ${recipientName || 'Customer'},</p>
                                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #374151;">Your cancellation request <strong style="color: #111;">${cancellation.cancellationId}</strong> for order <strong style="color: #111;">${cancellation.orderId?.orderId || cancellation.orderId}</strong> has been <strong style="color: ${statusColor};">${status.toLowerCase()}</strong>.</p>
                                </div>

                                <div style="margin-bottom: 24px;">
                                    <h3 style="font-family: Arial, sans-serif; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin: 0 0 16px 0;">Cancellation Details</h3>
                                    <div style="background: #f9fafb; border-radius: 8px; padding: 16px; font-size: 14px; color: #374151;">
                                        <p style="margin: 0 0 8px 0;"><strong style="color: #111;">Order:</strong> ${cancellation.orderId?.orderId || cancellation.orderId}</p>
                                        <p style="margin: 0 0 8px 0;"><strong style="color: #111;">Reason:</strong> ${cancellation.reason}</p>
                                        ${cancellation.resolution ? `<p style="margin: 0;"><strong style="color: #111;">Resolution:</strong> ${cancellation.resolution}</p>` : ''}
                                    </div>
                                </div>

                                <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
                                    <p style="margin: 0; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">Nike Store Team</p>
                                </div>
                            </div>
                        </div>
                    `;

                    await sendCancellationEmail(recipientEmail, `${statusTitle} - ${cancellation.cancellationId}`, html);
                }
            } catch (emailError) {
                console.error('Failed to send cancellation email:', emailError);
            }
        }

        res.json(cancellation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE cancellation
exports.deleteCancellation = async (req, res) => {
    try {
        const cancellation = await Cancellation.findById(req.params.id);
        if (!cancellation) return res.status(404).json({ message: 'Cancellation not found' });

        const isAllowed = cancellation.status === 'Requested' || req.user?.role === 'admin';
        if (!isAllowed) {
            return res.status(400).json({ message: 'Cannot delete a cancellation that is already resolved' });
        }

        await cancellation.deleteOne();
        res.json({ message: 'Cancellation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET dashboard stats for cancellations
exports.getStats = async (req, res) => {
    try {
        const [total, requested, approved, rejected] = await Promise.all([
            Cancellation.countDocuments(),
            Cancellation.countDocuments({ status: 'Requested' }),
            Cancellation.countDocuments({ status: 'Approved' }),
            Cancellation.countDocuments({ status: 'Rejected' }),
        ]);

        res.json({
            total,
            requested,
            approved,
            rejected
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
