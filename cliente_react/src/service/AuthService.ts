export interface UsuarioAuth {
    rut_usuario: string;
    nombre_usuario: string;
    rol_usuario: string;
}

const TOKEN_KEY = 'token';

export const AuthService = {
    // Guardar solo el token en sessionStorage (más seguro)
    guardarSesion: (_usuario: UsuarioAuth | any, token: string) => {
        try {
            // Solo guardar el token, no los datos del usuario
            // Los datos se obtendrán del backend verificando el token
            sessionStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            // Error handling
        }
    },

    // Obtener token
    obtenerToken: (): string | null => {
        return sessionStorage.getItem(TOKEN_KEY);
    },

    // Verificar si hay sesión activa
    tieneSesion: (): boolean => {
        const token = sessionStorage.getItem(TOKEN_KEY);
        return !!token;
    },

    // Limpiar sesión (logout)
    limpiarSesion: () => {
        sessionStorage.removeItem(TOKEN_KEY);
    },

    // Obtener información formateada del usuario
    obtenerInfoUsuario: (): string => {
        return "Usuario autenticado";
    }
};
