require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes (to be created)
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const serviceRequestRoutes = require('./routes/serviceRequests');
const serviceTypeRoutes = require('./routes/serviceTypes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/service-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res)=>{
    res.send("Hello World");
});
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/service-types', serviceTypeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
}); 