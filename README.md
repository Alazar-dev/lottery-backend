# Lottery Backend

REST API for a weekly lottery-style product: users sign in with email OTP, purchase tickets via [Chapa](https://chapa.co/), and draws run on a schedule. Admins can view aggregated stats, users, transactions, and draw history.

**Stack:** Node.js, Express 5, TypeScript, MongoDB (Mongoose), JWT auth, Nodemailer (OTP delivery), node-cron (weekly draw).

**Base path:** routes are mounted under `/api/...` (for example `/api/auth/requestOtp`).

---

## Features (high level)

- **Authentication:** `POST /api/auth/requestOtp` and `POST /api/auth/verifyOtp` (rate limiting on OTP requests).
- **Tickets:** Create and list tickets for the authenticated user (`/api/ticket`).
- **Payments:** Chapa initiate + verify callbacks (`/api/payment`).
- **Draws:** Weekly cron job (Sundays 23:59 server time); manual admin trigger at `POST /api/draw/trigger`.
- **Admin:** Dashboard stats, users, transactions, draw history (`/api/admin/*`) — requires a user with role `ADMIN`.
- **Smoke tests:** `GET /api/test/user` and `GET /api/test/admin` (JWT + admin checks).

---

## Prerequisites

- **Node.js** — a current LTS version (18+ recommended).
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas).
- **Email (SMTP)** — for sending OTP codes (e.g. Gmail app password or another SMTP provider).
- **Chapa** — secret key from the Chapa dashboard if you exercise payment flows locally.

---

## Run on your local machine

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd lottery-backend
npm install
```

### 2. Configure environment variables

Create a file named `.env` in the project root (same folder as `package.json`). Git ignores this file; never commit secrets.

See **[Environment variables](#environment-variables)** below for every variable and what it is used for.

### 3. Start MongoDB

- **Local:** ensure `mongod` is running and your `MONGO_URI` points at it (e.g. `mongodb://127.0.0.1:27017/lottery`).
- **Atlas:** create a cluster, a database user, allow your IP (or `0.0.0.0/0` for dev only), and paste the connection string into `MONGO_URI`.

### 4. Promote an admin user (optional)

Admin routes use middleware that checks `role === "ADMIN"` on the JWT payload (see `src/middleware/adminMiddleware.ts`). After a user signs in once (verify OTP), set their role in MongoDB so it matches that check. The Mongoose `User` model uses collection **`users`** by default:

```js
db.users.updateOne(
  { email: "you@example.com" },
  { $set: { role: "ADMIN" } }
)
```

If inserts are rejected by validation, align the stored value with your `User` schema enum or update the schema to include `ADMIN`.

### 5. Run the development server

```bash
npm run dev
```

The app loads `.env` via `dotenv` and listens on the port set by `PORT`. You should see MongoDB connection logs and `Listening on <PORT>`.

### 6. Verify it responds

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:<PORT>/api/auth/requestOtp \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com"}'
```

You should get `200` if the route and database are OK and email sends successfully (configure `EMAIL_ID` / `EMAIL_PASS`). If email is misconfigured, you may still see a `500`—check server logs.

---

## Environment variables

Create `.env` in the repository root. The server calls `dotenv.config()` at startup (`src/server.ts`).

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGO_URI` | **Yes** | MongoDB connection string used by Mongoose. |
| `PORT` | **Yes** | HTTP port for Express (e.g. `3000`). |
| `JWT_SECRET` | **Yes** | Secret used to sign and verify JWTs (`authController`, `authMiddleware`). |
| `EMAIL_ID` | **Yes** for OTP email | SMTP username / “from” address for Nodemailer (`sendEmail.ts`). |
| `EMAIL_PASS` | **Yes** for OTP email | SMTP password or app-specific password (`sendEmail.ts`). |
| `CHAPA_SECRET_KEY` | **Yes** for payments | Bearer token for Chapa API calls (`paymentController`). |

### Example `.env` (do not commit)

```env
# Server
PORT=3000

# Database
MONGO_URI=mongodb://127.0.0.1:27017/lottery

# Auth
JWT_SECRET=change-this-to-a-long-random-string

# Email (OTP) — values depend on your SMTP provider
EMAIL_ID=your-smtp-user@example.com
EMAIL_PASS=your-smtp-password-or-app-password

# Chapa — from https://developer.chapa.co/ / dashboard
CHAPA_SECRET_KEY=CHASECK_TEST-your-secret-key
```

Use test keys for Chapa while developing. Keep production secrets in a secure secret manager or hosting provider env configuration, not in source control.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run `src/server.ts` with `ts-node-dev` (reload on changes). |

---

## Weekly draw schedule

The cron expression `59 23 * * 0` runs the weekly draw job at **23:59 every Sunday** in the server’s local timezone. Adjust `src/jobs/drawJob.ts` if you need a different schedule or timezone-aware behavior.
