import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Materiel() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchMateriel = async () => {
      const { data } = await supabase.from("produits").select("*").eq("categorie", "MATERIEL");
      setItems(data || []);
    };
    fetchMateriel();
  }, []);

  const toggleEtat = async (id, currentEtat) => {
    const next = currentEtat === "OK" ? "HS" : "OK";
    await supabase.from("produits").update({ etat: next }).eq("id", id);
    window.location.reload(); // Simple refresh pour l'exemple
  };

  return (
    <div className="p-4 grid gap-4">
      <h1 className="font-bold text-xl">Parc Matériel</h1>
      {items.map(item => (
        <div key={item.id} className="bg-white p-4 rounded-3xl border shadow-sm flex justify-between items-center">
          <div>
            <h3 className="font-bold">{item.nom}</h3>
            <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${item.etat === 'OK' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              ÉTAT: {item.etat}
            </span>
          </div>
          <button onClick={() => toggleEtat(item.id, item.etat)} className="text-xs bg-gray-800 text-white px-4 py-2 rounded-xl italic">
            Changer état
          </button>
        </div>
      ))}
    </div>
  );
}
