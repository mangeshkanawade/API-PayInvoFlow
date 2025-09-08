# 📘 PayInvoFlow API

PayInvoFlow is a **Node.js + TypeScript + Express + MongoDB** based billing system backend.  
It follows **SOLID principles** with a clean architecture (`Controller → Service → Repository`) and comes with **JWT authentication** and **Swagger API documentation**.  

---

## 📂 Folder Structure
```
src/
 ├── config/        # Database, env, app configuration
 ├── controllers/   # Route controllers (entry point for HTTP)
 ├── dtos/          # Data Transfer Objects (validation schemas, types)
 ├── middleware/    # JWT auth, error handling, logging
 ├── models/        # Mongoose models (User, Biller, client, Invoice, etc.)
 ├── repositories/  # Data access layer
 ├── routes/        # Route definitions (Express Router)
 ├── services/      # Business logic
 ├── utils/         # Helper functions and utilities
 ├── server.ts      # Application entrypoint
 ├── swagger.ts     # Swagger setup
```

---

## 🚀 Features
- **Authentication**
  - JWT-based login & register  
  - Role-based access control (`Admin`, `Biller`, `Viewer`)  
- **Billing System**
  - Manage **Billers** (name, GST, email, etc.)  
  - Manage **clients** (basic client info)  
  - Future-ready for **Invoices**  
- **Generic CRUD**
  - Base repository, service, and controller to reduce duplication  
- **API Documentation**
  - Swagger UI (`/api-docs`) with request/response schemas  
  - JWT Bearer authentication built into Swagger  
- **Best Practices**
  - SOLID principles  
  - DTOs for validation  
  - Separation of concerns  

---

## 🛠 Tech Stack
- **Node.js** (v18+)  
- **TypeScript**  
- **Express.js**  
- **MongoDB with Mongoose**  
- **JWT for authentication**  
- **Swagger (swagger-jsdoc + swagger-ui-express)**  

---

## ⚙️ Setup & Installation

### 1️⃣ Clone repository
```bash
git clone https://github.com/your-username/payinvflow-api.git
cd payinvflow-api
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure Environment
Create a `.env` file at the root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/payinvflow
JWT_SECRET=yourSuperSecretKey
```

### 4️⃣ Run in Development
```bash
npm run dev
```

### 5️⃣ Build & Run in Production
```bash
npm run build
npm start
```

---

## 📖 API Documentation
Swagger UI is available at:  
👉 [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

Features:
- Try out API calls directly  
- Add `Authorization: Bearer <token>` once using the **Authorize** button  

---

## 🔑 Authentication Flow
- `POST /api/auth/register` → Create new user  
- `POST /api/auth/login` → Get JWT token  
- Use JWT token in `Authorization` header for all protected routes:
  ```
  Authorization: Bearer <token>
  ```

---

## 📌 Example Routes
- **Auth**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- **Billers**
  - `GET /api/billers`
  - `POST /api/billers`
  - `PUT /api/billers/:id`
  - `DELETE /api/billers/:id`
- **Clients**
  - `GET /api/clients`
  - `POST /api/clients`

---

## ✅ Roadmap
- [ ] Invoice module (generate & export PDF invoices)  
- [ ] Payment integration (Stripe, PayPal)  
- [ ] Role-based granular permissions  
- [ ] Unit & integration tests  

---

## 👨‍💻 Author
**PayInvoFlow Team**  
Maintained by Mangesh Kanawade  
