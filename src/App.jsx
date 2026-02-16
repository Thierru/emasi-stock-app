import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Pieces from "./pages/Pieces";
import Materiel from "./pages/Materiel";
import Budget from "./pages/Budget";
import Historique from "./pages/Historique";
import Admin from "./pages/Admin";
import Header from "./components/Header";

export default function App() {
  return (
    <Router>
      <Header />
      <nav className="flex justify-around bg-gray-100 p-2">
        <NavLink to="/pieces" className="font-bold">Pièces</NavLink>
        <NavLink to="/materiel" className="font-bold">Matériel</NavLink>
        <NavLink to="/budget" className="font-bold">Budget</NavLink>
        <NavLink to="/historique" className="font-bold">Historique</NavLink>
        <NavLink to="/admin" className="font-bold">Admin</NavLink>
      </nav>
      <div className="p-4">
        <Routes>
          <Route path="/pieces" element={<Pieces />} />
          <Route path="/materiel" element={<Materiel />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/historique" element={<Historique />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Pieces />} />
        </Routes>
      </div>
    </Router>
  );
}
