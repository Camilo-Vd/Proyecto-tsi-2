import axiosInstance from "./axiosInstance";
import { Compra, ComprasSchema } from "../types/compra";
import { safeParse } from "valibot";
import { handleAxiosError, extractArrayResponse, ApiResponse } from "../utils/apiErrorHandler";

export interface DetalleCompraPayload {
    id_producto: number;
    id_talla: number;
    cantidad_adquirida: number;
    precio_unitario_compra: number;
}

export interface CompraCreatePayload {
    rut_proveedor: string;
    detalles: DetalleCompraPayload[];
}

export const obtenerCompras = async (): Promise<ApiResponse<Compra[]>> => {
    try {
        const response = await axiosInstance.get("/compras");
        
        const comprasData = extractArrayResponse(response.data);
        const resultado = safeParse(ComprasSchema, comprasData);
        
        if (resultado.success) {
            return { success: true, data: resultado.output };
        }

        console.error("Validación de compras fallida:", resultado.issues);
        if (comprasData.length > 0) {
            return { success: true, data: comprasData as Compra[] };
        }

        return { success: true, data: [] };
    } catch (error) {
        return handleAxiosError(error, "Error al obtener compras");
    }
};

export const obtenerComprasAnuladas = async (): Promise<ApiResponse<Compra[]>> => {
    try {
        const response = await axiosInstance.get("/compras/anuladas");
        
        const comprasData = extractArrayResponse(response.data);
        const resultado = safeParse(ComprasSchema, comprasData);
        
        if (resultado.success) {
            return { success: true, data: resultado.output };
        }

        console.error("Validación de compras fallida:", resultado.issues);
        if (comprasData.length > 0) {
            return { success: true, data: comprasData as Compra[] };
        }

        return { success: true, data: [] };
    } catch (error) {
        return handleAxiosError(error, "Error al obtener compras anuladas");
    }
};

export const obtenerTodasLasCompras = async (): Promise<ApiResponse<Compra[]>> => {
    try {
        const response = await axiosInstance.get("/compras/todas");
        
        const comprasData = extractArrayResponse(response.data);
        const resultado = safeParse(ComprasSchema, comprasData);
        
        if (resultado.success) {
            return { success: true, data: resultado.output };
        }

        console.error("Validación de compras fallida:", resultado.issues);
        if (comprasData.length > 0) {
            return { success: true, data: comprasData as Compra[] };
        }

        return { success: true, data: [] };
    } catch (error) {
        return handleAxiosError(error, "Error al obtener todas las compras");
    }
};

// Alias para compatibilidad
export const getCompras = obtenerCompras;

export const crearCompra = async (
    payload: CompraCreatePayload
): Promise<ApiResponse<Compra>> => {
    try {
        const response = await axiosInstance.post("/compras/crear", payload);

        if (response.data?.compra) {
            return { success: true, data: response.data.compra };
        } else if (response.data?.id_compra) {
            return { success: true, data: response.data };
        }

        return {
            success: false,
            error: "Error al crear la compra",
            code: "UNKNOWN_ERROR",
        };
    } catch (error) {
        return handleAxiosError(error, "Error al crear la compra");
    }
};

export const obtenerComprobanteCompra = async (
    id_compra: number
): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.get(`/compras/imprimir/${id_compra}`, {
            responseType: "blob",
        });

        return { success: true, data: URL.createObjectURL(response.data) };
    } catch (error) {
        return handleAxiosError(error, "Error al obtener el comprobante");
    }
};

export const editarCompra = async (
    id_compra: number,
    payload: CompraCreatePayload
): Promise<ApiResponse<void>> => {
    try {
        await axiosInstance.put(`/compras/${id_compra}`, payload);
        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al editar la compra");
    }
};

export const anularCompra = async (
    id_compra: number
): Promise<ApiResponse<void>> => {
    try {
        await axiosInstance.put(`/compras/${id_compra}/anular`);
        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al anular la compra");
    }
};

// Alias para compatibilidad
export const eliminarCompra = anularCompra;

