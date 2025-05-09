const mongoose = require('mongoose');
const User = require('../models/User');
const ServiceType = require('../models/ServiceType');
const orders = require('../models/orders');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/service-management');
    console.log('Connected to MongoDB');

    // Clear old data
    await Promise.all([
      User.deleteMany({}),
      ServiceType.deleteMany({}),
      orders.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create users (no bcrypt, just plain passwords for dev/test)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      phone: '1234567890',
      role: 'admin',
      location: 'New York',
      isActive: true
    });

    const workers = await User.create([
      {
        name: 'John Plumber',
        email: 'john@example.com',
        password: 'worker123',
        phone: '2345678901',
        role: 'worker',
        location: 'New York',
        specialization: 'Plumbing',
        isActive: true
      },
      {
        name: 'Mike Electrician',
        email: 'mike@example.com',
        password: 'worker123',
        phone: '3456789012',
        role: 'worker',
        location: 'New York',
        specialization: 'Electrical',
        isActive: true
      }
    ]);

    const customers = await User.create([
      {
        name: 'Alice Customer',
        email: 'alice@example.com',
        password: 'customer123',
        phone: '4567890123',
        role: 'customer',
        location: 'New York',
        isActive: true
      },
      {
        name: 'Bob Customer',
        email: 'bob@example.com',
        password: 'customer123',
        phone: '5678901234',
        role: 'customer',
        location: 'New York',
        isActive: true
      }
    ]);

    const serviceTypes = await ServiceType.create([
      { name: 'Plumbing', description: 'Plumbing services', isActive: true },
      { name: 'Electrical', description: 'Electrical work', isActive: true },
      { name: 'HVAC', description: 'Heating, ventilation, AC', isActive: true },
      { name: 'Carpentry', description: 'Wood and furniture services', isActive: true }
    ]);

    await orders.create([
      {
        customerId: customers[0]._id,
        workerId: workers[0]._id,
        serviceType: serviceTypes[0]._id,
        description: 'Leaking faucet in kitchen',
        location: '123 Main St, New York',
        status: 'completed',
        scheduledTime: new Date(),
        rating: 5,
        notes: 'Fixed quickly and professionally'
      },
      {
        customerId: customers[1]._id,
        serviceType: serviceTypes[1]._id,
        description: 'Electrical outlet not working',
        location: '456 Park Ave, New York',
        status: 'pending',
        scheduledTime: new Date(Date.now() + 86400000),
        notes: 'Need urgent repair'
      }
    ]);

    console.log('\n✅ Seed data created successfully');
    console.log('\n🔐 Test Credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Worker: john@example.com, mike@example.com / worker123');
    console.log('Customer: alice@example.com, bob@example.com / customer123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
