import { array, object, string, type InferOutput } from "valibot";

export const ClienteSchema = object({
    rut_cliente: string(),
    nombre: string(),
    contacto: string(),
})

export const ClienteEditarSchema = object({
    rut_cliente: string(),
    nombre: string(),
    contacto: string(),
})

export const ClientesSchema = array(ClienteSchema);

export type Cliente = InferOutput<typeof ClienteSchema>;