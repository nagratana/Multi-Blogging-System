# Blog API

This is the backend API for the Blog application, built with Node.js, Express, and Prisma.

## Features

- **Authentication**: Secure user authentication using JWT and bcrypt.
- **Database**: PostgreSQL (via Prisma ORM).
- **Validation**: Request validation using Zod.
- **CORS**: Cross-Origin Resource Sharing enabled.

## Prerequisites

- Node.js
- PostgreSQL database

## Installation

1.  Clone the repository (if you haven't already).
2.  Navigate to the `blog-api` directory.
3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Set up environment variables:
    Create a `.env` file in the root directory and add the following:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
    JWT_SECRET="your_jwt_secret"
    PORT=3000
    ```

5.  Generate Prisma client:

    ```bash
    npx prisma generate
    ```

## Running the Server

To start the server:

```bash
npm start
```

Or for development (if `nodemon` or `ts-node` is set up):

```bash
npm run dev
```

## API Endpoints

(Add documentation for your specific API endpoints here, e.g.)

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login
- `GET /api/blog` - Get all blogs
