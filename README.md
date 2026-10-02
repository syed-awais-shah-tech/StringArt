# 🧵 StringArt — Custom Handcrafted String Art Studio & Business MVP

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.18-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Shopify--Style-Admin-008060?logo=shopify&logoColor=white" alt="Admin" />
  <img src="https://img.shields.io/badge/License-GPL--3.0-blue.svg" alt="License" />
</p>

<p align="center">
  <b>A complete, production-ready artisanal e-commerce web application for custom string art.</b><br>
  Customers upload photos and receive instant thread-art simulations with Cash on Delivery (COD) ordering.<br>
  Workshop managers manage production, download physical loom nail sequence instructions, and fulfill orders via a protected, Shopify-style dashboard.
</p>

---

## 🌟 What the Project Does

StringArt bridges digital photo simulation with physical artisanal manufacturing:

1. **Instant Web Simulation Engine**: Converts raster portraits (people, pets, memories) into thousands of continuous, unbroken tensioned thread segments mapped across a circular perimeter of nails using greedy residual error minimization and Bresenham line calculations.
2. **Frictionless Customer Storefront**: Inspired by artisanal luxury studios (e.g. *stringboard.co.uk*), customers get a clean, zero-friction path from photo upload to placing a Cash on Delivery order with no account creation or passwords required.
3. **Protected Admin & Workshop Management**: A Shopify Polaris-inspired admin portal that displays incoming orders, customer delivery details, side-by-side artwork verification, status workflows, and downloadable `.txt` nail sequence files used by physical workshops to weave the artboard.

---

## 🛒 Customer Flow

```text
Homepage → Upload Photo → Instant Generation → Interactive Preview → Place Order → Order Form → Cash on Delivery → Order Confirmed
```

1. **Homepage**: Clean, responsive brand showcase with interactive before/after transformation sliders, offerings, how-it-works guide, and sample portraits.
2. **Upload**: Drag-and-drop or file selector for JPG, PNG, or WEBP photos. Sample portraits (Golden Retriever, Studio Portrait) available for 1-click testing.
3. **Generate**: Transparent progress indicator while the server engine balances light/shadow depths across 200 perimeter nails.
4. **Preview**: Side-by-side comparison of the uploaded portrait and the simulated woven string art on a Baltic birch artboard.
5. **Place Order**: One-click transition to the checkout form.
6. **Order Form (Cash on Delivery)**: Simple, essential fields:
   - Full Name *(Required)*
   - Phone Number *(Required)*
   - Delivery Address *(Required)*
   - City *(Required)*
   - Email Address *(Optional)*
   - Payment Method: **Cash on Delivery (COD)** pre-selected with zero advance payment risk.
7. **Order Success**: Unique sequential order confirmation tag (e.g., `SA-1001`), summary of order details, and instructions for delivery courier handover.

---

## 🛡️ Admin Flow

```text
Admin Login → Dashboard Overview → Orders List → Order Details & Loom Files → Update Status → Logout
```

1. **Admin Authentication** (`/admin/login`):
   - Secure email & password authentication.
   - Protected session tokens (`sat_...`).
   - All `/admin/*` routes strictly guarded; unauthenticated access automatically redirects to `/admin/login`.
   - Zero customer authentication or login overhead.
2. **Dashboard Overview** (`/admin`):
   - Real-time KPI metric cards:
     - **Total Orders**
     - **New Orders** (awaiting workshop confirmation)
     - **Orders in Production** (active weaving)
     - **Shipped Orders** (dispatched with courier)
   - Recent orders preview table with quick-inspect action links.
3. **Orders Directory** (`/admin/orders`):
   - Real-time search by order number, customer name, phone, or city.
   - Filter tabs: `All`, `New`, `Confirmed`, `In Production`, `Shipped`, `Delivered`, `Cancelled`.
   - Comprehensive orders table with timestamps, customer names, totals, and colored status badges.
4. **Order Details & Workshop Fulfillment** (`/admin/orders/:id`):
   - Customer information & direct phone contact links.
   - Shipping address and Cash on Delivery collection reminder.
   - Side-by-side artwork inspection (original upload vs. generated string art preview).
   - **Sequence File Export**: Instant download of the exact nail sequence file (`SA-XXXX-sequence.txt`) for the physical workshop loom.
   - Collapsible inline sequence preview showing step-by-step pin paths.
   - **Status Management**: Instantly update fulfillment status (`new`, `confirmed`, `in_production`, `shipped`, `delivered`, `cancelled`) and payment status (`pending`, `paid`, `refunded`, `cancelled`).
5. **Store Settings** (`/admin/settings`):
   - Storefront configuration, workshop loom specifications, and COD delivery parameters.

---

## 🚀 How to Run the Application

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- `npm` v9 or higher

### Installation

