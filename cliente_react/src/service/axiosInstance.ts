import axios from "axios";
import { AuthService } from "./AuthService";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

axiosInstance.interceptors.request.use(config=>{
    const token = sessionStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Interceptor de respuesta para detectar token expirado
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // Si el error es 401 (No autorizado) y hay un token guardado, el token expiró
        if (error.response?.status === 401) {
            const token = sessionStorage.getItem('token');
            // Solo redirigir si hay un token (significa que el token expiró)
            // Si no hay token, el error 401 es por credenciales incorrectas en login
            if (token) {
                // Limpiar sesión
                AuthService.limpiarSesion();
                
                // Redirigir a login
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance