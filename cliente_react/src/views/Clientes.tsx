import { Link, useLoaderData } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import type { Cliente } from "../types/cliente";
import { getClientes, clienteDeshabilitarReq, clienteReactivar } from "../service/ClienteService";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { createPortal } from "react-dom";
import { getApiData } from "../utils/apiErrorHandler";

export async function loader() {
    const resultado = await getClientes('activos');
    return getApiData(resultado, []);
}

export default function Clientes() {
    const clientesOriginales = useLoaderData() as Cliente[];
    const [clientes, setClientes] = useState<Cliente[]>(clientesOriginales || []);
    const [filtro, setFiltro] = useState<'activos' | 'inactivos' | 'todos'>('activos');
    const [busqueda, setBusqueda] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
    const [modalType, setModalType] = useState<'deshabilitar' | 'reactivar'>('deshabilitar');
    const { canDeshabilitarCliente, isAdmin } = useRoleAccess();

    // Cargar clientes cuando el filtro cambia
    useEffect(() => {
        const cargarClientes = async () => {
            const resultado = await getClientes(filtro);
            if (resultado.success && resultado.data) {
                setClientes(resultado.data);
            }
        };
        cargarClientes();
    }, [filtro]);

    const matchesSearch = (cliente: Cliente) => {
        const searchLower = busqueda.trim().toLowerCase();
        return (
            String(cliente.rut_cliente).toLowerCase().includes(searchLower) ||
            String(cliente.nombre_cliente).toLowerCase().includes(searchLower)
        );
    };

    const clientesFiltrados = useMemo(() => {
        let resultado = clientes;
        if (busqueda.trim()) resultado = resultado.filter(matchesSearch);
        return resultado;
    }, [clientes, busqueda]);

    const handleDeshabilitar = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setModalType('deshabilitar');
        setShowModal(true);
    };

    const handleReactivar = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setModalType('reactivar');
        setShowModal(true);
    };

    const confirmarAccion = async () => {
        if (!selectedCliente) return;

        try {
            if (modalType === 'deshabilitar') {
                await clienteDeshabilitarReq(String(selectedCliente.rut_cliente));
            } else {
                await clienteReactivar(String(selectedCliente.rut_cliente));
            }
            
            // Recargar clientes del backend
            const resultado = await getClientes(filtro);
            if (resultado.success && resultado.data) {
                setClientes(resultado.data);
            }
            
            setShowModal(false);
            setSelectedCliente(null);
        } catch (error) {
            console.error(`Error al ${modalType} cliente:`, error);
            alert(`Error al ${modalType} cliente`);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-person-lines-fill me-2"></i>
                    Clientes
                </h1>
                <Link to="/clientes/registrar" className="btn btn-primary" state={{ from: "/clientes" }}>
                    <i className="bi bi-person-plus me-2"></i>
                    Registrar nuevo cliente
                </Link>
            </div>
            <p>Aquí puedes gestionar los clientes registrados.</p>

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

            {/* Tabla de clientes */}
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>RUT / ID Cliente</th>
                            <th>Nombre</th>
                            <th>Contacto</th>
                            <th>Estado</th>
                            <th>Nº Ventas</th>
                            {isAdmin && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {clientesFiltrados.map(cliente => (
                            <tr key={cliente.rut_cliente}>
                                <td><span className="badge bg-primary">#{cliente.rut_cliente}</span></td>
                                <td>{cliente.nombre_cliente}</td>
                                <td>{cliente.contacto_cliente}</td>
                                <td>
                                    {cliente.estado_cliente === 'activo' ? (
                                        <span className="badge bg-success">Activo</span>
                                    ) : (
                                        <span className="badge bg-danger">Inactivo</span>
                                    )}
                                </td>
                                <td>
                                    <span className="badge bg-info">{cliente.cantidad_compras || 0}</span>
                                </td>
                                {isAdmin && (
                                <td>
                                    <Link to={`/clientes/editar/${cliente.rut_cliente}`} className="btn btn-sm btn-info me-2">
                                        <i className="bi bi-pencil"></i>
                                    </Link>
                                    {cliente.estado_cliente === 'inactivo' ? (
                                        canDeshabilitarCliente && (
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleReactivar(cliente)}
                                                title="Reactivar"
                                            >
                                                <i className="bi bi-arrow-counterclockwise"></i>
                                            </button>
                                        )
                                    ) : (
                                        canDeshabilitarCliente && (
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={() => handleDeshabilitar(cliente)}
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

            {clientesFiltrados.length === 0 && (
                <div className="alert alert-info text-center">
                    <i className="bi bi-info-circle me-2"></i>
                    No hay clientes que coincidan con tu búsqueda.
                </div>
            )}

            {/* Modal de confirmación */}
            {showModal && selectedCliente &&
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
                                                Deshabilitar cliente
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Reactivar cliente
                                            </>
                                        )}
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>
                                        {modalType === 'deshabilitar'
                                            ? '¿Estás seguro de que deseas deshabilitar este cliente?'
                                            : '¿Estás seguro de que deseas reactivar este cliente?'}
                                    </p>
                                    <p className="fw-bold">
                                        {selectedCliente.nombre_cliente} (RUT: {selectedCliente.rut_cliente})
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