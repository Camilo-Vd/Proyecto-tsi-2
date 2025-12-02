import { Link } from "react-router-dom";

export default function Compras() {
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-cart4 me-2"></i>
                    Compras
                </h1>
                <Link to="/compras/registrar" className="btn btn-warning text-white">
                    <i className="bi bi-plus-circle me-2"></i>
                    Registrar compra
                </Link>
            </div>
            <p>Aquí puedes gestionar las compras de productos.</p>
            {/* Filtros */}
            <div className="card p-3 mb-3">
                <div className="row g-2">
                    <div className="col-md-3">
                        <input type="date" className="form-control" placeholder="Desde" />
                    </div>
                    <div className="col-md-3">
                        <input type="date" className="form-control" placeholder="Hasta" />
                    </div>
                    <div className="col-md-3">
                        <select className="form-select">
                            <option>Proveedor</option>
                            <option>Proveedor A</option>
                            <option>Proveedor B</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <input type="text" className="form-control" placeholder="Buscar producto" />
                    </div>
                </div>
            </div>
            {/* Tabla de historial de compras */}
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID Compra</th>
                            <th>Fecha/Hora</th>
                            <th>Proveedor</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>5001</td>
                            <td>25/09/2025 10:15</td>
                            <td>Proveedor A</td>
                            <td>$50.000</td>
                            <td>
                                <button className="btn btn-sm btn-info me-2" title="Ver detalle">
                                    <i className="bi bi-eye"></i>
                                </button>
                                <button className="btn btn-sm btn-secondary" title="Exportar PDF">
                                    <i className="bi bi-file-earmark-pdf"></i>
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