import { request, Request, Response } from "express";
import Proveedor from "../models/Proveedor";



export const obtenerProveedores = async (request: Request, response: Response) => {
    try {
        const proveedores = await Proveedor.findAll()
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

        const proveedor = await Proveedor.findByPk(rut);

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
        const { rut_proveedor, nombre, contacto, direccion } = request.body;

        // Validación de campos obligatorios
        if (!rut_proveedor || !nombre || !contacto || !direccion) {
            return response.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Verificar si el proveedor ya existe
        const proveedorExistente = await Proveedor.findByPk(rut_proveedor);
        if (proveedorExistente) {
            return response.status(409).json({ message: 'El proveedor con este RUT ya existe' });
        }

        // Crear el proveedor
        const nuevoProveedor = await Proveedor.create({
            rut_proveedor,
            nombre,
            contacto,
            direccion
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
        const { rut_proveedor, contacto, direccion, nombre } = request.body;

        // Validación de campos obligatorios
        if (!rut_proveedor || (!contacto && !direccion && !nombre)) {
            return response.status(400).json({ message: 'RUT y al menos un campo a modificar (nombre, contacto o dirección) son obligatorios' });
        }

        // Buscar el proveedor por su RUT
        const proveedor = await Proveedor.findByPk(rut_proveedor);
        if (!proveedor) {
            return response.status(404).json({ message: 'Proveedor no encontrado' });
        }

        // Actualizar los campos
        if (contacto) proveedor.contacto = contacto;
        if (direccion) proveedor.direccion = direccion;
        if (nombre) proveedor.nombre = nombre;
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

        // Buscar el proveedor por su RUT
        const proveedor = await Proveedor.findByPk(rut_proveedor);
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