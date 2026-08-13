import { Router } from "express";
import { readData, writeData, generateId } from "../utils/db.js";

const router = Router();
const FILE = "books.json";

// GET all books
router.get("/", (req, res) => {
  const books = readData(FILE);
  res.json(books);
});

// GET single book
router.get("/:id", (req, res) => {
  const books = readData(FILE);
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// POST create book
router.post("/", (req, res) => {
  const { title, author, isbn, genre, totalCopies } = req.body;

  if (!title || !author || !totalCopies) {
    return res
      .status(400)
      .json({ error: "title, author and totalCopies are required" });
  }

  const books = readData(FILE);
  const newBook = {
    id: generateId("b"),
    title,
    author,
    isbn: isbn || "",
    genre: genre || "General",
    totalCopies: Number(totalCopies),
    availableCopies: Number(totalCopies),
  };

  books.push(newBook);
  writeData(FILE, books);
  res.status(201).json(newBook);
});

// PUT update book
router.put("/:id", (req, res) => {
  const books = readData(FILE);
  const index = books.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const existing = books[index];
  const { title, author, isbn, genre, totalCopies } = req.body;

  // If totalCopies changes, adjust availableCopies proportionally
  let availableCopies = existing.availableCopies;
  if (totalCopies !== undefined) {
    const diff = Number(totalCopies) - existing.totalCopies;
    availableCopies = Math.max(0, existing.availableCopies + diff);
  }

  books[index] = {
    ...existing,
    title: title ?? existing.title,
    author: author ?? existing.author,
    isbn: isbn ?? existing.isbn,
    genre: genre ?? existing.genre,
    totalCopies: totalCopies !== undefined ? Number(totalCopies) : existing.totalCopies,
    availableCopies,
  };

  writeData(FILE, books);
  res.json(books[index]);
});

// DELETE book
router.delete("/:id", (req, res) => {
  const books = readData(FILE);
  const filtered = books.filter((b) => b.id !== req.params.id);
  if (filtered.length === books.length)
    return res.status(404).json({ error: "Book not found" });

  writeData(FILE, filtered);
  res.json({ message: "Book deleted" });
});

export default router;
