# Car Rental System - Backend API

A RESTful backend API for a car rental system, built with TypeScript, Express, PostgreSQL, Prisma, JWT, bcrypt, and Zod.

Users can sign up, log in, and manage their own car bookings. Every booking is protected by JWT authentication and ownership-based access control, so a user can only read, update, or delete their own bookings.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running PostgreSQL with Docker](#running-postgresql-with-docker)
- [Environment Variables](#environment-variables)
- [Authentication Flow](#authentication-flow)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Business Rules](#business-rules)
- [Author](#author)

## Features

- User signup and login
- JWT-based authentication
- Ownership-based authorization (a user can only access their own bookings)
- Full booking CRUD (create, read, update, delete)
- Booking summary per user (total bookings and total amount spent)
- Input validation with Zod
- Consistent JSON response envelope and centralized error handling

## Tech Stack

| Layer          | Technology                     |
| -------------- | ------------------------------ |
| Runtime        | Node.js                        |
| Framework      | Express 5                      |
| Language       | TypeScript                     |
| Database       | PostgreSQL                     |
| ORM            | Prisma                         |
| Authentication | JSON Web Tokens (jsonwebtoken) |
| Password hash  | bcrypt                         |
| Validation     | Zod                            |

## Project Structure

```
car-rental-system/
├── prisma/
│   ├── schema.prisma          # Database models (User, Booking)
│   └── migrations/            # SQL migration history
├── src/
│   ├── server.ts              # App entry point and middleware wiring
│   ├── prisma.ts              # Prisma client instance
│   ├── prisma.config.ts       # Prisma CLI configuration
│   ├── auth.ts                # Auth routes (signup, login)
│   ├── bookings.ts            # Booking routes (CRUD + summary)
│   ├── middleware.ts          # JWT authentication middleware
│   ├── schema.ts              # Zod validation schemas
│   ├── utils.ts               # bcrypt and JWT helpers
│   ├── types.d.ts             # Express Request type augmentation
│   └── generated/             # Prisma-generated client (not committed)
├── docker-compose.yml         # Local PostgreSQL service
├── .env.example               # Sample environment variables
├── tsconfig.json
└── package.json
```

## Prerequisites

- Node.js 18 or later
- A PostgreSQL database (either a local instance, the provided Docker Compose service, or a hosted provider)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ritiklakhwani/car-rental-system.git
cd car-rental-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

See [Environment Variables](#environment-variables) for details.

### 4. Set up the database

Apply the schema and generate the Prisma client:

```bash
npm run prisma:migrate
```

This creates the tables, applies the schema to PostgreSQL, and generates the Prisma client.

### 5. Run the server (development)

```bash
npm run dev
```

The server starts on `http://localhost:3000` (or the `PORT` you configured).

A health check is available at `GET /health`, which returns `{ "status": "ok" }`.

### Production build

```bash
npm run build
npm start
```

## Running PostgreSQL with Docker

If you do not have a local PostgreSQL instance, you can start one with Docker Compose:

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container on port `5432` with the default credentials `user` / `password` and database `car_rental`. The matching connection string is:

```
DATABASE_URL="postgresql://user:password@localhost:5432/car_rental"
```

After the container is healthy, run the migrations and start the server:

```bash
npm run prisma:migrate
npm run dev
```

To stop the database:

```bash
docker compose down
```

## Environment Variables

| Variable       | Description                                       | Example                                                  |
| -------------- | ------------------------------------------------- | -------------------------------------------------------- |
| `PORT`         | Port the HTTP server listens on                   | `3000`                                                   |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma       | `postgresql://user:password@localhost:5432/car_rental`   |
| `JWT_SECRET`   | Secret used to sign and verify JWTs               | `a-long-random-secret`                                   |

## Authentication Flow

1. A user signs up with a username and password. The password is hashed with bcrypt before being stored.
2. On login, the credentials are verified and a signed JWT is issued (valid for 1 day).
3. The token payload contains:

   ```json
   {
     "userId": 1,
     "username": "rahul"
   }
   ```

4. The token must be sent in the `Authorization` header on all protected routes:

   ```
   Authorization: Bearer <JWT_TOKEN>
   ```

5. All `/bookings` routes are protected by the authentication middleware.

## API Reference

Base URL: `http://localhost:3000`

| Method | Endpoint                    | Auth | Description                          |
| ------ | --------------------------- | ---- | ------------------------------------ |
| GET    | `/health`                   | No   | Health check                         |
| POST   | `/auth/signup`              | No   | Create a new user                    |
| POST   | `/auth/login`               | No   | Log in and receive a JWT             |
| POST   | `/bookings`                 | Yes  | Create a booking                     |
| GET    | `/bookings`                 | Yes  | List the current user's bookings     |
| GET    | `/bookings?bookingId=1`     | Yes  | Get a single booking by id           |
| GET    | `/bookings?summary=true`    | Yes  | Get a booking summary for the user   |
| PUT    | `/bookings/:bookingId`      | Yes  | Update a booking                     |
| DELETE | `/bookings/:bookingId`      | Yes  | Delete a booking                     |

### Signup

`POST /auth/signup`

Request body:

```json
{
  "username": "rahul",
  "password": "secret123"
}
```

Response (201):

```json
{
  "success": true,
  "data": {
    "message": "User created successfully",
    "userId": 1
  }
}
```

### Login

`POST /auth/login`

Request body:

```json
{
  "username": "rahul",
  "password": "secret123"
}
```

Response (200):

```json
{
  "success": true,
  "data": {
    "message": "Login successful",
    "token": "<JWT_TOKEN>"
  }
}
```

Use the returned token in the `Authorization` header for all booking requests.

### Create Booking

`POST /bookings`

Headers: `Authorization: Bearer <JWT_TOKEN>`

Request body:

```json
{
  "carName": "Honda City",
  "days": 3,
  "rentPerDay": 1500
}
```

Response (201):

```json
{
  "success": true,
  "data": {
    "message": "Booking created successfully",
    "bookingId": 1,
    "totalCost": 4500
  }
}
```

### List Bookings

`GET /bookings`

Headers: `Authorization: Bearer <JWT_TOKEN>`

Returns all bookings that belong to the authenticated user, each with a computed `totalCost`.

### Get a Single Booking

`GET /bookings?bookingId=1`

Headers: `Authorization: Bearer <JWT_TOKEN>`

Returns the booking with the given id, only if it belongs to the authenticated user.

### Booking Summary

`GET /bookings?summary=true`

Headers: `Authorization: Bearer <JWT_TOKEN>`

Response:

```json
{
  "success": true,
  "data": {
    "userId": 1,
    "username": "rahul",
    "totalBookings": 3,
    "totalAmountSpent": 6300
  }
}
```

Only `booked` and `completed` bookings are counted; `cancelled` bookings are ignored.

### Update Booking

`PUT /bookings/:bookingId`

Headers: `Authorization: Bearer <JWT_TOKEN>`

Send any subset of fields. Update the booking details:

```json
{
  "carName": "Verna",
  "days": 4,
  "rentPerDay": 1600
}
```

Or update only the status:

```json
{
  "status": "completed"
}
```

### Delete Booking

`DELETE /bookings/:bookingId`

Headers: `Authorization: Bearer <JWT_TOKEN>`

Deletes the booking if it belongs to the authenticated user.

## Error Handling

All errors follow a consistent envelope:

```json
{
  "success": false,
  "error": "error message"
}
```

| Status | Meaning                                  |
| ------ | ---------------------------------------- |
| 400    | Invalid input                            |
| 401    | Unauthorized (missing or invalid token)  |
| 403    | Forbidden (booking does not belong to user) |
| 404    | Resource not found                       |
| 409    | Conflict (for example, username taken)   |
| 500    | Internal server error                    |

## Business Rules

- A JWT is required for all `/bookings` routes.
- A booking belongs only to the user who created it.
- `days` must be less than 365.
- `rentPerDay` must be at most 2000.
- A new booking is created with the status `booked`.
- `totalCost` is computed as `days * rentPerDay`.
- Only the owner can update or delete a booking.

## Author

Built by oceandev. A TypeScript and backend focused project demonstrating real-world API practices in a minimal, readable structure.
