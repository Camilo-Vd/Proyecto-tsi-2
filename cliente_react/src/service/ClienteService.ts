import axios from "./axiosInstance";
import { safeParse } from "valibot";
import { ClienteEditarSchema, ClienteSchema, ClientesServerSchema } from "../types/cliente";
import { validarRUTFormulario } from "../utils/rutUtils";
import { handleAxiosError, extractArrayResponse, ApiResponse } from "../utils/apiErrorHandler";

export async function getClientes(filtro: 'activos' | 'inactivos' | 'todos' = 'activos'): Promise<ApiResponse<any[]>> {
    try {
        const url = `${import.meta.env.VITE_API_URL}/clientes?filtro=${filtro}`;
        const { data } = await axios.get(url);
        
        const clientes = extractArrayResponse(data);
        const resultado = safeParse(ClientesServerSchema, clientes);
        
        if (resultado.success) {
            return { success: true, data: resultado.output };
        }

        console.error("Error de validación:", resultado.issues);
        // Si la validación falla pero hay datos, retornar como están
        if (clientes.length > 0) {
            return { success: true, data: clientes };
        }

        return { success: true, data: [] };
    } catch (error) {
        return handleAxiosError(error, "Error al obtener clientes");
    }
}

type ClienteFormData = {
    [k: string]: FormDataEntryValue
}

export async function clienteAñadir(formData: ClienteFormData): Promise<ApiResponse<void>> {
    try {
        // Validar esquema básico
        const resultado = safeParse(ClienteSchema, formData);
        if (!resultado.success) {
            return {
                success: false,
                error: resultado.issues.map(issue => issue.message).join(", "),
                code: "VALIDATION_ERROR",
            };
        }

        // Validar RUT
        const rutValidacion = validarRUTFormulario(resultado.output.rut_cliente);
        if (!rutValidacion.valido) {
            return {
                success: false,
                error: rutValidacion.error || "RUT inválido",
                code: "INVALID_RUT",
            };
        }

        const url = `${import.meta.env.VITE_API_URL}/clientes/crear`;
        await axios.post(url, {
            rut_cliente: resultado.output.rut_cliente,
            nombre_cliente: resultado.output.nombre_cliente,
            contacto_cliente: resultado.output.contacto_cliente
        });

        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al crear el cliente");
    }
}

export async function clienteEditar(formData: ClienteFormData): Promise<ApiResponse<void>> {
    try {
        // Validar esquema básico
        const resultado = safeParse(ClienteEditarSchema, formData);
        if (!resultado.success) {
            return {
                success: false,
                error: resultado.issues.map(issue => issue.message).join(", "),
                code: "VALIDATION_ERROR",
            };
        }

        // Validar RUT
        const rutValidacion = validarRUTFormulario(resultado.output.rut_cliente);
        if (!rutValidacion.valido) {
            return {
                success: false,
                error: rutValidacion.error || "RUT inválido",
                code: "INVALID_RUT",
            };
        }

        const url = `${import.meta.env.VITE_API_URL}/clientes/actualizar`;
        await axios.put(url, {
            rut_cliente: resultado.output.rut_cliente,
            nombre_cliente: resultado.output.nombre_cliente,
            contacto_cliente: resultado.output.contacto_cliente
        });

        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al actualizar el cliente");
    }
}

export async function clienteEliminar(rut_cliente: string): Promise<ApiResponse<void>> {
    try {
        const url = `${import.meta.env.VITE_API_URL}/clientes/eliminar/${rut_cliente}`;
        await axios.delete(url);
        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al eliminar el cliente");
    }
}

export async function clienteDeshabilitarReq(rut_cliente: string): Promise<ApiResponse<void>> {
    try {
        const url = `${import.meta.env.VITE_API_URL}/clientes/${rut_cliente}/deshabilitar`;
        await axios.put(url);
        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al deshabilitar el cliente");
    }
}

export async function clienteReactivar(rut_cliente: string): Promise<ApiResponse<void>> {
    try {
        const url = `${import.meta.env.VITE_API_URL}/clientes/${rut_cliente}/reactivar`;
        await axios.put(url);
        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al reactivar el cliente");
    }
}