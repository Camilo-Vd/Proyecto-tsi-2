import { Request, Response } from 'express';
import Compra from '../models/Compra';
import Detalle_compra from '../models/Detalle_compra';
import Inventario from '../models/Inventario';
import Proveedor from '../models/Proveedor';
import Producto from '../models/Producto';
import Talla from '../models/Talla';
import { jsPDF } from 'jspdf';
import { procesarRUTBackend } from '../utils/rutUtils';

export const obtenerCompras = async (request: Request, response: Response) => {
    try {
        const compras = await Compra.findAll({
            where: { estado_compra: 'registrada' },
            attributes: ['id_compra', 'rut_proveedor', 'fecha_compra', 'total_compra', 'estado_compra'],
            include: [
                { model: Proveedor, attributes: ['nombre_proveedor'] }
            ],
            order: [['fecha_compra', 'DESC']]
        });
        response.status(200).json(compras);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener compras' });
    }
};

export const obtenerComprasAnuladas = async (request: Request, response: Response) => {
    try {
        const compras = await Compra.findAll({
            where: { estado_compra: 'anulada' },
            attributes: ['id_compra', 'rut_proveedor', 'fecha_compra', 'total_compra', 'estado_compra'],
            include: [
                { model: Proveedor, attributes: ['nombre_proveedor'] }
            ],
            order: [['fecha_compra', 'DESC']]
        });
        response.status(200).json(compras);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener compras anuladas' });
    }
};

export const obtenerTodasLasCompras = async (request: Request, response: Response) => {
    try {
        const compras = await Compra.findAll({
            attributes: ['id_compra', 'rut_proveedor', 'fecha_compra', 'total_compra', 'estado_compra'],
            include: [
                { model: Proveedor, attributes: ['nombre_proveedor'] }
            ],
            order: [['fecha_compra', 'DESC']]
        });
        response.status(200).json(compras);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener todas las compras' });
    }
};

export const crearCompra = async (request: Request, response: Response) => {
    try {
        let { rut_proveedor, detalles } = request.body;

        if (!rut_proveedor || !detalles || detalles.length === 0) {
            return response.status(400).json({ error: 'Datos incompletos' });
        }

        // Procesar y validar el RUT usando la función estándar
        const rutValidacion = procesarRUTBackend(rut_proveedor);
        if (!rutValidacion.valido) {
            return response.status(400).json({ error: rutValidacion.error || 'RUT de proveedor inválido' });
        }

        rut_proveedor = rutValidacion.rut!;

        // Verificar que el proveedor existe
        const proveedor = await Proveedor.findByPk(rut_proveedor);
        if (!proveedor) {
            return response.status(404).json({ error: `Proveedor con RUT ${rut_proveedor} no encontrado` });
        }

        // Calcular total
        const total = detalles.reduce((sum: number, d: any) => 
            sum + (d.cantidad_adquirida * d.precio_unitario_compra), 0
        );

        // Crear compra
        const compra = await Compra.create({
            rut_proveedor,
            fecha_compra: new Date(),
            total_compra: total
        });

        // Crear detalles y actualizar inventario
        for (const detalle of detalles) {
            // Validar que el producto existe
            const producto = await Producto.findByPk(detalle.id_producto);
            if (!producto) {
                return response.status(404).json({ error: `Producto con ID ${detalle.id_producto} no encontrado` });
            }

            // Crear detalle de compra
            await Detalle_compra.create({
                id_compra: compra.id_compra,
                id_producto: detalle.id_producto,
                id_talla: detalle.id_talla,
                cantidad_adquirida: detalle.cantidad_adquirida,
                precio_unitario_compra: detalle.precio_unitario_compra
            });

            // Actualizar o crear inventario
            const inventarioExistente = await Inventario.findOne({
                where: {
                    id_producto: detalle.id_producto,
                    id_talla: detalle.id_talla
                }
            });

            if (inventarioExistente) {
                // Si existe, incrementar stock
                await inventarioExistente.update({
                    stock_actual: inventarioExistente.getDataValue('stock_actual') + detalle.cantidad_adquirida
                });
            } else {
                // Si NO existe, crear nuevo registro de inventario
                await Inventario.create({
                    id_producto: detalle.id_producto,
                    id_talla: detalle.id_talla,
                    precio_unitario: detalle.precio_unitario_compra,
                    stock_actual: detalle.cantidad_adquirida
                });
            }
        }

        response.status(201).json({ id_compra: compra.id_compra, success: true });
    } catch (error) {
        console.error('Error al crear compra:', error);
        
        // Intentar enviar más detalles del error
        if (error instanceof Error) {
            console.error('Mensaje de error:', error.message);
            console.error('Stack:', error.stack);
            response.status(500).json({ error: `Error al crear la compra: ${error.message}` });
        } else {
            response.status(500).json({ error: 'Error desconocido al crear la compra' });
        }
    }
};

export const editarCompra = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const { rut_proveedor, detalles } = request.body;

        const compra = await Compra.findByPk(id);
        if (!compra) {
            return response.status(404).json({ error: 'Compra no encontrada' });
        }

        // Actualizar compra
        const total = detalles.reduce((sum: number, d: any) => 
            sum + (d.cantidad_adquirida * d.precio_unitario_compra), 0
        );

        await compra.update({
            rut_proveedor,
            total_compra: total
        });

        response.status(200).json({ success: true });
    } catch (error) {
        response.status(500).json({ error: 'Error al editar la compra' });
    }
};

