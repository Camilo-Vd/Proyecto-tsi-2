import axiosInstance from "./axiosInstance";
import { safeParse } from "valibot";
import { InventariosSchema } from "../types/inventario";
import { handleAxiosError, extractArrayResponse, ApiResponse } from "../utils/apiErrorHandler";

type FormData = {
    [k: string]: any;
}

export async function getInventarios(): Promise<ApiResponse<any[]>> {
    try {
        const { data: response } = await axiosInstance.get("/inventario");
        
        const inventarios = extractArrayResponse(response);
        const resultado = safeParse(InventariosSchema, inventarios);
        
        if (resultado.success) {
            return { success: true, data: resultado.output };
        }

        console.error("Error de validación:", resultado.issues);
        if (inventarios.length > 0) {
            return { success: true, data: inventarios };
        }

        return { success: true, data: [] };
    } catch (error) {
        return handleAxiosError(error, "Error al obtener inventario");
    }
}

export async function agregarInventario(formData: FormData): Promise<ApiResponse<any>> {
    try {
        const { data } = await axiosInstance.post("/inventario/crear", {
            id_producto: parseInt(formData.id_producto),
            id_talla: parseInt(formData.id_talla),
            precio_unitario: parseInt(formData.precio_unitario),
            stock_actual: parseInt(formData.stock_actual),
            stock_critico: parseInt(formData.stock_critico)
        });

        return { success: true, data };
    } catch (error) {
        return handleAxiosError(error, "Error al agregar al inventario");
    }
}

export async function editarInventario(
    id_producto: number,
    id_talla: number,
    stock_actual: number,
    precio_unitario?: number,
    stock_critico?: number
): Promise<ApiResponse<any>> {
    try {
        const payload: any = { stock_actual };
        if (precio_unitario !== undefined) {
            payload.precio_unitario = precio_unitario;
        }
        if (stock_critico !== undefined) {
            payload.stock_critico = stock_critico;
        }

        const { data } = await axiosInstance.put(`/inventario/${id_producto}/${id_talla}`, payload);
        return { success: true, data };
    } catch (error) {
        return handleAxiosError(error, "Error al editar inventario");
    }
}

export async function eliminarInventario(id_producto: number, id_talla: number): Promise<ApiResponse<any>> {
    try {
        const { data } = await axiosInstance.delete(`/inventario/${id_producto}/${id_talla}`);
        return { success: true, data };
    } catch (error) {
        return handleAxiosError(error, "Error al eliminar del inventario");
    }
}
