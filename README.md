# Coding Platform

A LeetCode-style coding practice platform built on the MERN stack, with an in-browser code editor, Judge0-powered code execution, mistake tracking, discussion threads, and detailed progress analytics.

**Live App:** [coding-platform-six-psi.vercel.app](https://coding-platform-six-psi.vercel.app)

---

## Features

**For Users**
- Register/login with JWT-based authentication
- Browse and solve coding problems in an in-browser Monaco code editor
- Run and submit code against test cases via Judge0 (multi-language support)
- Track solved problems and view submission history per problem
- **Mistake Notebook** — log, edit, and resolve notes on mistakes made per problem
- Discussion threads per problem with comments and upvotes
- Personal analytics dashboard:
  - Activity heatmap
  - Overall stats and solve streaks
  - Language usage breakdown
  - Topic-wise progress
  - Achievements
  - Recent activity feed

**For Admins**
- Create, update, and delete problems
- Manage the problem catalog through a dedicated admin panel

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Redux Toolkit, React Router, Monaco Editor, React Hook Form, Zod, Tailwind CSS, DaisyUI, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt |
| Code Execution | Judge0 (CE, batch submissions) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
coding-platform/
├── backend/
│   ├── Controllers/       # Route logic (auth, problems, submissions, analytics, mistakes, comments)
│   ├── models/             # Mongoose schemas (User, Problem, Submission, Mistake, Comment)
│   ├── routes/              # API route definitions
│   ├── middleware/          # User & admin auth guards
│   ├── utilis/              # DB connection, Judge0 integration, validators
│   └── index.js              # App entry point
│
└── frontend/
    └── src/
        ├── pages/            # Main views (Editor, Submissions, Discussion, Profile, Learning Notebook, etc.)
        │   └── admin/        # Admin problem management UI
        ├── store/            # Redux slices and store
        └── utilis/           # Axios client setup
```

---

## API Overview

| Resource | Base Path | Endpoints |
|---|---|---|
| Auth | `/user` | `register`, `login`, `logout`, `admin/register`, `profile`, `check` |
| Problems | `/problem` | `create`, `update/:id`, `delete/:id`, `problembyid/:id`, `getallproblem`, `problemsolvedbyuser`, `submittedproblem/:id`, `allsubmissions` |
| Submissions | `/submission` | `submit/:id`, `run/:id`, `problem/:id` |
| Mistakes | `/mistake` | `/` (list, create), `/:problemId`, `/:id` (update, resolve, delete) |
| Comments | `/comment` | `/:problemId` (create, list), `/:id` (delete), `/:id/upvote` |
| Analytics | `/analytics` | `heatmap`, `stats`, `languages`, `topics`, `achievements`, `mistakes`, `recent` |

Problem-management routes require admin privileges; most other routes require an authenticated user session (JWT cookie).

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB database (local or Atlas)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd coding-platform
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
DB_URL=your_mongodb_connection_string
JWT_KEY=your_jwt_secret
```

Run the backend:
```bash
npm run dev      # nodemon (development)
npm start        # production
```

### 3. Set up the frontend
```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000

# Optional
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`, talking to the API at `http://localhost:5000`.

> **Note:** Vite inlines environment variables at build time — redeploy the frontend after changing `VITE_API_BASE_URL`.

---

## Code Execution

Code submissions and test runs are sent to Judge0's batch submission API (`ce.judge0.com`), with results decoded via base64 and mapped from Judge0 status codes (e.g. Accepted, Wrong Answer, Time Limit Exceeded, Compilation Error, Runtime Error variants) into readable verdicts.

---

## Deployment Notes

- **Backend (Render free tier):** cold starts occur after inactivity; consider a keep-alive ping for demos.
- **Cookies over HTTP locally:** `secure`/`sameSite` cookie flags are environment-gated so authentication cookies work both on `localhost` (HTTP) and in production (HTTPS).
- **Cross-domain cookies:** since the frontend and backend live on different domains (Vercel + Render), ensure CORS `origin` and cookie `SameSite=None; Secure` are correctly configured in production.

---

## Roadmap
- [ ] Additional language support in the code editor
- [ ] Expanded test coverage
- [ ] Contest/timed-challenge mode

---

