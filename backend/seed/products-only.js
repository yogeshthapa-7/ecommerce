// Products-only seed script
// Usage: node seed/products-only.js
// Only clears and re-seeds the Product collection.
// Does NOT touch Orders, Customers, Categories, or Users.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Models
const Product = require('../models/Product');

// Seed data
const products = require('./products');

const seedProductsOnly = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear only products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Seed products
        await Product.insertMany(products);
        console.log(`Seeded ${products.length} products`);

        console.log('\n✅ Products seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error.message);
        process.exit(1);
    }
};

seedProductsOnly();
