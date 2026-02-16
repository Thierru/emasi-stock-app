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
  <div className="max-w-xl mx-auto p-4 pb-32">
    {/* HEADER STYLE RTE */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-black text-blue-900 italic uppercase leading-none">
        RTE <span className="text-blue-500">EMASI</span> <br />
        <span className="text-[10px] tracking-widest text-slate-400 not-italic">LORRAINE</span>
      </h1>
      <button onClick={() => supabase.auth.signOut()} className="text-[10px] bg-white px-3 py-2 rounded-xl shadow-sm font-bold border border-slate-100 uppercase">
        Quitter
      </button>
    </div>

    {/* BOUTON SCAN FLOTTANT */}
    <button className="fixed bottom-24 right-6 bg-blue-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl border-4 border-white z-40 active:scale-90 transition-transform">
      📷
    </button>

    <main>
      {tab === "pieces" && <Pieces />}
      {tab === "materiel" && <Materiel />}
      {tab === "budget" && <Budget />}
      {tab === "historique" && <Historique />}
    </main>

    {/* NAV STYLE MOBILE */}
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 z-50 shadow-lg">
      <TabButton active={tab === 'pieces'} onClick={() => setTab('pieces')} icon="📦" label="Pièces" />
      <TabButton active={tab === 'materiel'} onClick={() => setTab('materiel')} icon="🛠️" label="Matériel" />
      <TabButton active={tab === 'budget'} onClick={() => setTab('budget')} icon="🛒" label="Budget" />
      <TabButton active={tab === 'historique'} onClick={() => setTab('historique')} icon="📜" label="Logs" />
    </nav>
  </div>
);

function TabButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center p-2 ${active ? 'text-blue-600' : 'text-slate-300'}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-[9px] font-black mt-1 uppercase">{label}</span>
    </button>
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
