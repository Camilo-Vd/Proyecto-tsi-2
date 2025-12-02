import { array, object, string, nonEmpty, pipe, type InferOutput, check } from "valibot";
import { validarRUT } from "../utils/rutUtils";

export const ProveedorSchema = object({
    rut_proveedor: pipe(
        string(), 
        nonEmpty('El RUT no puede estar vacío'),
        check((rut) => validarRUT(rut), 'El RUT ingresado no es válido')
    ),
    nombre_proveedor: string(),
    contacto_proveedor: string(),
    direccion_proveedor: string(),
})

export const ProveedorEditarSchema = object({
    rut_proveedor: pipe(
        string(), 
        nonEmpty('El RUT no puede estar vacío'),
        check((rut) => validarRUT(rut), 'El RUT ingresado no es válido')
    ),
    nombre_proveedor: string(),
    contacto_proveedor: string(),
    direccion_proveedor: string(),
});

export const ProveedoresSchema = array(ProveedorSchema);

// Schema para datos del servidor (sin validación de RUT)
export const ProveedorServerSchema = object({
    rut_proveedor: string(),
    nombre_proveedor: string(),
    contacto_proveedor: string(),
    direccion_proveedor: string(),
});

export const ProveedoresServerSchema = array(ProveedorServerSchema);

export type Proveedor = InferOutput<typeof ProveedorSchema>;
export type ProveedorServer = InferOutput<typeof ProveedorServerSchema>;