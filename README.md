# Stackroom — Library Management System

A full-stack mini project built with **React**, **Express**, and **Node.js**, made for an IBM industrial training submission.

## What it does

- **Books** — add, view, and remove titles in the catalog; tracks total vs. available copies
- **Members** — register and remove library members
- **Issue / Return** — issue an available book to a member (auto-sets a 14-day due date), mark books as returned, and see loan history with overdue flags
- **Dashboard** — live stats: total titles, copies available, members, active loans, overdue count

## Tech stack

- **Frontend:** React 18 + React Router, plain CSS (no framework), Vite as the dev server
- **Backend:** Node.js + Express, REST API
- **Data storage:** JSON files (`backend/data/*.json`) — no database server needed, so it's easy to run anywhere. (See "Swapping in a real database" below if your mentor wants MySQL/MongoDB instead.)

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

## Deploying it live

Want to put this online (e.g. for IBM training submission)? See **[DEPLOYMENT.md](./DEPLOYMENT.md)** — it walks through deploying the backend to Render and the frontend to Netlify or Vercel.

## How to run it locally

You need [Node.js](https://nodejs.org) (v18+) installed.

### 1. Start the backend

```bash
cd backend
npm install
npm start
```

This runs the API at `http://localhost:5000`. Test it's working by visiting `http://localhost:5000/api/health` in a browser.

### 2. Start the frontend (in a new terminal)

```bash
cd frontend
npm install
npm run dev
```

This opens the app at `http://localhost:5173`.

Keep both terminals running at the same time — the frontend calls the backend for all data.

## API reference

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

## Swapping in a real database (optional, for extra marks)

Right now `utils/db.js` just reads/writes JSON files. If you want to demonstrate database skills:
- Replace it with **MongoDB** (via `mongoose`) — good if you've studied NoSQL
- Or **MySQL** (via `mysql2`) — good if you've studied SQL/relational DBs

The route files (`books.js`, `members.js`, `issues.js`) are written so only the data-access lines would need to change — the Express routes and React frontend stay the same.

## Ideas to extend it further

- Login/authentication for librarians vs. members
- Search & filter books by title/author/genre
- Fine calculation for overdue books
- Pagination for large catalogs
- Email/SMS reminders before due date

## Suggested project report sections (for your training documentation)

1. Introduction & objective
2. System requirements (functional/non-functional)
3. Architecture diagram (React frontend ↔ REST API ↔ JSON/DB)
4. ER diagram / data model (Book, Member, Issue)
5. Screenshots of each module
6. Technologies used
7. Testing (sample test cases: issue with no copies left, duplicate member email, etc.)
8. Conclusion & future scope
