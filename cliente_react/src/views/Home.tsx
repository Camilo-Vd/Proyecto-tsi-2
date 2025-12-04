import { Link } from "react-router-dom";
import { useUsuario } from "../context/UsuarioContext";

export default function Home() {
    const { usuario } = useUsuario();
    const esAdmin = usuario?.rol_usuario === "Administrador";

    return (
        <div className="container mt-5" style={{ background: "#f8fafc", borderRadius: "16px", padding: "32px" }}>
            {/* Saludo personalizado */}
            <div className="text-center mb-5">
                <h2 className="fw-bold" style={{ color: "#2d3748", fontSize: "2rem" }}>
                    Hola, <span style={{ color: "#667eea" }}>{usuario?.nombre_usuario}</span>
                </h2>
                <p className="lead" style={{ color: "#4a5568" }}>
                    {esAdmin 
                        ? "Panel de administración - Gestiona todos los aspectos del negocio"
                        : "Panel de vendedor - Registra ventas y gestiona clientes"}
                </p>
            </div>

            {/* Menú Principal - TODOS */}
            <div className="row g-4 justify-content-center">
                {/* Inventario */}
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

                {/* Ventas */}
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

                {/* Clientes */}
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
            </div>

            {/* Segunda fila - Proveedores y Configuración para todos */}
            <div className="row g-4 mt-3 justify-content-center">
                {/* Proveedores */}
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

                {/* Configuración */}
                <div className="col-md-4">
                    <div className="card shadow-lg border-0 h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-gear-fill" style={{ fontSize: "2.5rem", color: "#495057" }}></i>
                            <h5 className="card-title mt-2">Configuración</h5>
                            <p className="card-text">Ajustes y configuración general del sistema.</p>
                            <Link to="/configuraciones" className="btn btn-secondary mt-2">
                                <i className="bi bi-arrow-right-circle me-2"></i>
                                Ir a Configuración
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tercera fila - Solo para Admin */}
            {esAdmin && (
                <div className="row g-4 mt-3 justify-content-center">
                    {/* Compras */}
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

                    {/* Reportes */}
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

                    {/* Usuarios */}
                    <div className="col-md-4">
                        <div className="card shadow-lg border-0 h-100">
                            <div className="card-body text-center">
                                <i className="bi bi-people-fill" style={{ fontSize: "2.5rem", color: "#6c757d" }}></i>
                                <h5 className="card-title mt-2">Usuarios</h5>
                                <p className="card-text">Gestiona permisos y accesos de los usuarios del sistema.</p>
                                <Link to="/usuarios" className="btn btn-secondary mt-2">
                                    <i className="bi bi-arrow-right-circle me-2"></i>
                                    Ir a Usuarios
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}