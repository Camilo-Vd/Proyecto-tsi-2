import { Form, Link } from "react-router-dom";

export default function ComprasRegistrar() {
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-plus-circle me-2"></i>
                    Registrar Compra
                </h1>
                <Link to="/compras" className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Volver a compras
                </Link>
            </div>
            <p>Formulario para registrar una nueva compra.</p>
            <Form method="POST" className="card p-4 shadow-lg" style={{ maxWidth: 600, margin: "0 auto" }}>
                <div className="mb-3">
                    <label className="form-label">Proveedor</label>
                    <select className="form-select" name="proveedor" required>
                        <option value="">Selecciona un proveedor</option>
                        <option value="Proveedor S.A.">Proveedor S.A.</option>
                        {/* Más opciones */}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Productos</label>
                    <input type="text" className="form-control" name="productos" placeholder="Ej: Camiseta Básica x10, Jeans x5" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Total</label>
                    <input type="number" className="form-control" name="total" placeholder="Ej: 50000" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha</label>
                    <input type="date" className="form-control" name="fecha" required />
                </div>
                <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-success">
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar compra
                    </button>
                    <Link to="/compras" className="btn btn-danger">
                        <i className="bi bi-x-lg me-2"></i>
                        Cancelar
                    </Link>
                </div>
            </Form>
        </div>
    );
}