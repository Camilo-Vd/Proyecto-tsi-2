import { array, object, string, type InferOutput } from "valibot";


export const ProveedorSchema = object({
    rut_proveedor: string(),
    nombre: string(),
    contacto: string(),
    direccion: string(),
})

export const ProveedorEditarSchema = object({
    rut_proveedor: string(),
    nombre: string(),
    contacto: string(),
    direccion: string(),
});

export const ProveedoresSchema = array(ProveedorSchema);

export type Proveedor = InferOutput<typeof ProveedorSchema>;