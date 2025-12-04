import axiosInstance from "./axiosInstance";
import { AxiosError } from "axios";

export interface ProductoReporte {
    codigo?: number;
    id_producto?: number;
    nombre?: string;
    nombre_producto?: string;
    categoria?: string;
    stock?: number;
    stock_total?: number;
    precio_unitario?: number;
    nomnbre?: string;
    tallas?: Array<{
        nombre_talla?: string;
        stock?: number;
    }>;
}

export const getProductosDisponibles = async (): Promise<{ success: boolean; data?: ProductoReporte[]; error?: string }> => {
    try {
        const response = await axiosInstance.get("/reportes/disponibles");
        
        // El endpoint devuelve un array directo
        const productosData = Array.isArray(response.data) ? response.data : [];
        
        return { success: true, data: productosData };
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error al obtener productos disponibles:", axiosError);

        if (axiosError.status === 401) {
            return { success: false, error: "No autorizado. Inicia sesión nuevamente" };
        }

        return { success: false, error: "Error al obtener productos disponibles" };
    }
};

export const getProductosBajoStock = async (): Promise<{ success: boolean; data?: ProductoReporte[]; error?: string }> => {
    try {
        const response = await axiosInstance.get("/reportes/bajo-stock");
        
        // El endpoint devuelve un array directo
        const productosData = Array.isArray(response.data) ? response.data : [];
        
        return { success: true, data: productosData };
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error al obtener productos con bajo stock:", axiosError);

        if (axiosError.status === 401) {
            return { success: false, error: "No autorizado. Inicia sesión nuevamente" };
        }

        return { success: false, error: "Error al obtener productos con bajo stock" };
    }
};

export const getProductosAgotados = async (): Promise<{ success: boolean; data?: ProductoReporte[]; error?: string }> => {
    try {
        const response = await axiosInstance.get("/reportes/agotados");
        
        // El endpoint devuelve un array directo
        const productosData = Array.isArray(response.data) ? response.data : [];
        
        return { success: true, data: productosData };
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error al obtener productos agotados:", axiosError);

        if (axiosError.status === 401) {
            return { success: false, error: "No autorizado. Inicia sesión nuevamente" };
        }

        return { success: false, error: "Error al obtener productos agotados" };
    }
};

