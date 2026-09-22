# DarkGuard 🛡
### Cyber-Safety Dark Pattern & Hidden Fee Detector
> *"Expose Dark Patterns. Protect Consumers."*

DarkGuard is a modern, professional, cybersecurity-inspired consumer protection web platform that helps users detect, report, and analyze deceptive website design patterns such as **hidden fees (drip pricing), subscription traps, pre-checked add-ons, fake urgency countdowns, confirmshaming, difficult cancellation (roach motels), and bait-and-switch pricing**.

---

## 🚀 Key Features

1. **AI-Assisted Dark Pattern Detector (`/analyze`)**
   - Optical and semantic inspection for website URLs and uploaded checkout screenshots.
   - Computes a Deceptive Risk Score (0–100) across 4 color-coded risk bands:
     - **0–25**: Low Risk (Emerald)
     - **26–50**: Moderate Risk (Cyan)
     - **51–75**: High Risk (Amber)
     - **76–100**: Critical Risk (Red)
   - Generates itemized dark pattern cards detailing detection confidence, visual evidence, design mechanics, and recommended consumer defense tactics.
   - Dual-engine: Powered by Google Gemini Multimodal Vision AI when `GEMINI_API_KEY` is present, backed by a resilient offline cyber-heuristic vision and semantics analyzer.
   - Prominently labeled as an **assistive assessment**, not a definitive legal determination.

2. **Community Reporting Portal (`/report`)**
   - Step-by-step reporting flow with URL validation, category dropdown, detailed description, and screenshot evidence uploader with live preview.
   - Financial breakdown fields (Initial price, final price, undisclosed markup, recurring subscription cost, cancellation friction rating).
   - Generates a unique Report Identification ID upon filing.
   - Supports anonymous reporting while safeguarding internal anti-abuse telemetry.

3. **Public Deceptive Design Registry (`/reports`)**
   - Fully searchable public index filtering by domain, category, risk level, or verification status.
   - Sort by newest submissions, most corroborated/voted, admin verified, or highest risk.
   - Clearly distinguishes report origin via distinct status badges:
     - 🟡 **AI Detected**
     - 🔵 **Community Reported**
     - 🟢 **Admin Verified**

4. **Detailed Threat Dossier (`/reports/:id`)**
   - Full evidence breakdown, fee divergence comparison, and high-resolution screenshot lightbox zoom.
   - Abuse-prevented voting mechanism (`👍 I experienced this` vs `👎 I disagree`) tracking live community corroboration.
   - Moderated community discussion and advice threads.
   - Similar suspicious sites sidebar.

5. **Community Telemetry Dashboard (`/dashboard`)**
   - Live platform activity metrics: Total reports, verified evidence, active contributors, reported domains, total community votes.
   - Interactive visualizations built with **Recharts**:
     - Reports by Deceptive Category (Bar chart)
     - Reporting Trends Over Time (Gradient Area chart)
     - Top Reported Domains (Horizontal Bar chart)
     - Risk Score Severity Distribution (Donut chart)

6. **Contributor Leaderboard (`/leaderboard`)**
   - Ranks top consumer advocates (e.g. CyberHunter, SafeWeb, PrivacyGuard).
   - Reputation points engine awarding points for verified reports (+15 pts), screenshot evidence (+10 pts), admin verification (+25 pts), and corroboration (+3 pts).
   - Contributor badges: *First Report*, *Evidence Expert*, *Community Guardian*, *Verified Contributor*.

7. **Admin Moderation Operations (`/admin`)**
   - Role-protected panel for reviewing evidence queues, verifying findings, rejecting unverified claims, and purging spam.
   - Real-time status workflow: `Pending` → `Under Review` → `Verified` / `Rejected`.

8. **Ethical Principles & Privacy Charter (`/privacy`)**
   - Transparent disclosures regarding data minimization, screenshot storage, and user deletion rights.
   - Strict non-intrusive scanning protocol respecting `robots.txt` and rate limits.
   - Fictional `.test` domains (`shop-example.test`, `travel-checkout.test`, etc.) used for demonstration safety.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18
  - Vite
  - Tailwind CSS (Dark cybersecurity palette: deep navy/black, cyber cyan `#06b6d4`, electric purple `#a855f7`, glassmorphism)
  - Lucide React Icons
  - Recharts
  - Axios (with unified JWT request interceptors)
  - React Router v6

