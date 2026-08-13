import { useEffect, useState } from "react";
import { getBooks, getMembers, getIssues } from "../api.js";

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getBooks(), getMembers(), getIssues()])
      .then(([b, m, i]) => {
        setBooks(b);
        setMembers(m);
        setIssues(i);
      })
      .catch((err) => setError(err.message));
  }, []);

  const totalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0);
  const availableCopies = books.reduce((sum, b) => sum + b.availableCopies, 0);
  const activeLoans = issues.filter((i) => i.status === "issued");
  const today = new Date().toISOString().slice(0, 10);
  const overdue = activeLoans.filter((i) => i.dueDate < today);

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Overview</p>
          <h1 className="page-title">Reading Room Dashboard</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-value">{books.length}</div>
          <div className="stat-label">Titles in Catalog</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{availableCopies}/{totalCopies}</div>
          <div className="stat-label">Copies Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{members.length}</div>
          <div className="stat-label">Registered Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activeLoans.length}</div>
          <div className="stat-label">Active Loans</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: overdue.length ? "#a33d2e" : undefined }}>
            {overdue.length}
          </div>
          <div className="stat-label">Overdue Returns</div>
        </div>
      </div>

      <h2 className="section-heading">Currently on loan</h2>
      {activeLoans.length === 0 ? (
        <div className="empty-state">No books are currently checked out.</div>
      ) : (
        <table className="ledger">
          <thead>
            <tr>
              <th>Book</th>
              <th>Member</th>
              <th>Issued</th>
              <th>Due</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activeLoans.map((issue) => {
              const book = books.find((b) => b.id === issue.bookId);
              const member = members.find((m) => m.id === issue.memberId);
              const isOverdue = issue.dueDate < today;
              return (
                <tr key={issue.id}>
                  <td>{book ? book.title : "—"}</td>
                  <td>{member ? member.name : "—"}</td>
                  <td>{issue.issueDate}</td>
                  <td>{issue.dueDate}</td>
                  <td>
                    <span className={`stamp ${isOverdue ? "stamp-issued" : ""}`}>
                      {isOverdue ? "OVERDUE" : "ON LOAN"}
                    </span>
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
