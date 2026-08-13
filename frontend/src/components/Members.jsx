import { useEffect, useState } from "react";
import { getMembers, createMember, deleteMember } from "../api.js";

const emptyForm = { name: "", email: "", phone: "" };

export default function Members() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const loadMembers = () => {
    getMembers()
      .then(setMembers)
      .catch((err) => setError(err.message));
  };

  useEffect(loadMembers, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createMember(form);
      setForm(emptyForm);
      setShowForm(false);
      loadMembers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await deleteMember(id);
      loadMembers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Registry</p>
          <h1 className="page-title">Members</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ Register member"}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form className="form-panel" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Full name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
      )}

      {members.length === 0 ? (
        <div className="empty-state">No members registered yet.</div>
      ) : (
        <table className="ledger">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.phone || "—"}</td>
                <td>{m.joinDate}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
