import axiosInstance from "./axiosInstance";
import { safeParse } from "valibot";
import { UsuariosServerSchema } from "../types/usuario";
import { AuthService } from "./AuthService";
import { decodificarToken } from "../utils/tokenUtils";
import { calcularDigitoVerificador } from "../utils/rutUtils";
import { handleAxiosError, extractArrayResponse, ApiResponse } from "../utils/apiErrorHandler";

type FormData = {
    [k: string]: any;
}

export async function getUsuarios(): Promise<ApiResponse<any[]>> {
    try {
        const { data: response } = await axiosInstance.get("/usuarios");
        
        const usuarios = extractArrayResponse(response);
        const resultado = safeParse(UsuariosServerSchema, usuarios);
        
        if (resultado.success) {
            return { success: true, data: resultado.output };
        }

        console.error("Error de validación:", resultado.issues);
        if (usuarios.length > 0) {
            return { success: true, data: usuarios };
        }

        return { success: true, data: [] };
    } catch (error) {
        return handleAxiosError(error, "Error al obtener usuarios");
    }
}

export async function usuarioRegistrar(formData: FormData): Promise<ApiResponse<any>> {
    try {
        const response = await axiosInstance.post("/usuarios", {
            rut_usuario: formData.rut_usuario,
            nombre_usuario: formData.nombre_usuario,
            contraseña: formData.contraseña,
            rol_usuario: formData.rol_usuario
        });

        return { success: true, data: response.data };
    } catch (error) {
        return handleAxiosError(error, "Error al registrar usuario");
    }
}

export async function usuarioEliminar(rut: string): Promise<ApiResponse<void>> {
    try {
        await axiosInstance.delete(`/usuarios/${rut}`);
        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al eliminar usuario");
    }
}

export async function deshabilitarUsuario(rut: string): Promise<ApiResponse<void>> {
    try {
        await axiosInstance.put(`/usuarios/${rut}/deshabilitar`, {});
        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al deshabilitar usuario");
    }
}

export async function reactivarUsuario(rut: string): Promise<ApiResponse<void>> {
    try {
        await axiosInstance.put(`/usuarios/${rut}/reactivar`, {});
        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al reactivar usuario");
    }
}

export async function cambiarContraseña(rut_usuario: string, actualContraseña: string, nuevaContraseña: string): Promise<ApiResponse<void>> {
    try {
        await axiosInstance.put("/usuarios/cambiar-contrasena", {
            rut_usuario,
            actualContraseña,
            nuevaContraseña
        });
        return { success: true };
    } catch (error) {
        return handleAxiosError(error, "Error al cambiar contraseña");
    }
}

export async function getUsuarioPorRUT(rut: string): Promise<ApiResponse<any>> {
    try {
        const rutLimpio = String(rut).replace(/\D/g, "");
        
        let rutConDV = rutLimpio;
        if (rutLimpio.length === 8) {
            const dv = calcularDigitoVerificador(parseInt(rutLimpio));
            rutConDV = rutLimpio + dv;
        } else if (rutLimpio.length === 9) {
            rutConDV = rutLimpio;
        }
        
        const { data } = await axiosInstance.get(`/usuarios/${rutConDV}`);
        return { success: true, data };
    } catch (error) {
        return handleAxiosError(error, "Usuario no encontrado");
    }
}

export async function loginUsuario(formData: FormData): Promise<ApiResponse<void>> {
    try {
        const url = `${import.meta.env.VITE_API_URL}/usuarios/login`;
        
        const response = await axiosInstance.post(url, {
            rut_usuario: formData.rut_usuario,
            contraseña: formData.contraseña
        });

        if (response.data.token) {
            AuthService.guardarSesion({}, response.data.token);
            return { success: true };
        }

        return {
            success: false,
            error: "No se recibió token de autenticación",
            code: "NO_TOKEN",
        };
    } catch (error) {
        return handleAxiosError(error, "Usuario y/o contraseña incorrectos");
    }
}

// Obtener usuario actual decodificando el token y validando con backend
export async function obtenerUsuarioActual(): Promise<ApiResponse<any>> {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                error: "No hay sesión activa",
                code: "NO_SESSION",
            };
        }
        
        const decoded = decodificarToken(token);
        if (!decoded?.rut_usuario) {
            return {
                success: false,
                error: "Token inválido",
                code: "INVALID_TOKEN",
            };
        }
        
        return await getUsuarioPorRUT(decoded.rut_usuario);
    } catch (error) {
        return handleAxiosError(error, "Error obteniendo usuario actual");
    }
}