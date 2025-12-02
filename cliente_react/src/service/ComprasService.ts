import axios from "./axiosInstance";
import { AxiosError } from "axios";

export async function getCompras() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/compras`;
        const { data: compras } = await axios.get(url);
        return compras || [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

type DetalleCompra = {
    id_producto: number;
    id_talla: number;
    cantidad_adquirida: number;
    precio_unitario_compra: number;
}

export async function crearCompra(rut_proveedor: number, detalles: DetalleCompra[]) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/compras/crear`;
        const { data: response } = await axios.post(url, {
            rut_proveedor: rut_proveedor,
            detalles: detalles
        });
        return { success: true, compraId: response.id_compra };
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 400) {
                return { success: false, error: "Datos inválidos para la compra" };
            }
            if (error.response?.status === 404) {
                return { success: false, error: "Proveedor no encontrado" };
            }
            if (error.response?.data?.message) {
                return { success: false, error: error.response.data.message };
            }
        }
        return { success: false, error: "Error al crear la compra" };
    }
}

export async function editarCompra(id_compra: number, rut_proveedor: number, detalles: DetalleCompra[]) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/compras/${id_compra}`;
        await axios.put(url, {
            rut_proveedor: rut_proveedor,
            detalles: detalles
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al editar la compra" };
    }
}

export async function eliminarCompra(id_compra: number) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/compras/${id_compra}`;
        await axios.delete(url);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al eliminar la compra" };
    }
}

// Función auxiliar para obtener productos
export async function getProductos() {
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
