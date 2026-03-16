const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') });

const Product = require('../backend/models/Product');
const Customer = require('../backend/models/Customer');
const Order = require('../backend/models/Order');

async function check() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        
        const products = await Product.countDocuments();
        const customers = await Customer.countDocuments();
        const orders = await Order.countDocuments();
        
        console.log('Counts in DB:');
        console.log('Products:', products);
        console.log('Customers:', customers);
        console.log('Orders:', orders);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
