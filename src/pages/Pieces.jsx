import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Pieces() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("produits")
      .select("*")
      .eq("categorie", "PIECE")
      .order("nom");
    setItems(data || []);
  };

  const updateQty = async (id, currentQty, delta, nom) => {
    const newQty = Math.max(0, currentQty + delta);
    const { error } = await supabase
      .from("produits")
      .update({ quantite: newQty })
      .eq("id", id);

    if (!error) {
      // Enregistrement dans les logs (Historique)
      await supabase.from("historique").insert({
        produit_nom: nom,
        action: delta > 0 ? "➕ AJOUT" : "➖ SORTIE",
        quantite_finale: newQty,
        utilisateur: "THIERRY" // Ou utilise ton AuthContext pour le nom
      });
      fetchItems();
    }
  };

  const toggleScanner = () => {
    if (!isScannerOpen) {
      setIsScannerOpen(true);
      setTimeout(() => {
        const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
        scanner.render((text) => {
          setSearch(text);
          scanner.clear();
          setIsScannerOpen(false);
        }, () => {});
      }, 100);
    } else {
      setIsScannerOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* BARRE DE RECHERCHE & SCAN */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Chercher une pièce..."
          className="flex-1 p-5 rounded-[2rem] border shadow-sm outline-none bg-white font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* SECTION SCANNER (S'affiche par dessus si activé) */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-black/90 z-[100] p-6 flex flex-col">
          <div className="flex justify-between items-center text-white mb-6">
            <h2 className="font-black uppercase tracking-widest">Scanner un code</h2>
            <button onClick={toggleScanner} className="text-2xl">✕</button>
          </div>
          <div id="reader" className="bg-white rounded-3xl overflow-hidden"></div>
          <p className="text-slate-400 text-center text-[10px] mt-8 uppercase font-bold">
            Placez le code dans le cadre
          </p>
        </div>
      )}

      {/* BOUTON NOUVELLE PIÈCE */}
      <button className="w-full bg-blue-50 text-blue-700 p-5 rounded-[2rem] font-black text-sm uppercase italic border border-blue-100 active:scale-95 transition-transform">
        + Nouvelle Pièce Manuelle
      </button>

      {/* LISTE DES PIÈCES */}
      <div className="grid gap-4">
        {items
          .filter((i) => i.nom.toLowerCase().includes(search.toLowerCase()) || i.barcode === search)
          .map((p) => (
            <div
              key={p.id}
              className={`bg-white p-5 rounded-[2.5rem] shadow-sm border transition-all ${
                p.quantite <= p.seuil_critique 
                ? "border-red-500 bg-red-50" 
                : "border-slate-100"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-black text-slate-800 text-sm uppercase leading-tight">
                    {p.nom}
                  </h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                    📍 {p.emplacement || "ZONE NON DÉFINIE"}
                  </p>
                </div>
                <button className="bg-slate-50 p-2 rounded-xl text-lg">⚙️</button>
              </div>

              <div className="flex justify-between items-center mt-4 bg-slate-50/50 p-3 rounded-[1.5rem]">
                <div className="flex gap-2">
                  <button
                    onClick={() => updateQty(p.id, p.quantite, -1, p.nom)}
                    className="bg-white border w-12 h-12 rounded-2xl font-black shadow-sm text-xl active:bg-slate-100"
                  >
                    -
                  </button>
                  <button
                    onClick={() => updateQty(p.id, p.quantite, 1, p.nom)}
                    className="bg-white border w-12 h-12 rounded-2xl font-black shadow-sm text-xl active:bg-slate-100"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-right">
                  <span className={`text-2xl font-black block ${
                    p.quantite <= p.seuil_critique ? "text-red-600" : "text-blue-900"
                  }`}>
                    x{p.quantite}
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">
                    Seuil: {p.seuil_critique}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* BOUTON SCAN FLOTTANT (Comme sur ton modèle) */}
      <button 
        onClick={toggleScanner}
        className="fixed bottom-24 right-6 bg-blue-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl border-4 border-white z-40 active:scale-90 transition-transform"
      >
        📷
      </button>
    </div>
  );
}
