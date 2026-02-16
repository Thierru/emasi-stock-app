import imageCompression from "browser-image-compression";
import { supabase } from "./supabaseClient";

export async function uploadAndCompress(file) {
  const options = { maxSizeMB: 0.3, maxWidthOrHeight: 800, useWebWorker: true };
  try {
    const compressedFile = await imageCompression(file, options);
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
    const { data, error } = await supabase.storage.from("photos-stock").upload(fileName, compressedFile);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("photos-stock").getPublicUrl(fileName);
    return urlData.publicUrl;
  } catch (e) {
    console.error("Erreur upload:", e);
    return null;
  }
}
