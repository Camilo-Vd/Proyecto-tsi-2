import { array, object, number, string } from "valibot";
import type { InferOutput } from "valibot";

export const DetalleCompraSchema = object({
    id_producto: number(),
    id_talla: number(),
    cantidad_adquirida: number(),
    precio_unitario_compra: number()
});

export const CompraSchema = object({
    rut_proveedor: number(),
    detalles: array(DetalleCompraSchema)
});

export const ComprasSchema = array(object({
    id_compra: number(),
    rut_proveedor: number(),
    fecha_compra: string(),
    total_compra: number()
}));

export type DetalleCompra = InferOutput<typeof DetalleCompraSchema>;
export type Compra = InferOutput<typeof CompraSchema>;
export type Compras = InferOutput<typeof ComprasSchema>;
