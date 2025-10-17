import axios from "./axiosInstance";
import { AxiosError } from "axios";
import { safeParse } from "valibot";
import { ClienteEditarSchema, ClienteSchema, ClientesSchema } from "../types/cliente";

export async function getClientes() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/clientes`;
        const { data: clientes } = await axios.get(url);
        const resultado = safeParse(ClientesSchema, clientes);
        if (resultado.success) {
            return resultado.output;
        } else {
            throw new Error("Error de validación de datos");
        }
    } catch (error) {
        console.log(error);
    }
}

type ClienteFormData = {
    [k: string]: FormDataEntryValue
}

export async function clienteAñadir(formData: ClienteFormData) {
    try {
        const resultado = safeParse(ClienteSchema, formData);
        if (resultado.success) {
            const url = `${import.meta.env.VITE_API_URL}/clientes/crear`;
            await axios.post(url, {
                rut_cliente: resultado.output.rut_cliente,
                nombre: resultado.output.nombre,
                contacto: resultado.output.contacto
            });
            return { success: true };
        } else {
            return { success: false, errors: resultado.issues.map(issue => issue.message) };
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            // Manejo de errores específicos del backend
            if (error.response?.status === 409) {
                return { success: false, errors: ["El cliente con este RUT ya existe"] };
            }
            if (error.response?.status === 400) {
                return { success: false, errors: ["Todos los campos son obligatorios"] };
            }
            if (error.response?.data?.message) {
                return { success: false, errors: [error.response.data.message] };
            }
        }
        return { success: false, errors: ["Error al crear el cliente"] };
    }
}

export async function clienteEditar(formData: ClienteFormData) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/clientes/actualizar`;
        const resultado = safeParse(ClienteEditarSchema, formData);
        if (resultado.success) {
            await axios.put(url, {
                rut_cliente: resultado.output.rut_cliente,
                nombre: resultado.output.nombre,
                contacto: resultado.output.contacto
            });
            return { success: true };
        } else {
            throw new Error("Error de validación de datos");
        }
    } catch (error) {
        return { success: false, error: "Error al actualizar el cliente" };
    }
}

export async function clienteEliminar(rut_cliente: string) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/clientes/eliminar/${rut_cliente}`;
        await axios.delete(url);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al eliminar el cliente" };
    }
}