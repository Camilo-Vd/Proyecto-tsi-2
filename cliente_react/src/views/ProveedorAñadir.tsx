import { Form, Link, redirect, useLocation, useActionData, type ActionFunctionArgs } from "react-router-dom";
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
    const location = useLocation();
    const actionData = useActionData() as { success: boolean; errors?: string[] } | undefined;
    const backUrl = location.state?.from || "/proveedores";
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
                    <i className="bi bi-arrow-left"></i> Volver
                </Link>
            </div>
            <p>Formulario para registrar un nuevo proveedor.</p>
            <Form method="POST" className="card p-4 shadow-lg" style={{ maxWidth: 500, margin: "0 auto" }}>
                <input type="hidden" name="backUrl" value={backUrl} />
                
                {/* Mostrar error si existe */}
                {actionData && !actionData.success && (
                    <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {actionData.errors?.map((error, index) => (
                            <span key={index}>{error}</span>
                        ))}
                    </div>
                )}
                
                <div className="mb-3">
                    <label className="form-label">RUT del proveedor</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="rut_proveedor" 
                        placeholder="12.345.678-9" 
                        value={rutFormateado}
                        onChange={manejarCambioRut}
                        maxLength={12}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nombre o razón social</label>
                    <input type="text" className="form-control" name="nombre_proveedor" placeholder="Proveedor S.A." required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contacto</label>
                    <input type="text" className="form-control" name="contacto_proveedor" placeholder="+56 9 1234 5678" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input type="text" className="form-control" name="direccion_proveedor" placeholder="Av. Ejemplo 123, Santiago" required />
                </div>
                <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-success">
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar proveedor
                    </button>
                    <Link to={backUrl} className="btn btn-danger">
                        <i className="bi bi-x-lg me-2"></i>
                        Cancelar
                    </Link>
                </div>
            </Form>
        </div>
    );
}