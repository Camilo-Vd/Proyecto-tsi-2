import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware para verificar que el usuario está autenticado
 */
export const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
        return response.status(401).json({ message: "Token no proporcionado" });
    }

    try {
        const JWT_SECRET = process.env.SECRET_KEY || process.env.JWT_SECRET || 'secret_key';
        const decoded: any = jwt.verify(token, JWT_SECRET);

        (request as any).user = {
            rut_usuario: decoded.rut_usuario,
            rol: decoded.rol_usuario || decoded.rol
        };

        next();
    } catch (error) {
        return response.status(401).json({ message: "Token inválido" });
    }
};

/**
 * Middleware para verificar que el usuario tiene un rol específico
 * @param rolesPermitidos Array de roles permitidos (ej: ["Administrador"])
 */
export const requireRole = (rolesPermitidos: string[]) => {
    return (request: Request, response: Response, next: NextFunction) => {
        const token = request.headers.authorization?.split(" ")[1];

        if (!token) {
            return response.status(401).json({ message: "Token no proporcionado" });
        }

        try {
            const JWT_SECRET = process.env.SECRET_KEY || process.env.JWT_SECRET || 'secret_key';
            const decoded: any = jwt.verify(token, JWT_SECRET);

            const rolUsuario = decoded.rol_usuario || decoded.rol;

            // Verificar que el usuario tenga uno de los roles permitidos
            if (!rolesPermitidos.includes(rolUsuario)) {
                return response.status(403).json({ 
                    message: `Acceso denegado. Se requiere uno de estos roles: ${rolesPermitidos.join(", ")}` 
                });
            }

            (request as any).user = {
                rut_usuario: decoded.rut_usuario,
                rol: rolUsuario
            };

            next();
        } catch (error) {
            return response.status(401).json({ message: "Token inválido o expirado" });
        }
    };
};

/**
 * Middleware solo para Administrador
 */
export const requireAdmin = requireRole(["Administrador"]);

