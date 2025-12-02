import { request, Request, Response } from "express";
import Proveedor from "../models/Proveedor";
import { procesarRUTBackend } from "../utils/rutUtils";



export const obtenerProveedores = async (request: Request, response: Response) => {
    try {
        const proveedores = await Proveedor.findAll();
        response.status(200).json(proveedores)
    }
    catch (error) {
        console.error("error al obtener proveedores:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}

export const obtenerProveedoresPorRut = async (request: Request, response: Response) => {
    try {
        const { rut } = request.params; // Se espera que se pase como parámetro en la URL

        if (!rut) {
            return response.status(400).json({ message: 'El RUT es obligatorio' });
        }

        // Validar y procesar el RUT del parámetro
        const rutValidacion = procesarRUTBackend(rut);
        if (!rutValidacion.valido) {
            return response.status(400).json({ message: rutValidacion.error })
        }

        const proveedor = await Proveedor.findByPk(rutValidacion.rut);

        if (!proveedor) {
            return response.status(404).json({ message: 'Proveedor no encontrado' });
        }

        response.status(200).json(proveedor);

    }
    catch (error) {
        console.error("error al obtener proveedor por rut:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}

export const crearProveedor = async (request: Request, response: Response) => {
    try {
        const { rut_proveedor, nombre_proveedor, contacto_proveedor, direccion_proveedor } = request.body;

        // Validación de campos obligatorios
        if (!rut_proveedor || !nombre_proveedor || !contacto_proveedor || !direccion_proveedor) {
            return response.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Validar y procesar el RUT
        const rutValidacion = procesarRUTBackend(rut_proveedor);
        if (!rutValidacion.valido) {
            return response.status(400).json({ message: rutValidacion.error })
        }

        // Verificar si el proveedor ya existe (usando RUT numérico validado)
        const proveedorExistente = await Proveedor.findByPk(rutValidacion.rut);
        if (proveedorExistente) {
            return response.status(409).json({ message: 'El proveedor con este RUT ya existe' });
        }

        // Crear el proveedor
        const nuevoProveedor = await Proveedor.create({
            rut_proveedor: rutValidacion.rut,  // Usar el RUT numérico validado
            nombre_proveedor,
            contacto_proveedor,
            direccion_proveedor
        });

        response.status(201).json({ message: 'Proveedor creado exitosamente', proveedor: nuevoProveedor });

    }
    catch (error) {
        console.error("error al crear proveedor:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}

export const actualizarProveedor = async (request: Request, response: Response) => {
    try {
        const { rut_proveedor, nombre_proveedor, contacto_proveedor, direccion_proveedor } = request.body;

        // Validación de campos obligatorios
        if (!rut_proveedor || (!contacto_proveedor && !direccion_proveedor && !nombre_proveedor)) {
            return response.status(400).json({ message: 'RUT y al menos un campo a modificar (nombre_proveedor, contacto o dirección) son obligatorios' });
        }

        // Validar y procesar el RUT
        const rutValidacion = procesarRUTBackend(rut_proveedor);
        if (!rutValidacion.valido) {
            return response.status(400).json({ message: rutValidacion.error })
        }

        // Buscar el proveedor por su RUT (usando RUT numérico validado)
        const proveedor = await Proveedor.findByPk(rutValidacion.rut);
        if (!proveedor) {
            return response.status(404).json({ message: 'Proveedor no encontrado' });
        }

        // Actualizar los campos
        if (contacto_proveedor) proveedor.contacto_proveedor = contacto_proveedor;
        if (direccion_proveedor) proveedor.direccion_proveedor = direccion_proveedor;
        if (nombre_proveedor) proveedor.nombre_proveedor = nombre_proveedor;
        await proveedor.save();

        response.status(200).json({ message: 'Proveedor actualizado exitosamente', proveedor });

    }
    catch (error) {
        console.error("error al actualizar proveedor:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}


export const eliminarProveedor = async (request: Request, response: Response) => {
    try {
        const { rut_proveedor } = request.params;

        // Validación de campo obligatorio
        if (!rut_proveedor) {
            return response.status(400).json({ message: 'El RUT del proveedor es obligatorio' });
        }

        // Validar y procesar el RUT
        const rutValidacion = procesarRUTBackend(rut_proveedor);
        if (!rutValidacion.valido) {
            return response.status(400).json({ message: rutValidacion.error })
        }

        // Buscar el proveedor por su RUT (usando RUT numérico validado)
        const proveedor = await Proveedor.findByPk(rutValidacion.rut);
        if (!proveedor) {
            return response.status(404).json({ message: 'Proveedor no encontrado' });
        }

        // Eliminar el proveedor
        await proveedor.destroy();

        response.status(200).json({ message: "proveedor eliminado exitosamente" })

    }
    catch (error) {
        console.error("error al eliminar proveedor:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}
