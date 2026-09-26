const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

const cleanupDuplicates = async () => {
    const Product = require('../models/Product');
    
    console.log('\n=== Finding duplicate products ===\n');
    
    // Find all products grouped by name
    const allProducts = await Product.find({}).sort({ createdAt: 1 });
    const grouped = {};
    
    for (const product of allProducts) {
        const name = product.name.trim();
        if (!grouped[name]) {
            grouped[name] = [];
        }
        grouped[name].push(product);
    }
    
    // Find duplicates
    const duplicates = Object.entries(grouped).filter(([name, products]) => products.length > 1);
    
    if (duplicates.length === 0) {
        console.log('No duplicates found.');
        return;
    }
    
    console.log(`Found ${duplicates.length} product(s) with duplicates:\n`);
    
    let totalRemoved = 0;
    
    for (const [name, products] of duplicates) {
        console.log(`\n"${name}" - ${products.length} copies:`);
        
        // Keep the oldest one (first in sorted array)
        const keep = products[0];
        const remove = products.slice(1);
        
        console.log(`  ✓ Keeping: ${keep._id} (created: ${keep.createdAt})`);
        
        for (const p of remove) {
            console.log(`  ✗ Removing: ${p._id} (created: ${p.createdAt})`);
            await Product.findByIdAndDelete(p._id);
            totalRemoved++;
        }
    }
    
    console.log(`\n=== Cleanup complete ===`);
    console.log(`Removed ${totalRemoved} duplicate product(s).\n`);
    
    // Show remaining product count
    const remaining = await Product.countDocuments();
    console.log(`Remaining products in database: ${remaining}`);
    
    // Check for products missing stockQuantity
    const missingStock = await Product.find({ 
        $or: [
            { stockQuantity: { $exists: false } },
            { stockQuantity: null }
        ]
    });
    
    if (missingStock.length > 0) {
        console.log(`\nFound ${missingStock.length} products missing stockQuantity field. Fixing...`);
        for (const p of missingStock) {
            p.stockQuantity = p.stockQuantity || 0;
            p.lowStockThreshold = p.lowStockThreshold || 5;
            p.in_stock = p.in_stock !== false;
            await p.save();
            console.log(`  ✓ Fixed: ${p.name} (stockQuantity: ${p.stockQuantity})`);
        }
    } else {
        console.log('\nAll products have stockQuantity field.');
    }
    
    // Final summary
    const finalCount = await Product.countDocuments();
    console.log(`\nFinal product count: ${finalCount}`);
    
    // List all unique product names
    const allNames = await Product.find({}).sort({ name: 1 }).select('name stockQuantity in_stock');
    console.log('\nProduct inventory:');
    allNames.forEach(p => {
        const status = (p.in_stock !== false && p.stockQuantity > 0) ? 'In Stock' : 'Out of Stock';
        console.log(`  - ${p.name}: ${p.stockQuantity} units (${status})`);
    });
};

const run = async () => {
    await connectDB();
    await cleanupDuplicates();
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
    process.exit(0);
};

run().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
