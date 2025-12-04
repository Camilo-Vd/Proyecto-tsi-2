import { Request, Response } from "express";
import Venta from "../models/Venta";
import Cliente from "../models/Cliente";
import Usuario from "../models/Usuario";
import DetalleVenta from "../models/Detalle_venta";
import Producto from "../models/Producto";
import Talla from "../models/Talla";
import Inventario from "../models/Inventario";
import { jsPDF } from "jspdf";
import { procesarRUTBackend, formatearRUT } from "../utils/rutUtils";


export const obtenerVentas = async (request: Request, response: Response) => {
    try {
        const ventas = await Venta.findAll({
            where: { estado_venta: 'completada' },
            include: [
                {
                    model: Cliente,
                    attributes: ['rut_cliente', 'nombre_cliente']
                },
                {
                    model: Usuario,
                    attributes: ['rut_usuario', 'nombre_usuario', 'rol_usuario']
                },
                {
                    model: DetalleVenta,
                    attributes: ['id_producto', 'id_talla', 'cantidad_vendida', 'precio_unitario_venta'],
                    include: [
                        { model: Producto, attributes: ['nombre_producto'] },
                        { model: Talla, attributes: ['nombre_talla'] }
                    ]
                }
            ],
            attributes: ['id_venta', 'fecha_hora_venta', 'total_venta', 'estado_venta'],
            order: [['fecha_hora_venta', 'DESC']]
        });

        if (!ventas || ventas.length === 0) {
            return response.status(404).json({ message: "no se encontraron ventas registradas" })
        }

        const datosFormateados = ventas.map((venta) => {
            const fecha = venta.fecha_hora_venta instanceof Date ? venta.fecha_hora_venta : new Date(venta.fecha_hora_venta);
            const fechaFormato = !isNaN(fecha.getTime()) ? fecha.toLocaleString('es-CL', { timeZone: 'America/Santiago' }) : 'Fecha inválida';
            
            return {
                id_venta: venta.id_venta,
                fecha_hora: fechaFormato,
                cliente: venta.cliente ? venta.cliente.nombre_cliente : 'Sin cliente',
                rut_cliente: venta.cliente?.rut_cliente,
                vendedor: venta.usuario ? venta.usuario.nombre_usuario : 'Sin vendedor',
                total_venta: venta.total_venta,
                estado_venta: venta.estado_venta,
                detalles: venta.detalles?.map((d: any) => ({
                    id_producto: d.id_producto,
                    nombre_producto: d.producto?.nombre_producto || 'N/A',
                    id_talla: d.id_talla,
                    nombre_talla: d.talla?.nombre_talla || 'N/A',
                    cantidad_vendida: d.cantidad_vendida,
                    precio_unitario_venta: d.precio_unitario_venta,
                    subtotal: d.cantidad_vendida * d.precio_unitario_venta
                }))
            };
        });

        response.status(200).json({
            message: "ventas obtenidas correctamente",
            total_ventas: datosFormateados.length,
            ventas: datosFormateados
        })

    } catch (error) {
        console.error("error al obtener las ventas:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}

export const obtenerVentasAnuladas = async (request: Request, response: Response) => {
    try {
        const ventas = await Venta.findAll({
            where: { estado_venta: 'anulada' },
            include: [
                {
                    model: Cliente,
                    attributes: ['rut_cliente', 'nombre_cliente']
                },
                {
                    model: Usuario,
                    attributes: ['rut_usuario', 'nombre_usuario', 'rol_usuario']
                },
                {
                    model: DetalleVenta,
                    attributes: ['id_producto', 'id_talla', 'cantidad_vendida', 'precio_unitario_venta'],
                    include: [
                        { model: Producto, attributes: ['nombre_producto'] },
                        { model: Talla, attributes: ['nombre_talla'] }
                    ]
                }
            ],
            attributes: ['id_venta', 'fecha_hora_venta', 'total_venta', 'estado_venta'],
            order: [['fecha_hora_venta', 'DESC']]
        });

        const datosFormateados = ventas.map((venta) => {
            const fecha = venta.fecha_hora_venta instanceof Date ? venta.fecha_hora_venta : new Date(venta.fecha_hora_venta);
            const fechaFormato = !isNaN(fecha.getTime()) ? fecha.toLocaleString('es-CL', { timeZone: 'America/Santiago' }) : 'Fecha inválida';
            
            return {
                id_venta: venta.id_venta,
                fecha_hora: fechaFormato,
                cliente: venta.cliente ? venta.cliente.nombre_cliente : 'Sin cliente',
                rut_cliente: venta.cliente?.rut_cliente,
                vendedor: venta.usuario ? venta.usuario.nombre_usuario : 'Sin vendedor',
                total_venta: venta.total_venta,
                estado_venta: venta.estado_venta,
                detalles: venta.detalles?.map((d: any) => ({
                    id_producto: d.id_producto,
                    nombre_producto: d.producto?.nombre_producto || 'N/A',
                    id_talla: d.id_talla,
                    nombre_talla: d.talla?.nombre_talla || 'N/A',
                    cantidad_vendida: d.cantidad_vendida,
                    precio_unitario_venta: d.precio_unitario_venta,
                    subtotal: d.cantidad_vendida * d.precio_unitario_venta
                }))
            };
        });

        response.status(200).json({
            message: "ventas anuladas obtenidas correctamente",
            total_ventas: datosFormateados.length,
            ventas: datosFormateados
        })

    } catch (error) {
        console.error("error al obtener las ventas anuladas:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}

export const obtenerTodasLasVentas = async (request: Request, response: Response) => {
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
                {
                    model: DetalleVenta,
                    attributes: ['id_producto', 'id_talla', 'cantidad_vendida', 'precio_unitario_venta'],
                    include: [
                        { model: Producto, attributes: ['nombre_producto'] },
                        { model: Talla, attributes: ['nombre_talla'] }
                    ]
                }
            ],
            attributes: ['id_venta', 'fecha_hora_venta', 'total_venta', 'estado_venta'],
            order: [['fecha_hora_venta', 'DESC']]
        });

        const datosFormateados = ventas.map((venta) => {
            const fecha = venta.fecha_hora_venta instanceof Date ? venta.fecha_hora_venta : new Date(venta.fecha_hora_venta);
            const fechaFormato = !isNaN(fecha.getTime()) ? fecha.toLocaleString('es-CL', { timeZone: 'America/Santiago' }) : 'Fecha inválida';
            
            return {
                id_venta: venta.id_venta,
                fecha_hora: fechaFormato,
                cliente: venta.cliente ? venta.cliente.nombre_cliente : 'Sin cliente',
                rut_cliente: venta.cliente?.rut_cliente,
                vendedor: venta.usuario ? venta.usuario.nombre_usuario : 'Sin vendedor',
                total_venta: venta.total_venta,
                estado_venta: venta.estado_venta,
                detalles: venta.detalles?.map((d: any) => ({
                    id_producto: d.id_producto,
                    nombre_producto: d.producto?.nombre_producto || 'N/A',
                    id_talla: d.id_talla,
                    nombre_talla: d.talla?.nombre_talla || 'N/A',
                    cantidad_vendida: d.cantidad_vendida,
                    precio_unitario_venta: d.precio_unitario_venta,
                    subtotal: d.cantidad_vendida * d.precio_unitario_venta
                }))
            };
        });

        response.status(200).json({
            message: "todas las ventas obtenidas correctamente",
            total_ventas: datosFormateados.length,
            ventas: datosFormateados
        })

    } catch (error) {
        console.error("error al obtener todas las ventas:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}


export const agregarVenta = async (request: Request, response: Response) => {
    try {
        const { rut_cliente, rut_usuario, detalles } = request.body;

        // Validar datos obligatorios
        if (!rut_cliente || !rut_usuario || !detalles || !Array.isArray(detalles) || detalles.length === 0) {
            return response.status(400).json({ 
                message: "Faltan datos obligatorios: rut_cliente, rut_usuario y detalles (array no vacío) son requeridos" 
            });
        }

        // Procesar y validar RUT del cliente
        const rutClienteValidacion = procesarRUTBackend(rut_cliente);
        if (!rutClienteValidacion.valido) {
            return response.status(400).json({ message: rutClienteValidacion.error });
        }

        // Procesar y validar RUT del usuario
        const rutUsuarioValidacion = procesarRUTBackend(rut_usuario);
        if (!rutUsuarioValidacion.valido) {
            return response.status(400).json({ message: rutUsuarioValidacion.error });
        }

        // Verificar existencia de cliente y usuario
        const cliente = await Cliente.findByPk(rutClienteValidacion.rut);
        const usuario = await Usuario.findByPk(rutUsuarioValidacion.rut);

        if (!cliente) {
            return response.status(404).json({ message: "Cliente no encontrado" });
        }
        if (!usuario) {
            return response.status(404).json({ message: "Usuario (vendedor) no encontrado" });
        }

        // Calcular el total de la venta a partir del detalle y validar inventario
        let total_venta = 0;
        const detallesValidados: any[] = [];

        for (const item of detalles) {
            // Validar campos obligatorios del item
            if (!item.id_producto || !item.id_talla || !item.cantidad_vendida || !item.precio_unitario_venta) {
                return response.status(400).json({ 
                    message: "Cada item del detalle debe incluir: id_producto, id_talla, cantidad_vendida y precio_unitario_venta" 
                });
            }

            // Validar que cantidad y precio sean positivos
            if (item.cantidad_vendida <= 0 || item.precio_unitario_venta <= 0) {
                return response.status(400).json({ 
                    message: "La cantidad_vendida y precio_unitario_venta deben ser mayores a 0" 
                });
            }

            // Validar que el producto existe
            const producto = await Producto.findByPk(item.id_producto);
            if (!producto) {
                return response.status(404).json({ message: `Producto con ID ${item.id_producto} no encontrado` });
            }

            // Validar que la talla existe
            const talla = await Talla.findByPk(item.id_talla);
            if (!talla) {
                return response.status(404).json({ message: `Talla con ID ${item.id_talla} no encontrada` });
            }

            // Validar que existe inventario para este producto-talla
            const inventario = await Inventario.findOne({
                where: { id_producto: item.id_producto, id_talla: item.id_talla }
            });

            if (!inventario) {
                return response.status(404).json({ 
                    message: `No hay inventario para el producto ${item.id_producto} en talla ${item.id_talla}` 
                });
            }

            // Validar que hay stock suficiente
            if (inventario.stock_actual < item.cantidad_vendida) {
                return response.status(409).json({ 
                    message: `Stock insuficiente para ${producto.nombre_producto} talla ${talla.nombre_talla}. Disponible: ${inventario.stock_actual}, Solicitado: ${item.cantidad_vendida}` 
                });
            }

            const subtotal = item.cantidad_vendida * item.precio_unitario_venta;
            total_venta += subtotal;

            detallesValidados.push({
                ...item,
                inventario
            });
        }

        // Crear la venta principal
        const venta = await Venta.create({
            fecha_hora_venta: new Date(),
            total_venta,
            rut_cliente: rutClienteValidacion.rut,
            rut_usuario: rutUsuarioValidacion.rut
        });

        // Registrar los detalles de la venta y actualizar inventario
        for (const item of detallesValidados) {
            // Crear el detalle de venta
            await DetalleVenta.create({
                id_venta: venta.id_venta,
                id_producto: item.id_producto,
                id_talla: item.id_talla,
                cantidad_vendida: item.cantidad_vendida,
                precio_unitario_venta: item.precio_unitario_venta
            });

            // Actualizar el inventario (descontar stock)
            await item.inventario.update({
                stock_actual: item.inventario.stock_actual - item.cantidad_vendida
            });
        }

        // Obtener la venta creada con sus detalles
        const ventaCreada = await Venta.findByPk(venta.id_venta, {
            include: [
                {
                    model: DetalleVenta,
                    attributes: ['id_producto', 'id_talla', 'cantidad_vendida', 'precio_unitario_venta'],
                    include: [
                        { model: Producto, attributes: ['nombre_producto'] },
                        { model: Talla, attributes: ['nombre_talla'] }
                    ]
                }
            ]
        });

        response.status(201).json({
            message: "Venta registrada exitosamente",
            venta: {
                id_venta: ventaCreada?.id_venta,
                fecha_hora: ventaCreada?.fecha_hora_venta,
                total_venta: ventaCreada?.total_venta,
                detalles: ventaCreada?.detalles?.map((d: any) => ({
                    id_producto: d.id_producto,
                    nombre_producto: d.producto?.nombre_producto,
                    id_talla: d.id_talla,
                    nombre_talla: d.talla?.nombre_talla,
                    cantidad_vendida: d.cantidad_vendida,
                    precio_unitario_venta: d.precio_unitario_venta,
                    subtotal: d.cantidad_vendida * d.precio_unitario_venta
                }))
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
                    include: [
                        { model: Producto, attributes: ["nombre_producto"] },
                        { model: Talla, attributes: ["nombre_talla"] }
                    ],
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
        doc.text('ELUNAY CONFECCIONES', 105, 15, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Dirección: Ortiz de Rosas #937, La Ligua, Chile', 105, 22, { align: 'center' });
        doc.text('Email: elunayconfecciones@hotmail.com', 105, 28, { align: 'center' });
        
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
        doc.rect(130, 55, 70, 30);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('N° Factura:', 135, 61);
        doc.text('Fecha:', 135, 68);
        doc.text('Hora:', 135, 75);
        doc.text('Vendedor:', 135, 82);
        
        doc.setFont('helvetica', 'normal');
        doc.text(String(venta.id_venta).padStart(8, '0'), 165, 61);
        
        // Formato de fecha y hora chilena separadas
        const fechaHora = new Date(venta.fecha_hora_venta).toLocaleString('es-CL', { 
            timeZone: 'America/Santiago',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const [fecha, hora] = fechaHora.split(', ');
        doc.text(fecha, 165, 68);
        doc.text(hora, 165, 75);
        doc.text(usuario?.nombre_usuario || 'N/A', 165, 82);
        
        // INFORMACIÓN DEL CLIENTE
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('DATOS DEL CLIENTE', 10, 62);
        
        doc.setDrawColor(200, 200, 200);
        doc.rect(10, 65, 115, 15);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Nombre: ${cliente?.nombre_cliente || 'N/A'}`, 12, 71);
        doc.text(`RUT: ${formatearRUT(cliente?.rut_cliente) || 'N/A'}`, 12, 77);
              
        // TABLA DE PRODUCTOS
        
        let yPos = 95;
        
        // Encabezado de la tabla
        doc.setFillColor(52, 73, 94);
        doc.rect(10, yPos, 190, 8, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('PRODUCTO', 12, yPos + 6);
        doc.text('TALLA', 85, yPos + 6);
        doc.text('CANT.', 115, yPos + 6);
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
            const nombreTalla = detalle.talla?.nombre_talla || 'N/A';
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
            doc.text(nombreProducto.substring(0, 40), 12, yPos + 6);
            doc.text(nombreTalla, 85, yPos + 6);
            doc.text(String(cantidad), 120, yPos + 6);
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


export const eliminarVenta = async (request: Request, response: Response) => {
    try {
        const { id_venta } = request.params;

        // Validación de parámetro
        if (!id_venta) {
            return response.status(400).json({ message: "El ID de la venta es obligatorio" });
        }

        // Buscar la venta con detalles
        const venta = await Venta.findByPk(id_venta, {
            include: [{ model: DetalleVenta, include: [Producto] }]
        });

        if (!venta) {
            return response.status(404).json({ message: "Venta no encontrada" });
        }

        // Validar que TODOS los productos aún existen
        for (const detalle of venta.detalles) {
            if (!detalle.producto) {
                return response.status(409).json({
                    code: 'PRODUCTO_ELIMINADO',
                    message: 'No se puede anular: Producto eliminado del sistema. Contacte al administrador.',
                    detalles: { venta_id: id_venta, producto_id: detalle.id_producto }
                });
            }
        }

        // Validar que el inventario existe para todos los productos y que el stock no excedería límites
        const problemasInventario = [];
        
        for (const detalle of venta.detalles) {
            const inv = await Inventario.findOne({
                where: {
                    id_producto: detalle.id_producto,
                    id_talla: detalle.id_talla
                }
            });

            if (!inv) {
                problemasInventario.push({
                    producto: detalle.producto.nombre_producto,
                    id_producto: detalle.id_producto,
                    id_talla: detalle.id_talla,
                    cantidad_vendida: detalle.cantidad_vendida,
                    razon: 'No existe registro de inventario para este producto y talla. El producto puede haber sido eliminado del catálogo.'
                });
            } else if (inv.stock_actual + detalle.cantidad_vendida > 999999) {
                // Validación de límite razonable de stock
                problemasInventario.push({
                    producto: detalle.producto.nombre_producto,
                    id_producto: detalle.id_producto,
                    id_talla: detalle.id_talla,
                    stock_actual: inv.stock_actual,
                    cantidad_vendida: detalle.cantidad_vendida,
                    stock_resultante: inv.stock_actual + detalle.cantidad_vendida,
                    razon: 'El stock resultante excedería el límite permitido del sistema.'
                });
            }
        }

        if (problemasInventario.length > 0) {
            return response.status(409).json({
                success: false,
                code: 'INVENTARIO_INCONSISTENTE',
                message: 'No se puede anular la venta: Hay inconsistencias en el inventario.',
                detalles: problemasInventario
            });
        }

        // Revertir inventario (incrementar cantidad)
        for (const detalle of venta.detalles) {
            await Inventario.increment('stock_actual', {
                by: detalle.cantidad_vendida,
                where: {
                    id_producto: detalle.id_producto,
                    id_talla: detalle.id_talla
                }
            });
        }

        // Cambiar estado a anulada
        await venta.update({ estado_venta: 'anulada' });

        // Eliminar los detalles de la venta
        await DetalleVenta.destroy({
            where: { id_venta: id_venta }
        });

        response.status(200).json({ message: "Venta anulada exitosamente, inventario revertido" });

    } catch (error) {
        console.error("error al anular la venta:", error)
        response.status(500).json({ message: "error en el servidor" })
    }
}
