import axios from "./axiosInstance";
import { safeParse } from "valibot";
import { ProductosSchema } from "../types/producto";
import { handleAxiosError, extractArrayResponse, ApiResponse } from "../utils/apiErrorHandler";

export async function getProductos(): Promise<ApiResponse<any[]>> {
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/productos`);
        
        const productos = extractArrayResponse(data);
        const resultado = safeParse(ProductosSchema, productos);
        
        if (resultado.success) {
            return { success: true, data: resultado.output };
        }

        console.error("Error de validación:", resultado.issues);
        if (productos.length > 0) {
            return { success: true, data: productos };
        }

        return { success: true, data: [] };
    } catch (error) {
        return handleAxiosError(error, "Error al obtener productos");
    }
}

export async function crearProducto(nombre_producto: string, id_categoria: number): Promise<ApiResponse<any>> {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/productos`, {
            nombre_producto,
            id_categoria,
        });

        return { success: true, data };
    } catch (error) {
        return handleAxiosError(error, "Error al crear el producto");
    }
}

