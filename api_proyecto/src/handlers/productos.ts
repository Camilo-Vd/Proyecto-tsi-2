import { Request, Response } from 'express';
import Producto from '../models/Producto';
import Talla from '../models/Talla';
import Categoria from '../models/Categoria';

export const obtenerProductos = async (request: Request, response: Response) => {
    try {
        const productos = await Producto.findAll({
            attributes: ['id_producto', 'nombre_producto'],
            include: [{ association: 'categoria', attributes: ['id_categoria', 'nombre_categoria'] }]
        });
        response.status(200).json(productos);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener productos' });
    }
};

export const crearProducto = async (request: Request, response: Response) => {
    try {
        const { nombre_producto, id_categoria } = request.body;

        // Validar que los campos requeridos estén presentes
        if (!nombre_producto || !id_categoria) {
            return response.status(400).json({
                message: 'El nombre del producto y la categoría son requeridos'
            });
        }

        // Validar que la categoría exista
        const categoriaExiste = await Categoria.findByPk(id_categoria);
        if (!categoriaExiste) {
            return response.status(404).json({
                message: 'La categoría especificada no existe'
            });
        }

        // Crear el producto
        const nuevoProducto = await Producto.create({
            nombre_producto,
            id_categoria
        });

        // Obtener el producto con la categoría incluida
        const productoCreado = await Producto.findByPk(nuevoProducto.id_producto, {
            attributes: ['id_producto', 'nombre_producto'],
            include: [{ association: 'categoria', attributes: ['id_categoria', 'nombre_categoria'] }]
        });

        response.status(201).json(productoCreado);
    } catch (error: any) {
        console.error('Error al crear producto:', error);
        response.status(500).json({
            message: error.message || 'Error al crear el producto'
        });
    }
};

export const obtenerTallas = async (request: Request, response: Response) => {
    try {
        const tallas = await Talla.findAll({
            attributes: ['id_talla', 'nombre_talla']
        });
        response.status(200).json(tallas);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener tallas' });
    }
};
