import { array, nonEmpty, object, pipe, string, type InferOutput, check, minLength } from "valibot";
import { validarRUT } from "../utils/rutUtils";

export const UsuarioSchema = object({
    rut_usuario: pipe(
        string(), 
        nonEmpty('El RUT no puede estar vacío'),
        check((rut) => validarRUT(rut), 'El RUT ingresado no es válido')
    ),
    nombre_usuario: pipe(
        string(),
        nonEmpty('El nombre no puede estar vacío')
    ),
    contraseña: pipe(
        string(),
        nonEmpty('La contraseña no puede estar vacía'),
        minLength(6, 'La contraseña debe tener al menos 6 caracteres')
    ),
    rol_usuario: pipe(
        string(),
        nonEmpty('Debe seleccionar un rol'),
        check((rol) => ['Administrador', 'Vendedor'].includes(rol), 'Rol inválido')
    )
});

// Schema para datos del servidor (solo los campos que devuelve la API)
export const UsuarioServerSchema = object({
    rut_usuario: string(),
    nombre_usuario: string(),
    rol_usuario: string(),
    estado_usuario: string()
});

export const LoginFormSchema = object({
    rut_usuario: pipe(
        string(),
        nonEmpty('El RUT no puede estar vacío'),
        check((rut) => validarRUT(rut), 'El RUT ingresado no es válido')
    ),
    contraseña: pipe(
        string(),
        nonEmpty('La contraseña no puede estar vacía')
    )
});

export const UsuariosSchema = array(UsuarioSchema);
export const UsuariosServerSchema = array(UsuarioServerSchema);

export type Usuario = InferOutput<typeof UsuarioServerSchema>;
export type UsuarioServer = InferOutput<typeof UsuarioServerSchema>;