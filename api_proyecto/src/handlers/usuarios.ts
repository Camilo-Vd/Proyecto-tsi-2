import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import Jwt from "jsonwebtoken"
import Usuario from "../models/Usuario" // Ajusta la ruta según la ubicación real del modelo
import { procesarRUTBackend } from "../utils/rutUtils"


//para el acceso al modelo de usuario para interactuar con  la tabla 
// const Usuario = db.Usuario

//clave secreta para firmar los tokens 
const JWT_SECRET = process.env.SECRET_KEY || process.env.JWT_SECRET || 'secret_key'

//1 manejador para inicio de sesion 
// endpoint: POST /api/usuarios/login
export const login = async (request: Request, response: Response) => {
    try {
        const { rut_usuario, contraseña } = request.body

        // Validación para que no estén vacíos
        if (!rut_usuario || !contraseña) {
            return response.status(400).json({ message: "rut_usuario y contraseña son obligatorios" })
        }

        // Validar y procesar el RUT
        const rutValidacion = procesarRUTBackend(rut_usuario);
        if (!rutValidacion.valido) {
            return response.status(400).json({ message: rutValidacion.error })
        }

        // Buscar el usuario por rut_usuario (ya validado y convertido a número)
        const usuario = await Usuario.findByPk(rutValidacion.rut);

        if (!usuario) {
            return response.status(401).json({ message: "credenciales incorrectas (usuario o contraseña)" })
        }

        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña)

        if (!contraseñaValida) {
            return response.status(401).json({ message: "credenciales incorrectas (usuario o contraseña)" })
        }

        // Si las credenciales son válidas, generamos un token JWT
        const token = Jwt.sign(
            { rut_usuario: usuario.rut_usuario, rol: usuario.rol_usuario },
            JWT_SECRET,
            { expiresIn: '1h' }
        )

        response.status(200).json({ message: "inicio de sesion exitoso", token })

    } catch (error) {
        console.error('error en login: ', error)
        response.status(500).json({ message: 'error en el servidor' })
    }
}



//2 manejar de para crear un nuevo usuario
// endpoint: POST /api/usuarios
export const crearUsuario = async (request: Request, response: Response) => {
    try {
        const { rut_usuario, nombre_usuario, contraseña, rol_usuario } = request.body

        //validacion para campos obligatorios
        if (!rut_usuario || !nombre_usuario || !contraseña || !rol_usuario) {
            return response.status(400).json({ message: 'rut, nombre, contraseña y rol son obligatorios' })
        }

        // Validar y procesar el RUT
        const rutValidacion = procesarRUTBackend(rut_usuario);
        if (!rutValidacion.valido) {
            return response.status(400).json({ message: rutValidacion.error })
        }

        //validar que la contraseña tenga al menos 6 caracteres
        if (contraseña.length < 6) {
            return response.status(400).json({ message: 'la contraseña debe tener al menos 6 caracteres' })
        }

        //verificar si el rut ya existe (usando el RUT numérico validado)
        const usuarioExiste = await Usuario.findByPk(rutValidacion.rut)
        if (usuarioExiste) {
            return response.status(409).json({ message: 'el rut ya existe' })
        }

        //verificar si el nombre de usuario ya existe
        const nombreUsuarioExsite = await Usuario.findOne({ where: { nombre_usuario } })
        if (nombreUsuarioExsite) {
            return response.status(409).json({ message: 'el nombre de usuario ya existe' })
        }

        //hasheamos la contraseña antes de guardarla en la base de datos
        const hasheoPassword = await bcrypt.hash(contraseña, 10)

        //crea el nuevo usuario en la base de datos
        await Usuario.create({
            rut_usuario: rutValidacion.rut,  // Usar el RUT numérico validado
            nombre_usuario,
            contraseña: hasheoPassword,
            rol_usuario
        })

        response.status(201).json({ message: 'usuario creado exitosamente' })

    } catch (error) {
        console.error('error al crear usuario: ', error)
        response.status(500).json({ message: 'error en el servidor' })
    }
}

//3 manejar para cambiar la contraseña (del propio usuario)
// Endpoint: PUT /api/usuarios/cambiar-contraseña
export const cambiarContraseña = async (request: Request, response: Response) => {
    try {
        const { rut_usuario, actualContraseña, nuevaContraseña } = request.body

        //validacion de los campos no esten blancos
        if (!rut_usuario || !actualContraseña || !nuevaContraseña) {
            return response.status(400).json({ message: 'todos los campos son obligatorios ' })
        }

        // Validar y procesar el RUT
        const rutValidacion = procesarRUTBackend(rut_usuario);
        if (!rutValidacion.valido) {
            return response.status(400).json({ message: rutValidacion.error })
        }

        //minimo de caracteres en la contraseña nueva al ser creada
        if (nuevaContraseña.length < 6) {
            return response.status(400).json({ message: 'la nueva contraseña debe tener 6 caracteres minimo' })
        }

        const usuario = await Usuario.findByPk(rutValidacion.rut)
        //validacion si existe el usuario con ese email
        if (!usuario) {
            return response.status(404).json({ message: 'usuario no encontrado' })
        }

        //verificar la contraseña actual
        const esContraseñaValida = await bcrypt.compare(actualContraseña, usuario.contraseña)
        if (!esContraseñaValida) {
            return response.status(401).json({ message: 'la contraseña actual es incorrecta' })
        }

        //hasheamos la nueva contraseña y la guardamos 
        const hasheoNuevaContraseña = await bcrypt.hash(nuevaContraseña, 10)
        usuario.contraseña = hasheoNuevaContraseña
        await usuario.save()

        response.status(200).json({ message: 'contraseña cambiada perfectamente' })

    } catch (error) {
        console.error('error en el cambiar la contraseña', error)
        response.status(500).json({ message: 'error en el servidor' })
    }
}

//4 manejador de cerrar sesion
// Endpoint POST /api/usuarios/salir
export const logout = async (request: Request, response: Response) => {
    try {
        response.status(200).json({
            message: "sesion cerrada exitosamente",

        })

    }
    catch (error) {
        console.error('error en el logout', error)
        response.status(500).json({ message: "error en el servidor" })
    }
}

