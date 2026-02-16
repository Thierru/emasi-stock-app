import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Pieces from "./pages/Pieces";
import Materiel from "./pages/Materiel";
import Budget from "./pages/Budget";
import Historique from "./pages/Historique";
import Admin from "./pages/Admin";
import { supabase } from "./lib/supabaseClient";

function Dashboard() {
  const [tab, setTab] = useState("pieces");
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="p-4 bg-white shadow-sm flex justify-between items-center sticky top-0 z-50">
        <span className="font-black text-blue-600 text-xl tracking-tighter">EMASI STOCK</span>
        <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-bold bg-gray-100 px-3 py-2 rounded-xl">SORTIR</button>
      </header>

      <main className="max-w-md mx-auto">
        {tab === "pieces" && <Pieces />}
        {tab === "materiel" && <Materiel />}
        {tab === "budget" && <Budget />}
        {tab === "historique" && <Historique />}
        {tab === "admin" && <Admin />}
      </main>

      <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-md border-t flex justify-around p-3 pb-6 z-50">
        {[
          { id: "pieces", icon: "📦", label: "PIÈCES" },
          { id: "materiel", icon: "🛠️", label: "MATÉRIEL" },
          { id: "budget", icon: "💰", label: "BUDGET" },
          { id: "historique", icon: "📜", label: "LOGS" },
          { id: "admin", icon: "⚙️", label: "ADMIN" }
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${tab === item.id ? "text-blue-600 scale-110" : "text-gray-400"}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[9px] font-black">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

function AuthWrapper() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Login />;
}
