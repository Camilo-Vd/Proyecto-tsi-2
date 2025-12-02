import { Request, Response } from 'express';
import Producto from '../models/Producto';
import Talla from '../models/Talla';

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
