import { safeParse } from "valibot";
import { LoginFormSchema, UsuarioSchema } from "../types/usuario";
import axios from "./axiosInstance";
import { validarRUTFormulario } from "../utils/rutUtils";

type UsuarioDataForm = {
    [k: string]: FormDataEntryValue
}

export async function loginUsuario(formData: UsuarioDataForm) {
    try {
        // Validar esquema básico primero
        const resultado = safeParse(LoginFormSchema, formData);
        if (!resultado.success) {
            const detalleErrores: Record<string, string[]> = {}
            for (const issue of resultado.issues) {
                const campo = issue.path![0].key as string
                if (!detalleErrores[campo]) {
                    detalleErrores[campo] = []
                }
                detalleErrores[campo].push(issue.message)
            }
            return {
                success: false,
                error: 'Datos del formulario no válidos',
                detalleErrores: detalleErrores,
            };
        }

        // Validar RUT específicamente
        const rutValidacion = validarRUTFormulario(resultado.output.rut_usuario);
        if (!rutValidacion.valido) {
            return {
                success: false,
                error: rutValidacion.error || 'RUT inválido'
            };
        }

        const url = `${import.meta.env.VITE_API_URL}/usuarios/login`
        const { data } = await axios.post(url, {
            rut_usuario: formData.rut_usuario,
            contraseña: formData.contraseña
        })
        localStorage.setItem('token', data.token)
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: "Usuario y/o contraseña incorrectos",
        };
    }
}

export async function usuarioRegistrar(formData: UsuarioDataForm) {
    try {
        // Validar esquema básico primero
        const resultado = safeParse(UsuarioSchema, formData);
        if (!resultado.success) {
            const detalleErrores: Record<string, string[]> = {}
            for (const issue of resultado.issues) {
                const campo = issue.path![0].key as string
                if (!detalleErrores[campo]) {
                    detalleErrores[campo] = []
                }
                detalleErrores[campo].push(issue.message)
            }
            return {
                success: false,
                error: 'Datos del formulario no válidos',
                detalleErrores: detalleErrores,
            };
        }

        // Validar RUT específicamente
        const rutValidacion = validarRUTFormulario(resultado.output.rut_usuario);
        if (!rutValidacion.valido) {
            return {
                success: false,
                error: rutValidacion.error || 'RUT inválido'
            };
        }

        const url = `${import.meta.env.VITE_API_URL}/usuarios`
        await axios.post(url, {
            rut_usuario: resultado.output.rut_usuario,
            nombre_usuario: resultado.output.nombre_usuario,
            contraseña: resultado.output.contraseña,
            rol_usuario: resultado.output.rol_usuario
        })
        return { success: true };
        
    } catch (error) {
        console.error(error);
        return { success: false, error: "Error al registrar usuario" };
    }
}