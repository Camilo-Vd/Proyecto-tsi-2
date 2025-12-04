import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import Inventario from '../models/Inventario';
import db from '../config/db';
import bcrypt from 'bcryptjs';



export const cambiarContrasenaConfiguracion = async (request: Request, response: Response) => {
    try {
        const rut_usuario = (request as any).user?.rut_usuario;
        const { password_actual, password_nueva } = request.body;

        // Validar campos
        if (!password_actual || !password_nueva) {
            return response.status(400).json({ message: "Debe ingresar ambas contraseñas" });
        }

        // Buscar usuario
        const usuario = await Usuario.findByPk(rut_usuario);
        if (!usuario) {
            return response.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar contraseña actual
        const passwordCorrecta = await bcrypt.compare(password_actual, usuario.contraseña);
        if (!passwordCorrecta) {
            return response.status(401).json({ message: "La contraseña actual es incorrecta" });
        }

        // Encriptar nueva contraseña
        const hashedPassword = await bcrypt.hash(password_nueva, 10);

        // Guardar nueva contraseña
        usuario.contraseña = hashedPassword;
        await usuario.save();

        return response.status(200).json({ message: "Contraseña actualizada exitosamente" });

    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        return response.status(500).json({ message: "Error interno del servidor" });
    }
};

/**
 * Actualiza todos los registros de inventario que no tengan stock_critico definido
 * Establece stock_critico en 5 por defecto
 */
export const inicializarStockCritico = async (request: Request, response: Response) => {
    try {
        // Actualizar registros donde stock_critico es NULL o 0
        await db.query(
            `UPDATE inventario SET stock_critico = 5 WHERE stock_critico IS NULL OR stock_critico = 0`
        );

        // Contar registros actualizados
        const result = await db.query(
            `SELECT COUNT(*) as total FROM inventario WHERE stock_critico = 5`
        );

        const total = (result[0] as any)[0]?.total || 0;

        return response.status(200).json({ 
            message: "Stock crítico inicializado correctamente",
            registros_con_stock_critico_5: total,
            nota: "Todos los inventarios ahora tienen un stock crítico definido"
        });

    } catch (error) {
        console.error("Error al inicializar stock crítico:", error);
        return response.status(500).json({ message: "Error interno del servidor" });
    }
};
