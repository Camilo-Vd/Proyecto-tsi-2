import { NavLink, Link, useNavigate } from "react-router-dom";

export default function NavBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "#1a1a2e" }}>
            <div className="container-fluid">
                <NavLink className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <i className="bi bi-box-seam me-2"></i>
                    <span style={{ letterSpacing: "2px" }}>Gestión Inventario y Ventas</span>
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/inventario">
                                <i className="bi bi-box-seam me-1"></i> Inventario
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/ventas">
                                <i className="bi bi-cash-stack me-1"></i> Ventas
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/compras">
                                <i className="bi bi-cart4 me-1"></i> Compras
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/clientes">
                                <i className="bi bi-person-lines-fill me-1"></i> Clientes
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/proveedores">
                                <i className="bi bi-building me-1"></i> Proveedores
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/reportes">
                                <i className="bi bi-bar-chart-line-fill me-1"></i> Reportes
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/usuarios">
                                <i className="bi bi-people-fill me-1"></i> Usuarios
                            </NavLink>
                        </li>
                    </ul>
                    <div className="d-flex gap-2 align-items-center">
                        <Link to="/configuraciones" className="btn btn-outline-light border-0" style={{ background: "#22223b" }}>
                            <i className="bi bi-gear me-1"></i> Configuraciones
                        </Link>
                        <button className="btn btn-outline-danger border-0" style={{ background: "#22223b" }} onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}