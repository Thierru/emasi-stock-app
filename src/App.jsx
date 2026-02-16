import { useState } from "react";
import Admin from "./pages/Admin";
// (On créera Pieces et Materiel juste après)

import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import { supabase } from "./lib/supabaseClient";

function Dashboard() {
  const [tab, setTab] = useState("pieces");

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="p-4 bg-white shadow-sm flex justify-between items-center sticky top-0 z-10">
        <span className="font-black text-blue-600 tracking-tighter text-xl">EMASI STOCK</span>
        <button onClick={() => supabase.auth.signOut()} className="text-xs bg-gray-100 p-2 rounded-lg font-bold">SORTIR</button>
      </header>

      <main>
        {tab === "admin" && <Admin />}
        {tab === "pieces" && <div className="p-10 text-center text-gray-400">L'onglet Pièces arrive...</div>}
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around p-3 shadow-2xl">
        <button onClick={() => setTab("pieces")} className={`flex flex-col items-center ${tab === 'pieces' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">📦</span><span className="text-[10px] font-bold">PIÈCES</span>
        </button>
        <button onClick={() => setTab("admin")} className={`flex flex-col items-center ${tab === 'admin' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">⚙️</span><span className="text-[10px] font-bold">ADMIN</span>
        </button>
      </nav>
    </div>
  );
}

function AuthWrapper() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}
