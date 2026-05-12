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

// ==================== SEED DATA ====================

const products = [
    {
        name: "Nike Air Max 270",
        category: "Shoes",
        gender: "Men",
        price: 160.00,
        status: "active",
        currency: "$",
        rating: 4.8,
        reviews_count: 1240,
        colors: [
            { name: "White", image_url: "/product-cutouts-transparent/nike-air-max-270-dda25f7e.png" },
            { name: "Black", image_url: "/product-cutouts-transparent/nike-air-max-270-8904d678.png" },
            { name: "Multi-Color", image_url: "/product-cutouts-transparent/nike-air-max-270-43a1f087.png" }
        ],
        description: "Nike's first lifestyle Air Max brings you style, comfort and big attitude. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
        image_url: "/product-cutouts-transparent/nike-air-max-270-fe29fb79.png",
        in_stock: true,
        sizes: [7, 8, 9, 10, 11]
    },
    {
        name: "Nike Air Max Plus",
        category: "Shoes",
        gender: "Men",
        status: "active",
        price: 115.00,
        currency: "$",
        rating: 4.9,
        reviews_count: 5600,
        colors: [
            { name: "White", image_url: "/product-cutouts-transparent/nike-air-max-plus-5404a18a.png" },
            { name: "Black", image_url: "/product-cutouts-transparent/nike-air-max-plus-6c7ec7b0.png" },
            { name: "Reflect Silver/Hyper Jade", image_url: "/product-cutouts-transparent/nike-air-max-plus-c3747d8d.png" }
        ],
        image_url: "/product-cutouts-transparent/nike-air-max-plus-a6d42e0c.png",
        description: "The radiance lives on in the Nike Air Force 1 '07, the b-ball OG that puts a fresh spin on what you know best.",
        in_stock: true,
        sizes: [8, 9, 10, 11]
    },
    {
        name: "Nike Pegasus 41",
        category: "Shoes",
        gender: "Women",
        status: "active",
        price: 130.00,
        currency: "$",
        rating: 4.5,
        reviews_count: 890,
        colors: [
            { name: "White", image_url: "/product-cutouts-transparent/nike-pegasus-41-9b3c9122.png" },
            { name: "Black", image_url: "/product-cutouts-transparent/nike-pegasus-41-34d971e2.png" },
            { name: "Twist/Black", image_url: "/product-cutouts-transparent/nike-pegasus-41-c3b7be7a.png" },
            { name: "Gray/Diffused Blue", image_url: "/product-cutouts-transparent/nike-pegasus-41-607d4719.png" }
        ],
        description: "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals.",
        image_url: "/product-cutouts-transparent/nike-pegasus-41-9b3c9122.png",
        in_stock: true,
        sizes: [8, 9, 10]
    },
    {
        name: "Nike Blazer",
        category: "Shoes",
        gender: "Unisex",
        status: "active",
        price: 150.00,
        currency: "$",
        rating: 4.7,
        reviews_count: 890,
        colors: [
            { name: "White/Sail/Black", image_url: "/product-cutouts-transparent/nike-blazer-47dae5a7.png" },
            { name: "Black/Sail/Black/White", image_url: "/product-cutouts-transparent/nike-blazer-29860531.png" },
            { name: "Black/Anthracite/White/University Red", image_url: "/product-cutouts-transparent/nike-blazer-5eec2e75.png" },
            { name: "White/Sail/Black/Pine Green", image_url: "/product-cutouts-transparent/nike-blazer-7da899c4.png" }
        ],
        description: "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals.",
        image_url: "/product-cutouts-transparent/nike-blazer-bb984165.png",
        in_stock: true,
        sizes: [8, 9, 10]
    },
    {
        name: "Nike Huarache",
        category: "Shoes",
        gender: "Kids",
        status: "active",
        price: 100.00,
        currency: "$",
        rating: 4.2,
        reviews_count: 890,
        colors: [
            { name: "White", image_url: "/product-cutouts-transparent/nike-huarache-1a6ea6c1.png" },
            { name: "Black", image_url: "/product-cutouts-transparent/nike-huarache-27014530.png" },
            { name: "Red", image_url: "/product-cutouts-transparent/nike-huarache-e7aa05e7.png" },
            { name: "Multi-Color", image_url: "/product-cutouts-transparent/nike-huarache-ad6e849f.png" }
        ],
        description: "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals.",
        image_url: "/product-cutouts-transparent/nike-huarache-29c20f92.png",
        in_stock: true,
        sizes: [8, 9, 10]
    },
    {
        name: "Nike Run Defy",
        category: "Shoes",
        gender: "Women",
        status: "active",
        price: 200.00,
        currency: "$",
        rating: 4.2,
        reviews_count: 890,
        colors: [
            { name: "White/Mint Foam", image_url: "/product-cutouts-transparent/nike-run-defy-fa9eed58.png" },
            { name: "Black/White", image_url: "/product-cutouts-transparent/nike-run-defy-b86f8874.png" },
            { name: "Orange/White/Bright Crimson", image_url: "/product-cutouts-transparent/nike-run-defy-c6010dda.png" }
        ],
        description: "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals.",
        image_url: "/product-cutouts-transparent/nike-run-defy-a12c964d.png",
        in_stock: true,
        sizes: [8, 10, 12]
    },
    {
        name: "Jordan Spizike Low",
        category: "Shoes",
        gender: "Men",
        status: "active",
        price: 250.00,
        currency: "$",
        rating: 4.2,
        reviews_count: 890,
        colors: [
            { name: "Black/Anthracite", image_url: "/product-cutouts-transparent/jordan-spizike-low-be435a03.png" },
            { name: "Black/Wolf Grey", image_url: "/product-cutouts-transparent/jordan-spizike-low-28d246be.png" },
            { name: "Black/Gamma Blue", image_url: "/product-cutouts-transparent/jordan-spizike-low-097dc3f3.png" },
            { name: "Sail/Oil Grey", image_url: "/product-cutouts-transparent/jordan-spizike-low-a9b05d58.png" }
        ],
        description: "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals.",
        image_url: "/product-cutouts-transparent/jordan-spizike-low-d5901466.png",
        in_stock: true,
        sizes: [9, 10, 11]
    },
    {
        name: "Nike Metcon 10",
        category: "Shoes",
        gender: "Men",
        status: "active",
        price: 180.00,
        currency: "$",
        rating: 4.2,
        reviews_count: 890,
        colors: [
            { name: "Black/Anthracite/White", image_url: "/product-cutouts-transparent/nike-metcon-10-f9f3c5ae.png" },
            { name: "Black/Safety Orange", image_url: "/product-cutouts-transparent/nike-metcon-10-0c1f31b6.png" },
            { name: "Vast Grey/Blue Hero", image_url: "/product-cutouts-transparent/nike-metcon-10-5ea26efb.png" },
            { name: "Green Strike/Light Liquid Lime", image_url: "/product-cutouts-transparent/nike-metcon-10-3e9d8f65.png" }
        ],
        description: "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals.",
        image_url: "/product-cutouts-transparent/nike-metcon-10-fdc24e9f.png",
        in_stock: true,
        sizes: [10, 11, 13]
    },
    {
        name: "Nike Gym Bag",
        category: "Bags",
        gender: "Unisex",
        status: "active",
        price: 180.00,
        currency: "$",
        rating: 4.4,
        reviews_count: 890,
        colors: [
            { name: "Desert Khaki/Black", image_url: "/product-cutouts-transparent/nike-gym-bag-8405faaf.png" },
            { name: "Iron Grey/Black", image_url: "/product-cutouts-transparent/nike-gym-bag-a2ccaa6e.png" },
            { name: "Laser Fuchsia/Black", image_url: "/product-cutouts-transparent/nike-gym-bag-1922bb89.png" },
            { name: "Burnt Sunrise/Black", image_url: "/product-cutouts-transparent/nike-gym-bag-fc71f999.png" }
        ],
        description: "Simple and sleek design — the perfect compact companion for your fitness goals.",
        image_url: "/product-cutouts-transparent/nike-gym-bag-eab4131d.png",
        in_stock: true,
        sizes: ["One Size"]
    },
    {
        name: "Nike Academy",
        category: "Bags",
        gender: "Unisex",
        status: "active",
        price: 144.00,
        currency: "$",
        rating: 4.2,
        reviews_count: 890,
        colors: [
            { name: "Limelight/Hyper Crimson", image_url: "/product-cutouts-transparent/nike-academy-cab9aaeb.png" },
            { name: "Black/Sunset Pulse", image_url: "/product-cutouts-transparent/nike-academy-eb5fc363.png" },
            { name: "Black/White", image_url: "/product-cutouts-transparent/nike-academy-b6fd89bd.png" },
            { name: "Black/Ember Glow", image_url: "/product-cutouts-transparent/nike-academy-469aad44.png" }
        ],
        description: "Reliable and spacious — the go-to choice for travel, gym, or weekend trips.",
        image_url: "/product-cutouts-transparent/nike-academy-ba4df3c8.png",
        in_stock: true,
        sizes: ["One Size"]
    },
    {
        name: "Nike Heritage",
        category: "Bags",
        gender: "Unisex",
        status: "active",
        price: 130.00,
        currency: "$",
        rating: 4.4,
        reviews_count: 890,
        colors: [
            { name: "Light Bone", image_url: "/product-cutouts-transparent/nike-heritage-4315e0c3.png" },
            { name: "Black", image_url: "/product-cutouts-transparent/nike-heritage-e61be5f0.png" },
            { name: "Desert Khaki", image_url: "/product-cutouts-transparent/nike-heritage-8fdc1b65.png" }
        ],
        description: "Durable and stylish, this backpack is designed for athletes on the go.",
        image_url: "/product-cutouts-transparent/nike-heritage-df8a7e9f.png",
        in_stock: true,
        sizes: ["One Size"]
    },
    {
        name: "Nike Varsity Elite",
        category: "Bags",
        gender: "Unisex",
        status: "active",
        price: 110.00,
        currency: "$",
        rating: 4.2,
        reviews_count: 890,
        colors: [
            { name: "Black", image_url: "/product-cutouts-transparent/nike-varsity-elite-a20decdf.png" },
            { name: "Midnight Navy/Black", image_url: "/product-cutouts-transparent/nike-varsity-elite-8f05d291.png" },
            { name: "Iron Grey/Black", image_url: "/product-cutouts-transparent/nike-varsity-elite-c99f8e6d.png" }
        ],
        description: "Spacious and functional, this basketball backpack is perfect for carrying all your gear.",
        image_url: "/product-cutouts-transparent/nike-varsity-elite-c99f8e6d.png",
        in_stock: false,
        sizes: ["One Size"]
    },
    {
        name: "Nike Tech",
        category: "Hoodies",
        gender: "Men",
        status: "active",
        price: 97.00,
        currency: "$",
        rating: 4.0,
        reviews_count: 890,
        colors: [
            { name: "Black", image_url: "/product-cutouts-transparent/nike-tech-7c2bcbf8.png" },
            { name: "Dark Grey Heather", image_url: "/product-cutouts-transparent/nike-tech-6e181241.png" },
            { name: "Deep Night/Black", image_url: "/product-cutouts-transparent/nike-tech-a86e8c63.png" },
            { name: "Black Heather", image_url: "/product-cutouts-transparent/nike-tech-b6c568c1.png" }
        ],
        description: "Comfort meets style in this classic pullover hoodie.",
        image_url: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/7deb0efc-4a47-4ac3-8abf-ae49b4f33b50/AS+M+NK+TCH+FLC+FZ+WR+HOODIE.png",
        in_stock: true,
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Nike Club Fleece",
        category: "Hoodies",
        gender: "Men",
        status: "active",
        price: 100.00,
        currency: "$",
        rating: 4.3,
        reviews_count: 890,
        colors: [
            { name: "Black", image_url: "/product-cutouts-transparent/nike-club-fleece-44077b48.png" },
            { name: "Dark-Gray", image_url: "/product-cutouts-transparent/nike-club-fleece-647d294e.png" },
            { name: "Birch Heather/White", image_url: "/product-cutouts-transparent/nike-club-fleece-719480cc.png" },
            { name: "Sail/Sail/Black", image_url: "/product-cutouts-transparent/nike-club-fleece-029086f3.png" }
        ],
        description: "A cozy, standard-fit fleece sweatshirt with a soft interior.",
        image_url: "https://sportamore.com/cdn/shop/products/09236-35_001.png?v=1678993650",
        in_stock: true,
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Nike 24.7 ImpossiblySoft-Women",
        category: "Hoodies",
        gender: "Women",
        price: 87.00,
        status: "active",
        currency: "$",
        rating: 4.6,
        reviews_count: 890,
        colors: [
            { name: "Black", image_url: "/product-cutouts-transparent/nike-24-7-impossiblysoft-women-69c78e27.png" },
            { name: "Light Orewood Brown", image_url: "/product-cutouts-transparent/nike-24-7-impossiblysoft-women-9465f997.png" },
            { name: "Sail/Light Bone", image_url: "/product-cutouts-transparent/nike-24-7-impossiblysoft-women-4f6da231.png" },
            { name: "Midnight Navy/Dark Obsidian", image_url: "/product-cutouts-transparent/nike-24-7-impossiblysoft-women-2fb1e5cd.png" }
        ],
        description: "Soft and warm, this fleece hoodie is perfect for cooler days.",
        image_url: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/3be8ed34-66b3-4a2d-9beb-7bcfb3e91702/AS+W+NK+24.7+DF+HZ+TOP+SOFT.png",
        in_stock: true,
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Fleece Full-Zip Hoodie",
        category: "Hoodies",
        gender: "Men",
        status: "active",
        price: 95.00,
        currency: "$",
        rating: 4.7,
        reviews_count: 890,
        colors: [
            { name: "White", image_url: "/product-cutouts-transparent/fleece-full-zip-hoodie-e0770c3e.png" },
            { name: "Black", image_url: "/product-cutouts-transparent/fleece-full-zip-hoodie-4e15cb52.png" }
        ],
        description: "A versatile full-zip hoodie made from soft fleece fabric, perfect for layering.",
        image_url: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/cf44ed1f-4c9a-45d2-a9e1-f5c3ab0c01d2/M+NK+CLUB+BB+FZ+HOODIE.png",
        in_stock: true,
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Nike Sportswear Essentials",
        category: "Bags",
        gender: "Women",
        status: "active",
        price: 90.00,
        currency: "$",
        rating: 4.7,
        reviews_count: 890,
        colors: [
            { name: "Light Bone/Sail", image_url: "/product-cutouts-transparent/nike-sportswear-essentials-506a271b.png" },
            { name: "Black", image_url: "/product-cutouts-transparent/nike-sportswear-essentials-dabf34bf.png" }
        ],
        description: "A versatile crossbody bag perfect for everyday essentials.",
        image_url: "/product-cutouts-transparent/nike-sportswear-essentials-587eacba.png",
        in_stock: true,
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Nike Mind 001",
        category: "Slippers",
        gender: "Men",
        status: "active",
        price: 80.00,
        currency: "$",
        rating: 4.7,
        reviews_count: 890,
        colors: [
            { name: "Black/Hyper", image_url: "/product-cutouts-transparent/nike-mind-001-b9dfb60a.png" },
            { name: "Light Smoke Grey", image_url: "/product-cutouts-transparent/nike-mind-001-ff2c3065.png" },
            { name: "Solar Red/Hyper Crimson", image_url: "/product-cutouts-transparent/nike-mind-001-538903af.png" }
        ],
        description: "Step into effortless comfort with the Nike Mind 001 Slipper.",
        image_url: "/product-cutouts-transparent/nike-mind-001-ca9d09e2.png",
        in_stock: true,
        sizes: [8, 9, 10, 11]
    },
    {
        name: "Nike Offcourt Adjust",
        category: "Slippers",
        gender: "Men",
        status: "active",
        price: 40.00,
        currency: "$",
        rating: 4.7,
        reviews_count: 890,
        colors: [
            { name: "Summit White/Black", image_url: "/product-cutouts-transparent/nike-offcourt-adjust-b3f357a0.png" },
            { name: "Black", image_url: "/product-cutouts-transparent/nike-offcourt-adjust-ed113173.png" },
            { name: "University Red/Black", image_url: "/product-cutouts-transparent/nike-offcourt-adjust-5b023e57.png" },
            { name: "Lapis/Dark Smoke Grey", image_url: "/product-cutouts-transparent/nike-offcourt-adjust-5a54dfaf.png" }
        ],
        description: "Slide into all-day comfort with the Nike Offcourt Adjust.",
        image_url: "/product-cutouts-transparent/nike-offcourt-adjust-080c3ce5.png",
        in_stock: true,
        sizes: [8, 9, 10, 11]
    }
];

