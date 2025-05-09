# Service Management System

A RESTful API for managing service requests between customers and service workers.

## Features

- User authentication (JWT-based)
- Role-based access control (Customer, Worker, Admin)
- Service request management
- Service type management
- Rating system for workers

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/taki-deen/Sapp.git
cd service-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/service-management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Service Requests

- `POST /api/orders` - Create new service request
- `GET /api/orders` - Get all service requests
- `GET /api/orders/:id` - Get service request by ID
- `PUT /api/orders/:id` - Update service request
- `DELETE /api/orders/:id` - Delete service request

### Service Types

- `POST /api/service-types` - Create new service type (Admin only)
- `GET /api/service-types` - Get all service types
- `PUT /api/service-types/:id` - Update service type (Admin only)
- `DELETE /api/service-types/:id` - Delete service type (Admin only)

## Project Structure

```
/project-root
│
├── src/
│   ├── models/          // MongoDB schema definitions
│   ├── routes/          // API route definitions
│   ├── controllers/     // Request handlers and business logic
│   ├── services/        // Database operations and business logic
│   ├── middlewares/     // Auth checks, error handlers, validators
│   ├── utils/           // Helper functions
│   ├── config/          // MongoDB connection, Swagger, and app config
│   ├── tests/           // Test files for routes and services
│   ├── app.js           // Express application setup
│   └── server.js        // Server entry point
│
├── .env                 // Environment variables
├── .env.test           // Test environment variables
└── package.json        // Project dependencies and scripts
```

## Project Structure Details

- **models/**: Contains Mongoose schema definitions for User, Order, and ServiceType
- **routes/**: API route definitions with Swagger documentation
- **controllers/**: Request handlers that process incoming requests and send responses
- **services/**: Business logic and database operations
- **middlewares/**: Custom middleware for authentication, role checking, and validation
- **utils/**: Helper functions and utilities
- **config/**: Configuration files for database, Swagger, and other app settings
- **tests/**: Test files for routes and services using Jest and Supertest

## API Documentation

The API documentation is available at `/api-docs` when the server is running. It includes:
- Detailed endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests and responses


## Error Handling

The API uses a consistent error response format:

```json
{
    "success": false,
    "message": "Error message",
    "error": "Detailed error (in development mode)"
}
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```