# 🏪 Lokennath Printing & Stationery — Full Stack Web Application

A complete, production-ready web application for a local stationery + toy shop that also provides digital/online services.

**Stack:** React + Vite · Tailwind CSS · Node.js + Express · MongoDB · JWT Auth · Cloudinary

---

## 📁 Project Structure

```
loknath-solution/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   ├── cloudinary.js       # Image upload config
│   │   └── seed.js             # Database seeder
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── serviceController.js
│   │   ├── serviceRequestController.js
│   │   ├── contactController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT middleware
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── ServiceRequest.js
│   │   └── ContactMessage.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── services.js
│   │   ├── serviceRequests.js
│   │   ├── contact.js
│   │   └── admin.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layouts/
    │   │   │   ├── PublicLayout.jsx
    │   │   │   └── AdminLayout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── CartDrawer.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── ServiceCard.jsx
    │   │   └── Skeletons.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Products.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Services.jsx
    │   │   ├── ServiceDetail.jsx
    │   │   ├── Contact.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── OrderSuccess.jsx
    │   │   └── admin/
    │   │       ├── AdminLogin.jsx
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminProducts.jsx
    │   │       ├── AdminOrders.jsx
    │   │       ├── AdminServiceRequests.jsx
    │   │       └── AdminMessages.jsx
    │   ├── services/
    │   │   └── api.js            # All API calls (Axios)
    │   ├── store.js              # Zustand: cart, auth, theme
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env.example
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- MongoDB Atlas account (free tier is fine)
- Cloudinary account (free tier)

---

### Step 1 — Clone and install

```bash
# Clone the repository
git clone https://github.com/yourusername/loknath-solution.git
cd loknath-solution

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 2 — Backend Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your real values:

```env
PORT=5000
NODE_ENV=development

# Get this from MongoDB Atlas → Connect → Connect your application
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/loknath_solution?retryWrites=true&w=majority

# Generate a strong secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_very_long_random_secret_here
JWT_EXPIRE=7d

# From cloudinary.com → Dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret_here

# Admin credentials for first login
ADMIN_NAME=Loknath Admin
ADMIN_EMAIL=admin@loknathasolution.com
ADMIN_PASSWORD=Admin@12345

# For CORS
CLIENT_URL=http://localhost:5173
```

---

### Step 3 — Frontend Environment Variables

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=9883486739
VITE_SHOP_NAME=Lokennath Printing & Stationery

# Get embed URL from Google Maps → Share → Embed a map → Copy the src URL
VITE_GOOGLE_MAPS_EMBED=https://www.google.com/maps/embed?pb=...
```

---

### Step 4 — Seed the Database

```bash
cd backend
npm run seed
```

This will create:
- 1 admin user
- 14 sample products (8 stationery + 6 toys)

Output:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Admin user created
✅ 14 products seeded
🎉 Database seeded successfully!
📧 Admin Email: admin@loknathasolution.com
🔑 Admin Password: Admin@12345
```

---

### Step 5 — Run the Application

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App running on http://localhost:5173
```

---

### 🌐 Access the Application

| Page | URL |
|------|-----|
| Home | http://localhost:5173 |
| Products | http://localhost:5173/products |
| Services | http://localhost:5173/services |
| Contact | http://localhost:5173/contact |
| Admin Login | http://localhost:5173/admin/login |
| Admin Dashboard | http://localhost:5173/admin/dashboard |

**Default Admin Credentials:**
- Email: `admin@loknathasolution.com`
- Password: `Admin@12345`

---

## ☁️ Deployment — Step by Step

### 🗄️ Step 1 — MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free account
2. Create a new **Free Cluster** (M0)
3. **Database Access** → Add database user with password
4. **Network Access** → Add IP Address → `0.0.0.0/0` (allow from anywhere)
5. **Connect** → Connect your application → Copy the connection string
6. Replace `<password>` in the string with your actual password
7. Add the database name: `loknath_solution`

Example: `mongodb+srv://admin:mypassword@cluster0.abc12.mongodb.net/loknath_solution?retryWrites=true&w=majority`

---

### 🖼️ Step 2 — Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com) → Create free account
2. From the **Dashboard**, copy:
   - Cloud Name
   - API Key
   - API Secret
3. These go into your backend `.env`

---

### 🔧 Step 3 — Deploy Backend on Render

