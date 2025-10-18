import { Request, Response } from "express";
import Venta from "../models/Venta";
import Cliente from "../models/Cliente";
import Usuario from "../models/Usuario";
import DetalleVenta from "../models/Detalle_venta";
import Producto from "../models/Producto";
import { jsPDF } from "jspdf";


export const obtenerVentas = async (request: Request, response: Response) => {
    try {

        const ventas = await Venta.findAll({
            include: [
                {
                    model: Cliente,
                    attributes: ['rut_cliente', 'nombre']
                },
                {
                    model: Usuario,
                    attributes: ['rut_usuario', 'nombre_usuario', 'rol']
                },
            ],
            attributes: ['id_venta', 'fecha_hora', 'total_venta'],
            order: [['fecha_hora', 'DESC']]
        });

        if (!ventas || ventas.length === 0) {
            return response.status(404).json({ message: "no se encontraron ventas registradas " })
        }

        const datosFormateados = ventas.map((venta) => ({
            id_venta: venta.id_venta,
            fecha_hora: new Date(venta.fecha_hora).toLocaleString('es-CL', { timeZone: 'America/Santiago' }),
            cliente: venta.Cliente ? venta.Cliente.nombre : 'Sin cliente',
            vendedor: venta.Usuario ? venta.Usuario.nombre_usuario : 'Sin vendedor',
            total_venta: venta.total_venta,
        }));

        response.status(200).json({
            message: "ventas obtenidas correctamente",
            ventas: datosFormateados,
        })

    } catch (error) {
        console.error("error al obtner las ventas:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}


export const agregarVenta = async (request: Request, response: Response) => {
    try {
        const { rut_cliente, rut_usuario, detalle } = request.body;

        // Validar datos obligatorios
        if (!rut_cliente || !rut_usuario || !detalle || !Array.isArray(detalle) || detalle.length === 0) {
            return response.status(400).json({ message: "Faltan datos obligatorios o detalle de venta inválido" });
        }

        // Verificar existencia de cliente y usuario
        const cliente = await Cliente.findByPk(rut_cliente);
        const usuario = await Usuario.findByPk(rut_usuario);

        if (!cliente) {
            return response.status(404).json({ message: "Cliente no encontrado" });
        }
        if (!usuario) {
            return response.status(404).json({ message: "Usuario (vendedor) no encontrado" });
        }

        // Calcular el total de la venta a partir del detalle
        let total_venta = 0;
        for (const item of detalle) {
            const producto = await Producto.findByPk(item.id_producto);
            if (!producto) {
                return response.status(404).json({ message: `Producto con ID ${item.id_producto} no encontrado` });
            }

            const subtotal = item.cantidad * item.precio_unitario;
            total_venta += subtotal;
        }

        // Crear la venta principal
        const venta = await Venta.create({
            fecha_hora: new Date(),
            total_venta,
            rut_cliente,
            rut_usuario
        });

        // Registrar los detalles de la venta
        for (const item of detalle) {
            await DetalleVenta.create({
                id_venta: venta.id_venta,
                id_producto: item.id_producto,
                cantidad_vendida: item.cantidad,
                precio_unitario_venta: item.precio_unitario
            });
        }

        response.status(201).json({
            message: "Venta registrada exitosamente",
            venta: {
                id_venta: venta.id_venta,
                fecha_hora: venta.fecha_hora,
                total_venta,
                rut_cliente,
                rut_usuario
            }
        });


    } catch (error) {
        console.error("error al agregar la venta:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}


export const imprimirVenta = async (request: Request, response: Response) => {
    try {
        const { id_venta } = request.params;

        // Validación de parámetro
        if (!id_venta) {
            return response.status(400).json({ message: "El ID de la venta es obligatorio" });
        }

        // Buscar la venta con sus relaciones
        const venta = await Venta.findByPk(id_venta, {
            include: [
                { model: Cliente, attributes: ["rut_cliente", "nombre", "contacto"] },
                { model: Usuario, attributes: ["rut_usuario", "nombre_usuario", "rol"] },
                {
                    model: DetalleVenta,
                    include: [{ model: Producto, attributes: ["nombre_producto", "precio_unitario"] }],
                },
            ],
        });

        if (!venta) {
            return response.status(404).json({ message: "Venta no encontrada" });
        }

        // Extraer datos
        const cliente = venta.Cliente;
        const usuario = venta.Usuario;
        const detalles = venta.DetalleVenta;

        // Crear documento PDF temporal con jsPDF
        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.text("Comprobante de Venta", 70, 15);
        doc.setFontSize(10);
        doc.text(`ID Venta: ${venta.id_venta}`, 10, 30);
        doc.text(`Fecha: ${new Date(venta.fecha_hora).toLocaleString()}`, 10, 35);
        doc.text(`Cliente: ${cliente?.nombre} (${cliente?.rut_cliente})`, 10, 40);
        doc.text(`Vendedor: ${usuario?.nombre_usuario} (${usuario?.rol})`, 10, 45);
        doc.text(`-----------------------------------------------`, 10, 50);

        let y = 55;
        detalles.forEach((detalle: any) => {
            doc.text(
                `${detalle.Producto.nombre_producto}  |  Cant: ${detalle.cantidad_vendida}  |  $${detalle.precio_unitario_venta}`,
                10,
                y
            );
            y += 7;
        });

        doc.text(`-----------------------------------------------`, 10, y + 5);
        doc.text(`TOTAL: $${venta.total_venta}`, 10, y + 12);

        // Devolver el PDF como archivo descargable
        const pdfBuffer = doc.output("arraybuffer");
        response.setHeader("Content-Type", "application/pdf");
        response.setHeader("Content-Disposition", `inline; filename=comprobante_${venta.id_venta}.pdf`);
        response.send(Buffer.from(pdfBuffer));


    } catch (error) {
        console.error("error al imprimuir la venta:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}


