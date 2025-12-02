import { Request, Response } from "express";
import Inventario from "../models/Inventario";
import Producto from "../models/Producto";
import Talla from "../models/Talla";
import Categoria from "../models/Categoria";
import Proveedor from "../models/Proveedor";



export const obtenerInventarios = async (request: Request, response: Response) => {
    try {
        const inventario = await Inventario.findAll({
            attributes: ['id_producto', 'id_talla', 'stock_actual', 'precio_unitario'],
            include: [
                {
                    model: Producto,
                    attributes: ['id_producto', 'nombre_producto'],
                    include: [
                        { model: Categoria, attributes: ['id_categoria', 'nombre_categoria'] },
                        { model: Proveedor, attributes: ['rut_proveedor', 'nombre_proveedor'] } // solo si el producto tiene proveedor   
                    ]
                },
                {
                    model: Talla,
                    attributes: ['id_talla', 'nombre_talla']
                }
            ]
        });

        //Transformar datos a un formato limpio para el frontend
        const resultado = inventario.map((item: any) => ({
            // IDs principales (claves primarias compuestas del inventario)
            id_producto: item.id_producto,
            id_talla: item.id_talla,
            
            // Información del producto
            nombre_producto: item.Producto?.nombre_producto || 'N/A',
            id_categoria: item.Producto?.Categoria?.id_categoria,
            nombre_categoria: item.Producto?.Categoria?.nombre_categoria || 'Sin categoría',
            
            // Información del proveedor (puede ser null)
            rut_proveedor: item.Producto?.Proveedor?.rut_proveedor || null,
            nombre_proveedor: item.Producto?.Proveedor?.nombre_proveedor || 'Sin proveedor',
            
            // Información de talla
            nombre_talla: item.Talla?.nombre_talla || 'N/A',
            
            // Datos del inventario
            precio_unitario: item.precio_unitario,
            stock_actual: item.stock_actual
        }));

        response.status(200).json({
            message: "Inventarios obtenidos correctamente",
            total_registros: resultado.length,
            inventarios: resultado
        });

    } catch (error) {
        console.error("Error al obtener el inventario:", error)
        response.status(500).json({ message: "Error en el servidor" })
    }
}

export const editarInventario = async (request: Request, response: Response) => {
    try {
        const { id_producto, id_talla } = request.params;
        const { stock_actual } = request.body;

        // Validación de existencia de parámetros
        if (!id_producto || !id_talla) {
            return response.status(400).json({ message: 'Debe indicar producto y talla' });
        }

        // Buscar registro existente
        const inventario = await Inventario.findOne({
            where: { id_producto, id_talla }
        });

        if (!inventario) {
            return response.status(404).json({ message: 'Registro de inventario no encontrado' });
        }

        // Actualizar solo los campos permitidos
        if (stock_actual !== undefined) inventario.stock_actual = stock_actual;

        await inventario.save();

        // Retornar inventario actualizado con datos completos
        const actualizado = await Inventario.findOne({
            where: { id_producto, id_talla },
            attributes: ['stock_actual', 'precio_unitario'],
            include: [
                {
                    model: Producto,
                    attributes: ['id_producto', 'nombre_producto'],
                    include: [
                        { model: Categoria, attributes: ['nombre_categoria'] },
                        { model: Proveedor, attributes: ['nombre_proveedor'] }
                    ]
                },
                {
                    model: Talla,
                    attributes: ['nombre_talla']
                }
            ]
        });

        response.status(200).json({
            message: 'Inventario actualizado correctamente',
            inventario: actualizado
        });

    } catch (error) {
        console.error("error al editar el inventario:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}

export const eliminarInventario = async (request: Request, response: Response) => {
    try {

        const { id_producto, id_talla } = request.params;

        if (!id_producto || !id_talla) {
            return response.status(400).json({ message: 'Debe indicar producto y talla para eliminar' });
        }

        const inventario = await Inventario.findOne({
            where: { id_producto, id_talla }
        });

        if (!inventario) {
            return response.status(404).json({ message: 'Registro de inventario no encontrado' });
        }

        await inventario.destroy();

        response.status(200).json({ message: "registro de inventario eliminado" });

    } catch (error) {
        console.error("error en el eliminar en el inventario:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}

export const agregarInventario = async (request: Request, response: Response) => {
    try {
        const { id_producto, id_talla, stock_actual } = request.body;

        if (!id_producto || !id_talla || stock_actual === undefined) {
            return response.status(400).json({ message: "faltan datos  obligatorios" })
        }

        const productoExiste = await Producto.findByPk(id_producto);
        if (!productoExiste) {
            return response.status(404).json({ message: "el producto no existe" });
        }

        const tallaExiste = await Talla.findByPk(id_talla);
        if (!tallaExiste) {
            return response.status(404).json({ message: "la talla no existe" });
        }

        const inventarioExistente = await Inventario.findOne({
            where: { id_producto, id_talla }
        });

        if (inventarioExistente) {
            return response.status(409).json({ message: "el inventario para este producto y talla ya existe" });
        }

        await Inventario.create({
            id_producto,
            id_talla,
            stock_actual
        });

        const inventarioCreado = await Inventario.findOne({
            where: { id_producto, id_talla },
            attributes: ['stock_actual', 'precio_unitario'],
            include: [
                {
                    model: Producto,
                    attributes: ['id_producto', 'nombre_producto'],
                    include: [
                        {
                            model: Categoria,
                            attributes: ['nombre_categoria']
                        },
                        {
                            model: Proveedor,
                            attributes: ['nombre_proveedor']
                        }
                    ]
                },
                {
                    model: Talla,
                    attributes: ['nombre_talla']
                }
            ]
        });

        response.status(201).json({
            message: 'Inventario agregado correctamente',
            inventario: inventarioCreado
        });

    } catch (error) {
        console.error("error al agregar en el inventario:", error)
        response.status(500).json({ message: "error en el servidor" });
    }
}
