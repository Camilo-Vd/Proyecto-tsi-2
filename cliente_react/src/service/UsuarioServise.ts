import { safeParse } from "valibot";
import { LoginFormSchema, UsuarioSchema } from "../types/usuario";
import axios from "./axiosInstance";

type UsuarioDataForm = {
    [k: string]: FormDataEntryValue
}

export async function loginUsuario(formData: UsuarioDataForm) {
    try {
        const resultado = safeParse(LoginFormSchema, formData);
        if (resultado.success) {
            const url = `${import.meta.env.VITE_API_URL}/usuarios/login`
            const { data } = await axios.post(url, {
                rut_usuario: formData.rut_usuario,
                contraseña: formData.contraseña
            })
            localStorage.setItem('token', data.token)
            return { success: true };
        } else {
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
                error: 'Datos del formulario no validos',
                detalleErrores: detalleErrores,
            };
        }
    } catch (error) {
        return {
            success: false,
            error: "Usuario y/o contraseña incorrectos",
        };
    }
}

export async function usuarioRegistrar(formData: UsuarioDataForm) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/usuarios`
        const resultado = safeParse(UsuarioSchema, formData);
        if (resultado.success) {
            await axios.post(url, {
                rut_usuario: resultado.output.rut_usuario,
                nombre_usuario: resultado.output.nombre_usuario,
                contraseña: resultado.output.contraseña,
                rol: resultado.output.rol
            })
            return { success: true };
        } else {
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
                error: 'Datos del formulario no validos',
                detalleErrores: detalleErrores,
            };
        }
        
    } catch (error) {
        console.error(error);
        throw new Error("Error al registrar usuario");
    }
}