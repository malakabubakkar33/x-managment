# X Management — Smart Pharmacy Management & ERP Platform (Phase 1)

> **"Smart Pharmacy Management. Simplified Business."**

X Management is a modern cloud-based pharmacy management and enterprise resource planning (ERP) platform engineered for retail, community, and hospital pharmacies.

This repository contains **Phase 1: The Complete Public Website & Frontend Architecture**.

---

## 🌟 Features Implemented in Phase 1

- **Healthcare SaaS Design System**: Professional navy blue and medical emerald aesthetics built with Tailwind CSS.
- **Hero & Interactive ERP Preview**: Live preview showing cashier shift status, daily revenue KPIs, low-stock/near-expiry alerts, prescription counter dispensing table, and sales breakdown chart.
- **Trust & Value Propositions**: Key operational pillars focused on clinical integrity, inventory visibility, and billing speed.
- **12 Comprehensive Module Feature Cards**:
  1. Pharmacy POS and Billing
  2. Medicine Inventory
  3. Batch and Expiry Tracking (FEFO)
  4. Purchase Management
  5. Supplier Management
  6. Customer Management
  7. Customer and Supplier Khata
  8. Expenses Management
  9. Sales and Profit Reports
  10. Employee and Role Management (RBAC)
  11. Multi-Shop SaaS Administration
  12. Subscription Management
- **Interactive System Previews**: Multi-tab showcase of the upcoming Overview Dashboard, POS Billing Counter, FEFO Medicine Catalog, and Sales Reports.
- **Transparent Pricing Tiers**: Basic, Standard, and Premium subscription plans with early-access pilot request integration.
- **Validated Contact Form**: Full schema validation with React Hook Form and Zod with accessible error states and demo submission feedback.
- **Placeholder Routes**: `/login` (explaining planned role-based authentication), `/get-started` (tier onboarding preview), `/privacy` (draft review policy), and `/terms` (draft review terms).
- **Responsive & Accessible**: Tested across desktop, laptop, tablet, and mobile (360px–1440px) with semantic HTML and keyboard focus states.

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

- Node.js (v18+ or v20+)
- npm (v9+)

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

### Available Scripts

- `npm run dev`: Starts the Vite development server with HMR.
- `npm run build`: Runs TypeScript verification and builds optimized production assets into `dist/`.
- `npm run preview`: Previews the production build locally.
