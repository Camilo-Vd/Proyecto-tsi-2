import { useEffect, useState } from 'react';
import { UsuarioAuth } from '../service/AuthService';
import { obtenerUsuarioActual } from '../service/UsuarioService';
import { decodificarToken } from '../utils/tokenUtils';
import { formatearRUTInput } from '../utils/rutUtils';

export const useUsuarioAutenticado = () => {
    const [usuario, setUsuario] = useState<UsuarioAuth | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                // 1. Obtener token del sessionStorage
                const token = sessionStorage.getItem('token');
                if (!token) {
                    setUsuario(null);
                    setLoading(false);
                    return;
                }
                
                // 2. Decodificar token para datos iniciales (rápido)
                const decoded = decodificarToken(token);
                
                if (decoded && decoded.rut_usuario) {
                    // Mostrar datos del token inicialmente
                    const usuarioInicial: UsuarioAuth = {
                        rut_usuario: String(decoded.rut_usuario),
                        nombre_usuario: decoded.nombre_usuario || "Usuario",
                        rol_usuario: decoded.rol_usuario || decoded.rol || "Usuario"
                    };
                    setUsuario(usuarioInicial);
                }
                
                // 3. Luego obtener datos verificados del backend
                const resultado = await obtenerUsuarioActual();
                
                if ('data' in resultado && resultado.data) {
                    // El backend devuelve { message, usuario: {...} }
                    const usuarioDelBackend = resultado.data.usuario || resultado.data;
                    
                    const usuarioVerificado: UsuarioAuth = {
                        rut_usuario: formatearRUTInput(usuarioDelBackend.rut_usuario || String(decoded?.rut_usuario)),
                        nombre_usuario: usuarioDelBackend.nombre_usuario || decoded?.nombre_usuario || "Usuario",
                        rol_usuario: usuarioDelBackend.rol_usuario || decoded?.rol_usuario || decoded?.rol || "Usuario"
                    };
                    
                    setUsuario(usuarioVerificado);
                }
            } catch (error) {
                console.error('Error cargando usuario:', error);
                setUsuario(null);
            } finally {
                setLoading(false);
            }
        };

        cargarUsuario();
    }, []);

    return { usuario, loading };
};
