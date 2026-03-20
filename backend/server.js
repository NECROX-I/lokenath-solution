const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Loknath Solution API is running 🚀', version: '1.0.0' });
});

app.use('/api/auth',             require('./routes/auth'));
app.use('/api/products',         require('./routes/products'));
app.use('/api/orders',           require('./routes/orders'));
app.use('/api/services',         require('./routes/services'));
app.use('/api/service-requests', require('./routes/serviceRequests'));
app.use('/api/contact',          require('./routes/contact'));
app.use('/api/admin',            require('./routes/admin'));

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Loknath Solution running on port ${PORT}`);
  console.log(`📦 Mode: ${process.env.NODE_ENV}\n`);
});

module.exports = app;