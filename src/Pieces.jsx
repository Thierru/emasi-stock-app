import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Pieces() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPieces = async () => {
      const { data, error } = await supabase
        .from("produits")
        .select("*")
        .eq("categorie", "PIECE");
      if (error) console.error(error);
      else setProduits(data);
      setLoading(false);
    };
    fetchPieces();
  }, []);

  if (loading) return <p>Chargement des pièces...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Pièces consommables</h2>
      {produits.length === 0 ? (
        <p>Aucune pièce trouvée</p>
      ) : (
        <ul className="space-y-1">
          {produits.map((p) => (
            <li key={p.id} className={`p-2 border ${p.quantite <= p.seuil_critique ? "bg-red-200" : "bg-green-100"}`}>
              {p.nom} - {p.quantite} pcs - Seuil {p.seuil_critique}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
