 const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const Product = require('../models/Product');
        
        // Simulate what the admin page fetches
        const page = 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        
        const products = await Product.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        console.log(`\n=== Admin API Response (Page ${page}, Limit ${limit}) ===\n`);
        console.log(`Total products in DB: 24`);
        console.log(`Products on this page: ${products.length}\n`);
        
        products.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name}`);
            console.log(`   ID: ${p._id}`);
            console.log(`   Status: ${p.status}, In Stock: ${p.in_stock}, Stock Qty: ${p.stockQuantity}`);
            console.log(`   Created: ${p.createdAt}\n`);
        });
        
        // Check for any duplicate _ids
        const ids = products.map(p => p._id.toString());
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
            console.log('⚠️  DUPLICATE IDs FOUND IN RESPONSE!');
        } else {
            console.log('✓ No duplicate IDs in response');
        }
        
        // Check for duplicate names
        const names = products.map(p => p.name);
        const uniqueNames = new Set(names.map(n => n.toLowerCase()));
        if (names.length !== uniqueNames.size) {
            console.log('⚠️  DUPLICATE NAMES FOUND IN RESPONSE!');
            names.forEach((name, i) => {
                const lowerName = name.toLowerCase();
                if (names.filter(n => n.toLowerCase() === lowerName).length > 1) {
                    console.log(`   Duplicate: "${name}" (ID: ${products[i]._id})`);
                }
            });
        } else {
            console.log('✓ No duplicate names in response');
        }
        
        await mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
