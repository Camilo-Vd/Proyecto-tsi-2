import { Form, Link, redirect, useSearchParams, useActionData, type ActionFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { proveedorAñadir } from "../service/ProveedorService";
import { formatearRUTInput } from "../utils/rutUtils";

export async function action({ request }: ActionFunctionArgs) {
    const formData = Object.fromEntries(await request.formData());
    const resultado = await proveedorAñadir(formData);
    if (!resultado?.success) {
        return resultado;
    }
    // Obtén el backUrl del formData
    const backUrl = String(formData.backUrl || "/proveedores");
    return redirect(backUrl);
}

export default function ProveedorAñadir() {
    const [searchParams] = useSearchParams();
    const actionData = useActionData() as { success: boolean; errors?: string[]; detalleErrores?: Record<string, string[]> } | undefined;
    const backUrl = searchParams.get("from") || "/proveedores";
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
                    Registrar Proveedor
                </h1>
                <Link to={backUrl} className="btn btn-secondary">
                    <i className="bi bi-arrow-left me-2"></i>Volver
                </Link>
            </div>
            <p>Formulario para registrar un nuevo proveedor en el sistema.</p>
            <Form method="POST" className="card p-4 shadow-lg" style={{ maxWidth: 500, margin: "0 auto" }}>
                {/* Mostrar error general */}
                {actionData && !actionData.success && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <strong>{actionData.errors?.[0] || 'Error al registrar el proveedor'}</strong>
                        {actionData.detalleErrores && Object.keys(actionData.detalleErrores).length > 0 && (
                            <ul className="mb-0 mt-2">
                                {Object.entries(actionData.detalleErrores).map(([campo, errores]) => (
                                    <li key={campo}>{errores.join(", ")}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
                <input type="hidden" name="backUrl" value={backUrl} />
                
                <div className="mb-3">
                    <label className="form-label fw-bold">
                        RUT del proveedor {actionData?.detalleErrores?.rut_proveedor && <span className="text-danger">*</span>}
                    </label>
                    <input 
                        type="text" 
                        className={`form-control ${actionData?.detalleErrores?.rut_proveedor ? 'is-invalid' : ''}`}
                        name="rut_proveedor" 
                        placeholder="12.345.678-9" 
                        value={rutFormateado}
                        onChange={manejarCambioRut}
                        maxLength={12}
                    />
                    {actionData?.detalleErrores?.rut_proveedor && (
                        <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {actionData.detalleErrores.rut_proveedor.join(", ")}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">
                        Nombre o razón social {actionData?.detalleErrores?.nombre_proveedor && <span className="text-danger">*</span>}
                    </label>
                    <input 
                        type="text" 
                        className={`form-control ${actionData?.detalleErrores?.nombre_proveedor ? 'is-invalid' : ''}`}
                        name="nombre_proveedor" 
                        placeholder="Proveedor S.A." 
                    />
                    {actionData?.detalleErrores?.nombre_proveedor && (
                        <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {actionData.detalleErrores.nombre_proveedor.join(", ")}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">
                        Contacto {actionData?.detalleErrores?.contacto_proveedor && <span className="text-danger">*</span>}
                    </label>
                    <input 
                        type="text" 
                        className={`form-control ${actionData?.detalleErrores?.contacto_proveedor ? 'is-invalid' : ''}`}
                        name="contacto_proveedor" 
                        placeholder="+56 9 1234 5678" 
                    />
                    {actionData?.detalleErrores?.contacto_proveedor && (
                        <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {actionData.detalleErrores.contacto_proveedor.join(", ")}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">
                        Dirección {actionData?.detalleErrores?.direccion_proveedor && <span className="text-danger">*</span>}
                    </label>
                    <input 
                        type="text" 
                        className={`form-control ${actionData?.detalleErrores?.direccion_proveedor ? 'is-invalid' : ''}`}
                        name="direccion_proveedor" 
                        placeholder="Av. Ejemplo 123, Santiago" 
                    />
                    {actionData?.detalleErrores?.direccion_proveedor && (
                        <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {actionData.detalleErrores.direccion_proveedor.join(", ")}
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
                        Guardar proveedor
                    </button>                    
                </div>
            </Form>
        </div>
    );
}