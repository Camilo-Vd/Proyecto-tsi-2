import { array, object, number, string } from "valibot";
import type { InferOutput } from "valibot";

export const ReporteSchema = object({
    id_producto: number(),
    nombre_producto: string(),
    categoria: string(),
    stock_total: number(),
});

export const ReportesSchema = array(ReporteSchema);

export const BajoStockSchema = array(
    object({
        id_producto: number(),
        nombre_producto: string(),
        nombre_talla: string(),
        stock_actual: number(),
        precio_unitario: number(),
    })
);

export const AgotadosSchema = array(
    object({
        id_producto: number(),
        nombre_producto: string(),
        nombre_talla: string(),
        nombre_proveedor: string(),
    })
);

export type Reporte = InferOutput<typeof ReporteSchema>;
export type Reportes = InferOutput<typeof ReportesSchema>;
export type BajoStock = InferOutput<typeof BajoStockSchema>;
export type Agotados = InferOutput<typeof AgotadosSchema>;
