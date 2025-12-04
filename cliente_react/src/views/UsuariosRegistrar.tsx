import { Form, Link, redirect, useSearchParams, useActionData, type ActionFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { usuarioRegistrar } from "../service/UsuarioService";
import { formatearRUTInput } from "../utils/rutUtils";

export async function action({ request }: ActionFunctionArgs) {
    const formData = Object.fromEntries(await request.formData());
    const resultado = await usuarioRegistrar(formData);
    if (!resultado?.success) {
        return resultado;
    }
    return redirect("/usuarios");
}

export default function UsuariosRegistrar() {
    const [searchParams] = useSearchParams();
    const actionData = useActionData() as { success: boolean; error?: string; detalleErrores?: Record<string, string[]> } | undefined;
    const backUrl = searchParams.get("from") || "/usuarios";
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
                <Link to={backUrl} className="btn btn-secondary">
                    <i className="bi bi-arrow-left me-2"></i>Volver
                </Link>
            </div>
            <p>Formulario para registrar un nuevo usuario en el sistema.</p>
            
            <Form method="POST" className="card p-4 shadow-lg" style={{ maxWidth: 500, margin: "0 auto" }}>
                {/* Mostrar error general */}
                {actionData && !actionData.success && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <strong>{actionData.error || 'Error al registrar el usuario'}</strong>
                        {actionData.detalleErrores && Object.keys(actionData.detalleErrores).length > 0 && (
                            <ul className="mb-0 mt-2">
                                {Object.entries(actionData.detalleErrores).map(([campo, errores]) => (
                                    <li key={campo}>{errores.join(", ")}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label fw-bold">
                        RUT {actionData?.detalleErrores?.rut_usuario && <span className="text-danger">*</span>}
                    </label>
                    <input 
                        type="text" 
                        className={`form-control ${actionData?.detalleErrores?.rut_usuario ? 'is-invalid' : ''}`}
                        name="rut_usuario" 
                        placeholder="12.345.678-9" 
                        value={rutFormateado}
                        onChange={manejarCambioRut}
                        maxLength={12}
                    />
                    {actionData?.detalleErrores?.rut_usuario && (
                        <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {actionData.detalleErrores.rut_usuario.join(", ")}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">
                        Nombre de usuario {actionData?.detalleErrores?.nombre_usuario && <span className="text-danger">*</span>}
                    </label>
                    <input 
                        type="text" 
                        className={`form-control ${actionData?.detalleErrores?.nombre_usuario ? 'is-invalid' : ''}`}
                        name="nombre_usuario" 
                        placeholder="Camila López" 
                        minLength={3}
                    />
                    {actionData?.detalleErrores?.nombre_usuario && (
                        <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {actionData.detalleErrores.nombre_usuario.join(", ")}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">
                        Contraseña inicial {actionData?.detalleErrores?.contraseña && <span className="text-danger">*</span>}
                    </label>
                    <input 
                        type="password" 
                        className={`form-control ${actionData?.detalleErrores?.contraseña ? 'is-invalid' : ''}`}
                        name="contraseña" 
                        placeholder="Mínimo 6 caracteres" 
                        minLength={6}
                    />
                    {actionData?.detalleErrores?.contraseña && (
                        <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {actionData.detalleErrores.contraseña.join(", ")}
                        </div>
                    )}
                    <div className="form-text">
                        <i className="bi bi-info-circle me-1"></i>
                        El usuario podrá cambiar esta contraseña en su primer inicio de sesión.
                    </div>
                </div>

                <div className="mb-4">
                    <label className="form-label fw-bold">
                        Rol {actionData?.detalleErrores?.rol_usuario && <span className="text-danger">*</span>}
                    </label>
                    <select 
                        className={`form-select ${actionData?.detalleErrores?.rol_usuario ? 'is-invalid' : ''}`}
                        name="rol_usuario"
                        defaultValue=""
                    >
                        <option value="">-- Selecciona un rol --</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Vendedor">Vendedor</option>
                    </select>
                    {actionData?.detalleErrores?.rol_usuario && (
                        <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {actionData.detalleErrores.rol_usuario.join(", ")}
                        </div>
                    )}
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <Link to={backUrl} className="btn btn-danger">
                        <i className="bi bi-x-lg me-2"></i>
                        Cancelar
                    </Link>
                    <button type="submit" className="btn btn-success">
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar usuario
                    </button>                    
                </div>
            </Form>
        </div>
    );
}