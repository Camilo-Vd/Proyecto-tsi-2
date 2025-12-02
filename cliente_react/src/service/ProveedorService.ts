import { safeParse } from "valibot";
import { ProveedorEditarSchema, ProveedoresServerSchema, ProveedorSchema } from "../types/proveedor";
import axios from "./axiosInstance";
import { AxiosError } from "axios";
import { validarRUTFormulario } from "../utils/rutUtils";


export async function getProveedores() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/proveedores`;
        const { data: proveedores } = await axios.get(url);
        const resultado = safeParse(ProveedoresServerSchema, proveedores);
        if (resultado.success) {
            return resultado.output;
        } else {
            console.error("Error de validación de datos", resultado.issues);
            return [];
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}

type ProveedorFormData = {
    [k: string]: FormDataEntryValue
}

export async function proveedorAñadir(formData: ProveedorFormData) {
    try {
        // Validar esquema básico primero
        const resultado = safeParse(ProveedorSchema, formData);
        if (!resultado.success) {
            return { success: false, errors: resultado.issues.map(issue => issue.message) };
        }

        // Validar RUT específicamente
        const rutValidacion = validarRUTFormulario(resultado.output.rut_proveedor);
        if (!rutValidacion.valido) {
            return { success: false, errors: [rutValidacion.error || 'RUT inválido'] };
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
        // Manejo de errores HTTP del backend
        if (error instanceof AxiosError) {
            // Manejo de errores específicos del backend
            if (error.response?.status === 409) {
                return { success: false, errors: ["El proveedor con este RUT ya existe"] };
            }
            if (error.response?.status === 400) {
                return { success: false, errors: ["Todos los campos son obligatorios"] };
            }
            if (error.response?.data?.message) {
                return { success: false, errors: [error.response.data.message] };
            }
        }
        return { success: false, errors: ["Error al crear el proveedor"] };
    }
}

export async function proveedorEditar(formData: ProveedorFormData) {
    try {
        // Validar esquema básico primero
        const resultado = safeParse(ProveedorEditarSchema, formData);
        if (!resultado.success) {
            return { success: false, error: "Datos del formulario inválidos" };
        }

        // Validar RUT específicamente
        const rutValidacion = validarRUTFormulario(resultado.output.rut_proveedor);
        if (!rutValidacion.valido) {
            return { success: false, error: rutValidacion.error || 'RUT inválido' };
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
        return { success: false, error: "Error al eliminar proveedor" };
    }
}
