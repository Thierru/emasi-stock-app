import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

export default function App() {

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from("produits").select("*");
      console.log("DATA:", data);
      console.log("ERROR:", error);
    };

    testConnection();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">EMASI STOCK</h1>
      <p>Connexion Supabase en cours...</p>
    </div>
  );
}
