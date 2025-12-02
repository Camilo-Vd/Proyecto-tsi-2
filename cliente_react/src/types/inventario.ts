import { array, object, number } from "valibot";
import type { InferOutput } from "valibot";

export const InventarioSchema = object({
    id_producto: number(),
    id_talla: number(),
    precio_unitario: number(),
    stock_actual: number()
});

export const InventariosSchema = array(InventarioSchema);

export type Inventario = InferOutput<typeof InventarioSchema>;
export type Inventarios = InferOutput<typeof InventariosSchema>;
