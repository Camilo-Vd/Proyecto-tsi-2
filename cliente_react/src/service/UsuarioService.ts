import axios from "axios";

export type Usuario = {
    rut_usuario: number;
    nombre_usuario: string;
    correo_usuario: string;
    activo: boolean;
}

export const loginUsuario = async (data: any) => {
    try {
        const url = `${import.meta.env.VITE_API_URL}/usuarios/login`;
        const response = await axios.post(url, { correo_usuario: data.correo, contraseña_usuario: data.contraseña });
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: error.response?.data?.message || "Error al iniciar sesión" };
    }
};

export const usuarioRegistrar = async (data: any) => {
    try {
        const url = `${import.meta.env.VITE_API_URL}/usuarios/registrar`;
        const response = await axios.post(url, data);
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: error.response?.data?.message || "Error al registrar usuario" };
    }
};
