import { request, Request, Response } from "express";
import Cliente from "../models/Cliente";
import { procesarRUTBackend } from "../utils/rutUtils";

export const obtenerClientes = async (request: Request, response: Response) => {
    try {
        const clientes = await Cliente.findAll();
        response.status(200).json(clientes)
    }
    catch (error) {
        console.error("error al obtener clientes:", error);
        response.status(500).json({ message: "error en el servidor" })
    }
};

export const obtenerClientePorRut = async (request: Request, response: Response) => {
    try {
        const { rut } = request.params;
        if (!rut) {
            return response.status(400).json({ message: "el Rut es obligatorio" })
        }
        // Validar y procesar el RUT del parámetro
        const rutValidacion = procesarRUTBackend(rut);
        if (!rutValidacion.valido) {
            return response.status(400).json({ message: rutValidacion.error })
        }
        const cliente = await Cliente.findByPk(rutValidacion.rut);
        if (!cliente) {
            return response.status(404).json({ message: "cliente no encontrado" })
        }
        response.status(200).json(cliente)
    }
    catch (error) {
        console.error("error al obtner cliente por rut:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
};

// Handler para crear un nuevo cliente
export const crearCliente = async (request: Request, response: Response) => {
    try {
        const { rut_cliente, nombre_cliente, contacto_cliente } = request.body;
        // Validación de campos obligatorios
        if (!rut_cliente || !nombre_cliente || !contacto_cliente) {
            return response.status(400).json({ message: 'Todos los campos son obligatorios' });
        }
        // Validar y procesar el RUT
        const rutValidacion = procesarRUTBackend(rut_cliente);
        if (!rutValidacion.valido) {
            return response.status(400).json({ message: rutValidacion.error })
        }
        // Verificar si el cliente ya existe (usando RUT numérico validado)
        const clienteExistente = await Cliente.findByPk(rutValidacion.rut);
        if (clienteExistente) {
            return response.status(409).json({ message: 'El cliente con este RUT ya existe' });
        }
        // Crear el cliente
        const nuevoCliente = await Cliente.create({
            rut_cliente: rutValidacion.rut,  // Usar RUT numérico validado
            nombre_cliente,
            contacto_cliente
        });
        response.status(201).json({ message: 'Cliente creado exitosamente', cliente: nuevoCliente });
    } catch (error) {
        console.error('Error al crear cliente: ', error);
        response.status(500).json({ message: 'Error en el servidor' });
    }
};

export const actualizarContactoCliente = async (request: Request, response: Response) => {
    try {
        const { rut_cliente, contacto_cliente, nombre_cliente } = request.body;
        // Validación de campos obligatorios
        if (!rut_cliente || (!contacto_cliente && !nombre_cliente)) {
            return response.status(400).json({ message: 'RUT y al menos un campo a modificar (nombre_cliente o contacto_cliente) son obligatorios' });
        }
        // Validar y procesar el RUT
        const rutValidacion = procesarRUTBackend(rut_cliente);
        if (!rutValidacion.valido) {
            return response.status(400).json({ message: rutValidacion.error })
        }
        // Buscar el cliente por su RUT (usando RUT numérico validado)
        const cliente = await Cliente.findByPk(rutValidacion.rut);
        if (!cliente) {
            return response.status(404).json({ message: 'Cliente no encontrado' });
        }
        // Actualizar los campos
        if (contacto_cliente) cliente.contacto_cliente = contacto_cliente;
        if (nombre_cliente) cliente.nombre_cliente = nombre_cliente;
        await cliente.save();
        response.status(200).json({ message: 'Datos actualizados exitosamente', cliente });
    } catch (error) {
        console.error('Error al actualizar contacto del cliente: ', error);
        response.status(500).json({ message: 'Error en el servidor' });
    }
};

export const eliminarCliente = async (request: Request, response: Response) => {
    try {
        const { rut_cliente } = request.params;
        // Validación de campo obligatorio
        if (!rut_cliente) {
            return response.status(400).json({ message: 'El RUT del cliente es obligatorio' });
        }
        // Validar y procesar el RUT
        const rutValidacion = procesarRUTBackend(rut_cliente);
        if (!rutValidacion.valido) {
            return response.status(400).json({ message: rutValidacion.error })
        }
        // Buscar el cliente por su RUT (usando RUT numérico validado)
        const cliente = await Cliente.findByPk(rutValidacion.rut);
        if (!cliente) {
            return response.status(404).json({ message: 'Cliente no encontrado' });
        }
        // Eliminar el cliente
        await cliente.destroy();
        response.status(200).json({ message: "cliente eliminado exitosamente" })
    }
    catch (error) {
        console.error("error al eliminar cliente:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}
