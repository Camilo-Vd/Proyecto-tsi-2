import { Form, Link } from "react-router-dom";

export default function InventarioAgregar() {
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-plus-circle me-2"></i>
                    Agregar Producto
                </h1>
                <Link to="/inventario" className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Volver a inventario
                </Link>
            </div>
            <p>Formulario para agregar un nuevo producto al inventario.</p>
            <Form method="POST" className="card p-4 shadow-lg" style={{ maxWidth: 600, margin: "0 auto" }}>
                <div className="mb-3">
                    <label className="form-label">Código</label>
                    <input type="text" className="form-control" name="codigo" placeholder="Ej: 001" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nombre del producto</label>
                    <input type="text" className="form-control" name="nombre" placeholder="Ej: Camiseta Básica" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <input type="text" className="form-control" name="categoria" placeholder="Ej: Ropa" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Stock inicial</label>
                    <input type="number" className="form-control" name="stock" placeholder="Ej: 25" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Precio unitario</label>
                    <input type="number" className="form-control" name="precio" placeholder="Ej: 9990" required />
                </div>
                <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-success">
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar producto
                    </button>
                    <Link to="/inventario" className="btn btn-danger">
                        <i className="bi bi-x-lg me-2"></i>
                        Cancelar
                    </Link>
                </div>
            </Form>
        </div>
    );
}