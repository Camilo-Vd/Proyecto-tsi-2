import { array, nonEmpty, object, pipe, string, type InferOutput, check } from "valibot";
import { validarRUT } from "../utils/rutUtils";

export const UsuarioSchema = object({
    rut_usuario: pipe(
        string(), 
        nonEmpty('El RUT no puede estar vacío'),
        check((rut) => validarRUT(rut), 'El RUT ingresado no es válido')
    ),
    nombre_usuario: string(),
    contraseña: string(),
    rol_usuario: string()
});

export const LoginFormSchema = object({
    rut_usuario: pipe(
        string(),
        nonEmpty('El RUT no puede estar vacío'),
        check((rut) => validarRUT(rut), 'El RUT ingresado no es válido')
    ),
    contraseña: pipe(string(),nonEmpty('La contraseña no puede estar vacía'))
});

export const UsuariosSchema = array(UsuarioSchema);

export type Usuario = InferOutput<typeof UsuarioSchema>;