// In development, Vite proxies/uses localhost. In production (Netlify/Vercel),
// set VITE_API_URL to your deployed Render backend URL, e.g.
// https://stackroom-backend.onrender.com/api
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

// Books
export const getBooks = () => request("/books");
export const createBook = (book) =>
  request("/books", { method: "POST", body: JSON.stringify(book) });
export const updateBook = (id, book) =>
  request(`/books/${id}`, { method: "PUT", body: JSON.stringify(book) });
export const deleteBook = (id) =>
  request(`/books/${id}`, { method: "DELETE" });

// Members
export const getMembers = () => request("/members");
export const createMember = (member) =>
  request("/members", { method: "POST", body: JSON.stringify(member) });
export const deleteMember = (id) =>
  request(`/members/${id}`, { method: "DELETE" });

// Issues
export const getIssues = () => request("/issues");
export const issueBook = (bookId, memberId) =>
  request("/issues/issue", { method: "POST", body: JSON.stringify({ bookId, memberId }) });
export const returnBook = (issueId) =>
  request(`/issues/return/${issueId}`, { method: "POST" });
