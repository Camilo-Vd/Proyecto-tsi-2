import axios from "./axiosInstance";
import { AxiosError } from "axios";
import { safeParse } from "valibot";
import { InventariosSchema } from "../types/inventario";

type FormData = {
    [k: string]: any;
}

export async function getInventarios() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/inventario`;
        const { data: inventarios } = await axios.get(url);
        const resultado = safeParse(InventariosSchema, inventarios);
        if (resultado.success) {
            return resultado.output;
        } else {
            throw new Error("Error de validación de datos");
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function agregarInventario(formData: FormData) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/inventario/crear`;
        await axios.post(url, {
            id_producto: parseInt(formData.id_producto),
            id_talla: parseInt(formData.id_talla),
            precio_unitario: parseInt(formData.precio_unitario),
            stock_actual: parseInt(formData.stock_actual)
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 409) {
                return { success: false, error: "Este producto con talla ya existe en el inventario" };
            }
            if (error.response?.status === 400) {
                return { success: false, error: "Todos los campos son obligatorios" };
            }
            if (error.response?.data?.message) {
                return { success: false, error: error.response.data.message };
            }
        }
        return { success: false, error: "Error al agregar al inventario" };
    }
}

export async function editarInventario(id_producto: number, id_talla: number, formData: FormData) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/inventario/${id_producto}/${id_talla}`;
        await axios.put(url, {
            precio_unitario: parseInt(formData.precio_unitario),
            stock_actual: parseInt(formData.stock_actual)
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al editar inventario" };
    }
}

export async function eliminarInventario(id_producto: number, id_talla: number) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/inventario/${id_producto}/${id_talla}`;
        await axios.delete(url);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al eliminar del inventario" };
    }
}
