import axios from "./axiosInstance";
import { AxiosError } from "axios";
import { safeParse } from "valibot";
import { ClienteEditarSchema, ClienteSchema, ClientesServerSchema } from "../types/cliente";
import { validarRUTFormulario } from "../utils/rutUtils";

export async function getClientes() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/clientes`;
        const { data: clientes } = await axios.get(url);
        // Usar esquema del servidor que no valida RUT
        const resultado = safeParse(ClientesServerSchema, clientes);        
        if (resultado.success) {
            return resultado.output;
        } else {
            console.log("Data: ", resultado.output);
            console.error("Error de validación de datos", resultado.issues);
            return []; // Retorna array vacío en caso de error de validación
        }
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        return []; // Siempre retorna un array para evitar undefined
    }
}

type ClienteFormData = {
    [k: string]: FormDataEntryValue
}

export async function clienteAñadir(formData: ClienteFormData) {
    try {
        // Validar esquema básico primero
        const resultado = safeParse(ClienteSchema, formData);
        if (!resultado.success) {
            return { success: false, errors: resultado.issues.map(issue => issue.message) };
        }

        // Validar RUT específicamente
        const rutValidacion = validarRUTFormulario(resultado.output.rut_cliente);
        if (!rutValidacion.valido) {
            return { success: false, errors: [rutValidacion.error || 'RUT inválido'] };
        }

        const url = `${import.meta.env.VITE_API_URL}/clientes/crear`;
        await axios.post(url, {
            rut_cliente: resultado.output.rut_cliente, // El backend procesará el RUT
            nombre_cliente: resultado.output.nombre_cliente,
            contacto_cliente: resultado.output.contacto_cliente
        });
        return { success: true };
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
        // Validar esquema básico primero
        const resultado = safeParse(ClienteEditarSchema, formData);
        if (!resultado.success) {
            return { success: false, error: "Datos del formulario inválidos" };
        }

        // Validar RUT específicamente
        const rutValidacion = validarRUTFormulario(resultado.output.rut_cliente);
        if (!rutValidacion.valido) {
            return { success: false, error: rutValidacion.error || 'RUT inválido' };
        }

            const url = `${import.meta.env.VITE_API_URL}/clientes/actualizar`;
            await axios.put(url, {
                rut_cliente: resultado.output.rut_cliente,
                nombre_cliente: resultado.output.nombre_cliente,
                contacto_cliente: resultado.output.contacto_cliente
            });
        return { success: true };
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