import { array, object, string, number, nonEmpty, pipe, type InferOutput, check, picklist } from "valibot";
import { validarRUT } from "../utils/rutUtils";

export const ClienteSchema = object({
    rut_cliente: pipe(
        string(), 
        nonEmpty('El RUT no puede estar vacío'),
        check((rut) => validarRUT(rut), 'El RUT ingresado no es válido')
    ),
    nombre_cliente: string(),
    contacto_cliente: string(),
})

export const ClienteEditarSchema = object({
    rut_cliente: pipe(
        string(), 
        nonEmpty('El RUT no puede estar vacío'),
        check((rut) => validarRUT(rut), 'El RUT ingresado no es válido')
    ),
    nombre_cliente: string(),
    contacto_cliente: string(),
})

// Schema para datos del servidor (sin validación de RUT)
export const ClienteServerSchema = object({
    rut_cliente: string(),
    nombre_cliente: string(),
    contacto_cliente: string(),
    cantidad_compras: number(),
    estado_cliente: picklist(['activo', 'inactivo']),
})

export const ClientesSchema = array(ClienteSchema);
export const ClientesServerSchema = array(ClienteServerSchema);

export type Cliente = InferOutput<typeof ClienteSchema> & { cantidad_compras?: number; estado_cliente?: 'activo' | 'inactivo' };
export type ClienteServer = InferOutput<typeof ClienteServerSchema>;

