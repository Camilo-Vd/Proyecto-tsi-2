import { Link } from "react-router-dom";

export default function Usuarios() {
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-people-fill me-2"></i>
                    Usuarios
                </h1>
                <Link to="/usuarios/registrar" className="btn btn-primary">
                    <i className="bi bi-person-plus me-2"></i>
                    Registrar nuevo usuario
                </Link>
            </div>
            <p>Gestión de usuarios registrados en el sistema.</p>
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre completo</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Camila López</td>
                            <td>Administrador</td>
                            <td>
                                <button className="btn btn-sm btn-info me-2" title="Ver detalle">
                                    <i className="bi bi-eye"></i>
                                </button>
                                <button className="btn btn-sm btn-warning me-2" title="Editar">
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-sm btn-danger" title="Eliminar">
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>Juan Pérez</td>
                            <td>Vendedor</td>
                            <td>
                                <button className="btn btn-sm btn-info me-2" title="Ver detalle">
                                    <i className="bi bi-eye"></i>
                                </button>
                                <button className="btn btn-sm btn-warning me-2" title="Editar">
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-sm btn-danger" title="Eliminar">
                                    <i className="bi bi-trash"></i>
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