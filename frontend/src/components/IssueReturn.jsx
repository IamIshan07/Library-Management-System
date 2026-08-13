import { useEffect, useState } from "react";
import { getBooks, getMembers, getIssues, issueBook, returnBook } from "../api.js";

export default function IssueReturn() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAll = () => {
    Promise.all([getBooks(), getMembers(), getIssues()])
      .then(([b, m, i]) => {
        setBooks(b);
        setMembers(m);
        setIssues(i.sort((a, b) => (a.issueDate < b.issueDate ? 1 : -1)));
      })
      .catch((err) => setError(err.message));
  };

  useEffect(loadAll, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!bookId || !memberId) {
      setError("Choose a book and a member first.");
      return;
    }
    try {
      await issueBook(bookId, memberId);
      setSuccess("Book issued successfully.");
      setBookId("");
      setMemberId("");
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReturn = async (issueId) => {
    setError("");
    setSuccess("");
    try {
      await returnBook(issueId);
      setSuccess("Book marked as returned.");
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const availableBooks = books.filter((b) => b.availableCopies > 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Circulation Desk</p>
          <h1 className="page-title">Issue &amp; Return</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="form-panel" onSubmit={handleIssue}>
        <div className="form-row">
          <label>Book</label>
          <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
            <option value="">Select an available title…</option>
            {availableBooks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.availableCopies} left)
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Member</label>
          <select value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
            <option value="">Select a member…</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Issue book</button>
        </div>
      </form>

      <h2 className="section-heading">Loan history</h2>
      {issues.length === 0 ? (
        <div className="empty-state">No loans recorded yet.</div>
      ) : (
        <table className="ledger">
          <thead>
            <tr>
              <th>Book</th>
              <th>Member</th>
              <th>Issued</th>
              <th>Due</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => {
              const isOverdue = issue.status === "issued" && issue.dueDate < today;
              return (
                <tr key={issue.id}>
                  <td>{issue.book ? issue.book.title : "—"}</td>
                  <td>{issue.member ? issue.member.name : "—"}</td>
                  <td>{issue.issueDate}</td>
                  <td>{issue.dueDate}</td>
                  <td>
                    {issue.status === "returned" ? (
                      <span className="stamp stamp-returned">RETURNED</span>
                    ) : (
                      <span className="stamp stamp-issued">{isOverdue ? "OVERDUE" : "ON LOAN"}</span>
                    )}
                  </td>
                  <td>
                    {issue.status === "issued" && (
                      <button className="btn btn-sm" onClick={() => handleReturn(issue.id)}>
                        Mark returned
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
