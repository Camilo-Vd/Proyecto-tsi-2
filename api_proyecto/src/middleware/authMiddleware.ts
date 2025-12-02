import jwt from "jsonwebtoken";

export const authMiddleware = (request, response, next) => {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
        return response.status(401).json({ message: "Token no proporcionado" });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

        request.user = {
            rut_usuario: decoded.rut_usuario,
            rol: decoded.rol
        };

        next();
    } catch (error) {
        return response.status(401).json({ message: "Token inválido" });
    }
};
