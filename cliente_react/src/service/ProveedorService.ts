import { safeParse } from "valibot";
import { ProveedorEditarSchema, ProveedoresServerSchema, ProveedorSchema } from "../types/proveedor";
import axios from "./axiosInstance";
import { validarRUTFormulario } from "../utils/rutUtils";
import { handleAxiosError, extractArrayResponse, ApiResponse } from "../utils/apiErrorHandler";


export async function getProveedores(filtro: 'activos' | 'inactivos' | 'todos' = 'activos'): Promise<ApiResponse<any[]>> {
    try {
        const url = `${import.meta.env.VITE_API_URL}/proveedores?filtro=${filtro}`;
        const { data } = await axios.get(url);
        
        const proveedores = extractArrayResponse(data);
        const resultado = safeParse(ProveedoresServerSchema, proveedores);
        
        if (resultado.success) {
            return { success: true, data: resultado.output };
        }

        console.error("Error de validación:", resultado.issues);
        if (proveedores.length > 0) {
            return { success: true, data: proveedores };
        }

        return { success: true, data: [] };
    } catch (error) {
        return handleAxiosError(error, "Error al obtener proveedores");
    }
}

type ProveedorFormData = {
    [k: string]: FormDataEntryValue
}

export async function proveedorAñadir(formData: ProveedorFormData): Promise<ApiResponse<void>> {
    try {
        const resultado = safeParse(ProveedorSchema, formData);
        if (!resultado.success) {
            return {
                success: false,
                error: resultado.issues.map(issue => issue.message).join(", "),
                code: "VALIDATION_ERROR",
            };
        }

        const rutValidacion = validarRUTFormulario(resultado.output.rut_proveedor);
        if (!rutValidacion.valido) {
            return {
                success: false,
                error: rutValidacion.error || "RUT inválido",
                code: "INVALID_RUT",
            };
        }

        const url = `${import.meta.env.VITE_API_URL}/proveedores/crear`;
        await axios.post(url, {
            rut_proveedor: resultado.output.rut_proveedor,
            nombre_proveedor: resultado.output.nombre_proveedor,
            contacto_proveedor: resultado.output.contacto_proveedor,
            direccion_proveedor: resultado.output.direccion_proveedor
        });

        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al crear el proveedor");
    }
}

export async function proveedorEditar(formData: ProveedorFormData): Promise<ApiResponse<void>> {
    try {
        const resultado = safeParse(ProveedorEditarSchema, formData);
        if (!resultado.success) {
            return {
                success: false,
                error: resultado.issues.map(issue => issue.message).join(", "),
                code: "VALIDATION_ERROR",
            };
        }

        const rutValidacion = validarRUTFormulario(resultado.output.rut_proveedor);
        if (!rutValidacion.valido) {
            return {
                success: false,
                error: rutValidacion.error || "RUT inválido",
                code: "INVALID_RUT",
            };
        }

        const url = `${import.meta.env.VITE_API_URL}/proveedores/actualizar`;
        await axios.put(url, {
            rut_proveedor: resultado.output.rut_proveedor,
            nombre_proveedor: resultado.output.nombre_proveedor,
            contacto_proveedor: resultado.output.contacto_proveedor,
            direccion_proveedor: resultado.output.direccion_proveedor
        });

        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al actualizar el proveedor");
    }
}

export async function proveedorEliminar(rut_proveedor: string): Promise<ApiResponse<void>> {
    try {
        const url = `${import.meta.env.VITE_API_URL}/proveedores/eliminar/${rut_proveedor}`;
        await axios.delete(url);
        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al eliminar proveedor");
    }
}

export async function proveedorDeshabilitarReq(rut_proveedor: string): Promise<ApiResponse<void>> {
    try {
        const url = `${import.meta.env.VITE_API_URL}/proveedores/${rut_proveedor}/deshabilitar`;
        await axios.put(url);
        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al deshabilitar proveedor");
    }
}

export async function proveedorReactivar(rut_proveedor: string): Promise<ApiResponse<void>> {
    try {
        const url = `${import.meta.env.VITE_API_URL}/proveedores/${rut_proveedor}/reactivar`;
        await axios.put(url);
        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al reactivar proveedor");
    }
}