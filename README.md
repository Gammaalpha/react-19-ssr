# React 19 SSR with express, Node and MySQL

A simple react v19 SSR app with a login and configuration page using secure JWT token management which connects to a MySql database to manage user information.

## Installation and Setup Instructions

### 1. Prerequisites

- Node.js (v18 or higher)
- MySQL Server
- npm or yarn

### 2. Installation Steps

`npm install`

### 3. Database Setup

```sql
-- Create database
CREATE DATABASE mytestdatabse;

-- Use the database
USE mytestdatabse;

-- The users table will be automatically created by the application
```

### 4. Configuration

1. Create a `env` file in the root directory with your database credentials and JWT secrets
2. Update the MySQL connection details in the `env` file
3. Generate strong JWT secrets for production use

#### Required environment variables

```bash
# Client INFO
CLIENT_URL=http://localhost:3000

# Database Configuration
export DB_HOST='localhost'
export DB_PORT='3306'
export DB_USER='root'
export DB_PASSWORD='your-password-here'
export DB_NAME='mytestdatabase'

# JWT Secrets (generate strong secrets for production)
export JWT_SECRET=your-jwt-secret-key-here
export JWT_REFRESH_SECRET=your-refresh-jwt-secret-key-here

# Application Configuration
export NODE_ENV=development
export PORT=3000

# IBM Telemetry state
IBM_TELEMETRY_DISABLED='true'
```

### 5. Running the Application

#### Development mode (with hot reload)

`npm run build:dev`

#### Run the client

`. ./env.sh && npm run start`

> This will run the project from the compiled files in the build folder

#### Build for production

npm run build

#### Start production server

npm run start

### 6. Features Included

✅ **React v19** with TypeScript  
✅ **Server-Side Rendering (SSR)**  
✅ **MySQL Database** with connection pooling  
✅ **JWT Authentication** with short-lived access tokens (15 minutes)  
✅ **Refresh Token** mechanism (7 days, HTTP-only cookie)  
✅ **Protected Routes** component  
✅ **Login/Register** functionality  
✅ **Automatic Token Refresh** on page load  
✅ **Secure Cookie** handling  
✅ **User Context** with React Context API  
✅ **Type Safety** throughout the application  
✅ **Modern Webpack** configuration  
✅ **Production Ready** setup

### 7. Security Features

- **HTTP-only cookies** for refresh tokens
- **Short-lived access tokens** (15 minutes)
- **Password hashing** with bcrypt
- **SQL injection protection** with parameterized queries
- **CORS configuration**
- **Token validation** middleware
- **Secure cookie** settings for production

### 8. API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### 9. Usage

1. Navigate to `http://localhost:3000`
2. Register a new account or login with existing credentials
3. Access protected routes automatically
4. Tokens are refreshed automatically when needed
5. Logout clears all authentication data
