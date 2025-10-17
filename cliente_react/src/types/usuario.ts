import { array, nonEmpty, object, pipe, string, type InferOutput } from "valibot";

export const UsuarioSchema = object({
    rut_usuario: string(),
    nombre_usuario: string(),
    contraseña: string(),
    rol: string()
});

export const LoginFormSchema = object({
    rut_usuario: pipe(string(),nonEmpty('El RUT no puede estar vacío')),
    contraseña: pipe(string(),nonEmpty('La contraseña no puede estar vacía'))
});

export const UsuariosSchema = array(UsuarioSchema);

export type Usuario = InferOutput<typeof UsuarioSchema>;