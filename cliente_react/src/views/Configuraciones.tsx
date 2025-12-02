import { Link } from "react-router-dom";

export default function Configuraciones() {
    return (
        <div className="container mt-5">
            <div className="d-flex align-items-center mb-4">
                <i className="bi bi-gear-fill me-2" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
                <h1 className="mb-0">Configuraciones</h1>
            </div>
            <p>Gestión de configuraciones del sistema.</p>

            {/* 1. Perfil de usuario */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white">
                    <i className="bi bi-person-circle me-2"></i>
                    Perfil de usuario
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-control" value="Camila López" disabled />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Usuario</label>
                            <input type="text" className="form-control" value="camila.lopez" disabled />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Rol</label>
                            <input type="text" className="form-control" value="Administrador" disabled />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Teléfono</label>
                            <input type="text" className="form-control" value="+56 9 1234 5678" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Cambiar contraseña</label>
                        <div className="row g-2">
                            <div className="col-md-4">
                                <input type="password" className="form-control" placeholder="Contraseña actual" />
                            </div>
                            <div className="col-md-4">
                                <input type="password" className="form-control" placeholder="Nueva contraseña" />
                            </div>
                            <div className="col-md-4">
                                <input type="password" className="form-control" placeholder="Repetir nueva contraseña" />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button type="button" className="btn btn-success">
                            <i className="bi bi-save me-2"></i>
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Gestión del sistema */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-secondary text-white">
                    <i className="bi bi-sliders me-2"></i>
                    Gestión del sistema
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Umbral de stock bajo</label>
                            <input type="number" className="form-control" min="1" value="5" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Moneda del sistema</label>
                            <select className="form-select">
                                <option>$ (Peso)</option>
                                <option>€ (Euro)</option>
                                <option>USD (Dólar)</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">IVA (%)</label>
                            <input type="number" className="form-control" min="0" max="100" value="19" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <Link to="/usuarios" className="btn btn-outline-primary">
                            <i className="bi bi-people-fill me-2"></i>
                            Ir a gestión de usuarios
                        </Link>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button type="button" className="btn btn-success">
                            <i className="bi bi-save me-2"></i>
                            Guardar parámetros
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Seguridad y respaldos */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-warning text-dark">
                    <i className="bi bi-shield-lock me-2"></i>
                    Seguridad y respaldos
                </div>
                <div className="card-body">
                    <div className="mb-3 d-flex gap-2">
                        <button type="button" className="btn btn-outline-secondary">
                            <i className="bi bi-cloud-arrow-down me-2"></i>
                            Respaldar base de datos
                        </button>
                        <input type="file" className="form-control w-auto" />
                        <button type="button" className="btn btn-outline-primary">
                            <i className="bi bi-cloud-arrow-up me-2"></i>
                            Restaurar base de datos
                        </button>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Sesiones activas</label>
                        <ul className="list-group">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Camila López - Chrome (Windows) - Activa
                                <span className="badge bg-success">Este dispositivo</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Camila López - Chrome (Android) - Activa
                                <button className="btn btn-sm btn-outline-danger">
                                    <i className="bi bi-x-circle"></i>
                                    Cerrar sesión
                                </button>
                            </li>
                        </ul>
                        <div className="mt-2">
                            <button type="button" className="btn btn-danger btn-sm">
                                <i className="bi bi-x-circle me-2"></i>
                                Cerrar sesión en todos los dispositivos
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Notificaciones */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-info text-white">
                    <i className="bi bi-bell-fill me-2"></i>
                    Notificaciones
                </div>
                <div className="card-body">
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="notiStockBajo" />
                        <label className="form-check-label" htmlFor="notiStockBajo">
                            Alertar cuando un producto tenga stock bajo
                        </label>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="notiVentasDia" />
                        <label className="form-check-label" htmlFor="notiVentasDia">
                            Notificar ventas del día
                        </label>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="notiComprasRecientes" />
                        <label className="form-check-label" htmlFor="notiComprasRecientes">
                            Notificar compras recientes
                        </label>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button type="button" className="btn btn-success">
                            <i className="bi bi-save me-2"></i>
                            Guardar notificaciones
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}