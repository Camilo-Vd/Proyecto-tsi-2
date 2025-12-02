import { array, object, number, string } from "valibot";
import type { InferOutput } from "valibot";

export const DetalleVentaSchema = object({
    id_producto: number(),
    id_talla: number(),
    cantidad_vendida: number(),
    precio_unitario_venta: number()
});

export const VentaSchema = object({
    rut_cliente: number(),
    rut_usuario: number(),
    detalles: array(DetalleVentaSchema)
});

export const VentasSchema = array(object({
    id_venta: number(),
    rut_cliente: number(),
    rut_usuario: number(),
    fecha_hora_venta: string(),
    total_venta: number()
}));

// Schema para datos del servidor
export const VentaServerSchema = object({
    id_venta: number(),
    rut_cliente: string(),
    fecha_venta: string(),
    total_venta: number()
});

export const VentasServerSchema = array(VentaServerSchema);

export type DetalleVenta = InferOutput<typeof DetalleVentaSchema>;
export type Venta = InferOutput<typeof VentaSchema>;
export type Ventas = InferOutput<typeof VentasSchema>;
export type VentaServer = InferOutput<typeof VentaServerSchema>;
