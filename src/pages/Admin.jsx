import Papa from "papaparse";
import { supabase } from "../lib/supabaseClient";

export default function Admin() {
  // EXPORT EXCEL (CSV)
  const handleExport = async () => {
    const { data } = await supabase.from("produits").select("*");
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "export_stock_emasi.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // IMPORT EXCEL (CSV)
  const handleImport = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const { error } = await supabase.from("produits").upsert(results.data);
        if (error) alert("Erreur import : " + error.message);
        else alert("Importation réussie !");
      },
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administration</h1>
      
      <div className="bg-white p-4 rounded-2xl shadow-sm border mb-4">
        <h2 className="font-bold mb-2">Exportation</h2>
        <button onClick={handleExport} className="w-full bg-green-600 text-white p-4 rounded-xl font-bold">
          Télécharger l'inventaire (.csv)
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border">
        <h2 className="font-bold mb-2">Importation</h2>
        <input type="file" accept=".csv" onChange={handleImport} className="mb-4 block w-full text-sm text-gray-500" />
        <p className="text-xs text-gray-400">Le fichier doit avoir les colonnes : nom, categorie, quantite, prix_unitaire...</p>
      </div>
    </div>
  );
}
