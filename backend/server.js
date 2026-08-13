import express from "express";
import cors from "cors";

import booksRouter from "./routes/books.js";
import membersRouter from "./routes/members.js";
import issuesRouter from "./routes/issues.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Library Management API is running" });
});

app.use("/api/books", booksRouter);
app.use("/api/members", membersRouter);
app.use("/api/issues", issuesRouter);

app.listen(PORT, () => {
  console.log(`Library Management backend running on http://localhost:${PORT}`);
});
