const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const Product = require('../models/Product');
        
        // Check for potential duplicates by name (case-insensitive)
        const products = await Product.find({}).sort({ name: 1 });
        const grouped = {};
        
        products.forEach(p => {
            const name = p.name.toLowerCase().trim();
            if (!grouped[name]) {
                grouped[name] = [];
            }
            grouped[name].push({
                id: p._id,
                name: p.name,
                status: p.status,
                in_stock: p.in_stock,
                stockQuantity: p.stockQuantity,
                createdAt: p.createdAt
            });
        });
        
        console.log('\n=== Checking for duplicates ===\n');
        let hasDuplicates = false;
        
        for (const [name, items] of Object.entries(grouped)) {
            if (items.length > 1) {
                hasDuplicates = true;
                console.log(`\n"${items[0].name}" has ${items.length} copies:`);
                items.forEach(item => {
                    console.log(`  - ID: ${item.id}`);
                    console.log(`    Status: ${item.status}, In Stock: ${item.in_stock}, Stock: ${item.stockQuantity}`);
                    console.log(`    Created: ${item.createdAt}`);
                });
            }
        }
        
        if (!hasDuplicates) {
            console.log('No duplicates found by name.\n');
        }
        
        // Check specific products mentioned by user
        const missingProducts = ['Nike Air Max Plus', 'Nike Academy', 'Nike Heritage'];
        console.log('\n=== Checking for missing products ===\n');
        
        for (const name of missingProducts) {
            const found = products.find(p => p.name.toLowerCase() === name.toLowerCase());
            if (found) {
                console.log(`✓ "${name}" exists (ID: ${found._id}, Status: ${found.status}, In Stock: ${found.in_stock})`);
            } else {
                console.log(`✗ "${name}" NOT FOUND`);
            }
        }
        
        // Check for "Nike" as a standalone product
        const nikeProduct = products.find(p => p.name.toLowerCase() === 'nike');
        if (nikeProduct) {
            console.log(`✓ "Nike" exists (ID: ${nikeProduct._id})`);
        } else {
            console.log(`✗ "Nike" NOT FOUND as standalone product`);
        }
        
        await mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
