import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Pieces() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from("produits").select("*").eq("categorie", "PIECE").order('nom');
    setItems(data || []);
  };

  const updateQty = async (id, currentQty, delta, nom) => {
    const newQty = Math.max(0, currentQty + delta);
    await supabase.from("produits").update({ quantite: newQty }).eq("id", id);
    await supabase.from("historique").insert({
      produit_id: id, produit_nom: nom, action: delta > 0 ? "Ajout" : "Sortie",
      quantite_finale: newQty, utilisateur: "Equipe Terrain"
    });
    fetchItems();
  };

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render((text) => {
      setSearch(text);
      scanner.clear();
      alert("Article trouvé : " + text);
    }, () => {});
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input 
          placeholder="Chercher ou Scanner..." 
          className="flex-1 p-3 border rounded-2xl shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={startScanner} className="bg-blue-600 text-white p-3 rounded-2xl">📷</button>
      </div>
      <div id="reader"></div>

      <div className="grid gap-3 mt-4">
        {items.filter(i => i.nom.toLowerCase().includes(search.toLowerCase()) || i.barcode === search).map(item => (
          <div key={item.id} className={`p-4 rounded-3xl border shadow-sm flex justify-between items-center ${item.quantite <= item.seuil_critique ? "bg-red-50 border-red-200" : "bg-white"}`}>
            <div>
              <h3 className="font-bold text-gray-800">{item.nom}</h3>
              <p className="text-sm text-gray-500">Stock: <span className="font-black text-black">{item.quantite}</span> / Seuil: {item.seuil_critique}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => updateQty(item.id, item.quantite, -1, item.nom)} className="bg-gray-100 w-10 h-10 rounded-full font-bold text-xl">-</button>
              <button onClick={() => updateQty(item.id, item.quantite, 1, item.nom)} className="bg-blue-600 text-white w-10 h-10 rounded-full font-bold text-xl">+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
