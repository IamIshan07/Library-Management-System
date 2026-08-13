import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Books from "./components/Books.jsx";
import Members from "./components/Members.jsx";
import IssueReturn from "./components/IssueReturn.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
          <Route path="/issues" element={<IssueReturn />} />
        </Routes>
      </main>
    </div>
  );
}
