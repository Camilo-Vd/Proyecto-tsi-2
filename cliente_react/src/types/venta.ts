import { array, object, number, string, optional, union } from "valibot";
import type { InferOutput } from "valibot";

export const DetalleVentaSchema = object({
    id_producto: number(),
    nombre_producto: optional(string()),
    id_talla: number(),
    nombre_talla: optional(string()),
    cantidad_vendida: number(),
    precio_unitario_venta: number(),
    subtotal: optional(number()),
});

export const VentaSchema = object({
    id_venta: number(),
    fecha_hora: string(),
    cliente: optional(string()),
    rut_cliente: union([string(), number()]), // Acepta tanto string como número
    vendedor: optional(string()),
    total_venta: number(),
    estado_venta: optional(string()),
    detalles: optional(array(DetalleVentaSchema)),
});

export const VentasSchema = array(VentaSchema);

// Schema para el servidor que puede retornar con wrapper
export const VentasResponseSchema = object({
    message: string(),
    total_ventas: number(),
    ventas: VentasSchema,
});

export type DetalleVenta = InferOutput<typeof DetalleVentaSchema>;
export type Venta = InferOutput<typeof VentaSchema>;
export type VentasResponse = InferOutput<typeof VentasResponseSchema>;
export type Ventas = InferOutput<typeof VentasSchema>;
