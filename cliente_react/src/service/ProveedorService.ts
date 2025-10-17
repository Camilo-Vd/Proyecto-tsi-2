import { safeParse } from "valibot";
import { ProveedorEditarSchema, ProveedoresSchema, ProveedorSchema } from "../types/proveedor";
import axios from "./axiosInstance";
import { AxiosError } from "axios";


export async function getProveedores() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/proveedores`;
        const { data: proveedores } = await axios.get(url);
        const resultado = safeParse(ProveedoresSchema, proveedores);
        if (resultado.success) {
            return resultado.output;
        } else {
            throw new Error("Error de validación de datos");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener proveedores");
    }
}

type ProveedorFormData = {
    [k: string]: FormDataEntryValue
}

export async function proveedorAñadir(formData: ProveedorFormData) {
    try {
        const resultado = safeParse(ProveedorSchema, formData);
        if (resultado.success) {
            const url = `${import.meta.env.VITE_API_URL}/proveedores/crear`;
            await axios.post(url, {
                rut_proveedor: resultado.output.rut_proveedor,
                nombre: resultado.output.nombre,
                contacto: resultado.output.contacto,
                direccion: resultado.output.direccion
            });
            return { success: true };
        } else {
            return { success: false, error: "Error de validación de datos" };
        }
    } catch (error) {        
        // Manejo de errores HTTP del backend
        if (error instanceof AxiosError && error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    return { success: false, error: data.message || "Todos los campos son obligatorios" };
                case 409:
                    return { success: false, error: data.message || "El proveedor con este RUT ya existe" };
                case 500:
                    return { success: false, error: data.message || "Error en el servidor" };
                default:
                    return { success: false, error: "Error inesperado del servidor" };
            }
        }
        
        return { success: false, error: "Error al añadir proveedor" };
    }
}

export async function proveedorEditar(formData: ProveedorFormData) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/proveedores/actualizar`;
        const resultado = safeParse(ProveedorEditarSchema, formData);
        if (resultado.success) {
            await axios.put(url, {
                rut_proveedor: resultado.output.rut_proveedor,
                nombre: resultado.output.nombre,
                contacto: resultado.output.contacto,
                direccion: resultado.output.direccion
            });
            return { success: true };
        } else {
            return { success: false, error: "Error de validación de datos" };
        }
    } catch (error) {
        // Manejo de errores HTTP del backend
        if (error instanceof AxiosError && error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    return { success: false, error: data.message || "RUT y al menos un campo son obligatorios" };
                case 404:
                    return { success: false, error: data.message || "Proveedor no encontrado" };
                case 500:
                    return { success: false, error: data.message || "Error en el servidor" };
                default:
                    return { success: false, error: "Error inesperado del servidor" };
            }
        }
        
        return { success: false, error: "Error al actualizar el proveedor" };
    }
}

export async function proveedorEliminar(rut_proveedor: string) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/proveedores/eliminar/${rut_proveedor}`;
        await axios.delete(url);
        return { success: true };
    } catch (error) {
        console.error(error);
        throw new Error("Error al eliminar proveedor");
    }
}
