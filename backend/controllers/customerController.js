const Customer = require('../models/Customer');

// GET all customers
exports.getCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Customer.countDocuments();
        const customers = await Customer.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.json({
            customers,
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

// GET single customer
exports.getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create customer
exports.createCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        const saved = await customer.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update customer
exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after', runValidators: true }
        );
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PATCH toggle status
exports.toggleStatus = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        customer.status = customer.status === 'Banned' ? 'Active' : 'Banned';
        await customer.save();
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE customer
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
