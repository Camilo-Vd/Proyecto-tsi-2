import { array, object, string, number, type InferOutput, union } from "valibot";

export const InventarioSchema = object({
    id_producto: number(),
    id_talla: number(),
    nombre_producto: string(),
    nombre_categoria: string(),
    nombre_talla: string(),
    precio_unitario: number(),
    stock_actual: number(),
    stock_critico: number(),
});

export const InventariosSchema = array(InventarioSchema);

// Para manejar respuesta envuelta en un objeto
export const InventariosResponseSchema = union([
    InventariosSchema,
    object({
        data: InventariosSchema,
    }),
    object({
        inventarios: InventariosSchema,
    }),
]);

export type Inventario = InferOutput<typeof InventarioSchema>;
export type Inventarios = InferOutput<typeof InventariosSchema>;