Clone the repository and install dependencies for both the frontend client and backend server:

```bash
git clone https://github.com/syed-awais-shah-tech/StringArt.git
cd StringArt

# Install server dependencies
npm install --prefix server

# Install client dependencies
npm install --prefix client
```

---

### Running Frontend & Backend Concurrently

You can run both the server and client with a single command from the project root:

```bash
npm run dev
```

- **Customer Storefront**: [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

### Running Individually in Separate Terminals

#### 1. Backend Server
```bash
cd server
npm start
```
*Server starts on `http://localhost:3001`.*

#### 2. Frontend Client
```bash
cd client
npm run dev
```
*Vite client starts on `http://localhost:5173` with automated proxies configured for `/api` and `/data`.*

---

### Building for Standalone Production

To build the client into optimized static assets and serve directly from Express:

```bash
# 1. Build frontend
npm run build --prefix client

# 2. Start production server
node server/index.js
```
The server will automatically serve the built client application and all API routes from `http://localhost:3001`.

---

## 🔐 Required Environment Variables

All variables have secure and sensible defaults for instant local development. You can configure them via environment variables or a `.env` file in the `server/` directory:

| Variable | Description | Default Value | Required in Production |
| :--- | :--- | :--- | :---: |
| `PORT` | Port for the Express backend server | `3001` | Optional |
| `ADMIN_EMAIL` | Admin login email for dashboard access | `admin@stringart.io` | **Recommended** |
| `ADMIN_PASSWORD` | Admin login password for dashboard access | `admin123` | **Recommended** |
| `NODE_ENV` | Application environment (`development` / `production`) | `development` | Optional |

### Default Admin Credentials (Out of the Box)
- **Email**: `admin@stringart.io`
- **Password**: `admin123`

---

## 📁 Repository Layout

```text
StringArt/
├── client/                      # React 18 + Vite Frontend
│   ├── src/
│   │   ├── admin/               # Shopify-style admin dashboard
│   │   │   ├── AdminApp.jsx     # Admin routing & gatekeeper
│   │   │   ├── AdminContext.jsx # Protected session & auth state
│   │   │   ├── AdminDashboard.jsx # KPI metrics & recent orders
│   │   │   ├── AdminLayout.jsx  # Sidebar & top navigation shell
│   │   │   ├── AdminLogin.jsx   # Admin authentication form
│   │   │   ├── AdminOrderDetail.jsx # Artwork, sequence & status updater
│   │   │   ├── AdminOrders.jsx  # Search, filter tabs & orders table
│   │   │   ├── AdminSettings.jsx# Store configuration placeholder
│   │   │   └── admin.css        # Clean, Shopify Polaris inspired styling
│   │   ├── components/          # Customer storefront components
│   │   │   ├── CanvasPreview.jsx# String art HTML5 canvas renderer
│   │   │   ├── CompareSlider.jsx# Interactive before/after transformation slider
│   │   │   ├── HeroGenerator.jsx# Main generator & ordering container
│   │   │   ├── OrderForm.jsx    # Cash on Delivery checkout form
│   │   │   ├── OrderSuccess.jsx # Order confirmation card
│   │   │   ├── Navbar.jsx       # Header & navigation
│   │   │   ├── HowItWorks.jsx   # 4-step craft guide
│   │   │   ├── Gallery.jsx      # Customer showcase
│   │   │   ├── PricingPreview.jsx # Finished art, kits & pricing
│   │   │   ├── FAQ.jsx          # Frequently asked questions
│   │   │   └── Footer.jsx       # Brand footer & admin portal link
│   │   ├── hooks/
│   │   │   └── useStringArt.js  # Generator state & API communication
│   │   ├── App.jsx              # Root router (customer vs. admin)
│   │   ├── index.css            # Artisanal luxury design system
│   │   └── main.jsx
│   ├── vite.config.js           # Vite dev configuration & API proxies
│   └── package.json
├── server/                      # Express Backend
│   ├── data/                    # JSON order store & uploaded artwork files
│   │   ├── orders.json          # Persisted order database
│   │   └── orders/              # Generated previews, images & sequence files
│   ├── engine/                  # Core String Art Algorithm
│   │   ├── imageProcessor.js    # Sharp image normalization & resizing
│   │   ├── nailGenerator.js     # Perimeter nail trigonometry
│   │   ├── scoreCalculator.js   # Greedy Bresenham residual minimization
│   │   └── sequenceFormatter.js # Nail sequence builder (.txt)
│   ├── routes/
│   │   ├── admin.js             # Protected admin API routes & auth middleware
│   │   ├── generate.js          # Image generation endpoint
│   │   └── orders.js            # Customer COD order submission & storage
│   ├── index.js                 # Express server entry point & static server
│   └── package.json
└── README.md                    # Project documentation
```

---

## 📜 License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
