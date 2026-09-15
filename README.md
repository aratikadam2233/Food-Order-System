# TastyGo — Food Ordering System

A complete full-stack food ordering web application with a customer-facing site and an admin dashboard.

- **Frontend:** React (Vite), React Router, Axios, plain CSS
- **Backend:** Node.js, Express.js, REST APIs
- **Database:** MongoDB with Mongoose
- **Auth:** JWT + bcrypt password hashing, role-based access (customer / admin)

---

## 1. Project Structure

```
food-ordering-system/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route logic (auth, food, order, dashboard)
│   ├── middleware/      # JWT auth guard, admin guard, error handler
│   ├── models/          # Mongoose schemas: User, Food, Order
│   ├── routes/          # Express routers
│   ├── seed/            # Sample data + admin account seeder
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, Footer, FoodCard, ProtectedRoute, etc.
    │   ├── pages/        # Home, Menu, Cart, Checkout, Orders, Admin/*
    │   ├── context/      # AuthContext, CartContext, ToastContext
    │   ├── services/     # Axios API calls
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## 2. Prerequisites

- Node.js v18+ and npm
- A MongoDB instance — either:
  - **Local MongoDB** installed and running (`mongod`), or
  - **MongoDB Atlas** free cluster (recommended if you don't want to install MongoDB locally): https://www.mongodb.com/cloud/atlas/register

---

## 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string:

```
MONGO_URI=mongodb://127.0.0.1:27017/food-ordering-system
# or for Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/food-ordering-system?retryWrites=true&w=majority

PORT=5000
JWT_SECRET=replace_this_with_a_long_random_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Seed the database with sample food items and demo accounts:

```bash
npm run seed
```

This creates:
- 9 sample food items (Pizza, Burger, Indian, Chinese, Snacks, Desserts, Beverages)
- **Admin account:** `admin@foodorder.com` / `Admin@123`
- **Test customer account:** `customer@foodorder.com` / `Customer@123`

Start the backend:

```bash
npm run dev     # with nodemon (auto-restart on changes)
# or
npm start       # plain node
```

The API will run at `http://localhost:5000`. Check it's alive:

```bash
curl http://localhost:5000/api/health
```

---

## 4. Frontend Setup

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173`.

By default the frontend calls the backend at `http://localhost:5000/api`. To change this, create a `frontend/.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

---

## 5. Using the App

### As a customer
1. Register a new account (or log in with `customer@foodorder.com` / `Customer@123`).
2. Browse the **Food Menu**, filter by category, search, sort by price/rating.
3. Click **View Details** on any item to see ingredients and adjust quantity.
4. **Add to Cart**, then go to the **Cart** page to adjust quantities or remove items.
5. Click **Proceed to Checkout**, fill in delivery details, choose a payment method, and **Place Order**.
6. View your order confirmation, then track it anytime from **My Orders**.

### As an admin
1. Log in with `admin@foodorder.com` / `Admin@123`.
2. You'll be taken to `/admin`, which is protected — regular customers cannot access it.
3. **Dashboard:** total food items, total/pending/completed orders, total revenue.
4. **Manage Foods:** add, edit, delete food items, or toggle availability with one click.
5. **Manage Orders:** view all customer orders, expand for details, and change order status. Status changes are reflected immediately on the customer's My Orders page.

---

## 6. API Documentation

Base URL: `http://localhost:5000/api`

All responses follow this shape:
```json
{ "success": true, "message": "...", "data": {} }
{ "success": false, "message": "..." }
```

Protected routes require an `Authorization: Bearer <token>` header. Admin-only routes additionally require the logged-in user's role to be `admin`.

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new customer account |
| POST | `/auth/login` | Public | Log in, returns JWT + user |
| GET | `/auth/me` | Private | Get the current logged-in user |

### Food
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/foods` | Public | List foods. Query: `search`, `category`, `sort` (`price_asc`\|`price_desc`\|`rating_desc`), `availableOnly` |
| GET | `/foods/:id` | Public | Get a single food item |
| POST | `/foods` | Admin | Create a food item |
| PUT | `/foods/:id` | Admin | Update a food item |
| DELETE | `/foods/:id` | Admin | Delete a food item |

### Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/orders` | Private | Place a new order from cart items |
| GET | `/orders/my-orders` | Private | Get the logged-in user's orders |
| GET | `/orders` | Admin | Get all orders (any customer) |
| GET | `/orders/:id` | Private | Get one order (owner or admin only) |
| PUT | `/orders/:id/status` | Admin | Update order status |

### Dashboard
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard/stats` | Admin | Total foods, orders, pending/completed counts, revenue |

---

## 7. Database Models (summary)

**User:** `name, email (unique), password (hashed), phone, role (customer/admin), createdAt`

**Food:** `name, description, category, price, image, ingredients[], rating, available, createdAt`

**Order:** `user (ref), items[{food, name, image, price, quantity}], deliveryAddress{fullName, mobile, email, address, city, pincode}, paymentMethod, subtotal, deliveryFee, tax, discount, totalAmount, status, createdAt`

Order status values: `Pending → Confirmed → Preparing → Out for Delivery → Delivered`, or `Cancelled`.

---

## 8. Notes on Pricing & Totals

- Delivery fee: flat ₹40 whenever the cart is non-empty.
- Tax: 5% of subtotal.
- All prices used to calculate an order total are re-fetched from the database on the backend (not trusted from the client), so totals can't be tampered with from the browser.

---

## 9. Testing Checklist

This project was built and verified as follows before delivery:
- All backend JS files pass `node --check` (syntax valid) and `npm install` completes cleanly.
- The Express server was started and its `/api/health` endpoint verified to return `200 OK` with valid JSON, confirming the app, middleware, and routing all wire up correctly.
- The frontend was installed and built successfully with `npm run build` (Vite), confirming there are no import errors, JSX errors, or broken references across all pages/components.

**Important:** This sandbox environment does not have network access to a real MongoDB server, so the full request→database→response flow (register → login → browse → cart → checkout → place order, and the matching admin flow) could not be executed live here. Please run through the checklist below yourself after starting both servers with a real MongoDB connection:

- [ ] Register → Login → Browse Food → Add to Cart → Update Cart → Checkout → Place Order → View Order
- [ ] Admin Login → Add Food → View Food → Edit Food → Delete Food → View Orders → Update Order Status → confirm the customer sees the updated status on My Orders

If you hit any errors during this run-through, they're most likely environment-specific (Mongo URI, port conflicts, CORS origin mismatch) — check your `.env` values first.

---

## 10. Troubleshooting

- **"MongoDB connection error"** — check `MONGO_URI` in `backend/.env`; make sure `mongod` is running locally or your Atlas IP allowlist includes your current IP.
- **CORS errors in the browser console** — make sure `CLIENT_URL` in `backend/.env` matches the URL the frontend is actually running on (default `http://localhost:5173`).
- **"Not authorized" on admin pages** — make sure you're logged in with the admin account, and that the JWT token hasn't expired (default 7 days).
- **Empty menu on first run** — run `npm run seed` inside `backend/` to populate sample food items.
