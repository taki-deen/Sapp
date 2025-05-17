const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const serviceTypeRoutes = require('./routes/serviceTypes');
const { auth } = require('./middlewares/auth');

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

module.exports = app;
