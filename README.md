# PAM-Lite (Privileged Access Management – Lite)

PAM-Lite is a **beginner-friendly, security-focused project** that demonstrates how privileged access can be requested, approved, time-bound, and enforced — without building a complex enterprise PAM system.

This project is built as a **monorepo** using:

* **React + TypeScript** (UI)
* **Node.js + TypeScript** (Control Plane)
* **Go** (Access Gateway / Enforcement)
* **PostgreSQL** (Source of truth)

---

## 🎯 Project Goal

Solve a **micro-problem**:

> Control *who* can access *which application* and *for how long*, with approvals and audit logs — without exposing credentials.

This is **PAM-lite**, not CyberArk.

---

## 🧱 High-Level Architecture

```text
User (Browser)
   ↓
React UI
   ↓
Node.js API (Auth, RBAC, Approval, Sessions)
   ↓
Go Access Gateway (Session Validation + Redirect)
   ↓
Target Application (MongoDB UI / Web App)
```

---

## 📁 Monorepo Folder Structure

```bash
pam-lite/
├── apps/
├── packages/
├── infra/
├── docs/
├── scripts/
├── turbo.json
├── pnpm-workspace.yaml
├── .env.example
└── README.md
```

---

## 📦 apps/ (Deployable Applications)

All **runnable services** live here.

### 1️⃣ `apps/web` — Frontend (React + TypeScript)

User-facing web application for **Admins, Approvers, and Users**.

```bash
apps/web/
├── src/
│   ├── pages/          # Route-level pages (dashboards)
│   ├── components/     # Reusable UI components
│   ├── features/       # Feature-based modules
│   ├── services/       # API calls to Node backend
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript types & enums
│   └── utils/          # Helpers
├── public/
└── package.json
```

**Responsibilities**

* Login & authentication UI
* Access request UI
* Approval UI
* “Open Application” button
* Role-based dashboards

🚫 Does **NOT** connect to databases or applications directly.

---

### 2️⃣ `apps/api` — Backend Control Plane (Node.js + TS)

The **brain of the system**.

```bash
apps/api/
├── src/
│   ├── config/         # Env loading & validation
│   ├── db/             # PostgreSQL connection & migrations
│   ├── modules/        # Feature-based backend logic
│   │   ├── auth/
│   │   ├── users/
│   │   ├── tenants/
│   │   ├── applications/
│   │   ├── access-requests/
│   │   └── sessions/
│   ├── middlewares/    # JWT & RBAC enforcement
│   ├── routes/         # API routes
│   ├── utils/
│   └── server.ts
└── package.json
```

**Responsibilities**

* Authentication (JWT)
* Tenant isolation
* RBAC (Admin / Approver / User)
* Application metadata
* Access request & approval
* Session creation & expiry
* Audit logs

🚫 Does **NOT** proxy traffic or enforce access itself.

---

### 3️⃣ `apps/access-gateway` — Access Gateway (Go)

The **gatekeeper**.

```bash
apps/access-gateway/
├── cmd/
│   └── server/
│       └── main.go     # Entry point
├── internal/
│   ├── config/         # Env configuration
│   ├── server/         # HTTP server
│   ├── middleware/     # Token/session validation
│   ├── proxy/          # Redirect / access logic
│   └── audit/          # Access logging
├── go.mod
└── README.md
```

**Responsibilities**

* Validate short-lived session tokens
* Check session expiry with Node API
* Allow or deny access
* Redirect user to target application
* Log access events

🚫 Does **NOT** manage approvals or users.

---

## 📚 packages/ (Shared Code – Optional)

Shared libraries used across apps.

```bash
packages/
├── types/     # Shared TypeScript enums & interfaces
├── ui/        # Shared UI components (optional)
└── config/    # Shared ESLint / TS configs
```

Used **only if duplication starts** — not mandatory initially.

---

## 🛠 infra/ (Infrastructure)

```bash
infra/
├── docker/
├── postgres/
```

Contains:

* Docker files
* Database setup
* Local dev infra configs

---

## 📄 docs/ (Documentation)

```bash
docs/
├── architecture.md
├── db-schema.md
└── flows/
```

Used to document:

* Architecture decisions
* Database schema
* Request/approval flows

---

## 🧠 How Access Flow Works (Example)

1. User requests access to MongoDB for 30 minutes
2. Approver approves request
3. Node creates a **time-bound session**
4. User clicks **Open Application**
5. Redirect goes to Go Access Gateway
6. Go validates session → redirects to MongoDB UI
7. Session expires → access denied

✅ Credentials are never exposed
✅ Access is time-bound
✅ Fully auditable

---

## 🚀 Why This Architecture

* Beginner-friendly
* Real-world security patterns
* Clear separation of concerns
* Interview-ready explanation
* Easy to extend later

---

## 🧩 Future Enhancements (Optional)

* Redis for session caching
* Reverse proxy mode
* CLI access
* MFA integration

---

## 🏁 Final Note

This project is intentionally **not over-engineered**.

> The goal is to understand **PAM concepts**, **system design**, and **clean architecture** — not to build a full enterprise PAM.

---

If you want, next I can:

* Add **DB schema section**
* Add **API contract examples**
* Add **sequence diagrams**
* Break this into `/docs` files

Just tell me 👍