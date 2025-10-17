import { Form, Link, redirect, useParams, type ActionFunctionArgs } from "react-router-dom";
import { clienteEditar } from "../service/ClienteService";

export async function action({ request }: ActionFunctionArgs) {
    const formData = Object.fromEntries(await request.formData());
    const resultado = await clienteEditar(formData);
    if (!resultado?.success) {
        return resultado;
    }
    return redirect("/clientes");
}

export default function ClientesEditar() {
    const { rut_cliente } = useParams();

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Cliente
                </h1>
                <Link to="/clientes" className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Volver
                </Link>
            </div>
            <p>Modifica solo los datos de contacto del cliente.</p>
            <Form method="POST" className="card p-4 shadow-lg" style={{ maxWidth: 500, margin: "0 auto" }}>
                <input type="hidden" name="rut_cliente" value={rut_cliente} />
                <div className="mb-3">
                    <label className="form-label">RUT del cliente</label>
                    <input type="text" className="form-control" value={rut_cliente} disabled />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nombre del cliente</label>
                    <input type="text" className="form-control" name="nombre" placeholder="Juan Pérez"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input type="text" className="form-control" name="contacto" placeholder="+56 9 1234 5678"/>
                </div>
                <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-success">
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar cambios
                    </button>
                    <Link to="/clientes" className="btn btn-danger">
                        <i className="bi bi-x-lg me-2"></i>
                        Cancelar
                    </Link>
                </div>
            </Form>
        </div>
    );
}