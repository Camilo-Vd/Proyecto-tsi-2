import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="container mt-5" style={{ background: "#f8fafc", borderRadius: "16px", padding: "32px" }}>
            <div className="text-center mb-5">
                <h2 className="fw-bold" style={{ color: "#2d3748" }}>Bienvenido/a al Sistema de Gestión</h2>
                <p className="lead" style={{ color: "#4a5568" }}>
                    Administra tu inventario, ventas, compras, clientes y proveedores de manera fácil y eficiente.
                </p>
            </div>
            <div className="row g-4 justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow-lg border-0 h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-box-seam" style={{ fontSize: "2.5rem", color: "#0d6efd" }}></i>
                            <h5 className="card-title mt-2">Inventario</h5>
                            <p className="card-text">Consulta y gestiona tus productos y stock.</p>
                            <Link to="/inventario" className="btn btn-primary mt-2">
                                <i className="bi bi-arrow-right-circle me-2"></i>
                                Ir a Inventario
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-lg border-0 h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-cash-stack" style={{ fontSize: "2.5rem", color: "#198754" }}></i>
                            <h5 className="card-title mt-2">Ventas</h5>
                            <p className="card-text">Registra ventas y revisa el historial de transacciones.</p>
                            <Link to="/ventas" className="btn btn-success mt-2">
                                <i className="bi bi-arrow-right-circle me-2"></i>
                                Ir a Ventas
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-lg border-0 h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-cart4" style={{ fontSize: "2.5rem", color: "#ffc107" }}></i>
                            <h5 className="card-title mt-2">Compras</h5>
                            <p className="card-text">Gestiona compras a proveedores y actualiza tu inventario.</p>
                            <Link to="/compras" className="btn btn-warning mt-2 text-white">
                                <i className="bi bi-arrow-right-circle me-2"></i>
                                Ir a Compras
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row g-4 mt-3 justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow-lg border-0 h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-person-lines-fill" style={{ fontSize: "2.5rem", color: "#0dcaf0" }}></i>
                            <h5 className="card-title mt-2">Clientes</h5>
                            <p className="card-text">Administra la información de tus clientes.</p>
                            <Link to="/clientes" className="btn btn-info mt-2 text-white">
                                <i className="bi bi-arrow-right-circle me-2"></i>
                                Ir a Clientes
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-lg border-0 h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-building" style={{ fontSize: "2.5rem", color: "#6c757d" }}></i>
                            <h5 className="card-title mt-2">Proveedores</h5>
                            <p className="card-text">Consulta y gestiona tus proveedores.</p>
                            <Link to="/proveedores" className="btn btn-secondary mt-2">
                                <i className="bi bi-arrow-right-circle me-2"></i>
                                Ir a Proveedores
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-lg border-0 h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-bar-chart-line-fill" style={{ fontSize: "2.5rem", color: "#212529" }}></i>
                            <h5 className="card-title mt-2">Reportes</h5>
                            <p className="card-text">Visualiza reportes y estadísticas del sistema.</p>
                            <Link to="/reportes" className="btn btn-dark mt-2">
                                <i className="bi bi-arrow-right-circle me-2"></i>
                                Ir a Reportes
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}