1. Go to [render.com](https://render.com) → Create free account
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `loknath-solution-api`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add **Environment Variables** (click "Add Environment Variable" for each):
   ```
   PORT                    = 5000
   NODE_ENV                = production
   MONGO_URI               = mongodb+srv://...
   JWT_SECRET              = your_secret_here
   JWT_EXPIRE              = 7d
   CLOUDINARY_CLOUD_NAME   = your_cloud_name
   CLOUDINARY_API_KEY      = your_api_key
   CLOUDINARY_API_SECRET   = your_api_secret
   CLIENT_URL              = https://your-frontend.vercel.app
   ADMIN_NAME              = Loknath Admin
   ADMIN_EMAIL             = admin@loknathasolution.com
   ADMIN_PASSWORD          = YourSecurePassword@123
   ```
6. Click **Create Web Service**
7. Wait for deployment (~3 minutes)
8. Note your backend URL: `https://loknath-solution-api.onrender.com`

**Important:** After deployment, seed the database by hitting:
`https://your-api.onrender.com/` — it should return `{"success":true,"message":"Lokennath Printing & Stationery API is running 🚀"}`

To seed, add this one-time script call or use Render's Shell tab:
```bash
node config/seed.js
```

---

### 🌐 Step 4 — Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → Create free account
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add **Environment Variables**:
   ```
   VITE_API_URL            = https://loknath-solution-api.onrender.com/api
   VITE_WHATSAPP_NUMBER    = 9883486739
   VITE_SHOP_NAME          = Lokennath Printing & Stationery
   VITE_GOOGLE_MAPS_EMBED  = https://www.google.com/maps/embed?pb=...
   ```
6. Click **Deploy**
7. Your app will be live at: `https://loknath-solution.vercel.app`

---

### 🔗 Step 5 — Update CORS

Go back to Render → Your Backend Service → Environment → Update:
```
CLIENT_URL = https://loknath-solution.vercel.app
```
Click **Save Changes** → Service will redeploy automatically.

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Admin login |
| GET | `/api/auth/me` | Private | Get current user |
| PUT | `/api/auth/change-password` | Private | Change password |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | Get all products |
| GET | `/api/products/:id` | Public | Get single product |
| GET | `/api/products/categories` | Public | Get categories with counts |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

**GET /api/products Query Params:**
```
category=stationery|toys
search=keyword
featured=true
page=1
limit=12
sort=-createdAt|price|-price|-soldCount
```

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | Public | Place order |
| GET | `/api/orders` | Admin | Get all orders |
| GET | `/api/orders/:id` | Admin | Get single order |
| PUT | `/api/orders/:id/status` | Admin | Update order status |

**POST /api/orders Body:**
```json
{
  "customerName": "Ram Kumar",
  "customerPhone": "9876543210",
  "customerEmail": "ram@email.com",
  "customerAddress": "123 Main St, Kolkata",
  "items": [
    { "productId": "...", "name": "Notebook", "quantity": 2 }
  ],
  "notes": "Please pack carefully"
}
```

### Services
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/services` | Public | Get all services |
| GET | `/api/services/:id` | Public | Get service by id |

**Service IDs:** `tax-payment`, `money-transfer`, `government-schemes`, `aadhaar-services`, `voter-id`, `ration-card`, `form-filling`

### Service Requests
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/service-requests` | Public | Submit request |
| GET | `/api/service-requests` | Admin | Get all requests |
| GET | `/api/service-requests/:id` | Admin | Get single request |
| PUT | `/api/service-requests/:id` | Admin | Update request |

### Contact
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contact` | Public | Submit message |
| GET | `/api/contact` | Admin | Get all messages |
| PUT | `/api/contact/:id/read` | Admin | Mark as read |
| DELETE | `/api/contact/:id` | Admin | Delete message |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | Admin | Dashboard analytics |

---

## 🔐 Security Features

- **JWT Authentication** — Stateless auth with 7-day expiry
- **bcryptjs** — Passwords hashed with salt rounds 12
- **Helmet.js** — Secure HTTP headers
- **CORS** — Restricted to frontend origin
- **Rate Limiting** — 100 requests per 15 minutes per IP
- **Input Validation** — Mongoose schema validation on all models
- **Soft Deletes** — Products are deactivated, not hard-deleted

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Font | Sora (Display) |
| Body Font | DM Sans |
| Mono Font | JetBrains Mono |
| Brand Color | `#0a925d` (Green) |
| Ocean Color | `#2563eb` (Blue) |
| Dark Mode | Class-based (`dark:`) |

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| State Management | Zustand (persist) |
| HTTP Client | Axios |
| Charts | Recharts |
| Icons | React Icons (Material) |
| SEO | React Helmet Async |
| Notifications | React Hot Toast |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Image Upload | Cloudinary + Multer |
| Security | Helmet + express-rate-limit |

---

## 🛠️ Common Issues & Solutions

**Issue:** `CORS error` on frontend
**Fix:** Make sure `CLIENT_URL` in backend `.env` exactly matches your frontend URL (no trailing slash)

**Issue:** Images not uploading
**Fix:** Verify all 3 Cloudinary environment variables are set correctly

**Issue:** Login fails after deployment
**Fix:** Run the seed script once on production to create the admin user

**Issue:** MongoDB connection timeout
**Fix:** In Atlas, ensure `0.0.0.0/0` is added to Network Access. Render uses dynamic IPs.

**Issue:** Products page empty
**Fix:** Run `npm run seed` in the backend directory to populate sample data

---

## 📱 Features Checklist

- [x] Responsive mobile-first design
- [x] Dark mode toggle
- [x] Product listing with search + filter + pagination
- [x] Product detail page
- [x] Cart with quantity management (persisted in localStorage)
- [x] Checkout with order placement
- [x] Service listing + detail pages
- [x] Service request form
- [x] Contact form
- [x] WhatsApp integration
- [x] Google Maps embed
- [x] Admin login (JWT)
- [x] Admin dashboard with analytics + charts
- [x] Product CRUD with image upload (Cloudinary)
- [x] Order management + status updates
- [x] Service request management
- [x] Contact message inbox
- [x] Loading skeletons
- [x] Toast notifications
- [x] SEO meta tags

---

## 📞 Support

For any issues, contact: **info@loknathasolution.com**

© 2024 Lokennath Printing & Stationery. All rights reserved.
# lokenath-solution
