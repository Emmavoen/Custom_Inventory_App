# Project X - Backend for Multi-User Checkout System

**Project X** is a SaaS inventory and checkout software designed for marketplace enterprises. 
## 📌 Features

- 👑 Super Admin registration (business owner)
- 👥 Add users with roles
- 🔐 Login for all user types
- 🛂 Role-based permission system
- 🔧 Built with Express.js & PostgreSQL
- 📄 RESTful API structure
- 
## 🗂️ Tech Stack

- **Backend**: Node.js (Express.js)
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Password Hashing**: bcrypt
- **Dev Tools**: Git, Postman


## 🚀 Getting Started

### 1. Clone the Repository


git clone https://github.com/your-username/project-x-backend.git
cd project-x-backend

## 2. Install Dependencies

npm install
## 3. Set Up Environment Variables
Create a .env file:
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
## 4. Run the Server
npm run dev
## 5. 📬 API Endpoints
##✅ Register Super Admin
## 6. POST /api/auth/register-super-admin
{
  "fullName": "Jane Doe",
  "companyName": "Shoprite",
  "email": "admin@example.com",
  "password": "securePassword"
}
## 7. 👥 Add New User
##POST /api/users/add
{
  "fullName": "John Employee",
  "email": "john@example.com",
  "roleId": "role_object_id",
  "password": "optional_custom_password"
}
Only accessible to the Super Admin.

## 8. 🔐 Login
##POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securePassword"
}
Response:
{
  "message": "Login successful",
  "token": "jwt_token"
}
## Models Overview
User: fullName, email, password, companyName, role

Role: name, permissions[]

Permission: name
