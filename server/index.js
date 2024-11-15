import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import coachRoutes from './routes/coach.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';

// Middleware imports
import { authenticateToken } from './middleware/auth.middleware.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/coaches', authenticateToken, coachRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/schedules', authenticateToken, scheduleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});