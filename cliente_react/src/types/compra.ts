import { array, object, number, string, optional } from "valibot";
import type { InferOutput } from "valibot";

export const DetalleCompraSchema = object({
    id_producto: number(),
    id_talla: number(),
    cantidad_adquirida: number(),
    precio_unitario_compra: number(),
});

export const ProveedorResumenSchema = object({
    nombre_proveedor: string(),
});

export const CompraSchema = object({
    id_compra: number(),
    rut_proveedor: number(),
    fecha_compra: string(),
    total_compra: number(),
    estado_compra: optional(string()),
    proveedor: optional(ProveedorResumenSchema),
});

export const ComprasSchema = array(CompraSchema);

// Para respuesta que puede incluir detalles
export const CompraConDetallesSchema = object({
    id_compra: number(),
    rut_proveedor: number(),
    fecha_compra: string(),
    total_compra: number(),
    estado_compra: optional(string()),
    detalles: array(DetalleCompraSchema),
    proveedor: optional(ProveedorResumenSchema),
});

export type DetalleCompra = InferOutput<typeof DetalleCompraSchema>;
export type Compra = InferOutput<typeof CompraSchema>;
export type CompraConDetalles = InferOutput<typeof CompraConDetallesSchema>;
export type Compras = InferOutput<typeof ComprasSchema>;
