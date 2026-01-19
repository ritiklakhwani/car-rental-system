# 🚗 Car Rental System Backend

A backend API for a **Car Rental System** built using **TypeScript, Express, PostgreSQL, Prisma, JWT, bcrypt, and Zod**.

This project demonstrates:
- Authentication & Authorization using JWT
- Ownership-based access control
- Database modeling with Prisma
- Input validation using Zod
- Clean and minimal backend architecture

---

## 📌 Features

- User Signup & Login
- JWT-based Authentication
- Protected Booking APIs
- Create, Read, Update, Delete bookings
- Booking summary for a user
- Ownership checks (only owner can update/delete)
- Proper error handling and validations

---

## 🛠 Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **PostgreSQL**
- **Prisma ORM**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **Zod**
- **Postman (for testing)**

---

## 📁 Project Structure (Minimal & Clean)

src/
├── server.ts # App entry point
├── prisma.ts # Prisma client
├── auth.ts # Auth routes
├── bookings.ts # Booking routes
├── middleware.ts # JWT auth middleware
├── schemas.ts # Zod schemas
├── utils.ts # bcrypt + jwt helpers
└── types.d.ts # Express Request typing


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone <repo-url>
cd car-rental-backend

2️⃣ Install dependencies
npm install

3️⃣ Setup environment variables

Create a .env file in root:

PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/car_rental"
JWT_SECRET=supersecretkey

4️⃣ Setup Prisma & Database
npx prisma migrate dev --name init


This will:

Create tables

Apply schema to PostgreSQL

Generate Prisma client

5️⃣ Run the server (Development)
npx ts-node-dev src/server.ts


Server will start on:

http://localhost:3000

🔐 Authentication Flow

JWT is issued only on login

JWT payload:

{
  "userId": 1,
  "username": "rahul"
}


Token must be sent in headers:

Authorization: Bearer <JWT_TOKEN>


All /bookings routes are protected

🧪 Testing with Postman (Step-by-Step)
🔹 1. Signup User

POST /auth/signup

Body (JSON):

{
  "username": "rahul",
  "password": "123"
}


Success (201):

{
  "success": true,
  "data": {
    "message": "User created successfully",
    "userId": 1
  }
}

🔹 2. Login User

POST /auth/login

Body (JSON):

{
  "username": "rahul",
  "password": "123"
}


Success (200):

{
  "success": true,
  "data": {
    "message": "Login successful",
    "token": "<JWT_TOKEN>"
  }
}


👉 Copy the token and use it in all booking requests.

🔹 3. Create Booking

POST /bookings

Headers:

Authorization: Bearer <JWT_TOKEN>


Body (JSON):

{
  "carName": "Honda City",
  "days": 3,
  "rentPerDay": 1500
}


Success (201):

{
  "success": true,
  "data": {
    "message": "Booking created successfully",
    "bookingId": 1,
    "totalCost": 4500
  }
}

🔹 4. Get All Bookings

GET /bookings

Headers:

Authorization: Bearer <JWT_TOKEN>

🔹 5. Get Single Booking

GET /bookings?bookingId=1

Headers:

Authorization: Bearer <JWT_TOKEN>

🔹 6. Booking Summary

GET /bookings?summary=true

Headers:

Authorization: Bearer <JWT_TOKEN>


Response:

{
  "success": true,
  "data": {
    "userId": 1,
    "username": "rahul",
    "totalBookings": 3,
    "totalAmountSpent": 6300
  }
}


Only booked and completed bookings are counted
cancelled bookings are ignored

🔹 7. Update Booking

PUT /bookings/1

Headers:

Authorization: Bearer <JWT_TOKEN>


Body (JSON):

{
  "carName": "Verna",
  "days": 4,
  "rentPerDay": 1600
}


OR

{
  "status": "completed"
}

🔹 8. Delete Booking

DELETE /bookings/1

Headers:

Authorization: Bearer <JWT_TOKEN>

🚫 Error Handling Rules

All errors follow this format:

{
  "success": false,
  "error": "error message"
}


Examples:

Invalid inputs → 400

Unauthorized → 401

Forbidden (not owner) → 403

Not found → 404

Conflict → 409

✅ Business Rules Implemented

JWT required for all booking routes

Booking belongs only to logged-in user

days < 365

rentPerDay ≤ 2000

Status on creation = "booked"

Total cost = days × rentPerDay

Only owner can update or delete booking

📌 Notes

ts-node-dev is used only in development

Prisma handles all DB operations

Zod ensures strict input validation

This project follows real-world backend practices in a simplified structure

👨‍💻 Author

Built by oceandev
TypeScript + Backend focused project


