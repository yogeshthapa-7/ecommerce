const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration - allow localhost and production domains
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://your-production-domain.vercel.app',
            'https://your-production-domain.com'
        ];
        const isLocalhostOrigin = typeof origin === 'string'
            && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || isLocalhostOrigin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/password-reset', require('./routes/passwordResetRoutes'));

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Nike E-Commerce API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
