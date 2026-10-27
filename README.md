# X Management — Smart Pharmacy Management & ERP Platform

> **"Smart Pharmacy Management. Simplified Business."**

X Management is a modern cloud-based pharmacy management and enterprise resource planning (ERP) platform engineered for retail, community, and hospital pharmacies.

This repository contains **Phase 1 (Complete Public Website)** and **Phase 2 (Secure Super Admin Panel)**.

---

## 🌟 Implemented Phases

### Phase 1: Complete Public Website & Frontend Architecture
- **Healthcare SaaS Design System**: Professional navy blue and medical emerald aesthetics built with Tailwind CSS.
- **Hero & Interactive ERP Preview**: Live preview showing cashier shift status, daily revenue KPIs, low-stock/near-expiry alerts, prescription counter dispensing table, and sales breakdown chart.
- **Trust & Value Propositions**: Key operational pillars focused on clinical integrity, inventory visibility, and billing speed.
- **12 Comprehensive Module Feature Cards**: POS & Billing, Medicine Inventory, FEFO Expiry Tracking, Procurement, Khata Ledgers, Role Management, Multi-Shop SaaS Admin, etc.
- **Interactive System Previews**: Multi-tab showcase of Overview Dashboard, POS Billing Counter, FEFO Medicine Catalog, and Sales Reports.
- **Transparent Pricing Tiers**: Basic, Standard, and Premium subscription plans with early-access pilot request integration.
- **Validated Contact Form**: Full schema validation with React Hook Form and Zod with accessible error states and demo submission feedback.
- **Public Routes**: `/`, `/login` (public pharmacy staff portal placeholder), `/get-started`, `/privacy`, `/terms`.

### Phase 2: Secure Super Admin Panel Foundation
- **Super Admin Authentication (`/admin/login`)**:
  - Email and password inputs with show/hide password toggle.
  - Form validation with React Hook Form and Zod schema.
  - Integration boundary with backend configuration status detection (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
  - Safe Development Preview Session launcher for testing UI/UX layouts when the backend is unconfigured.
  - Zero hardcoded passwords; strict server-side role check enforcement (`role: 'super_admin'`).
- **Protected Routing (`/admin/*`)**:
  - `AdminProtectedRoute` guard redirecting unauthenticated users to `/admin/login`.
  - Session inactivity timeout handling and secure session clearing.
- **Super Admin Layout & Design**:
  - Navy blue collapsible sidebar (`#0B1528`), professional blue accents, clean white/gray content surfaces.
  - Top navigation bar with administrator profile, role badge, notification bell, and mobile hamburger drawer.
- **Super Admin Dashboard (`/admin`)**:
  - 4 Core Summary Cards: Total Pharmacies, Active Subscriptions, Expired / Past Due Subscriptions, and Recorded Monthly Revenue (MRR).
  - Subscription status distribution visualizer (Active vs Trial vs Past Due).
  - Recent Pharmacy Tenants table with state license auditing and details drawer.
  - Recent Invoices & Payments table with status badges (Completed, Pending, Failed).
  - Quick action shortcuts for tenant onboarding, pricing plans, and audit logs.
- **Pharmacy Management Navigation Foundations**:
  - `/admin/pharmacies`: Pharmacy tenants directory with search, status filters, and tenant dossiers.
  - `/admin/subscriptions`: Subscription ledgers with billing cycles and MRR breakdowns.
  - `/admin/payments`: Billing transaction audit ledger with export triggers.
  - `/admin/plans`: SaaS subscription tier definitions and feature limit enforcement.
  - `/admin/users`: Platform administrator directory and RBAC security policies.
  - `/admin/settings`: Database environment audit and multi-tenant security policies.

---

## 🛠️ Technology Stack

- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Frontend Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + PostCSS + Autoprefixer
- **Routing**: [React Router 6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Utility**: clsx & tailwind-merge (`cn`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ or v20+ or v24+)
- npm (v9+ or v11+)

### Installation

```bash
# Clone the repository
git clone https://github.com/malakabubakkar33/x-managment.git

# Navigate to the project directory
cd x-managment

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be live at `http://localhost:5173/`.

### Navigation Paths

- Public Website: `http://localhost:5173/`
- Super Admin Login: `http://localhost:5173/admin/login`
- Super Admin Dashboard: `http://localhost:5173/admin`
- Pharmacy Directory: `http://localhost:5173/admin/pharmacies`
- Subscriptions: `http://localhost:5173/admin/subscriptions`
- Payments: `http://localhost:5173/admin/payments`
- Plans: `http://localhost:5173/admin/plans`
- Users & Roles: `http://localhost:5173/admin/users`
- Settings: `http://localhost:5173/admin/settings`

### Environment Configuration (For Future Live Backend)

To connect a live Supabase PostgreSQL backend in Phase 3, create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

When these are omitted, the application automatically operates in transparent **Development Preview Mode** with illustrative data.
