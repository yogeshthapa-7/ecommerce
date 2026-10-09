// One-time migration: add festival sale discounts to existing products
// Usage: node seed/add-sale-tags.js
// Does NOT delete or overwrite products — only sets discount and saleFestival fields.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Models
const Product = require('../models/Product');

// Map product names to discount % and festival
// Adjust these mappings to match your actual product names in the DB
const saleMappings = [
    // Dashain offers
    { name: "Nike Air Max 270", discount: 25, saleFestival: "dashain" },
    { name: "Nike Air Max Plus", discount: 30, saleFestival: "dashain" },
    { name: "Jordan Spizike Low", discount: 20, saleFestival: "dashain" },
    { name: "Nike Metcon 10", discount: 15, saleFestival: "dashain" },
    { name: "Nike Tech", discount: 20, saleFestival: "dashain" },

    // Tihar offers
    { name: "Nike Pegasus 41", discount: 20, saleFestival: "tihar" },
    { name: "Nike Blazer", discount: 25, saleFestival: "tihar" },
    { name: "Nike Club Fleece", discount: 15, saleFestival: "tihar" },
    { name: "Nike Gym Bag", discount: 30, saleFestival: "tihar" },
    { name: "Nike Heritage", discount: 20, saleFestival: "tihar" },

    // Holi offers
    { name: "Nike Huarache", discount: 20, saleFestival: "holi" },
    { name: "Nike Run Defy", discount: 25, saleFestival: "holi" },
    { name: "Nike 24.7 ImpossiblySoft-Women", discount: 15, saleFestival: "holi" },
    { name: "Fleece Full-Zip Hoodie", discount: 20, saleFestival: "holi" },
    { name: "Nike Academy", discount: 25, saleFestival: "holi" },

    // General / multi-festival
    { name: "Nike Mind 001", discount: 10, saleFestival: "dashain" },
    { name: "Nike Offcourt Adjust", discount: 15, saleFestival: "tihar" },
    { name: "Nike Varsity Elite", discount: 35, saleFestival: "dashain" },
    { name: "Nike Sportswear Essentials", discount: 20, saleFestival: "holi" },
];

const addSaleTags = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        let updated = 0;
        let skipped = 0;

        for (const mapping of saleMappings) {
            const result = await Product.findOneAndUpdate(
                { name: mapping.name },
                { $set: { discount: mapping.discount, saleFestival: mapping.saleFestival } },
                { new: true }
            );

            if (result) {
                updated++;
                console.log(`✅ ${mapping.name}: ${mapping.discount}% off (${mapping.saleFestival})`);
            } else {
                skipped++;
                console.log(`⚠️  Not found: ${mapping.name}`);
            }
        }

        console.log(`\n✅ Updated ${updated} products, skipped ${skipped}`);
        console.log('Sale tags added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error.message);
        process.exit(1);
    }
};

addSaleTags();
