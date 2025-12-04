import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../service/AuthService';
import { decodificarToken } from '../utils/tokenUtils';

/**
 * Hook que valida periódicamente si el token está expirado
 * Si expira, limpia la sesión y redirige a login
 */
export const useTokenValidation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Función para validar token
        const validarToken = () => {
            const token = sessionStorage.getItem('token');
            
            if (!token) {
                // Si no hay token, ir a login
                navigate('/login');
                return;
            }

            try {
                // Decodificar token para obtener exp (tiempo de expiración)
                const decoded = decodificarToken(token);
                
                if (!decoded) {
                    // Token inválido
                    AuthService.limpiarSesion();
                    navigate('/login');
                    return;
                }

                // Verificar si el token está expirado
                if (decoded.exp) {
                    const ahora = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
                    const tiempoRestante = decoded.exp - ahora;

                    if (tiempoRestante <= 0) {
                        // Token expirado
                        AuthService.limpiarSesion();
                        navigate('/login');
                    } else if (tiempoRestante <= 300) {
                        // Token vence en 5 minutos o menos
                        console.warn(`Token vence en ${tiempoRestante} segundos`);
                    }
                }
            } catch (error) {
                // Error al decodificar
                AuthService.limpiarSesion();
                navigate('/login');
            }
        };

        // Validar token al montar
        validarToken();

        // Validar token cada 30 segundos
        const intervalo = setInterval(validarToken, 30000);

        // Limpiar intervalo al desmontar
        return () => clearInterval(intervalo);
    }, [navigate]);
};
