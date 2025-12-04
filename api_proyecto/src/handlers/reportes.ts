import { Request, Response } from "express";
import Inventario from "../models/Inventario";
import Categoria from "../models/Categoria";
import Producto from "../models/Producto";
import Talla from "../models/Talla";

/**
 * Obtiene productos con inventario disponible (stock > stock_critico) con desglose por talla
 */
export const productosDisponibles = async (request: Request, response: Response) => {
    try {
        const inventarios = await Inventario.findAll({
            include: [
                {
                    model: Producto,
                    attributes: ['id_producto', 'nombre_producto', 'id_categoria'],
                    include: [
                        {
                            model: Categoria,
                            attributes: ['nombre_categoria'],
                            required: false
                        }
                    ],
                    required: true
                },
                {
                    model: Talla,
                    attributes: ['id_talla', 'nombre_talla'],
                    required: false
                }
            ]
        });

        // Filtrar en JavaScript: solo stock > stock_critico
        const inventariosFiltrados = inventarios.filter(item => item.stock_actual > item.stock_critico);

        // Agrupar por producto con desglose de tallas
        const productosMap = new Map<number, any>();
        inventariosFiltrados.forEach(item => {
            const id = (item as any).producto?.id_producto;
            if (id) {
                if (!productosMap.has(id)) {
                    productosMap.set(id, {
                        codigo: id,
                        nombre: (item as any).producto?.nombre_producto,
                        categoria: (item as any).producto?.categoria?.nombre_categoria || "-",
                        stock: item.stock_actual,
                        tallas: [{
                            id_talla: (item as any).id_talla,
                            nombre_talla: (item as any).talla?.nombre_talla || 'N/A',
                            stock: item.stock_actual,
                            stock_critico: item.stock_critico,
                            estado: 'disponible'
                        }]
                    });
                } else {
                    const existing = productosMap.get(id);
                    existing.stock += item.stock_actual;
                    existing.tallas.push({
                        id_talla: (item as any).id_talla,
                        nombre_talla: (item as any).talla?.nombre_talla || 'N/A',
                        stock: item.stock_actual,
                        stock_critico: item.stock_critico,
                        estado: 'disponible'
                    });
                }
            }
        });

        const resultado = Array.from(productosMap.values());
        return response.status(200).json(resultado);

    } catch (error) {
        console.error("error al obtener los productos disponibles", error);
        return response.status(500).json({ message: "error en el servidor" });
    }
}

/**
 * Obtiene productos con bajo stock (cercanos a stock crítico) por talla
 */
export const productosBajoStock = async (request: Request, response: Response) => {
    try {
        const inventarios = await Inventario.findAll({
            include: [
                {
                    model: Producto,
                    attributes: ['id_producto', 'nombre_producto'],
                    required: true
                },
                {
                    model: Talla,
                    attributes: ['id_talla', 'nombre_talla'],
                    required: false
                }
            ]
        });

        // Filtrar en JavaScript: stock > 0 AND stock <= stock_critico
        const inventariosFiltrados = inventarios.filter(item => 
            item.stock_actual > 0 && item.stock_actual <= item.stock_critico
        );

        // Agrupar por producto con desglose de tallas
        const productosMap = new Map<number, any>();
        inventariosFiltrados.forEach(item => {
            const id = (item as any).producto?.id_producto;
            if (id) {
                if (!productosMap.has(id)) {
                    productosMap.set(id, {
                        codigo: id,
                        nombre: (item as any).producto?.nombre_producto,
                        stock: item.stock_actual,
                        tallas: [{
                            id_talla: (item as any).id_talla,
                            nombre_talla: (item as any).talla?.nombre_talla || 'N/A',
                            stock: item.stock_actual,
                            stock_critico: item.stock_critico,
                            estado: 'bajo_stock'
                        }]
                    });
                } else {
                    const existing = productosMap.get(id);
                    existing.stock += item.stock_actual;
                    existing.tallas.push({
                        id_talla: (item as any).id_talla,
                        nombre_talla: (item as any).talla?.nombre_talla || 'N/A',
                        stock: item.stock_actual,
                        stock_critico: item.stock_critico,
                        estado: 'bajo_stock'
                    });
                }
            }
        });

        const resultado = Array.from(productosMap.values());
        return response.status(200).json(resultado);

    } catch (error) {
        console.error("error al obtener los productos bajo stock", error);
        return response.status(500).json({ message: "error en el servidor" });
    }
}

/**
 * Obtiene productos agotados (stock = 0) por talla
 */
export const productosAgotados = async (request: Request, response: Response) => {
    try {
        const inventarios = await Inventario.findAll({
            where: {
                stock_actual: 0 // Stock igual a 0
            },
            include: [
                {
                    model: Producto,
                    attributes: ['id_producto', 'nombre_producto'],
                    required: true
                },
                {
                    model: Talla,
                    attributes: ['id_talla', 'nombre_talla'],
                    required: false
                }
            ]
        });

        // Agrupar por producto con desglose de tallas
        const productosMap = new Map<number, any>();
        inventarios.forEach(item => {
            const id = (item as any).producto?.id_producto;
            if (id) {
                if (!productosMap.has(id)) {
                    productosMap.set(id, {
                        codigo: id,
                        nombre: (item as any).producto?.nombre_producto,
                        stock: 0,
                        tallas: [{
                            id_talla: (item as any).id_talla,
                            nombre_talla: (item as any).talla?.nombre_talla || 'N/A',
                            stock: 0,
                            stock_critico: item.stock_critico,
                            estado: 'agotado'
                        }]
                    });
                } else {
                    const existing = productosMap.get(id);
                    existing.tallas.push({
                        id_talla: (item as any).id_talla,
                        nombre_talla: (item as any).talla?.nombre_talla || 'N/A',
                        stock: 0,
                        stock_critico: item.stock_critico,
                        estado: 'agotado'
                    });
                }
            }
        });

        const resultado = Array.from(productosMap.values());
        return response.status(200).json(resultado);

    } catch (error) {
        console.error("error al obtener los productos agotados", error);
        return response.status(500).json({ message: "error en el servidor" });
    }
}