import { Request, Response } from "express";
import { json } from "sequelize";
import Inventario from "../models/Inventario";
import Categoria from "../models/Categoria";
import Producto from "../models/Producto";


export const productosDisponibles = async (request: Request, response: Response) => {
    try {
        const productos = await Inventario.findAll({
            where: { stock_actual: { gt: 0 } },
            include: [
                {
                    model: Producto,
                    attributes: ['id_producto', 'nombre_producto'],
                    include: [
                        {
                            model: Categoria,
                            attributes: ['nombre_categoria']
                        }
                    ]
                }
            ]
        });

        if (productos.length === 0) {
            return response.status(404).json({ message: "no hay ningun producto disponible" });
        }

        const resultado = productos.map(item => ({
            codigo: item.Producto.id_producto,
            nombre: item.Producto.nombre_producto,
            categoria: item.Producto.Categoria.nombre_categoria,
            stock: item.stock_actual

        }));

        response.status(200).json(resultado);


    } catch (error) {
        console.error("error al obtener los prodcutos disponibles", error);
        response.status(500), json({ message: "error en el servidor" });
    }
}


export const productosBajoStock = async (request: Request, response: Response) => {
    try {
        const productos = await Inventario.findAll({
            where: { stock_actual: { lte: 4 } },
            include: [
                {
                    model: Producto,
                    attributes: ['id_producto', 'nombre_producto'],
                }
            ]
        });

        if (productos.length === 0) {
            return response.status(404).json({ message: "no hay ningun producto bajo stock actual" });
        }

        const resultado = productos.map(item => ({
            codigo: item.Producto.id_producto,
            nomnbre: item.Producto.nombre_producto,
            stock: item.stock_actual,
        }));

        response.status(200).json(resultado);


    } catch (error) {
        console.error("error al obtner los productos bajo stock", error);
        response.status(500), json({ message: "error en el servidor" });
    }
}


export const productosAgotados = async (request: Request, response: Response) => {
    try {

        const productos = await Inventario.findAll({
            where: { stock_actual: 0 },
            include: [
                {
                    model: Producto,
                    attributes: ['id_producto', 'nombre_producto'],
                }
            ]
        });

        if(productos.length === 0) {
            return response.status(404).json({ message: "no hay ningun producto agotado" });
        }

        const resultado = productos.map(item => ({
            codigo: item.Producto.id_producto,
            nombre: item.Producto.nombre_producto,
        }))

        response.status(200).json(resultado);

    } catch (error) {
        console.error("error al obtener los productos agotados", error);
        response.status(500), json({ message: "error en el servidor" });
    }
}