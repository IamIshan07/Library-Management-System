import { useEffect, useState } from "react";
import { getBooks, createBook, deleteBook } from "../api.js";

const emptyForm = { title: "", author: "", isbn: "", genre: "", totalCopies: 1 };

export default function Books() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadBooks = () => {
    getBooks()
      .then(setBooks)
      .catch((err) => setError(err.message));
  };

  useEffect(loadBooks, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await createBook({ ...form, totalCopies: Number(form.totalCopies) });
      setForm(emptyForm);
      setShowForm(false);
      setSuccess("Book added to catalog.");
      loadBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this title from the catalog?")) return;
    try {
      await deleteBook(id);
      loadBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Catalog</p>
          <h1 className="page-title">Books</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ Add a title"}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <form className="form-panel" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Author</label>
            <input name="author" value={form.author} onChange={handleChange} required />
          </div>
          <div className="form-grid-2">
            <div className="form-row">
              <label>Genre</label>
              <input name="genre" value={form.genre} onChange={handleChange} placeholder="e.g. Fiction" />
            </div>
            <div className="form-row">
              <label>Total copies</label>
              <input
                type="number"
                min="1"
                name="totalCopies"
                value={form.totalCopies}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <label>ISBN (optional)</label>
            <input name="isbn" value={form.isbn} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save to catalog</button>
          </div>
        </form>
      )}

      {books.length === 0 ? (
        <div className="empty-state">No books in the catalog yet.</div>
      ) : (
        <div className="catalog-grid">
          {books.map((book, idx) => (
            <div className="catalog-card" key={book.id}>
              <div className="catalog-card-index">#{String(idx + 1).padStart(3, "0")}</div>
              <div className="catalog-card-title">{book.title}</div>
              <div className="catalog-card-author">{book.author}</div>
              <div className="catalog-meta">
                <span className="tag">{book.genre}</span>
                <span className={`tag ${book.availableCopies > 0 ? "tag-available" : "tag-out"}`}>
                  {book.availableCopies > 0
                    ? `${book.availableCopies} of ${book.totalCopies} available`
                    : "All copies out"}
                </span>
              </div>
              <div className="catalog-card-actions">
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
