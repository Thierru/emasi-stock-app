import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = `${id}@emasi.stock`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Erreur : " + error.message);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">EMASI STOCK</h1>
        <input 
          className="w-full p-3 border rounded-xl mb-4" 
          placeholder="Identifiant" 
          onChange={(e) => setId(e.target.value)} 
        />
        <input 
          type="password" 
          className="w-full p-3 border rounded-xl mb-6" 
          placeholder="Mot de passe" 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold">Connexion</button>
      </form>
    </div>
  );
}
