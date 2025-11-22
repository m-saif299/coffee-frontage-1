import { supabase } from "../lib/supabase";
export const getCafes = async () => {
    const { data, error } = await supabase
        .from("cafes")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) {
        console.error("Error fetching cafes:", error);
        return [];
    }
    return data;
};
export const addCafe = async (cafe) => {
    const { data, error } = await supabase
        .from("cafes")
        .insert([cafe])
        .select();
    if (error) {
        console.error("Error adding cafe:", error);
        return null;
    }
    return data[0];
};
export const updateCafe = async (id, updates) => {
    const { data, error } = await supabase
        .from("cafes")
        .update(updates)
        .eq("id", id)
        .select();
    if (error) {
        console.error("Update error:", error);
        return null;
    }
    return data[0];
};
export const deleteCafe = async (id) => {
    const { error } = await supabase
        .from("cafes")
        .delete()
        .eq("id", id);
    if (error) {
        console.error("Delete error:", error);
        return false;
    }
    return true;
};