- **Backend**:
  - Node.js & Express.js
  - MongoDB & Mongoose ODM
  - JSON Web Tokens (JWT) & bcryptjs
  - Multer (secure 5MB multipart image storage)
  - Helmet & CORS
  - express-rate-limit (API abuse mitigation)

- **AI & Heuristics**:
  - Multi-tier visual and semantic dark pattern detection engine
  - Google Gemini Vision API support via `GEMINI_API_KEY`

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20+)
- [MongoDB](https://www.mongodb.com/) (running on `mongodb://localhost:27017` or MongoDB Atlas URI)

### 1. Install Dependencies
In the root directory, run:
```bash
npm run install:all
```
*(Or install in root, backend, and frontend separately: `npm install`, `cd backend && npm install`, `cd frontend && npm install`)*

### 2. Environment Configuration
Backend settings are configured in `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/darkguard
JWT_SECRET=darkguard_super_secret_jwt_key_2026_cybersecurity
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Optional: Add your Google Gemini API key for Gemini multimodal vision analysis
GEMINI_API_KEY=
```

### 3. Seed Realistic Demo Data
Populate MongoDB with realistic demo reports, contributors, and SVG screenshots:
```bash
npm run seed
```

### 4. Start the Application
Run both backend and frontend concurrently:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Credentials

To test role-based features immediately, use the pre-seeded accounts:

| Role | Email | Password | Access / Badges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@darkguard.test` | `Admin@12345` | Full Admin Panel (`/admin`), Verify & Reject Reports, Moderate Spam |
| **Top Hunter** | `cyberhunter@darkguard.test` | `User@12345` | 245 pts, *Top Hunter*, *Evidence Expert*, *Verified Contributor* |
| **Contributor**| `safeweb@darkguard.test` | `User@12345` | 198 pts, *Verified Contributor*, *Community Guardian* |

*(The login page includes quick 1-click test fill buttons for both Admin and Hunter profiles!)*

---

## 📡 REST API Summary

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & badges | Private (JWT) |
| `GET` | `/api/reports` | Public report feed (search, filter, sort, paginate) | Public |
| `GET` | `/api/reports/search` | Fast search by domain, ID, or keywords | Public |
| `POST` | `/api/reports` | Submit a new deceptive pattern report | Public / Optional JWT |
| `GET` | `/api/reports/:id` | Fetch full report dossier with user vote status | Public / Optional JWT |
| `POST` | `/api/reports/:id/vote` | Toggle community vote (`experienced`/`disagree`) | Private (JWT) |
| `GET` | `/api/reports/:id/comments`| List comments on a report | Public |
| `POST` | `/api/reports/:id/comments`| Post discussion comment | Private (JWT) |
| `POST` | `/api/analyze` | AI visual & semantic dark pattern scan | Public |
| `GET` | `/api/statistics` | Platform-wide metrics and Recharts telemetry | Public |
| `GET` | `/api/leaderboard` | Top contributor leaderboard | Public |
| `GET` | `/api/admin/reports` | Admin review queue (Pending, Verified, Flagged) | Admin Only |
| `PUT` | `/api/admin/reports/:id/verify` | Verify report and award submitter points | Admin Only |
| `PUT` | `/api/admin/reports/:id/reject` | Reject report | Admin Only |
| `DELETE`| `/api/admin/reports/:id` | Purge spam report | Admin Only |

---

## ⚖️ Ethical & Legal Disclaimer
DarkGuard is designed to empower consumer awareness and promote transparent design ethics. Automated assessments and community observations are assistive indicators and should not be construed as legal accusations or regulatory sanctions. All demonstration reports strictly employ reserved `.test` domain names in accordance with IETF RFC 2606.
#   C y b e r - S a f e t y - D a r k - P a t t e r n - H i d d e n - F e e - D e t e c t o r  
 