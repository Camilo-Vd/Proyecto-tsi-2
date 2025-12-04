import axios from "./axiosInstance";
import { safeParse } from "valibot";
import { TallasSchema } from "../types/talla";

export async function getTallas() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/tallas`;
        const { data } = await axios.get(url);
        
        const resultado = safeParse(TallasSchema, data);
        if (!resultado.success) {
            return { success: false, data: [], error: "Error validando tallas" };
        }
        
        return { success: true, data: resultado.output };
    } catch (error) {
        console.error("Error obteniendo tallas:", error);
        return { success: false, data: [], error: "Error al obtener tallas" };
    }
}
