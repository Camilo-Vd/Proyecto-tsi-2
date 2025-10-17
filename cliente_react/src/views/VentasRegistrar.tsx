import { Form, Link } from "react-router-dom";

export default function VentasRegistrar() {
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-plus-circle me-2"></i>
                    Registrar Venta
                </h1>
                <Link to="/ventas" className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Volver a ventas
                </Link>
            </div>
            <p>Formulario para registrar una nueva venta de productos.</p>
            <Form method="POST" className="card p-4 shadow-lg">
                {/* Cliente */}
                <div className="mb-3">
                    <label className="form-label">Cliente (opcional)</label>
                    <div className="input-group mb-2">
                        <select className="form-select" name="cliente">
                            <option value="">Compra rápida (sin cliente)</option>
                            <option value="Juan Pérez">Juan Pérez</option>
                            <option value="María Gómez">María Gómez</option>
                        </select>
                        <Link to="/clientes/registrar" className="btn btn-outline-primary" state={{ from: "/ventas/registrar" }}>
                            <i className="bi bi-person-plus me-1"></i>
                            Agregar nuevo cliente
                        </Link>
                    </div>
                </div>
                {/* Vendedor */}
                <div className="mb-3">
                    <label className="form-label">Vendedor</label>
                    <input type="text" className="form-control" value="Camila López" disabled />
                </div>
                {/* Productos vendidos */}
                <div className="mb-3 border rounded p-3">
                    <label className="form-label">Agregar producto</label>
                    <div className="row g-2 align-items-end">
                        <div className="col-md-4">
                            <input type="text" className="form-control" placeholder="Buscar por nombre o código" />
                        </div>
                        <div className="col-md-2">
                            <select className="form-select">
                                <option>Talla</option>
                                <option>S</option>
                                <option>M</option>
                                <option>L</option>
                                <option>XL</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <input type="number" className="form-control" min="1" placeholder="Cantidad" />
                        </div>
                        <div className="col-md-2">
                            <input type="text" className="form-control" placeholder="Precio unitario" disabled />
                        </div>
                        <div className="col-md-2">
                            <button type="button" className="btn btn-success w-100">
                                <i className="bi bi-plus-circle me-1"></i>
                                Agregar
                            </button>
                        </div>
                    </div>
                    <div className="form-text mt-1">
                        Stock disponible: <b>10</b> unidades (ejemplo)
                    </div>
                </div>
                {/* Tabla de productos agregados */}
                <div className="mb-3">
                    <label className="form-label">Productos en la venta</label>
                    <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Talla</th>
                                    <th>Cantidad</th>
                                    <th>Precio unitario</th>
                                    <th>Sub total</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Camiseta Básica</td>
                                    <td>M</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-1">
                                            <button type="button" className="btn btn-sm btn-outline-secondary">-</button>
                                            <span>2</span>
                                            <button type="button" className="btn btn-sm btn-outline-secondary">+</button>
                                        </div>
                                    </td>
                                    <td>$15.990</td>
                                    <td>$31.980</td>
                                    <td>
                                        <button type="button" className="btn btn-sm btn-danger" title="Eliminar">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Total y método de pago */}
                <div className="mb-3 row">
                    <div className="col-md-6">
                        <label className="form-label">Método de pago</label>
                        <select className="form-select" name="metodo_pago" required>
                            <option value="">Selecciona método</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="transferencia">Transferencia</option>
                        </select>
                    </div>
                    <div className="col-md-6 d-flex align-items-end justify-content-end">
                        <h4 className="mb-0">
                            Total: <span className="text-success">$31.980</span>
                        </h4>
                    </div>
                </div>
                {/* Botones de acción */}
                <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-success">
                        <i className="bi bi-check-lg me-2"></i>
                        Confirmar venta
                    </button>
                    <Link to="/ventas" className="btn btn-danger">
                        <i className="bi bi-x-lg me-2"></i>
                        Cancelar
                    </Link>
                </div>
            </Form>
        </div>
    );
}