import { array, object, string, number, type InferOutput } from "valibot";

export const TallaSchema = object({
    id_talla: number(),
    nombre_talla: string(),
});

export const TallasSchema = array(TallaSchema);

export type Talla = InferOutput<typeof TallaSchema>;
export type Tallas = InferOutput<typeof TallasSchema>;
