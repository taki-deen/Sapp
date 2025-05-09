# Service Management System

A RESTful API for managing service requests between customers and service workers.

## Features

- JWT-based user authentication
- Role-based access control (Customer, Worker, Admin)
- Service request creation, assignment, and management
- Service type management (Admin only)
- Worker rating system

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
