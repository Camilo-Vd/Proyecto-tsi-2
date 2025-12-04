import { Request, Response } from "express";
import Inventario from "../models/Inventario";
import Producto from "../models/Producto";
import Talla from "../models/Talla";
import Categoria from "../models/Categoria";



export const obtenerInventarios = async (request: Request, response: Response) => {
    try {
        const inventarios = await Inventario.findAll({
            attributes: ['id_producto', 'id_talla', 'precio_unitario', 'stock_actual', 'stock_critico']
        });

        // Para cada inventario, obtener los datos relacionados manualmente
        const resultado = await Promise.all(inventarios.map(async (inv: any) => {
            const producto = await Producto.findByPk(inv.id_producto, {
                attributes: ['nombre_producto', 'id_categoria'],
                include: [
                    { model: Categoria, attributes: ['nombre_categoria'] }
                ]
            });

            const talla = await Talla.findByPk(inv.id_talla, {
                attributes: ['nombre_talla']
            });

            return {
                id_producto: inv.id_producto,
                id_talla: inv.id_talla,
                nombre_producto: producto?.nombre_producto || 'N/A',
                nombre_categoria: producto?.categoria?.nombre_categoria || 'Sin categoría',
                nombre_talla: talla?.nombre_talla || 'N/A',
                precio_unitario: inv.precio_unitario,
                stock_actual: inv.stock_actual,
                stock_critico: inv.stock_critico
            };
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
        const { stock_actual, precio_unitario, stock_critico } = request.body;

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
        if (precio_unitario !== undefined) inventario.precio_unitario = precio_unitario;
        if (stock_critico !== undefined) inventario.stock_critico = stock_critico;

        await inventario.save();

        // Retornar inventario actualizado con datos completos
        const producto = await Producto.findByPk(inventario.id_producto, {
            attributes: ['nombre_producto', 'id_categoria'],
            include: [
                { model: Categoria, attributes: ['nombre_categoria'] }
            ]
        });

        const talla = await Talla.findByPk(inventario.id_talla, {
            attributes: ['nombre_talla']
        });

        const actualizado = {
            id_producto: inventario.id_producto,
            id_talla: inventario.id_talla,
            nombre_producto: producto?.nombre_producto || 'N/A',
            nombre_categoria: producto?.categoria?.nombre_categoria || 'Sin categoría',
            nombre_talla: talla?.nombre_talla || 'N/A',
            precio_unitario: inventario.precio_unitario,
            stock_actual: inventario.stock_actual,
            stock_critico: inventario.stock_critico
        };

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
        const { id_producto, id_talla, precio_unitario, stock_actual, stock_critico } = request.body;

        if (!id_producto || !id_talla || precio_unitario === undefined || stock_actual === undefined) {
            return response.status(400).json({ message: "faltan datos obligatorios (id_producto, id_talla, precio_unitario, stock_actual)" })
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
            precio_unitario,
            stock_actual,
            stock_critico: stock_critico || 5
        });

        const inventarioCreado = await Inventario.findOne({
            where: { id_producto, id_talla },
            attributes: ['stock_actual', 'precio_unitario', 'stock_critico'],
            include: [
                {
                    model: Producto,
                    attributes: ['id_producto', 'nombre_producto', 'id_categoria'],
                    include: [
                        {
                            model: Categoria,
                            attributes: ['nombre_categoria']
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
