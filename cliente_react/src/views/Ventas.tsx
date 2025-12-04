import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { obtenerVentas, obtenerVentasAnuladas, obtenerTodasLasVentas, anularVenta, obtenerComprobante } from "../service/VentasService";
import { Venta } from "../types/venta";
import Loader from "../components/Loader";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { createPortal } from "react-dom";

export async function loader() {
    const ventas = await obtenerVentas();
    return ventas;
}

export default function Ventas() {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtro, setFiltro] = useState<'completadas' | 'anuladas' | 'todas'>('completadas');
    const [busqueda, setBusqueda] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
    const [errorModal, setErrorModal] = useState<{ show: boolean; code?: string; detalles?: any; problemas?: any[] }>({ show: false });
    const { canAnularVenta } = useRoleAccess();

    useEffect(() => {
        cargarDatos();
    }, [filtro]);

    const cargarDatos = async () => {
        setLoading(true);
        setError(null);
        let resultado;

        try {
            if (filtro === 'completadas') resultado = await obtenerVentas();
            else if (filtro === 'anuladas') resultado = await obtenerVentasAnuladas();
            else resultado = await obtenerTodasLasVentas();

            if (resultado.success && resultado.data) {
                setVentas(resultado.data);
            } else if (!resultado.success) {
                setError((resultado as any).error || "Error al cargar ventas");
                setVentas([]);
            }
        } catch (err) {
            setError("Error al cargar ventas");
            setVentas([]);
        }

        setLoading(false);
    };

    const formatearFecha = (fecha: string) => {
        // La fecha ya viene formateada desde el backend, solo la retornamos
        return fecha || "Fecha inválida";
    };

    const handleAnular = (venta: Venta) => {
        setSelectedVenta(venta);
        setShowDeleteModal(true);
    };

    const handleDescargarPDF = async (id_venta: number) => {
        const resultado = await obtenerComprobante(id_venta);
        if (resultado.success && resultado.data) {
            // Crear un elemento <a> temporal para descargar
            const link = document.createElement("a");
            link.href = resultado.data;
            link.download = `comprobante_venta_${id_venta}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Liberar el objeto URL
            URL.revokeObjectURL(resultado.data);
        } else {
            setError((resultado as any).error || "Error al descargar el comprobante");
        }
    };

    const confirmarAnular = async () => {
        if (!selectedVenta) return;

        const resultado = await anularVenta(selectedVenta.id_venta);
        if (resultado.success) {
            setVentas(ventas.map((v) =>
                v.id_venta === selectedVenta.id_venta
                    ? { ...v, estado_venta: 'anulada' }
                    : v
            ));
            setShowDeleteModal(false);
            setSelectedVenta(null);
        } else {
            // Mostrar error modal
            setErrorModal({
                show: true,
                code: resultado.code,
                detalles: resultado.detalles,
                problemas: resultado.problemas
            });
            setShowDeleteModal(false);
        }
    };

    const ventasFiltradas = useMemo(() => {
        return ventas.filter(venta => {
            const coincideID = venta.id_venta.toString().includes(busqueda.toLowerCase());
            const coincideCliente = (venta.cliente || "").toLowerCase().includes(busqueda.toLowerCase());
            return coincideID || coincideCliente;
        });
    }, [ventas, busqueda]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container-fluid mt-4">
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
            <p>Gestión del historial de ventas realizadas.</p>

            {/* Filtros */}
            <div className="card p-3 mb-3">
                <div className="row g-3 align-items-end">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por ID de venta o cliente..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6">
                        <div className="btn-group d-flex gap-2" role="group">
                            <input
                                type="radio"
                                className="btn-check"
                                name="filtro"
                                id="filtro-completadas"
                                checked={filtro === 'completadas'}
                                onChange={() => setFiltro('completadas')}
                            />
                            <label className="btn btn-outline-success" htmlFor="filtro-completadas">
                                <i className="bi bi-check-circle me-1"></i>Completadas
                            </label>

                            <input
                                type="radio"
                                className="btn-check"
                                name="filtro"
                                id="filtro-anuladas"
                                checked={filtro === 'anuladas'}
                                onChange={() => setFiltro('anuladas')}
                            />
                            <label className="btn btn-outline-danger" htmlFor="filtro-anuladas">
                                <i className="bi bi-x-circle me-1"></i>Anuladas
                            </label>

                            <input
                                type="radio"
                                className="btn-check"
                                name="filtro"
                                id="filtro-todas"
                                checked={filtro === 'todas'}
                                onChange={() => setFiltro('todas')}
                            />
                            <label className="btn btn-outline-secondary" htmlFor="filtro-todas">
                                <i className="bi bi-list me-1"></i>Todas
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError(null)}
                    ></button>
                </div>
            )}

            {/* Tabla de historial de ventas */}
            {ventasFiltradas.length === 0 ? (
                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    No hay ventas {filtro === 'completadas' ? 'completadas' : filtro === 'anuladas' ? 'anuladas' : ''} aún.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Fecha/Hora</th>
                                <th>Cliente</th>
                                <th>Vendedor</th>
                                <th>Estado</th>
                                <th className="text-end">Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventasFiltradas.map((venta) => (
                                <tr key={venta.id_venta}>
                                    <td>
                                        <span className="badge bg-primary">#{venta.id_venta}</span>
                                    </td>
                                    <td>{formatearFecha(venta.fecha_hora)}</td>
                                    <td>{venta.cliente || "Cliente desconocido"}</td>
                                    <td>{venta.vendedor || "Vendedor desconocido"}</td>
                                    <td>
                                        {venta.estado_venta === 'completada' ? (
                                            <span className="badge bg-success">Completada</span>
                                        ) : (
                                            <span className="badge bg-danger">Anulada</span>
                                        )}
                                    </td>
                                    <td className="text-end fw-bold">
                                        ${venta.total_venta.toLocaleString("es-CL")}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleDescargarPDF(venta.id_venta)}
                                            title="Descargar PDF"
                                        >
                                            <i className="bi bi-file-pdf"></i> PDF
                                        </button>
                                        {venta.estado_venta === 'completada' && canAnularVenta && (
                                            <button
                                                className="btn btn-sm btn-outline-danger ms-1"
                                                onClick={() => handleAnular(venta)}
                                                title="Anular venta"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        )}
                                        {venta.estado_venta === 'anulada' && !canAnularVenta && (
                                            <span className="text-muted ms-2">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de anulación */}
            {showDeleteModal && selectedVenta &&
                createPortal(
                    <div
                        className="modal fade show d-block"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <div
                            className="modal-dialog modal-dialog-centered"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header bg-danger text-white">
                                    <h5 className="modal-title">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        Confirmar anulación de venta
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowDeleteModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>¿Estás seguro de que deseas anular esta venta?</p>
                                    <p className="fw-bold text-danger mb-0">
                                        Venta #{selectedVenta.id_venta} - {formatearFecha(selectedVenta.fecha_hora)}
                                    </p>
                                    <div className="alert alert-warning mt-3 mb-0">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Se revertirá el inventario automáticamente.
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={confirmarAnular}
                                    >
                                        <i className="bi bi-trash me-2"></i>
                                        Anular
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            {/* Modal de error */}
            {errorModal.show &&
                createPortal(
                    <div
                        className="modal fade show d-block"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                        onClick={() => setErrorModal({ show: false })}
                    >
                        <div
                            className="modal-dialog modal-dialog-centered"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header bg-danger text-white">
                                    <h5 className="modal-title">
                                        <i className="bi bi-exclamation-octagon me-2"></i>
                                        Error al anular venta
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setErrorModal({ show: false })}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {errorModal.code === 'PRODUCTO_ELIMINADO' && (
                                        <>
                                            <p className="fw-bold text-danger mb-3">
                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                Producto eliminado del sistema
                                            </p>
                                            <p className="mb-0">
                                                No se puede anular esta venta porque uno o más productos han sido eliminados del catálogo. 
                                                Por favor, contacte al administrador.
                                            </p>
                                        </>
                                    )}
                                    {errorModal.code === 'INVENTARIO_INCONSISTENTE' && (
                                        <>
                                            <p className="fw-bold text-danger mb-3">
                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                Inconsistencia en el inventario
                                            </p>
                                            <p className="text-muted mb-3">
                                                No se puede completar la anulación debido a los siguientes problemas:
                                            </p>
                                            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                                {errorModal.detalles?.map((problema, idx) => (
                                                    <div key={idx} className="alert alert-warning mb-2" role="alert">
                                                        <p className="mb-1">
                                                            <strong>{problema.producto}</strong>
                                                            <span className="ms-2 text-muted" style={{ fontSize: '0.85rem' }}>
                                                                (ID: {problema.id_producto})
                                                            </span>
                                                        </p>
                                                        <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
                                                            {problema.razon}
                                                        </p>
                                                        {problema.stock_actual !== undefined && (
                                                            <p className="mb-0 text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                                                                Stock actual: {problema.stock_actual} | 
                                                                A revertir: {problema.cantidad_vendida}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-muted mt-3 mb-0" style={{ fontSize: '0.9rem' }}>
                                                <i className="bi bi-info-circle me-1"></i>
                                                Si el problema persiste, contacte al administrador del sistema.
                                            </p>
                                        </>
                                    )}
                                    {!errorModal.code && (
                                        <p>{errorModal}</p>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => setErrorModal({ show: false })}
                                    >
                                        Entendido
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