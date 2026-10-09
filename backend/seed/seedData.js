const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Models
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Customer = require('../models/Customer');
const User = require('../models/User');

// Seed data (separated into modules for targeted re-seeding)
const products = require('./products');
const categories = require('./categories');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Category.deleteMany({});
        await Customer.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data');

        // Seed products
        await Product.insertMany(products);
        console.log(`Seeded ${products.length} products`);

        // Seed categories
        await Category.insertMany(categories);
        console.log(`Seeded ${categories.length} categories`);

        // Seed admin user
        const adminUser = new User({
            email: 'admin@nike.com',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'Nike',
            role: 'admin'
        });
        await adminUser.save();

        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error.message);
        process.exit(1);
    }
};

seedDB();
