import { Form, Link, redirect } from "react-router-dom";
import { useState } from "react";
import { usuarioRegistrar } from "../service/UsuarioServise";
import { formatearRUTInput } from "../utils/rutUtils";

export async function action({ request }: { request: Request }) {
    const formData = Object.fromEntries(await request.formData());
    console.log("Datos del formulario:", formData);
    const resultado = await usuarioRegistrar(formData);
    if (!resultado?.success) {
        return resultado;
    }
    return redirect("/usuarios");
}

export default function UsuariosRegistrar() {
    const [rutFormateado, setRutFormateado] = useState("");

    const manejarCambioRut = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        const rutFormateadoNuevo = formatearRUTInput(valor);
        setRutFormateado(rutFormateadoNuevo);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-person-plus me-2"></i>
                    Registrar Usuario
                </h1>
                <Link to="/usuarios" className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Volver a usuarios
                </Link>
            </div>
            <p>Formulario para registrar un nuevo usuario.</p>
            <Form method="POST" className="card p-4 shadow-lg" style={{ maxWidth: 500, margin: "0 auto" }}>
                <div className="mb-3">
                    <label className="form-label">RUT</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="rut_usuario" 
                        placeholder="Ej: 12.345.678-9" 
                        value={rutFormateado}
                        onChange={manejarCambioRut}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input type="text" className="form-control" name="nombre_usuario" placeholder="Ej: Camila López" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña inicial</label>
                    <input type="password" className="form-control" name="contraseña" placeholder="Contraseña temporal" required />
                    <div className="form-text">
                        El usuario podrá cambiar la contraseña en su primer inicio de sesión.
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select className="form-select" name="rol_usuario" required>
                        <option value="">Selecciona un rol</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Vendedor">Vendedor</option>
                    </select>
                </div>
                <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-success">
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar
                    </button>
                    <Link to="/usuarios" className="btn btn-danger">
                        <i className="bi bi-x-lg me-2"></i>
                        Cancelar
                    </Link>
                </div>
            </Form>
        </div>
    );
}