import { Link, useLoaderData } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import type { Usuario } from "../types/usuario";
import { getUsuarios, deshabilitarUsuario, reactivarUsuario, usuarioEliminar } from "../service/UsuarioService";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { createPortal } from "react-dom";
import { getApiData } from "../utils/apiErrorHandler";

export async function loader() {
    const resultado = await getUsuarios();
    return getApiData(resultado, []);
}

export default function Usuarios() {
    const usuariosOriginales = useLoaderData() as Usuario[];
    const [usuariosTodos, setUsuariosTodos] = useState<Usuario[]>(usuariosOriginales || []);
    const [filtro, setFiltro] = useState<'activo' | 'inactivo' | 'todos'>('activo');
    const [busqueda, setBusqueda] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
    const [modalType, setModalType] = useState<'deshabilitar' | 'reactivar' | 'eliminar'>('deshabilitar');
    const [loading, setLoading] = useState(false);
    const { canDeleteUsuario, isAdmin } = useRoleAccess();

    // Inicializar con datos del loader
    useEffect(() => {
        if (usuariosOriginales && usuariosOriginales.length > 0) {
            setUsuariosTodos(usuariosOriginales);
        }
    }, [usuariosOriginales]);

    // Aplicar filtro y búsqueda
    const usuariosFiltrados = useMemo(() => {
        let resultado = [...usuariosTodos];
        
        // Normalizar estado_usuario
        resultado = resultado.map(u => ({
            ...u,
            estado_usuario: u.estado_usuario || 'activo'
        }));
        
        // Filtrar por estado
        if (filtro !== 'todos') {
            resultado = resultado.filter(u => {
                const estado = u.estado_usuario || 'activo';
                return estado === filtro;
            });
        }
        
        // Filtrar por búsqueda
        if (busqueda.trim()) {
            const searchLower = busqueda.trim().toLowerCase();
            resultado = resultado.filter(u =>
                String(u.rut_usuario).toLowerCase().includes(searchLower) ||
                String(u.nombre_usuario).toLowerCase().includes(searchLower)
            );
        }
        
        return resultado;
    }, [usuariosTodos, filtro, busqueda]);

    const handleDeshabilitar = (usuario: Usuario) => {
        setSelectedUsuario(usuario);
        setModalType('deshabilitar');
        setShowModal(true);
    };

    const handleReactivar = (usuario: Usuario) => {
        setSelectedUsuario(usuario);
        setModalType('reactivar');
        setShowModal(true);
    };

    const handleEliminar = (usuario: Usuario) => {
        setSelectedUsuario(usuario);
        setModalType('eliminar');
        setShowModal(true);
    };

    const confirmarAccion = async () => {
        if (!selectedUsuario) return;

        setLoading(true);
        try {
            const rut = String(selectedUsuario.rut_usuario || "");
            
            if (modalType === 'deshabilitar') {
                await deshabilitarUsuario(rut);
            } else if (modalType === 'reactivar') {
                await reactivarUsuario(rut);
            } else if (modalType === 'eliminar') {
                await usuarioEliminar(rut);
            }
            
            // Recargar usuarios del backend
            const resultado = await getUsuarios();
            if (resultado.success && resultado.data) {
                setUsuariosTodos(resultado.data);
            }
            
            setShowModal(false);
            setSelectedUsuario(null);
        } catch (error) {
            console.error(`Error al ${modalType} usuario:`, error);
            alert(`Error al ${modalType} usuario`);
        } finally {
            setLoading(false);
        }
    };

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

            {/* Filtros */}
            <div className="card p-3 mb-3">
                <div className="row g-3 align-items-end">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por RUT o nombre..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6">
                        <div className="btn-group d-flex gap-2" role="group">
                            <input
                                type="radio"
                                className="btn-check"
                                name="filtro"
                                id="filtro-activo"
                                checked={filtro === 'activo'}
                                onChange={() => setFiltro('activo')}
                            />
                            <label className="btn btn-outline-success" htmlFor="filtro-activo">
                                <i className="bi bi-check-circle me-1"></i>Activos
                            </label>

                            <input
                                type="radio"
                                className="btn-check"
                                name="filtro"
                                id="filtro-inactivo"
                                checked={filtro === 'inactivo'}
                                onChange={() => setFiltro('inactivo')}
                            />
                            <label className="btn btn-outline-danger" htmlFor="filtro-inactivo">
                                <i className="bi bi-x-circle me-1"></i>Inactivos
                            </label>

                            <input
                                type="radio"
                                className="btn-check"
                                name="filtro"
                                id="filtro-todos"
                                checked={filtro === 'todos'}
                                onChange={() => setFiltro('todos')}
                            />
                            <label className="btn btn-outline-secondary" htmlFor="filtro-todos">
                                <i className="bi bi-list me-1"></i>Todos
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>RUT</th>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            {isAdmin && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.map(usuario => (
                            <tr key={usuario.rut_usuario}>
                                <td>{usuario.rut_usuario}</td>
                                <td>{usuario.nombre_usuario}</td>
                                <td>
                                    <span className={`badge ${usuario.rol_usuario === 'Administrador' ? 'bg-danger' : 'bg-info'}`}>
                                        {usuario.rol_usuario}
                                    </span>
                                </td>
                                <td>
                                    {(usuario.estado_usuario || 'activo') === 'activo' ? (
                                        <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>Activo</span>
                                    ) : (
                                        <span className="badge bg-warning"><i className="bi bi-x-circle me-1"></i>Inactivo</span>
                                    )}
                                </td>
                                {isAdmin && (
                                <td>
                                    {canDeleteUsuario && (
                                        <div className="d-flex gap-1">
                                            {(usuario.estado_usuario || 'activo') === 'inactivo' ? (
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() => handleReactivar(usuario)}
                                                    title="Reactivar"
                                                    disabled={loading}
                                                >
                                                    <i className="bi bi-arrow-counterclockwise"></i>
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-warning"
                                                    onClick={() => handleDeshabilitar(usuario)}
                                                    title="Deshabilitar"
                                                    disabled={loading}
                                                >
                                                    <i className="bi bi-lock"></i>
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleEliminar(usuario)}
                                                title="Eliminar"
                                                disabled={loading}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    )}
                                </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {usuariosFiltrados.length === 0 && (
                <div className="alert alert-info text-center">
                    <i className="bi bi-info-circle me-2"></i>
                    No hay usuarios que coincidan con tu búsqueda.
                </div>
            )}

            {/* Modal de confirmación */}
            {showModal && selectedUsuario &&
                createPortal(
                    <div
                        className="modal fade show d-block"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                        onClick={() => !loading && setShowModal(false)}
                    >
                        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content">
                                <div className={`modal-header text-white ${modalType === 'eliminar' ? 'bg-danger' : modalType === 'deshabilitar' ? 'bg-warning' : 'bg-success'}`}>
                                    <h5 className="modal-title">
                                        {modalType === 'deshabilitar' && (
                                            <>
                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                Deshabilitar usuario
                                            </>
                                        )}
                                        {modalType === 'reactivar' && (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Reactivar usuario
                                            </>
                                        )}
                                        {modalType === 'eliminar' && (
                                            <>
                                                <i className="bi bi-trash me-2"></i>
                                                Eliminar usuario
                                            </>
                                        )}
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => !loading && setShowModal(false)} disabled={loading}></button>
                                </div>
                                <div className="modal-body">
                                    <p>
                                        {modalType === 'deshabilitar' && '¿Estás seguro de que deseas deshabilitar este usuario?'}
                                        {modalType === 'reactivar' && '¿Estás seguro de que deseas reactivar este usuario?'}
                                        {modalType === 'eliminar' && '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.'}
                                    </p>
                                    <p className="fw-bold">
                                        {selectedUsuario.nombre_usuario} (RUT: {selectedUsuario.rut_usuario})
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={loading}>Cancelar</button>
                                    <button
                                        type="button"
                                        className={`btn ${modalType === 'eliminar' ? 'btn-danger' : modalType === 'deshabilitar' ? 'btn-warning' : 'btn-success'}`}
                                        onClick={confirmarAccion}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                {modalType === 'deshabilitar' && 'Deshabilitar'}
                                                {modalType === 'reactivar' && 'Reactivar'}
                                                {modalType === 'eliminar' && 'Eliminar'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}