import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
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


