import { Form, Link, redirect, useParams, useActionData, type ActionFunctionArgs } from "react-router-dom";
import { proveedorEditar } from "../service/ProveedorService";

export async function action({ request }: ActionFunctionArgs) {
    const formData = Object.fromEntries(await request.formData());
    const resultado = await proveedorEditar(formData);
    if (!resultado?.success) {
        return resultado;
    }
    return redirect("/proveedores");
}

export default function ProveedorEditar() {
    const { rut_proveedor } = useParams();
    const actionData = useActionData() as { success: boolean; error?: string } | undefined;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Proveedor
                </h1>
                <Link to="/proveedores" className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Volver
                </Link>
            </div>
            <p>Modifica solo los datos de contacto del proveedor.</p>
            <Form method="POST" className="card p-4 shadow-lg" style={{ maxWidth: 500, margin: "0 auto" }}>
                <input type="hidden" name="rut_proveedor" value={rut_proveedor} />
                
                {/* Mostrar error si existe */}
                {actionData && !actionData.success && (
                    <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {actionData.error}
                    </div>
                )}
                
                <div className="mb-3">
                    <label className="form-label">RUT del proveedor</label>
                    <input type="text" className="form-control" value={rut_proveedor} disabled />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nombre del proveedor</label>
                    <input type="text" className="form-control" name="nombre_proveedor" placeholder="Ej: Proveedor S.A." required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input type="text" className="form-control" name="contacto_proveedor" placeholder="Ej: +56 9 1234 5678" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input type="text" className="form-control" name="direccion_proveedor" placeholder="Ej: Av. Ejemplo 123, Santiago" required />
                </div>
                <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-success">
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar cambios
                    </button>
                    <Link to="/proveedores" className="btn btn-danger">
                        <i className="bi bi-x-lg me-2"></i>
                        Cancelar
                    </Link>
                </div>
            </Form>
        </div>
    );
}