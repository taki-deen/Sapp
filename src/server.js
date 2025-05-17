require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = require('./app');


// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));


// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/service-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
}); 