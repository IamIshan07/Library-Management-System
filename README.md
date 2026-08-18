# 📚 Stackroom — Library Management System.

A full-stack library management system built with **React**, **Express**, and **Node.js**, made for an IBM industrial training submission. Deployed and live — no local setup needed to use it.

🔗 **Live App:** [stackroom07.netlify.app](https://stackroom07.netlify.app/issues)
🔗 **Backend API:** [stackroom-library-management-system.onrender.com](https://stackroom-library-management-system.onrender.com)
🔗 **Repository:** [github.com/IamIshan07/Library-Management-System](https://github.com/IamIshan07/Library-Management-System)

> ⏳ **Cold starts:** the backend is on Render's free tier, which spins down after inactivity. The first request after idle time can take 30–60 seconds to wake up — that's expected, not a bug.

## What it does

- **Books** — add, view, and remove titles in the catalog; tracks total vs. available copies
- **Members** — register and remove library members
- **Issue / Return** — issue an available book to a member (auto-sets a 14-day due date), mark books as returned, and see loan history with overdue flags
- **Dashboard** — live stats: total titles, copies available, members, active loans, overdue count.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + React Router, plain CSS, Vite |
| Backend | Node.js + Express, REST API |
| Data storage | JSON files (`backend/data/*.json`) |
| Hosting | Frontend on **Netlify**, backend on **Render** |

Data is stored in flat JSON files rather than a database — simple to run and grade, at the cost of production durability (see the note below).

## Architecture

```
React (Netlify) ──HTTPS──▶ Express API (Render) ──reads/writes──▶ JSON files
```

The frontend never touches the data files directly — every read/write goes through the Express API, which keeps business rules (like copy-count checks) in one place. The frontend's API base URL is set via an environment variable, pointing at the live Render backend.

## Folder structure

```
library-management-system/
├── backend/
│   ├── data/            # JSON "database" files
│   ├── routes/          # books.js, members.js, issues.js
│   ├── utils/db.js      # simple JSON read/write helper
│   ├── server.js        # Express app entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # Dashboard, Books, Members, IssueReturn, Sidebar
    │   ├── api.js        # fetch calls to the backend
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## API reference

Base URL: `https://stackroom-library-management-system.onrender.com`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | List all books |
| POST | `/api/books` | Add a book `{title, author, isbn, genre, totalCopies}` |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Remove a book |
| GET | `/api/members` | List all members |
| POST | `/api/members` | Add a member `{name, email, phone}` |
| DELETE | `/api/members/:id` | Remove a member |
| GET | `/api/issues` | List all loan records (with book & member details) |
| POST | `/api/issues/issue` | Issue a book `{bookId, memberId}` |
| POST | `/api/issues/return/:issueId` | Mark a loan as returned |

## Running it for development

The live app is the primary way to use Stackroom — cloning and running it locally is only needed if you want to modify the code. Requires [Node.js](https://nodejs.org) (v18+).

```bash
# backend
cd backend
npm install
npm start          # http://localhost:5000

# frontend (new terminal)
cd frontend
npm install
npm run dev         # http://localhost:5173
```

Both need to run at the same time in development. In production, the frontend is built as a static site and points at the Render API instead of `localhost:5000`.

## Swapping in a real database (optional, for extra marks)

`utils/db.js` currently just reads/writes JSON files. To demonstrate database skills, swap it for:
- **MongoDB** (via `mongoose`) — good if you've studied NoSQL
- **MySQL** (via `mysql2`) — good if you've studied SQL/relational DBs

The route files (`books.js`, `members.js`, `issues.js`) are written so only the data-access lines would need to change.

> Because the backend persists to JSON files on Render's filesystem, data written in production doesn't survive a redeploy or a free-tier spin-down. Moving to MongoDB/MySQL (e.g. a free Atlas or PlanetScale instance) fixes this.

## Ideas to extend it further

- Login/authentication for librarians vs. members
- Search & filter books by title/author/genre
- Fine calculation for overdue books
- Pagination for large catalogs
- Email/SMS reminders before due date
