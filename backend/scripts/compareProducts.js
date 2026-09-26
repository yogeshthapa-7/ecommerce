const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const Product = require('../models/Product');
        
        // Simulate user page API: /products?includeOutOfStock=true&limit=100
        const userProducts = await Product.find({ status: 'active' })
            .sort({ createdAt: -1 })
            .limit(100);
        
        console.log(`\n=== User Page API (includeOutOfStock=true, limit=100) ===`);
        console.log(`Products returned: ${userProducts.length}\n`);
        userProducts.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name} (ID: ${p._id})`);
        });
        
        // Simulate admin page API: /products?showAll=true&page=1&limit=10
        const adminProducts = await Product.find({})
            .sort({ createdAt: -1 })
            .skip(0)
            .limit(10);
        
        console.log(`\n=== Admin Page API (showAll=true, page=1, limit=10) ===`);
        console.log(`Products returned: ${adminProducts.length}\n`);
        adminProducts.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name} (ID: ${p._id})`);
        });
        
        // Find products in user page but not admin page
        const adminIds = new Set(adminProducts.map(p => p._id.toString()));
        const userOnly = userProducts.filter(p => !adminIds.has(p._id.toString()));
        
        console.log(`\n=== Products in User Page but NOT in Admin Page (page 1) ===`);
        if (userOnly.length > 0) {
            userOnly.forEach(p => {
                console.log(` - ${p.name} (ID: ${p._id})`);
            });
        } else {
            console.log(' None (all user products are also in admin page 1)');
        }
        console.log(`\nNote: Admin uses pagination (10 per page). Products not on page 1 may be on later pages.`);
        
        await mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
