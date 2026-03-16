const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');
const Customer = require('./models/Customer');
const Order = require('./models/Order');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const products = await Product.countDocuments();
        const customers = await Customer.countDocuments();
        const orders = await Order.countDocuments();
        console.log(`P: ${products}, C: ${customers}, O: ${orders}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
