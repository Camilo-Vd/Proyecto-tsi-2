import { Request, Response } from "express";
import Venta from "../models/Venta";
import Cliente from "../models/Cliente";
import Usuario from "../models/Usuario";
import DetalleVenta from "../models/Detalle_venta";
import Producto from "../models/Producto";
import Talla from "../models/Talla";
import { jsPDF } from "jspdf";


export const obtenerVentas = async (request: Request, response: Response) => {
    try {

        const ventas = await Venta.findAll({
            include: [
                {
                    model: Cliente,
                    attributes: ['rut_cliente', 'nombre_cliente']
                },
                {
                    model: Usuario,
                    attributes: ['rut_usuario', 'nombre_usuario', 'rol_usuario']
                },
            ],
            attributes: ['id_venta', 'fecha_hora_venta', 'total_venta'],
            order: [['fecha_hora_venta', 'DESC']]
        });

        if (!ventas || ventas.length === 0) {
            return response.status(404).json({ message: "no se encontraron ventas registradas " })
        }

        const datosFormateados = ventas.map((venta) => ({
            id_venta: venta.id_venta,
            fecha_hora: new Date(venta.fecha_hora_venta).toLocaleString('es-CL', { timeZone: 'America/Santiago' }), 
            cliente: venta.cliente ? venta.cliente.nombre_cliente : 'Sin cliente',
            vendedor: venta.usuario ? venta.usuario.nombre_usuario : 'Sin vendedor',
            total_venta: venta.total_venta,
        }));        response.status(200).json({
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
            // Validar campos obligatorios del item
            if (!item.id_producto || !item.id_talla || !item.cantidad || !item.precio_unitario) {
                return response.status(400).json({ 
                    message: "Cada item del detalle debe incluir: id_producto, id_talla, cantidad y precio_unitario" 
                });
            }

            // Validar que cantidad y precio sean positivos
            if (item.cantidad <= 0 || item.precio_unitario <= 0) {
                return response.status(400).json({ 
                    message: "La cantidad y precio_unitario deben ser mayores a 0" 
                });
            }

            const producto = await Producto.findByPk(item.id_producto);
            if (!producto) {
                return response.status(404).json({ message: `Producto con ID ${item.id_producto} no encontrado` });
            }

            // Validar que la talla exista
            const talla = await Talla.findByPk(item.id_talla);
            if (!talla) {
                return response.status(404).json({ message: `Talla con ID ${item.id_talla} no encontrada` });
            }

            const subtotal = item.cantidad * item.precio_unitario;
            total_venta += subtotal;
        }

        // Crear la venta principal
        const venta = await Venta.create({
            fecha_hora_venta: new Date(),
            total_venta,
            rut_cliente,
            rut_usuario
        });

        // Registrar los detalles de la venta
        for (const item of detalle) {
            await DetalleVenta.create({
                id_venta: venta.id_venta,
                id_producto: item.id_producto,
                id_talla: item.id_talla,
                cantidad_vendida: item.cantidad,
                precio_unitario_venta: item.precio_unitario
            });
        }

        response.status(201).json({
            message: "Venta registrada exitosamente",
            venta: {
                id_venta: venta.id_venta,
                fecha_hora: venta.fecha_hora_venta,
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
                { model: Cliente, attributes: ["rut_cliente", "nombre_cliente", "contacto_cliente"] },
                { model: Usuario, attributes: ["rut_usuario", "nombre_usuario", "rol_usuario"] },
                {
                    model: DetalleVenta,
                    include: [{ model: Producto, attributes: ["nombre_producto"] }],
                },
            ],
        });

        if (!venta) {
            return response.status(404).json({ message: "Venta no encontrada" });
        }

        // Extraer datos
        const cliente = venta.cliente;
        const usuario = venta.usuario;
        const detalles = venta.detalles;

        // Validar que existan detalles
        if (!detalles || detalles.length === 0) {
            return response.status(404).json({ message: "La venta no tiene detalles asociados" });
        }

        // Crear documento PDF con jsPDF
        const doc = new jsPDF();
        
        // ENCABEZADO DE LA FACTURA
        
        // Rectángulo superior con color de fondo
        doc.setFillColor(41, 128, 185); // Azul corporativo
        doc.rect(0, 0, 210, 35, 'F');
        
        // Título de la empresa
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('TIENDA TSI-2', 105, 15, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Dirección: Av. Principal #123, Santiago, Chile', 105, 22, { align: 'center' });
        doc.text('Teléfono: +56 9 1234 5678 | Email: ventas@tiendatsi2.cl', 105, 28, { align: 'center' });
        
        // Resetear color de texto
        doc.setTextColor(0, 0, 0);
        
        // INFORMACIÓN DE LA FACTURA
        
        // Título "FACTURA DE VENTA"
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('FACTURA DE VENTA', 105, 50, { align: 'center' });
        
        // Recuadro de información de factura (derecha)
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.rect(130, 55, 70, 25);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('N° Factura:', 135, 62);
        doc.text('Fecha:', 135, 69);
        doc.text('Vendedor:', 135, 76);
        
        doc.setFont('helvetica', 'normal');
        doc.text(String(venta.id_venta).padStart(8, '0'), 165, 62);
        
        // Formato de fecha chilena
        const fechaFormateada = new Date(venta.fecha_hora_venta).toLocaleString('es-CL', { 
            timeZone: 'America/Santiago',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        doc.text(fechaFormateada, 165, 69);
        doc.text(usuario?.nombre_usuario || 'N/A', 165, 76);
        
        // INFORMACIÓN DEL CLIENTE
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('DATOS DEL CLIENTE', 10, 62);
        
        doc.setDrawColor(200, 200, 200);
        doc.rect(10, 65, 115, 15);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Nombre: ${cliente?.nombre_cliente || 'N/A'}`, 12, 71);
        doc.text(`RUT: ${cliente?.rut_cliente || 'N/A'}`, 12, 77);
              
        // TABLA DE PRODUCTOS
        
        let yPos = 95;
        
        // Encabezado de la tabla
        doc.setFillColor(52, 73, 94);
        doc.rect(10, yPos, 190, 8, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('PRODUCTO', 12, yPos + 6);
        doc.text('CANT.', 120, yPos + 6);
        doc.text('PRECIO UNIT.', 140, yPos + 6);
        doc.text('SUBTOTAL', 175, yPos + 6);
        
        // Resetear color
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        
        yPos += 8;
        
        // Detalles de productos
        let subtotalGeneral = 0;
        detalles.forEach((detalle: any, index: number) => {
            const nombreProducto = detalle.producto?.nombre_producto || detalle.Producto?.nombre_producto || 'Producto N/A';
            const cantidad = detalle.cantidad_vendida || 0;
            const precioUnitario = detalle.precio_unitario_venta || 0;
            const subtotal = cantidad * precioUnitario;
            subtotalGeneral += subtotal;
            
            // Alternar color de fondo para filas
            if (index % 2 === 0) {
                doc.setFillColor(245, 245, 245);
                doc.rect(10, yPos, 190, 8, 'F');
            }
            
            doc.setFontSize(9);
            doc.text(nombreProducto.substring(0, 50), 12, yPos + 6);
            doc.text(String(cantidad), 125, yPos + 6);
            doc.text(`$${precioUnitario.toLocaleString('es-CL')}`, 145, yPos + 6);
            doc.text(`$${subtotal.toLocaleString('es-CL')}`, 175, yPos + 6);
            
            yPos += 8;
        });
        
        // Línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(10, yPos, 200, yPos);
        
        // TOTALES
        
        yPos += 10;
        
        // Calcular IVA (19% en Chile)
        const neto = Math.round(subtotalGeneral / 1.19);
        const iva = subtotalGeneral - neto;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        doc.text('Subtotal (Neto):', 140, yPos);
        doc.text(`$${neto.toLocaleString('es-CL')}`, 185, yPos, { align: 'right' });
        
        doc.text('IVA (19%):', 140, yPos + 7);
        doc.text(`$${iva.toLocaleString('es-CL')}`, 185, yPos + 7, { align: 'right' });
        
        // Total con fondo
        doc.setFillColor(41, 128, 185);
        doc.rect(130, yPos + 12, 70, 10, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('TOTAL:', 140, yPos + 19);
        doc.text(`$${venta.total_venta.toLocaleString('es-CL')}`, 195, yPos + 19, { align: 'right' });
        
        // PIE DE PÁGINA
        
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        
        const piePagina = yPos + 35;
        doc.line(10, piePagina, 200, piePagina);
        doc.text('Gracias por su compra. Este documento es una representación impresa de la factura electrónica.', 105, piePagina + 5, { align: 'center' });
        doc.text('Para consultas o reclamos, contáctenos a través de nuestros canales oficiales.', 105, piePagina + 10, { align: 'center' });
        
        // Devolver el PDF como archivo descargable
        const pdfBuffer = doc.output("arraybuffer");
        response.setHeader("Content-Type", "application/pdf");
        response.setHeader("Content-Disposition", `inline; filename=factura_${String(venta.id_venta).padStart(8, '0')}.pdf`);
        response.send(Buffer.from(pdfBuffer));


    } catch (error) {
        console.error("error al imprimuir la venta:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}


