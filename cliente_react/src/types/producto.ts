import { array, object, string, number, type InferOutput } from "valibot";

export const ProductoSchema = object({
    id_producto: number(),
    nombre_producto: string(),
    categoria: object({
        id_categoria: number(),
        nombre_categoria: string(),
    }),
});

export const ProductosSchema = array(ProductoSchema);

export type Producto = InferOutput<typeof ProductoSchema>;
export type Productos = InferOutput<typeof ProductosSchema>;
