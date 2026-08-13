import { Router } from "express";
import { readData, writeData, generateId } from "../utils/db.js";

const router = Router();
const FILE = "members.json";

// GET all members
router.get("/", (req, res) => {
  res.json(readData(FILE));
});

// GET single member
router.get("/:id", (req, res) => {
  const members = readData(FILE);
  const member = members.find((m) => m.id === req.params.id);
  if (!member) return res.status(404).json({ error: "Member not found" });
  res.json(member);
});

// POST create member
router.post("/", (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  const members = readData(FILE);
  const newMember = {
    id: generateId("m"),
    name,
    email,
    phone: phone || "",
    joinDate: new Date().toISOString().slice(0, 10),
  };

  members.push(newMember);
  writeData(FILE, members);
  res.status(201).json(newMember);
});

// PUT update member
router.put("/:id", (req, res) => {
  const members = readData(FILE);
  const index = members.findIndex((m) => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Member not found" });

  const { name, email, phone } = req.body;
  members[index] = {
    ...members[index],
    name: name ?? members[index].name,
    email: email ?? members[index].email,
    phone: phone ?? members[index].phone,
  };

  writeData(FILE, members);
  res.json(members[index]);
});

// DELETE member
router.delete("/:id", (req, res) => {
  const members = readData(FILE);
  const filtered = members.filter((m) => m.id !== req.params.id);
  if (filtered.length === members.length)
    return res.status(404).json({ error: "Member not found" });

  writeData(FILE, filtered);
  res.json({ message: "Member deleted" });
});

export default router;
