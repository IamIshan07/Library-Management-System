import { Router } from "express";
import { readData, writeData, generateId } from "../utils/db.js";

const router = Router();
const FILE = "issues.json";
const BOOKS_FILE = "books.json";
const MEMBERS_FILE = "members.json";
const LOAN_DAYS = 14;

// GET all issue records (with book + member info attached)
router.get("/", (req, res) => {
  const issues = readData(FILE);
  const books = readData(BOOKS_FILE);
  const members = readData(MEMBERS_FILE);

  const enriched = issues.map((issue) => ({
    ...issue,
    book: books.find((b) => b.id === issue.bookId) || null,
    member: members.find((m) => m.id === issue.memberId) || null,
  }));

  res.json(enriched);
});

// POST issue a book to a member
router.post("/issue", (req, res) => {
  const { bookId, memberId } = req.body;
  if (!bookId || !memberId) {
    return res.status(400).json({ error: "bookId and memberId are required" });
  }

  const books = readData(BOOKS_FILE);
  const members = readData(MEMBERS_FILE);
  const issues = readData(FILE);

  const book = books.find((b) => b.id === bookId);
  const member = members.find((m) => m.id === memberId);

  if (!book) return res.status(404).json({ error: "Book not found" });
  if (!member) return res.status(404).json({ error: "Member not found" });
  if (book.availableCopies < 1) {
    return res.status(400).json({ error: "No available copies of this book" });
  }

  const issueDate = new Date();
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + LOAN_DAYS);

  const newIssue = {
    id: generateId("i"),
    bookId,
    memberId,
    issueDate: issueDate.toISOString().slice(0, 10),
    dueDate: dueDate.toISOString().slice(0, 10),
    returnDate: null,
    status: "issued",
  };

  issues.push(newIssue);
  book.availableCopies -= 1;

  writeData(FILE, issues);
  writeData(BOOKS_FILE, books);

  res.status(201).json(newIssue);
});

// POST return a book
router.post("/return/:issueId", (req, res) => {
  const issues = readData(FILE);
  const books = readData(BOOKS_FILE);

  const issue = issues.find((i) => i.id === req.params.issueId);
  if (!issue) return res.status(404).json({ error: "Issue record not found" });
  if (issue.status === "returned") {
    return res.status(400).json({ error: "Book already returned" });
  }

  issue.status = "returned";
  issue.returnDate = new Date().toISOString().slice(0, 10);

  const book = books.find((b) => b.id === issue.bookId);
  if (book) book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);

  writeData(FILE, issues);
  writeData(BOOKS_FILE, books);

  res.json(issue);
});

export default router;