const categories = [
    { name: "Shoes", image: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_png/47b7945e-a379-4c24-b9df-98f4eef178e5/NIKE+AIR+MAX+PLUS.png", products: 42, status: "Active" },
    { name: "Hoodies", image: "https://cdn.media.amplience.net/i/frasersdev/53101203_o?fmt=auto&upscale=false&w=767&h=767&sm=scaleFit&$h-ttl$", products: 18, status: "Active" },
    { name: "Bags", image: "https://i8.amplience.net/i/jpl/jd_ANZ0126710_a?qlt=92", products: 10, status: "Hidden" },
    { name: "Slippers", image: "https://images.soleretriever.com/sb/products/nike_mind_001_geode_teal_HQ4307-301-1772479014774.webp?width=1600&quality=90&fit=contain", products: 20, status: "Active" },
    { name: "Jerseys", image: "https://thesoccerfactory.com/cdn/shop/files/NikeParkVIIMens-Black.jpg?v=1752063507&width=1000", products: 22, status: "Active" },
    { name: "Tops", image: "https://cdn-images.farfetch-contents.com/23/02/90/79/23029079_53346247_1000.jpg", products: 26, status: "Active" },
    { name: "Leggings", image: "https://www.goaliemonkey.com/media/catalog/product/cache/a848536da192a0c5bb969d0898e6ec13/n/i/nike-undergarmets-just-do-it-power-training-tights-wmn_1.jpg", products: 13, status: "Active" },
    { name: "Gym-Bra", image: "https://www.nikys-sports.com/cdn/shop/files/AURORA_DJ8523-010_PHSFH001-2000.jpg?v=1686777182", products: 10, status: "Active" }
];



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
