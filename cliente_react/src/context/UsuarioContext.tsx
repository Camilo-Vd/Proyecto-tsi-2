import React, { createContext, useContext, useEffect, useState } from 'react';
import { UsuarioAuth } from '../service/AuthService';
import { obtenerUsuarioActual } from '../service/UsuarioService';
import { decodificarToken } from '../utils/tokenUtils';
import { formatearRUTInput } from '../utils/rutUtils';

interface UsuarioContextType {
    usuario: UsuarioAuth | null;
    loading: boolean;
    cerrarSesion: () => void;
    recargarUsuario: () => Promise<void>;
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

export const UsuarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [usuario, setUsuario] = useState<UsuarioAuth | null>(null);
    const [loading, setLoading] = useState(true);
    const [tokenActual, setTokenActual] = useState<string | null>(sessionStorage.getItem('token'));

    const cargarUsuario = async () => {
        try {
            setLoading(true);
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
                // Mostrar datos del token inmediatamente
                const usuarioInicial: UsuarioAuth = {
                    rut_usuario: String(decoded.rut_usuario),
                    nombre_usuario: decoded.nombre_usuario || "Usuario",
                    rol_usuario: decoded.rol_usuario || decoded.rol || "Usuario"
                };
                setUsuario(usuarioInicial);
                // NO esperar, dejar loading en false para renderizar inmediatamente
                setLoading(false);
            }
            
            // 3. Luego obtener datos verificados del backend (en background)
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
            setLoading(false);
        }
    };

    // Efecto para cargar usuario al montar o cuando el token cambia
    useEffect(() => {
        cargarUsuario();
    }, [tokenActual]);

    // Efecto para detectar cambios en sessionStorage en la misma pestaña
    useEffect(() => {
        // Usar un intervalo para detectar cambios en sessionStorage
        const intervalo = setInterval(() => {
            const tokenActualizado = sessionStorage.getItem('token');
            if (tokenActualizado !== tokenActual) {
                setTokenActual(tokenActualizado);
            }
        }, 100);

        return () => clearInterval(intervalo);
    }, [tokenActual]);

    const cerrarSesion = () => {
        // Limpiar sessionStorage
        sessionStorage.removeItem('token');
        // Actualizar estado del Context
        setUsuario(null);
        setLoading(false);
    };

    const recargarUsuario = async () => {
        setLoading(true);
        await cargarUsuario();
    };

    return (
        <UsuarioContext.Provider value={{ usuario, loading, cerrarSesion, recargarUsuario }}>
            {children}
        </UsuarioContext.Provider>
    );
};

export const useUsuario = () => {
    const context = useContext(UsuarioContext);
    if (context === undefined) {
        throw new Error('useUsuario debe ser usado dentro de UsuarioProvider');
    }
    return context;
};
