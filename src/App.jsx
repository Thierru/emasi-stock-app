import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import { supabase } from "./lib/supabaseClient";

function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="p-4 bg-white shadow-sm flex justify-between items-center">
        <span className="font-bold text-blue-600 text-lg">EMASI</span>
        <button 
          onClick={() => supabase.auth.signOut()} 
          className="text-sm bg-gray-200 px-3 py-1 rounded-lg"
        >Déconnexion</button>
      </header>
      
      <main className="p-4">
        <h2 className="text-xl font-bold">Bienvenue {user.email.split('@')[0]}</h2>
        <div className="mt-6 p-10 border-2 border-dashed border-gray-300 rounded-2xl text-center text-gray-400">
           Le module Pièces sera ici.
        </div>
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around p-4 text-xs font-medium">
        <div className="flex flex-col items-center text-blue-600"><span>📦</span><span>Pièces</span></div>
        <div className="flex flex-col items-center text-gray-400"><span>🛠️</span><span>Matériel</span></div>
        <div className="flex flex-col items-center text-gray-400"><span>💰</span><span>Budget</span></div>
        <div className="flex flex-col items-center text-gray-400"><span>📋</span><span>Admin</span></div>
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
