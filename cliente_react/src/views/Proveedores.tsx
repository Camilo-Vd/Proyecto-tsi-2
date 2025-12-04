import { Link, useLoaderData } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import type { Proveedor } from "../types/proveedor";
import { getProveedores, proveedorDeshabilitarReq, proveedorReactivar } from "../service/ProveedorService";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { createPortal } from "react-dom";
import { getApiData } from "../utils/apiErrorHandler";

export async function loader() {
    const resultado = await getProveedores('activos');
    return getApiData(resultado, []);
}

export default function Proveedores() {
    const proveedoresOriginales = useLoaderData() as Proveedor[];
    const [proveedores, setProveedores] = useState<Proveedor[]>(proveedoresOriginales || []);
    const [filtro, setFiltro] = useState<'activos' | 'inactivos' | 'todos'>('activos');
    const [busqueda, setBusqueda] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
    const [modalType, setModalType] = useState<'deshabilitar' | 'reactivar'>('deshabilitar');
    const { canRegisterProveedor, canDeshabilitarCliente, isAdmin } = useRoleAccess();

    useEffect(() => {
        const cargarProveedores = async () => {
            const resultado = await getProveedores(filtro);
            if (resultado.success && resultado.data) {
                const proveedoresActualizados = resultado.data;
                setProveedores(proveedoresActualizados);
            }
        };
        cargarProveedores();
    }, [filtro]);

    const matchesSearch = (proveedor: Proveedor) => {
        const searchLower = busqueda.trim().toLowerCase();
        return (
            String(proveedor.rut_proveedor).toLowerCase().includes(searchLower) ||
            String(proveedor.nombre_proveedor).toLowerCase().includes(searchLower)
        );
    };

    const proveedoresFiltrados = useMemo(() => {
        let resultado = proveedores;
        if (busqueda.trim()) resultado = resultado.filter(matchesSearch);
        return resultado;
    }, [proveedores, busqueda]);

    const handleDeshabilitar = (proveedor: Proveedor) => {
        setSelectedProveedor(proveedor);
        setModalType('deshabilitar');
        setShowModal(true);
    };

    const handleReactivar = (proveedor: Proveedor) => {
        setSelectedProveedor(proveedor);
        setModalType('reactivar');
        setShowModal(true);
    };

    const confirmarAccion = async () => {
        if (!selectedProveedor) return;

        try {
            if (modalType === 'deshabilitar') {
                await proveedorDeshabilitarReq(String(selectedProveedor.rut_proveedor));
            } else {
                await proveedorReactivar(String(selectedProveedor.rut_proveedor));
            }
            
            // Recargar proveedores del backend
            const resultado = await getProveedores(filtro);
            if (resultado.success && resultado.data) {
                setProveedores(resultado.data);
            }
            
            setShowModal(false);
            setSelectedProveedor(null);
        } catch (error) {
            console.error(`Error al ${modalType} proveedor:`, error);
            alert(`Error al ${modalType} proveedor`);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-building me-2"></i>
                    Proveedores
                </h1>
                {canRegisterProveedor && (
                    <Link to="/proveedores/registrar" className="btn btn-primary" state={{ from: "/proveedores" }}>
                        <i className="bi bi-person-plus me-2"></i>
                        Registrar nuevo proveedor
                    </Link>
                )}
            </div>
            <p>Aquí puedes gestionar los proveedores de productos.</p>

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
                                id="filtro-activos"
                                checked={filtro === 'activos'}
                                onChange={() => setFiltro('activos')}
                            />
                            <label className="btn btn-outline-success" htmlFor="filtro-activos">
                                <i className="bi bi-check-circle me-1"></i>Activos
                            </label>

                            <input
                                type="radio"
                                className="btn-check"
                                name="filtro"
                                id="filtro-inactivos"
                                checked={filtro === 'inactivos'}
                                onChange={() => setFiltro('inactivos')}
                            />
                            <label className="btn btn-outline-danger" htmlFor="filtro-inactivos">
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

            {/* Tabla de proveedores */}
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>RUT / ID proveedor</th>
                            <th>Nombre o razón social</th>
                            <th>Contacto</th>
                            <th>Dirección</th>
                            <th>Estado</th>
                            <th>Nº compras</th>
                            {isAdmin && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {proveedoresFiltrados.map(proveedor => (
                            <tr key={proveedor.rut_proveedor}>
                                <td><span className="badge bg-primary">#{proveedor.rut_proveedor}</span></td>
                                <td>{proveedor.nombre_proveedor}</td>
                                <td>{proveedor.contacto_proveedor}</td>
                                <td>{proveedor.direccion_proveedor}</td>
                                <td>
                                    {proveedor.estado_proveedor === 'activo' ? (
                                        <span className="badge bg-success">Activo</span>
                                    ) : (
                                        <span className="badge bg-danger">Inactivo</span>
                                    )}
                                </td>
                                <td>
                                    <span className="badge bg-info">{proveedor.cantidad_compras || 0}</span>
                                </td>
                                {isAdmin && (
                                <td>
                                    <Link to={`/proveedores/editar/${proveedor.rut_proveedor}`} className="btn btn-sm btn-info me-2">
                                        <i className="bi bi-pencil"></i>
                                    </Link>
                                    {proveedor.estado_proveedor === 'inactivo' ? (
                                        canDeshabilitarCliente && (
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleReactivar(proveedor)}
                                                title="Reactivar"
                                            >
                                                <i className="bi bi-arrow-counterclockwise"></i>
                                            </button>
                                        )
                                    ) : (
                                        canDeshabilitarCliente && (
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={() => handleDeshabilitar(proveedor)}
                                                title="Deshabilitar"
                                            >
                                                <i className="bi bi-lock"></i>
                                            </button>
                                        )
                                    )}
                                </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {proveedoresFiltrados.length === 0 && (
                <div className="alert alert-info text-center">
                    <i className="bi bi-info-circle me-2"></i>
                    No hay proveedores que coincidan con tu búsqueda.
                </div>
            )}

            {/* Modal de confirmación */}
            {showModal && selectedProveedor &&
                createPortal(
                    <div
                        className="modal fade show d-block"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                        onClick={() => setShowModal(false)}
                    >
                        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content">
                                <div className={`modal-header text-white ${modalType === 'deshabilitar' ? 'bg-warning' : 'bg-success'}`}>
                                    <h5 className="modal-title">
                                        {modalType === 'deshabilitar' ? (
                                            <>
                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                Deshabilitar proveedor
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Reactivar proveedor
                                            </>
                                        )}
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>
                                        {modalType === 'deshabilitar'
                                            ? '¿Estás seguro de que deseas deshabilitar este proveedor?'
                                            : '¿Estás seguro de que deseas reactivar este proveedor?'}
                                    </p>
                                    <p className="fw-bold">
                                        {selectedProveedor.nombre_proveedor} (RUT: {selectedProveedor.rut_proveedor})
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button
                                        type="button"
                                        className={`btn ${modalType === 'deshabilitar' ? 'btn-warning' : 'btn-success'}`}
                                        onClick={confirmarAccion}
                                    >
                                        {modalType === 'deshabilitar' ? 'Deshabilitar' : 'Reactivar'}
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