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
git clone <repository-url>
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

- `POST /api/service-requests` - Create new service request
- `GET /api/service-requests` - Get all service requests
- `GET /api/service-requests/:id` - Get service request by ID
- `PUT /api/service-requests/:id` - Update service request
- `DELETE /api/service-requests/:id` - Delete service request

### Service Types

- `POST /api/service-types` - Create new service type (Admin only)
- `GET /api/service-types` - Get all service types
- `PUT /api/service-types/:id` - Update service type (Admin only)
- `DELETE /api/service-types/:id` - Delete service type (Admin only)

## Project Structure

```
/project-root
│
├── /controllers       // Logic for each route
├── /models           // MongoDB schema definitions
├── /routes           // API route definitions
├── /middlewares      // Auth checks, error handlers, validators
├── /utils            // Helper functions
├── /config           // MongoDB connection and app config
├── .env              // Environment variables
├── server.js         // Application entry point
```

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

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 