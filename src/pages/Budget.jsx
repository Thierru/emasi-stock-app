import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Budget() {
  const [total, setTotal] = useState(0);
  const [itemsToBuy, setItemsToBuy] = useState([]);

  useEffect(() => {
    const calculateBudget = async () => {
      const { data } = await supabase.from("produits").select("*");
      let runningTotal = 0;
      let list = [];

      data.forEach(p => {
        if (p.categorie === "PIECE" && p.quantite <= p.seuil_critique) {
          const diff = p.seuil_critique - p.quantite;
          const cost = diff * (p.prix_unitaire || 0);
          runningTotal += cost;
          if (diff > 0) list.push({ ...p, besoin: diff, cost });
        }
        if (p.categorie === "MATERIEL" && p.etat === "HS") {
          runningTotal += (p.prix_unitaire || 0);
          list.push({ ...p, besoin: "Remplacement (HS)", cost: p.prix_unitaire });
        }
      });
      setTotal(runningTotal);
      setItemsToBuy(list);
    };
    calculateBudget();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black mb-2">Budget Estimé</h1>
      <div className="bg-red-600 text-white p-6 rounded-3xl shadow-xl mb-6">
        <p className="text-sm opacity-80 uppercase font-bold tracking-wider">Total Réappro</p>
        <p className="text-4xl font-black">{total.toLocaleString()} €</p>
      </div>

      <div className="space-y-3">
        {itemsToBuy.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border flex justify-between items-center shadow-sm">
            <div>
              <p className="font-bold text-gray-800">{item.nom}</p>
              <p className="text-xs text-red-500 font-bold uppercase">{item.besoin} à prévoir</p>
            </div>
            <p className="font-black text-gray-900">{item.cost} €</p>
          </div>
        ))}
      </div>
    </div>
  );
}
