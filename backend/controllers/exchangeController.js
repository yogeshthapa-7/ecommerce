const Exchange = require('../models/Exchange');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const createTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const sendExchangeEmail = async (to, subject, html) => {
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

const calculatePriceDifference = (originalItems, requestedItems) => {
    const originalTotal = originalItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
    );
    const requestedTotal = requestedItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
    );
    return requestedTotal - originalTotal;
};

const formatItemList = (items) => {
    return (items || [])
        .map(
            (item) =>
                `<li>${item.quantity}x ${item.name || 'Product'} — $${Number(item.price).toFixed(2)}${item.color ? ` (${item.color}` : ''}${item.size ? ` / ${item.size}` : ''}${item.color ? ')' : ''}</li>`
        )
        .join('');
};

const getStatusTitle = (status) => {
    switch (status) {
        case 'Approved':
            return 'Exchange Approved';
        case 'Rejected':
            return 'Exchange Rejected';
        case 'Completed':
            return 'Exchange Completed';
        case 'Cancelled':
            return 'Exchange Cancelled';
        default:
            return 'Exchange Update';
    }
};

const buildExchangeEmailHtml = (exchange, status, recipientName) => {
    const statusColor = status === 'Approved' || status === 'Completed' ? '#10b981' : '#ef4444';
    const statusBg = status === 'Approved' || status === 'Completed' ? '#ecfdf5' : '#fef2f2';
    const statusTitle = getStatusTitle(status);
    const recipient = recipientName || 'Customer';

    let actionText = '';
    let policySection = '';

    if (status === 'Approved') {
        const diff = Number(exchange.priceDifference || 0);
        const isAvailable = exchange.allRequestedItemsAvailable !== false;

        if (isAvailable) {
            actionText = `
                <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px; font-weight: 700; color: #065f46;">Good news! All requested items are in stock.</p>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #374151;">Your exchange will be processed as requested. The new item(s) will be shipped to you once we receive the original item(s) you are returning.</p>
                </div>
            `;
        } else {
            const unavailableList = (exchange.unavailableRequestedItems || [])
                .map(item => `<li>${item.name}: ${item.reason}</li>`)
                .join('');

            actionText = `
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px; font-weight: 700; color: #92400e;">Partial Availability Notice</p>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #374151;">Some items you requested are currently unavailable:</p>
                    <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 14px; color: #374151;">
                        ${unavailableList}
                    </ul>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #374151;">Our team will contact you within 24 hours with alternative options or to arrange a refund for the unavailable items.</p>
                </div>
            `;
        }

        if (diff > 0) {
            actionText += `<p style="margin: 8px 0 0 0; font-size: 14px; color: #374151;">A payment of <strong style="color: #111;">$${diff.toFixed(2)}</strong> is required to complete this exchange. You will receive a payment link shortly.</p>`;
        } else if (diff < 0) {
            actionText += `<p style="margin: 8px 0 0 0; font-size: 14px; color: #374151;">A refund of <strong style="color: #111;">$${Math.abs(diff).toFixed(2)}</strong> will be processed to your original payment method once the exchange is completed.</p>`;
        } else {
            actionText += `<p style="margin: 8px 0 0 0; font-size: 14px; color: #374151;">This is a direct exchange with no price difference.</p>`;
        }
        actionText += `<p style="margin: 8px 0 0 0; font-size: 14px; color: #374151;">Please ship back the original item(s) using the prepaid label provided in your account.</p>`;
    } else if (status === 'Rejected') {
        actionText = `<p style="margin: 8px 0 0 0; font-size: 14px; color: #374151;">If you believe this was a mistake, please contact our support team.</p>`;
        policySection = `
            <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #e5e7eb;">
                <h3 style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #111; margin: 0 0 12px 0;">Exchange Policy</h3>
                <div style="background: #f9fafb; border-radius: 8px; padding: 16px; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.6; color: #374151;">
                    <p style="margin: 0 0 8px 0;"><strong style="color: #111;">Eligibility:</strong> Exchanges are accepted within 30 days of delivery. Items must be unworn, unwashed, and unaltered with original tags and packaging intact.</p>
                    <p style="margin: 0 0 8px 0;"><strong style="color: #111;">Price Difference:</strong> If the requested item costs more, you will be charged the difference. If it costs less, you will receive a refund.</p>
                    <p style="margin: 0 0 8px 0;"><strong style="color: #111;">Availability:</strong> Exchanges are subject to product availability. If the requested item is out of stock, we will contact you with alternatives or issue a refund.</p>
                    <p style="margin: 0 0 8px 0;"><strong style="color: #111;">How to Exchange:</strong> Go to Profile &rarr; Exchanges tab, select a delivered order, choose items to exchange, select replacement items, and submit.</p>
                    <p style="margin: 0 0 8px 0;"><strong style="color: #111;">Shipping:</strong> Once approved, a prepaid return label is provided. Ship back the original item(s) in their original packaging.</p>
                    <p style="margin: 0;"><strong style="color: #111;">Processing:</strong> Exchanges are completed within 5-10 business days after we receive the returned item(s).</p>
                </div>
            </div>
        `;
    } else if (status === 'Completed') {
        actionText = `
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #374151;">Your exchange has been completed. The new item(s) have been shipped to you.</p>
            </div>
        `;
    }

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #111;">
            <div style="background: #111; padding: 32px; text-align: center;">
                <h1 style="font-family: Arial, sans-serif; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; margin: 0; color: #ffffff;">NIKE STORE</h1>
            </div>
            <div style="padding: 40px 32px;">
                <div style="background: ${statusBg}; border-left: 4px solid ${statusColor}; padding: 20px; margin-bottom: 32px; border-radius: 4px;">
                    <h2 style="font-family: Arial, sans-serif; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; color: ${statusColor};">${statusTitle}</h2>
                    <p style="margin: 0; font-size: 14px; color: #374151;">Hi ${recipient},</p>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #374151;">Your exchange request <strong style="color: #111;">${exchange.exchangeId}</strong> for order <strong style="color: #111;">${exchange.orderId?.orderId || exchange.orderId}</strong> has been <strong style="color: ${statusColor};">${status.toLowerCase()}</strong>.</p>
                </div>

                ${actionText}

                <div style="margin-bottom: 24px;">
                    <h3 style="font-family: Arial, sans-serif; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin: 0 0 16px 0;">Original Items</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <thead>
                            <tr style="border-bottom: 2px solid #e5e7eb;">
                                <th style="text-align: left; padding: 8px 0; font-weight: 700; color: #111;">Item</th>
                                <th style="text-align: right; padding: 8px 0; font-weight: 700; color: #111;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${formatItemList(exchange.originalItems) || '<tr><td colspan="2" style="padding: 12px 0; color: #9ca3af;">No items</td></tr>'}
                        </tbody>
                    </table>
                </div>

                <div style="margin-bottom: 24px;">
                    <h3 style="font-family: Arial, sans-serif; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin: 0 0 16px 0;">Requested Items</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <thead>
                            <tr style="border-bottom: 2px solid #e5e7eb;">
                                <th style="text-align: left; padding: 8px 0; font-weight: 700; color: #111;">Item</th>
                                <th style="text-align: right; padding: 8px 0; font-weight: 700; color: #111;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${formatItemList(exchange.requestedItems) || '<tr><td colspan="2" style="padding: 12px 0; color: #9ca3af;">No items</td></tr>'}
                        </tbody>
                    </table>
                </div>

                <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px;">
                        <span style="font-weight: 700; color: #111;">Price Difference</span>
                        <span style="font-weight: 900; font-size: 18px; color: ${Number(exchange.priceDifference || 0) > 0 ? '#ef4444' : Number(exchange.priceDifference || 0) < 0 ? '#10b981' : '#111'};">
                            ${Number(exchange.priceDifference || 0) > 0 ? '+' : ''}$${Number(exchange.priceDifference || 0).toFixed(2)}
                        </span>
                    </div>
                </div>

                ${exchange.resolution ? `
                    <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                        <p style="margin: 0; font-size: 13px; color: #6b7280; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Resolution</p>
                        <p style="margin: 4px 0 0 0; font-size: 14px; color: #111; font-weight: 600;">${exchange.resolution}</p>
                    </div>
                ` : ''}

                ${status === 'Rejected' && exchange.resolution ? `
                    <div style="background: #fef2f2; border-left: 3px solid #ef4444; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
                        <p style="margin: 0; font-size: 12px; color: #991b1b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Rejection Reason</p>
                        <p style="margin: 4px 0 0 0; font-size: 14px; color: #7f1d1d;">${exchange.resolution}</p>
                    </div>
                ` : ''}

                ${policySection}

                <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">Nike Store Team</p>
                </div>
            </div>
        </div>
    `;

    return html;
};

// GET all exchanges (admin, paginated)
exports.getExchanges = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status) filter.status = req.query.status;

        const [total, exchanges] = await Promise.all([
            Exchange.countDocuments(filter),
            Exchange.find(filter)
                .populate('orderId', 'orderId total customer customerEmail date')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ]);

        res.json({
            exchanges,
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

// GET exchanges for a specific user
exports.getExchangesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        let exchanges = [];

        if (mongoose.Types.ObjectId.isValid(userId)) {
            exchanges = await Exchange.find({ userId: new mongoose.Types.ObjectId(userId) })
                .populate('orderId', 'orderId total')
                .sort({ createdAt: -1 });
        }

        res.json(exchanges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single exchange
exports.getExchange = async (req, res) => {
    try {
        const exchange = await Exchange.findById(req.params.id)
            .populate('orderId', 'orderId total customer customerEmail date items')
            .populate('userId', 'firstName lastName email');
        if (!exchange) return res.status(404).json({ message: 'Exchange not found' });
        res.json(exchange);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create exchange request
exports.createExchange = async (req, res) => {
    try {
        const { orderId, originalItems, requestedItems, reason, description, customerName, customerEmail, userId } = req.body;

        if (!orderId || !originalItems || !Array.isArray(requestedItems) || !reason) {
            return res.status(400).json({ message: 'Order id, original items, requested items, and reason are required' });
        }

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.deliveryStatus !== 'Delivered') {
            return res.status(400).json({ message: 'Exchanges are only allowed for delivered orders' });
        }

        const productIds = requestedItems
            .map(item => item.productId)
            .filter(Boolean);

        let allRequestedItemsAvailable = true;
        const unavailableRequestedItems = [];

        if (productIds.length > 0) {
            const products = await Product.find({ _id: { $in: productIds } });
            const productMap = new Map(products.map(p => [String(p._id), p]));

            for (const item of requestedItems) {
                if (!item.productId) continue;
                const product = productMap.get(String(item.productId));
                if (!product) {
                    allRequestedItemsAvailable = false;
                    unavailableRequestedItems.push({
                        productId: item.productId,
                        name: item.name,
                        reason: 'Product not found'
                    });
                } else if (product.in_stock === false) {
                    allRequestedItemsAvailable = false;
                    unavailableRequestedItems.push({
                        productId: item.productId,
                        name: item.name || product.name,
                        reason: 'Out of stock'
                    });
                }
            }
        }

        const priceDifference = requestedItems.length > 0
            ? calculatePriceDifference(originalItems, requestedItems)
            : 0;

        const exchangeId = `EXC-${Date.now().toString().slice(-6)}`;

        const exchange = new Exchange({
            exchangeId,
            orderId,
            userId: userId || order.userId || null,
            customerName: customerName || order.customer || '',
            customerEmail: customerEmail || order.customerEmail || '',
            originalItems,
            requestedItems,
            reason,
            description: description || '',
            priceDifference,
            allRequestedItemsAvailable,
            unavailableRequestedItems,
            status: 'Requested'
        });

        const saved = await exchange.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update exchange status (admin action)
exports.updateExchange = async (req, res) => {
    try {
        const { status, resolution } = req.body;

        const exchange = await Exchange.findById(req.params.id);
        if (!exchange) return res.status(404).json({ message: 'Exchange not found' });

        if (exchange.status === 'Completed') {
            return res.status(400).json({ message: 'Exchange is already completed' });
        }

        const update = {};
        if (status) update.status = status;
        if (resolution !== undefined) update.resolution = resolution;

        if (status && ['Approved', 'Rejected', 'Completed', 'Cancelled'].includes(status)) {
            update.resolvedBy = req.user?.id || req.user?._id;
            update.resolvedAt = new Date();
        }

        const updated = await Exchange.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        );

        // Send email notification for status changes
        if (status && ['Approved', 'Rejected', 'Completed', 'Cancelled'].includes(status)) {
            try {
                const user = await User.findById(updated.userId).select('firstName lastName email');
                const recipientEmail = user?.email || updated.customerEmail;
                const recipientName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : updated.customerName;

                if (recipientEmail) {
                    const html = buildExchangeEmailHtml(updated, status, recipientName);
                    const subject = `${getStatusTitle(status)} - ${updated.exchangeId}`;
                    await sendExchangeEmail(recipientEmail, subject, html);
                }
            } catch (emailError) {
                console.error('Failed to send exchange email:', emailError);
            }
        }

        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE exchange
exports.deleteExchange = async (req, res) => {
    try {
        const exchange = await Exchange.findById(req.params.id);
        if (!exchange) return res.status(404).json({ message: 'Exchange not found' });

        const isAllowed = exchange.status === 'Requested' || req.user?.role === 'admin';
        if (!isAllowed) {
            return res.status(400).json({ message: 'Cannot delete an exchange that is already resolved' });
        }

        await exchange.deleteOne();
        res.json({ message: 'Exchange deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT update exchange request items (user action when approved)
exports.updateExchangeRequest = async (req, res) => {
    try {
        const { requestedItems, description } = req.body;

        if (!requestedItems || !Array.isArray(requestedItems) || requestedItems.length === 0) {
            return res.status(400).json({ message: 'Requested items are required' });
        }

        const exchange = await Exchange.findById(req.params.id);
        if (!exchange) return res.status(404).json({ message: 'Exchange not found' });

        if (exchange.status !== 'Approved') {
            return res.status(400).json({ message: 'You can only select replacement items for approved exchanges' });
        }

        const currentUserId = req.user?.id || req.user?._id;
        if (exchange.userId && String(exchange.userId) !== String(currentUserId)) {
            return res.status(403).json({ message: 'You can only update your own exchange requests' });
        }

        const productIds = requestedItems
            .map(item => item.productId)
            .filter(Boolean);

        let allRequestedItemsAvailable = true;
        const unavailableRequestedItems = [];

        if (productIds.length > 0) {
            const products = await Product.find({ _id: { $in: productIds } });
            const productMap = new Map(products.map(p => [String(p._id), p]));

            for (const item of requestedItems) {
                if (!item.productId) continue;
                const product = productMap.get(String(item.productId));
                if (!product) {
                    allRequestedItemsAvailable = false;
                    unavailableRequestedItems.push({
                        productId: item.productId,
                        name: item.name,
                        reason: 'Product not found'
                    });
                } else if (product.in_stock === false) {
                    allRequestedItemsAvailable = false;
                    unavailableRequestedItems.push({
                        productId: item.productId,
                        name: item.name || product.name,
                        reason: 'Out of stock'
                    });
                }
            }
        }

        const priceDifference = calculatePriceDifference(exchange.originalItems, requestedItems);

        const updated = await Exchange.findByIdAndUpdate(
            req.params.id,
            {
                requestedItems,
                priceDifference,
                allRequestedItemsAvailable,
                unavailableRequestedItems,
                ...(description !== undefined && { description: description || exchange.description })
            },
            { new: true, runValidators: true }
        );

        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET dashboard stats for exchanges
exports.getStats = async (req, res) => {
    try {
        const [totalRequests, approved, rejected, completed, cancelled] = await Promise.all([
            Exchange.countDocuments({ status: 'Requested' }),
            Exchange.countDocuments({ status: 'Approved' }),
            Exchange.countDocuments({ status: 'Rejected' }),
            Exchange.countDocuments({ status: 'Completed' }),
            Exchange.countDocuments({ status: 'Cancelled' })
        ]);

        res.json({
            totalRequests,
            approved,
            rejected,
            completed,
            cancelled
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
