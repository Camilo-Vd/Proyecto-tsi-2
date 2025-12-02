import axios from "./axiosInstance";
import { AxiosError } from "axios";
import { safeParse } from "valibot";
import { VentasServerSchema } from "../types/venta";

export async function getVentas() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/ventas`;
        const { data: ventas } = await axios.get(url);
        const resultado = safeParse(VentasServerSchema, ventas);
        if (resultado.success) {
            return resultado.output;
        } else {
            console.error("Error de validación de datos", resultado.issues);
            return [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

type DetalleVenta = {
    id_producto: number;
    id_talla: number;
    cantidad_vendida: number;
    precio_unitario_venta: number;
}

export async function crearVenta(rut_cliente: number | null, detalles: DetalleVenta[]) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/ventas/crear`;
        const payload: any = {
            detalles: detalles
        };
        
        if (rut_cliente) {
            payload.rut_cliente = rut_cliente;
        }

        const { data: response } = await axios.post(url, payload);
        return { success: true, ventaId: response.id_venta };
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 400) {
                return { success: false, error: "Datos inválidos para la venta" };
            }
            if (error.response?.data?.message) {
                return { success: false, error: error.response.data.message };
            }
        }
        return { success: false, error: "Error al crear la venta" };
    }
}

export async function imprimirVenta(id_venta: number) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/ventas/imprimir/${id_venta}`;
        const { data } = await axios.get(url, { responseType: 'blob' });
        
        // Descargar PDF
        const url_blob = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url_blob;
        link.setAttribute('download', `venta-${id_venta}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        
        return { success: true };
    } catch (error) {
        console.error("Error al imprimir venta", error);
        return { success: false, error: "Error al descargar PDF" };
    }
}

// Función auxiliar para obtener productos disponibles
export async function getProductosDisponibles() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/inventario`;
        const { data } = await axios.get(url);
        return data || [];
    } catch (error) {
        return [];
    }
}

// Función auxiliar para obtener tallas
export async function getTallas() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/tallas`;
        const { data } = await axios.get(url);
        return data || [];
    } catch (error) {
        return [];
    }
}
