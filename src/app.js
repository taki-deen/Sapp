import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import serviceTypeRoutes from './routes/serviceTypes.js';
import { auth } from './middlewares/auth.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "uploads" directory at root level
const rootPath = path.resolve(__dirname, '..');
app.use('/uploads', express.static(path.join(rootPath, 'uploads')));

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});
app.use('/api/auth', authRoutes);
app.use('/api/users', auth, userRoutes);
app.use('/api/orders', auth, orderRoutes);
app.use('/api/service-types', auth, serviceTypeRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

export default app;
