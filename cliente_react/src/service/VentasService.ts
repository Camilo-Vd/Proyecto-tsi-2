import axiosInstance from "./axiosInstance";
import { Venta, VentasSchema } from "../types/venta";
import { safeParse } from "valibot";
import { handleAxiosError, extractArrayResponse, ApiResponse } from "../utils/apiErrorHandler";

export interface VentaCreatePayload {
    rut_cliente: string;
    rut_usuario: string;
    detalles: {
        id_producto: number;
        id_talla: number;
        cantidad_vendida: number;
        precio_unitario_venta: number;
    }[];
}

export const obtenerVentas = async (): Promise<ApiResponse<Venta[]>> => {
    try {
        const response = await axiosInstance.get("/ventas");
        
        const ventasData = extractArrayResponse(response.data);
        const resultado = safeParse(VentasSchema, ventasData);
        
        if (resultado.success) {
            return { success: true, data: resultado.output };
        }

        console.error("Validación de ventas fallida:", resultado.issues);
        if (ventasData.length > 0) {
            return { success: true, data: ventasData as Venta[] };
        }

        return { success: true, data: [] };
    } catch (error) {
        return handleAxiosError(error, "Error al obtener las ventas");
    }
};

export const obtenerVentasAnuladas = async (): Promise<ApiResponse<Venta[]>> => {
    try {
        const response = await axiosInstance.get("/ventas/anuladas");
        
        const ventasData = extractArrayResponse(response.data);
        const resultado = safeParse(VentasSchema, ventasData);
        
        if (resultado.success) {
            return { success: true, data: resultado.output };
        }

        console.error("Validación de ventas fallida:", resultado.issues);
        if (ventasData.length > 0) {
            return { success: true, data: ventasData as Venta[] };
        }

        return { success: true, data: [] };
    } catch (error) {
        return handleAxiosError(error, "Error al obtener ventas anuladas");
    }
};

export const obtenerTodasLasVentas = async (): Promise<ApiResponse<Venta[]>> => {
    try {
        const response = await axiosInstance.get("/ventas/todas");
        
        const ventasData = extractArrayResponse(response.data);
        const resultado = safeParse(VentasSchema, ventasData);
        
        if (resultado.success) {
            return { success: true, data: resultado.output };
        }

        console.error("Validación de ventas fallida:", resultado.issues);
        if (ventasData.length > 0) {
            return { success: true, data: ventasData as Venta[] };
        }

        return { success: true, data: [] };
    } catch (error) {
        return handleAxiosError(error, "Error al obtener todas las ventas");
    }
};

// Alias para compatibilidad
export const getVentas = obtenerVentas;

export const crearVenta = async (
    payload: VentaCreatePayload
): Promise<ApiResponse<Venta>> => {
    try {
        const response = await axiosInstance.post("/ventas/crear", payload);

        if (response.data?.venta) {
            return { success: true, data: response.data.venta };
        }

        return {
            success: false,
            error: "Error al crear la venta",
            code: "UNKNOWN_ERROR",
        };
    } catch (error) {
        return handleAxiosError(error, "Error al crear la venta");
    }
};

export const obtenerComprobante = async (
    id_venta: number
): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.get(`/ventas/imprimir/${id_venta}`, {
            responseType: "blob",
        });

        return { success: true, data: URL.createObjectURL(response.data) };
    } catch (error) {
        return handleAxiosError(error, "Error al obtener el comprobante");
    }
};

export const anularVenta = async (
    id_venta: number
): Promise<ApiResponse<void>> => {
    try {
        await axiosInstance.put(`/ventas/${id_venta}/anular`);
        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al anular la venta");
    }
};

// Alias para compatibilidad
export const eliminarVenta = anularVenta;

