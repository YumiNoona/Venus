<div align="center">
  <img src="https://venusapp.in/icon.png" alt="Venus Studio Logo" width="120" height="120" style="border-radius: 24px; margin-bottom: 20px;" />
  <h1 align="center">🪐 VENUS STUDIO</h1>
  <p align="center"><strong>The High-Performance Architectural Experience Engine</strong></p>

  <p align="center">
    <a href="https://venusapp.in/" target="_blank">
      <img src="https://img.shields.io/badge/Live_Site-venusapp.in-emerald?style=for-the-badge&logo=vercel" alt="Live Site" />
    </a>
    <img src="https://img.shields.io/badge/Framework-Next.js%2016-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Backend-Supabase-emerald?style=for-the-badge&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/License-MIT-amber?style=for-the-badge" alt="License" />
  </p>

  <p align="center">
    <i>Elevate architectural presentations with immersive, interactive streaming experiences.</i>
  </p>
</div>

---

## 💎 The Premium Engine for Architects

Venus Studio transforms static renders into high-converting, immersive storytelling experiences. Designed for studios that demand excellence, it bridges the gap between visualization and lead generation.

### ✨ Elite Features

- **🌐 Branded Subdomains**: Automatically map projects to official subdomains like `serenity.venusapp.in` with zero-config routing.
- **🛡️ Multi-Factor Gate**: Seamless combination of Identity Verification and security layers (Password / magic-link OTP).
- **📱 Precise Device Intelligence**: Advanced visitor analytics identifying Windows, Mac, iPhone, and Android for granular reporting.
- **📄 Professional Export Tooling**:
  - **PDF Reports**: High-fidelity, server-side PDF generation using Puppeteer for branded architectural portfolios.
  - **Excel-Optimized CSV**: Tab-prefixed phone formatting to prevent data loss or scientific notation in Excel.
- **⚡ Next.js 16 Proxy Layer**: Enterprise-grade routing architecture for subdomain-to-path rewrites and session persistence.
- **🌌 Immersive Theming**: Dynamic theme-aware UI with fluid `framer-motion` transitions and high-resolution media management.
- **🎨 Custom Platform Branding**: Fully integrated platform identity with custom high-res favicons and minimal Studio UI.

---

## 🛠️ The Technology Matrix

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Core Routing & Server-Side Execution |
| **Backend** | Supabase (PostgreSQL) | Real-time Database, Storage & Auth |
| **PDF Engine** | Puppeteer | Server-side High-Fidelity Rendering |
| **Intelligence** | UA-Parser-JS | Granular Device & OS Identification |
| **Styling** | Tailwind CSS + Vanilla CSS | High-Performance Design System |
| **Animations** | Framer Motion | Fluid Interactive Lifecycle Transitions |
| **Security** | SHA-256 / Bcrypt | Data Privacy & Access Control |

---

## 🚀 Deployment & Local Setup

### 1. Environment Configuration
Create a `.env.local` file with your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_PLATFORM_DOMAIN=venusapp.in
```

### 2. Database Synchronization
Apply the schema in `supabase/migration.sql` to your Supabase project. This handles:
- **Slug Versioning**: 301 Redirects for modified project URLs.
- **RLS Policies**: Atomic security for projects, leads, and visitors.
- **Plan Enforcement**: Feature gating for Starter/Studio/Agency tiers.

### 3. Execution
```bash
# Install dependencies
npm install

# Start production build
npm run build && npm start
```

---

## 🏛️ Project Architecture

```text
├── app/                  # Next.js 16 App Router (Studio, Public, API)
├── components/           # UI Engine & Shared Design Components
├── lib/                  # Server Actions, Auth logic, & Billing Config
├── proxy.ts              # Custom platform middleware & subdomain proxy
├── supabase/             # Database migrations & SQL logic
└── public/               # Static assets and high-res iconography
```

---

## 📜 License & Legal

This project is licensed under the **MIT License**.

Copyright (c) 2026 Venus Studio.

> [!NOTE]
> All visitor data is hashed via SHA-256 before storage to ensure complete privacy compliance and enterprise-grade data security.

---

<div align="center">
  <p>Engineered for the future of architectural representation.</p>
  <p><strong>Made By Veil &copy; 2026</strong></p>
</div>
