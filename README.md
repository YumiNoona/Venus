<div align="center">
  <h1 align="center">🪐 VENUS STUDIO</h1>
  <p align="center"><strong>The High-Performance Architectural Experience Engine</strong></p>

  <p align="center">
    <img src="https://img.shields.io/badge/Framework-Next.js%2015-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Backend-Supabase-emerald?style=for-the-badge&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/Security-Hardenend-blue?style=for-the-badge" alt="Security" />
    <img src="https://img.shields.io/badge/License-MIT-amber?style=for-the-badge" alt="License" />
  </p>

  <p align="center">
    <i>Elevate your architectural presentations with immersive, interactive streaming experiences.</i>
  </p>
</div>

---

## ✨ Premium Features

Venus Studio transforms simple architectural renders into high-converting, interactive storytelling machines.

- **🌌 Immersive Theming**: Real-time Day/Night cycle transitions using `framer-motion` and theme-aware rendering.
- **🛡️ Secure Lead Gating**: Fused Identity & Authentication funnel (Password/OTP) with session-based unlocking.
- **📈 Advanced Analytics**: Real-time visitor tracking with anonymized IP hashing and device fingerprinting.
- **💳 Multi-Tier Subscription**: Built-in feature gating for **Starter, Studio, and Agency** plans.
- **🖼️ Professional Editor**: Auto-slug generation, drag-and-drop cover management, and SaaS-style status chips.
- **📄 High-Fidelity Exports**: Generate professional PDF reports and CSV lead exports with one click.
- **🏢 White-Labeling**: Remove platform branding and connect custom domains (Agency only).

---

## 🛠️ Technical Matrix

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router) | Core Application Logic |
| **Backend** | Supabase (PostgreSQL) | Real-time Database & Auth |
| **Styling** | Tailwind CSS / Vanilla CSS | High-Performance Aesthetics |
| **Animations** | Framer Motion | Fluid UI/UX Transitions |
| **Security** | Bcrypt / SHA-256 | Data Privacy & Hardening |
| **Types** | TypeScript | End-to-end Type Safety |

---

## 🚀 Getting Started

### 1. Environment Configuration
Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Database Synchronization
Apply the schema provided in [migration.sql](file:///f:/AI/Venus/supabase/migration.sql) to your Supabase SQL editor. This handles:
- ENUM definitions for security.
- RLS Policy enforcement.
- Subscription and project tracking.

### 3. Local Development
```bash
# Install dependencies
npm install

# Launch development server
npm run dev
```

Visit `http://localhost:3000` to begin.

---

## 📦 Project Architecture

```text
├── app/                  # Next.js App Router (Studio, Public, API)
├── components/           # UI Library & Experience Components
├── lib/                  # Server Actions, Auth helpers, & Database Config
├── styles/               # Global CSS & Design Tokens
├── supabase/             # Migration scripts & SQL Logic
└── types/                # Auto-generated & Custom TypeScript definitions
```

---

## 🔒 Security Standards

Venus is built with a **Privacy-First** approach:
- **Zero Raw IP Storage**: Every visitor IP is hashed using SHA-256 before storage.
- **Idempotent Tracking**: 60-second window prevents analytics inflation from page reloads.
- **Server-Side Enforcement**: All feature gates and mutations run purely on the server.
- **Password Protection**: Industry-standard `bcrypt` hashing for all project passwords.

---

## 📜 License

This project is licensed under the **MIT License**.

Copyright (c) 2026 Venus Studio.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

<div align="center">
  <p>Built for architects who demand excellence.</p>
  <p><strong> Made By Veil &copy; 2026</strong></p>
</div>
