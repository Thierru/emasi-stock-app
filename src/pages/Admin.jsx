import Papa from "papaparse";
import { supabase } from "../lib/supabaseClient";

export default function Admin() {
  const handleExport = async () => {
    const { data } = await supabase.from("produits").select("*");
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `EMASI_STOCK_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: async (results) => {
        const { error } = await supabase.from("produits").upsert(results.data);
        if (error) alert("Erreur: " + error.message);
        else alert("Importation terminée avec succès !");
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Données</h1>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="font-bold mb-4 text-blue-600">📤 Sauvegarde</h2>
        <button onClick={handleExport} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black shadow-lg shadow-blue-200">
          EXPORTER SUR EXCEL (CSV)
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="font-bold mb-4 text-green-600">📥 Mise à jour massive</h2>
        <input type="file" accept=".csv" onChange={handleImport} className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 font-bold" />
        <p className="mt-3 text-[10px] text-gray-400 italic">Attention : L'importation écrase les données existantes si l'ID est identique.</p>
      </div>
    </div>
  );
}