export const eliminarCompra = async (request: Request, response: Response) => {
    try {
        const { id_compra } = request.params;
        const compra = await Compra.findByPk(id_compra, {
            include: [{ model: Detalle_compra, include: [Producto] }]
        });

        if (!compra) {
            return response.status(404).json({ error: 'Compra no encontrada' });
        }

        // Validar que TODOS los productos aún existen
        for (const detalle of compra.detalles) {
            if (!detalle.producto) {
                return response.status(409).json({
                    code: 'PRODUCTO_ELIMINADO',
                    message: 'No se puede anular: Producto eliminado del sistema. Contacte administrador.',
                    detalles: { compra_id: id_compra, producto_id: detalle.id_producto }
                });
            }
        }

        // Validar que el stock no quedará negativo para ningún producto
        const productosConProblemas = [];
        
        for (const detalle of compra.detalles) {
            const inventario = await Inventario.findOne({
                where: {
                    id_producto: detalle.id_producto,
                    id_talla: detalle.id_talla
                }
            });

            if (inventario) {
                const stockResultante = inventario.stock_actual - detalle.cantidad_adquirida;
                if (stockResultante < 0) {
                    productosConProblemas.push({
                        producto: detalle.producto.nombre_producto,
                        talla_id: detalle.id_talla,
                        stock_actual: inventario.stock_actual,
                        cantidad_a_descontar: detalle.cantidad_adquirida,
                        stock_resultante: stockResultante
                    });
                }
            }
        }

        if (productosConProblemas.length > 0) {
            return response.status(409).json({
                success: false,
                code: 'STOCK_INSUFICIENTE',
                message: 'No se puede anular la compra: El stock de algunos productos quedaría en negativo.',
                detalles: productosConProblemas
            });
        }

        // Revertir inventario
        for (const detalle of compra.detalles) {
            await Inventario.decrement('stock_actual', {
                by: detalle.cantidad_adquirida,
                where: {
                    id_producto: detalle.id_producto,
                    id_talla: detalle.id_talla
                }
            });
        }

        // Cambiar estado a anulada
        await compra.update({ estado_compra: 'anulada' });

        // Eliminar los detalles de la compra
        await Detalle_compra.destroy({
            where: { id_compra: id_compra }
        });

        response.status(200).json({ success: true, message: 'Compra anulada, inventario revertido' });
    } catch (error) {
        console.error('Error al anular compra:', error);
        response.status(500).json({ error: 'Error al anular la compra' });
    }
};

export const imprimirCompra = async (request: Request, response: Response) => {
    try {
        const { id_compra } = request.params;

        if (!id_compra) {
            return response.status(400).json({ message: "El ID de la compra es obligatorio" });
        }

        // Buscar la compra con sus relaciones
        const compra = await Compra.findByPk(id_compra, {
            include: [
                { model: Proveedor, attributes: ["rut_proveedor", "nombre_proveedor", "contacto_proveedor"] },
                {
                    model: Detalle_compra,
                    include: [
                        { model: Producto, attributes: ["nombre_producto"] },
                        { model: Talla, attributes: ["nombre_talla"] }
                    ],
                },
            ],
        });

        if (!compra) {
            return response.status(404).json({ message: "Compra no encontrada" });
        }

        const proveedor = compra.proveedor;
        const detalles = compra.detalles;

        if (!detalles || detalles.length === 0) {
            return response.status(404).json({ message: "La compra no tiene detalles asociados" });
        }

        // Crear documento PDF con jsPDF
        const doc = new jsPDF();

        // ENCABEZADO DE LA COMPROBANTE
        
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
        
        // INFORMACIÓN DEL COMPROBANTE
        
        // Título "COMPROBANTE DE COMPRA"
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('COMPROBANTE DE COMPRA', 105, 50, { align: 'center' });
        
        // Recuadro de información de comprobante (derecha)
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.rect(130, 55, 70, 30);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('N° Compra:', 135, 61);
        doc.text('Fecha:', 135, 68);
        doc.text('Hora:', 135, 75);
        
        doc.setFont('helvetica', 'normal');
        doc.text(String(compra.id_compra).padStart(8, '0'), 165, 61);
        
        // Formato de fecha y hora chilena separadas
        const fechaHora = new Date(compra.fecha_compra).toLocaleString('es-CL', { 
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
        
        // INFORMACIÓN DEL PROVEEDOR
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('DATOS DEL PROVEEDOR', 10, 62);
        
        doc.setDrawColor(200, 200, 200);
        doc.rect(10, 65, 115, 15);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Nombre: ${proveedor?.nombre_proveedor || 'N/A'}`, 12, 71);
        doc.text(`RUT: ${proveedor?.rut_proveedor || 'N/A'}`, 12, 77);
        
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
            const nombreProducto = detalle.producto?.nombre_producto || 'Producto N/A';
            const nombreTalla = detalle.talla?.nombre_talla || 'N/A';
            const cantidad = detalle.cantidad_adquirida || 0;
            const precioUnitario = detalle.precio_unitario_compra || 0;
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
        doc.text(`$${compra.total_compra.toLocaleString('es-CL')}`, 195, yPos + 19, { align: 'right' });
        
        // PIE DE PÁGINA
        
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        
        const piePagina = yPos + 35;
        doc.line(10, piePagina, 200, piePagina);
        doc.text('Este documento es un comprobante de compra para control de inventario.', 105, piePagina + 5, { align: 'center' });
        
        // Devolver el PDF como archivo descargable
        const pdfBuffer = doc.output("arraybuffer");
        response.setHeader("Content-Type", "application/pdf");
        response.setHeader("Content-Disposition", `inline; filename=compra_${String(compra.id_compra).padStart(8, '0')}.pdf`);
        response.send(Buffer.from(pdfBuffer));

    } catch (error) {
        console.error("Error al imprimir la compra:", error);
        response.status(500).json({ message: "Error en el servidor" });
    }
};
