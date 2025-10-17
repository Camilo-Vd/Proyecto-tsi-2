import { Request, Response } from "express";
import Inventario from "../models/Inventario";
import Producto from "../models/Producto";
import Talla from "../models/Talla";


export const obtenerInventarios = async (request: Request, response: Response) =>{
    try {
        const inventario = await Inventario.findAll({
            attributes :['stock_actual'], 
            include: [
                {
                    model: Producto,
                    attributes: ['nombre_producto', 'precio_unitario']
                },
                {
                    model: Talla,
                    attributes: ['nombre_talla']
                }
            ]
        });

        const resultado = inventario.map((item: any) =>({
            nombre_producto: item.producto?.nombre_producto,
            precio_unitario: item.producto?.precio_unitario,
            nombre_talla: item.talla?.nombre_talla,
            stock_actual: item.stock_actual
        }));

        response.status(200).json(resultado);
        
    } catch (error) {
        console.error("error al obtner el inventario:", error)
        response.status(500).json({message:"error en el servidor"})
    }
}