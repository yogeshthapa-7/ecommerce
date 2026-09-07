const Return = require('../models/Return');
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

const sendReturnEmail = async (to, subject, html) => {
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

// GET all returns (admin, paginated)
exports.getReturns = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status) filter.status = req.query.status;

        const [total, returns] = await Promise.all([
            Return.countDocuments(filter),
            Return.find(filter)
                .populate('orderId', 'orderId total customer customerEmail date')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ]);

        res.json({
            returns,
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

// GET returns for a specific user
exports.getReturnsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        let returns = [];

        if (mongoose.Types.ObjectId.isValid(userId)) {
            returns = await Return.find({ userId: new mongoose.Types.ObjectId(userId) })
                .populate('orderId', 'orderId total')
                .sort({ createdAt: -1 });
        }

        res.json(returns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single return
exports.getReturn = async (req, res) => {
    try {
        const ret = await Return.findById(req.params.id)
            .populate('orderId', 'orderId total customer customerEmail date items')
            .populate('userId', 'firstName lastName email');
        if (!ret) return res.status(404).json({ message: 'Return not found' });
        res.json(ret);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create return request
exports.createReturn = async (req, res) => {
    try {
        const { orderId, items, totalAmount, reason, customerName, customerEmail, userId } = req.body;

        if (!orderId || !items || !reason) {
            return res.status(400).json({ message: 'Order id, items, and reason are required' });
        }

        // Validate the referenced order exists
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.deliveryStatus !== 'Delivered') {
            return res.status(400).json({ message: 'Returns are only allowed for delivered orders' });
        }

        const returnId = `RET-${Date.now().toString().slice(-6)}`;

        const ret = new Return({
            returnId,
            orderId,
            userId: userId || order.userId || null,
            customerName: customerName || order.customer || '',
            customerEmail: customerEmail || order.customerEmail || '',
            items,
            totalAmount: totalAmount || 0,
            reason,
            description: req.body.description || '',
            status: 'Requested'
        });

        const saved = await ret.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update return status (admin action)
exports.updateReturn = async (req, res) => {
    try {
        const { status, resolution, refundAmount } = req.body;

        const update = {};
        if (status) update.status = status;
        if (resolution !== undefined) update.resolution = resolution;
        if (refundAmount !== undefined) update.refundAmount = refundAmount;

        if (status && ['Approved', 'Rejected', 'Refunded', 'Cancelled'].includes(status)) {
            update.resolvedBy = req.user?.id || req.user?._id;
            update.resolvedAt = new Date();
        }

        const ret = await Return.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        );

        if (!ret) return res.status(404).json({ message: 'Return not found' });

        // Send email notification for Approved or Rejected status
        if (status === 'Approved' || status === 'Rejected') {
            try {
                const user = await User.findById(ret.userId).select('firstName lastName email');
                const recipientEmail = user?.email || ret.customerEmail;
                const recipientName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ret.customerName;

                if (recipientEmail) {
                    const itemsList = (ret.items || [])
                        .map(item => `<li>${item.quantity}x ${item.name || 'Product'} — $${Number(item.price).toFixed(2)}${item.color ? ` (${item.color}` : ''}${item.size ? ` / ${item.size}` : ''}${item.color ? ')' : ''}</li>`)
                        .join('');

                    const refundDisplay = status === 'Rejected' ? '$0.00' : `$${Number(ret.refundAmount || ret.totalAmount || 0).toFixed(2)}`;
                    const statusColor = status === 'Approved' ? '#10b981' : '#ef4444';
                    const statusBg = status === 'Approved' ? '#ecfdf5' : '#fef2f2';
                    const statusTitle = status === 'Approved' ? 'Return Approved' : 'Return Rejected';

                    const policySection = status === 'Rejected' ? `
                        <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #e5e7eb;">
                            <h3 style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #111; margin: 0 0 12px 0;">Return Policy</h3>
                            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.6; color: #374151;">
                                <p style="margin: 0 0 8px 0;"><strong style="color: #111;">Eligibility:</strong> Returns accepted within 30 days of delivery. Items must be unworn, unwashed, and unaltered with original tags and packaging intact.</p>
                                <p style="margin: 0 0 8px 0;"><strong style="color: #111;">Non-Returnable:</strong> Gift cards, promotional codes, personalized products, and items marked as Final Sale cannot be returned.</p>
                                <p style="margin: 0 0 8px 0;"><strong style="color: #111;">How to Return:</strong> Go to Profile → Returns tab, select delivered order, choose items, provide reason, and submit.</p>
                                <p style="margin: 0 0 8px 0;"><strong style="color: #111;">Shipping:</strong> Once approved, a prepaid return label is provided. Refunds processed to original payment method within 5–10 business days.</p>
                                <p style="margin: 0;"><strong style="color: #111;">Exchanges:</strong> We offer refunds only. For size/color changes, return original item and place a new order.</p>
                            </div>
                        </div>
                    ` : '';

                    const html = `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #111;">
                            <div style="background: #111; padding: 32px; text-align: center;">
                                <h1 style="font-family: Arial, sans-serif; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; margin: 0; color: #ffffff;">NIKE STORE</h1>
                            </div>
                            <div style="padding: 40px 32px;">
                                <div style="background: ${statusBg}; border-left: 4px solid ${statusColor}; padding: 20px; margin-bottom: 32px; border-radius: 4px;">
                                    <h2 style="font-family: Arial, sans-serif; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; color: ${statusColor};">${statusTitle}</h2>
                                    <p style="margin: 0; font-size: 14px; color: #374151;">Hi ${recipientName || 'Customer'},</p>
                                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #374151;">Your return request <strong style="color: #111;">${ret.returnId}</strong> for order <strong style="color: #111;">${ret.orderId?.orderId || ret.orderId}</strong> has been <strong style="color: ${statusColor};">${status.toLowerCase()}</strong>.</p>
                                </div>

                                <div style="margin-bottom: 24px;">
                                    <h3 style="font-family: Arial, sans-serif; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin: 0 0 16px 0;">Return Details</h3>
                                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                        <thead>
                                            <tr style="border-bottom: 2px solid #e5e7eb;">
                                                <th style="text-align: left; padding: 8px 0; font-weight: 700; color: #111;">Item</th>
                                                <th style="text-align: right; padding: 8px 0; font-weight: 700; color: #111;">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${(ret.items || []).map(item => `
                                                <tr style="border-bottom: 1px solid #f3f4f6;">
                                                    <td style="padding: 12px 0; color: #374151;">${item.quantity}x ${item.name || 'Product'}${item.color ? ` (${item.color}` : ''}${item.size ? ` / ${item.size}` : ''}${item.color ? ')' : ''}</td>
                                                    <td style="padding: 12px 0; text-align: right; color: #374151; font-weight: 600;">$${Number(item.price).toFixed(2)}</td>
                                                </tr>
                                            `).join('') || '<tr><td colspan="2" style="padding: 12px 0; color: #9ca3af;">No items</td></tr>'}
                                        </tbody>
                                    </table>
                                </div>

                                <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px;">
                                        <span style="font-weight: 700; color: #111;">Total Refund Amount</span>
                                        <span style="font-weight: 900; font-size: 18px; color: ${status === 'Rejected' ? '#9ca3af' : '#111'};">${refundDisplay}</span>
                                    </div>
                                </div>

                                ${ret.resolution ? `
                                    <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                                        <p style="margin: 0; font-size: 13px; color: #6b7280; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Resolution</p>
                                        <p style="margin: 4px 0 0 0; font-size: 14px; color: #111; font-weight: 600;">${ret.resolution}</p>
                                    </div>
                                ` : ''}

                                ${status === 'Rejected' && ret.resolution ? `
                                    <div style="background: #fef2f2; border-left: 3px solid #ef4444; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
                                        <p style="margin: 0; font-size: 12px; color: #991b1b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Rejection Reason</p>
                                        <p style="margin: 4px 0 0 0; font-size: 14px; color: #7f1d1d;">${ret.resolution}</p>
                                    </div>
                                ` : ''}

                                ${policySection}

                                <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
                                    <p style="margin: 0; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">Nike Store Team</p>
                                </div>
                            </div>
                        </div>
                    `;

                    await sendReturnEmail(recipientEmail, `${statusTitle} - ${ret.returnId}`, html);
                }
            } catch (emailError) {
                console.error('Failed to send return email:', emailError);
            }
        }

        res.json(ret);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE return
exports.deleteReturn = async (req, res) => {
    try {
        const ret = await Return.findById(req.params.id);
        if (!ret) return res.status(404).json({ message: 'Return not found' });

        const isAllowed = ret.status === 'Requested' || req.user?.role === 'admin';
        if (!isAllowed) {
            return res.status(400).json({ message: 'Cannot delete a return that is already resolved' });
        }

        await ret.deleteOne();
        res.json({ message: 'Return deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET dashboard stats for returns
exports.getStats = async (req, res) => {
    try {
        const [totalRequests, approved, rejected, refunded, totalRefundAmount] = await Promise.all([
            Return.countDocuments({ status: 'Requested' }),
            Return.countDocuments({ status: 'Approved' }),
            Return.countDocuments({ status: 'Rejected' }),
            Return.countDocuments({ status: 'Refunded' }),
            Return.aggregate([
                { $match: { status: 'Refunded' } },
                { $group: { _id: null, total: { $sum: '$refundAmount' } } }
            ])
        ]);

        const refundTotal = totalRefundAmount[0]?.total || 0;

        res.json({
            totalRequests,
            approved,
            rejected,
            refunded,
            refundTotal
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
