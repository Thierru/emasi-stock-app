import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Historique() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase.from("historique").select("*").order("date_action", { ascending: false });
      setLogs(data || []);
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Mouvements de Stock</h1>
      <div className="space-y-2">
        {logs.map(log => (
          <div key={log.id} className="bg-white p-3 rounded-xl border text-sm shadow-sm">
            <div className="flex justify-between font-bold">
              <span>{log.produit_nom}</span>
              <span className={log.action === "Ajout" ? "text-green-600" : "text-red-600"}>{log.action}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-[10px] mt-1 italic">
              <span>Par: {log.utilisateur}</span>
              <span>{new Date(log.date_action).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
