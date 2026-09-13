const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const Product = require('../models/Product');
        const count = await Product.countDocuments();
        console.log('Total products:', count);
        
        const names = await Product.find({}).sort({ name: 1 }).select('name');
        names.forEach(p => console.log(' -', p.name));
        
        await mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
