import { Link } from "react-router-dom";

export default function Ventas() {
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-cash-stack me-2"></i>
                    Ventas
                </h1>
                <Link to="/ventas/registrar" className="btn btn-success">
                    <i className="bi bi-plus-circle me-2"></i>
                    Nueva venta
                </Link>
            </div>
            <p>Gestiona las ventas de productos aquí.</p>
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID Venta</th>
                            <th>Fecha/Hora</th>
                            <th>Cliente</th>
                            <th>Vendedor</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1001</td>
                            <td>25/09/2025 14:30</td>
                            <td>Juan Pérez</td>
                            <td>Camila López</td>
                            <td>$120.000</td>
                            <td>
                                <button className="btn btn-sm btn-info me-2" title="Ver detalle">
                                    <i className="bi bi-eye"></i>
                                </button>
                                <button className="btn btn-sm btn-secondary" title="Reimprimir comprobante">
                                    <i className="bi bi-printer"></i>
                                </button>
                            </td>
                        </tr>
                        {/* Más filas de ejemplo */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}