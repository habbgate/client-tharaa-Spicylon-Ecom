# 🌶️ Spicylon - Premium Ceylon Spices eCommerce

Spicylon is a full-stack eCommerce application built with Next.js, MongoDB, and Stripe, showcasing premium Sri Lankan spices with location-based language and currency detection.

## 🚀 Features

- **Full-stack Next.js**: App Router, API Routes, and Server-side Rendering.
- **Modern UI**: Tailored with Vanilla CSS/Tailwind for a premium "spicy" aesthetic.
- **Multilingual & Multi-currency**: Automatically detects user location (Germany/Switzerland -> German/EUR, Others -> English/USD).
- **Stripe Payments**: Integrated checkout session for secure payments.
- **Admin Dashboard**: Comprehensive management of products and stock.
- **JWT Auth**: Secure registration and login.

## 🛠️ Setup Instructions

### 1. Prerequisite
- Node.js 18+
- MongoDB instance (local or Atlas)
- Stripe Account (for API keys)

### 2. Environment Variables
Create a `.env.local` file in the root directory (one has been provided as a template):
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_sk
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_pk
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Installation
```bash
npm install
```

### 4. Seed Database
This will add an admin user and 20+ premium spicy products.
```bash
npm run db:seed
```
*   **Admin Email**: `admin@spicylon.com`
*   **Admin Password**: `admin123`

### 5. Start Development
```bash
npm run dev
```

## 📂 Project Structure
- `/src/app`: Page routes and layouts
- `/src/api`: Backend API logic
- `/src/components`: Reusable UI components
- `/src/models`: Mongoose database schemas
- `/src/lib`: Database, Auth, and Seed utilities
- `/messages`: i18n translation files

## 🧪 Testing Location Logic
In `src/middleware.ts`, the IP detection uses `ipapi.co`. For local development, it falls back to a US-based IP. You can manually change the fallback IP in the middleware to test different regions.
