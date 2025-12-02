import { Request, Response } from 'express';
import Compra from '../models/Compra';
import Detalle_compra from '../models/Detalle_compra';
import Inventario from '../models/Inventario';

export const obtenerCompras = async (request: Request, response: Response) => {
    try {
        const compras = await Compra.findAll({
            attributes: ['id_compra', 'rut_proveedor', 'fecha_compra', 'total_compra'],
            include: [
                { association: 'proveedor', attributes: ['nombre_proveedor'] }
            ],
            order: [['fecha_compra', 'DESC']]
        });
        response.status(200).json(compras);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener compras' });
    }
};

export const crearCompra = async (request: Request, response: Response) => {
    try {
        const { rut_proveedor, detalles } = request.body;

        if (!rut_proveedor || !detalles || detalles.length === 0) {
            return response.status(400).json({ error: 'Datos incompletos' });
        }

        // Calcular total
        const total = detalles.reduce((sum: number, d: any) => 
            sum + (d.cantidad_adquirida * d.precio_unitario_compra), 0
        );

        // Crear compra
        const compra = await Compra.create({
            rut_proveedor,
            fecha_compra: new Date(),
            total_compra: total
        });

        // Crear detalles y actualizar inventario
        for (const detalle of detalles) {
            await Detalle_compra.create({
                id_compra: compra.id_compra,
                id_producto: detalle.id_producto,
                id_talla: detalle.id_talla,
                cantidad_adquirida: detalle.cantidad_adquirida,
                precio_unitario_compra: detalle.precio_unitario_compra
            });

            // Actualizar inventario
            const inventarioExistente = await Inventario.findOne({
                where: {
                    id_producto: detalle.id_producto,
                    id_talla: detalle.id_talla
                }
            });

            if (inventarioExistente) {
                await inventarioExistente.update({
                    stock_actual: inventarioExistente.getDataValue('stock_actual') + detalle.cantidad_adquirida
                });
            }
        }

        response.status(201).json({ id_compra: compra.id_compra, success: true });
    } catch (error) {
        console.error('Error al crear compra:', error);
        response.status(500).json({ error: 'Error al crear la compra' });
    }
};

export const editarCompra = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const { rut_proveedor, detalles } = request.body;

        const compra = await Compra.findByPk(id);
        if (!compra) {
            return response.status(404).json({ error: 'Compra no encontrada' });
        }

        // Actualizar compra
        const total = detalles.reduce((sum: number, d: any) => 
            sum + (d.cantidad_adquirida * d.precio_unitario_compra), 0
        );

        await compra.update({
            rut_proveedor,
            total_compra: total
        });

        response.status(200).json({ success: true });
    } catch (error) {
        response.status(500).json({ error: 'Error al editar la compra' });
    }
};

export const eliminarCompra = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const compra = await Compra.findByPk(id);

        if (!compra) {
            return response.status(404).json({ error: 'Compra no encontrada' });
        }

        await compra.destroy();
        response.status(200).json({ success: true });
    } catch (error) {
        response.status(500).json({ error: 'Error al eliminar la compra' });
    }
};
