import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { obtenerCompras, obtenerComprasAnuladas, obtenerTodasLasCompras, anularCompra, obtenerComprobanteCompra } from "../service/ComprasService";
import { Compra } from "../types/compra";
import Loader from "../components/Loader";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { createPortal } from "react-dom";

export default function Compras() {
    const [compras, setCompras] = useState<Compra[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtro, setFiltro] = useState<'registradas' | 'anuladas' | 'todas'>('registradas');
    const [busqueda, setBusqueda] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);
    const [errorModal, setErrorModal] = useState<{ show: boolean; code?: string; detalles?: any; problemas?: any[] }>({ show: false });
    const { canAnularCompra } = useRoleAccess();

    useEffect(() => {
        cargarDatos();
    }, [filtro]);

    const cargarDatos = async () => {
        setLoading(true);
        setError(null);
        let resultado;

        try {
            if (filtro === 'registradas') resultado = await obtenerCompras();
            else if (filtro === 'anuladas') resultado = await obtenerComprasAnuladas();
            else resultado = await obtenerTodasLasCompras();

            if (resultado.success && resultado.data) {
                setCompras(resultado.data);
            } else if (!resultado.success) {
                setError((resultado as any).error || "Error al cargar compras");
                setCompras([]);
            }
        } catch (err) {
            setError("Error al cargar compras");
            setCompras([]);
        }

        setLoading(false);
    };

    const obtenerNombreProveedor = (compra: Compra) => {
        return compra?.proveedor?.nombre_proveedor || "Proveedor desconocido";
    };

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleString("es-CL");
    };

    const handleDescargarPDF = async (id_compra: number) => {
        const resultado = await obtenerComprobanteCompra(id_compra);
        if (resultado.success && resultado.data) {
            // Crear un elemento <a> temporal para descargar
            const link = document.createElement("a");
            link.href = resultado.data;
            link.download = `comprobante_compra_${id_compra}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Liberar el objeto URL
            URL.revokeObjectURL(resultado.data);
        } else {
            setError(resultado.error || "Error al descargar el comprobante");
        }
    };

    const handleAnular = (compra: Compra) => {
        setSelectedCompra(compra);
        setShowDeleteModal(true);
    };

    const confirmarAnular = async () => {
        if (!selectedCompra) return;

        const resultado = await anularCompra(selectedCompra.id_compra);
        if (resultado.success) {
            setCompras(compras.map((c) =>
                c.id_compra === selectedCompra.id_compra
                    ? { ...c, estado_compra: 'anulada' }
                    : c
            ));
            setShowDeleteModal(false);
            setSelectedCompra(null);
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

    const comprasFiltradas = useMemo(() => {
        return compras.filter(compra => {
            const coincideID = compra.id_compra.toString().includes(busqueda.toLowerCase());
            const coincideProveedor = (compra.proveedor?.nombre_proveedor || "").toLowerCase().includes(busqueda.toLowerCase());
            return coincideID || coincideProveedor;
        });
    }, [compras, busqueda]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container-fluid mt-4">
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
            <p>Gestión del historial de compras a proveedores.</p>

            {/* Filtros */}
            <div className="card p-3 mb-3">
                <div className="row g-3 align-items-end">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por ID de compra o proveedor..."
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
                                id="filtro-registradas"
                                checked={filtro === 'registradas'}
                                onChange={() => setFiltro('registradas')}
                            />
                            <label className="btn btn-outline-success" htmlFor="filtro-registradas">
                                <i className="bi bi-check-circle me-1"></i>Registradas
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

            {/* Tabla de historial de compras */}
            {comprasFiltradas.length === 0 ? (
                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    No hay compras {filtro === 'registradas' ? 'registradas' : filtro === 'anuladas' ? 'anuladas' : ''} aún.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID Compra</th>
                                <th>Fecha/Hora</th>
                                <th>Proveedor</th>
                                <th>Estado</th>
                                <th className="text-end">Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comprasFiltradas.map((compra) => (
                                <tr key={compra.id_compra}>
                                    <td>
                                        <span className="badge bg-primary">#{compra.id_compra}</span>
                                    </td>
                                    <td>{formatearFecha(compra.fecha_compra)}</td>
                                    <td>{obtenerNombreProveedor(compra)}</td>
                                    <td>
                                        {compra.estado_compra === 'registrada' ? (
                                            <span className="badge bg-success">Registrada</span>
                                        ) : (
                                            <span className="badge bg-danger">Anulada</span>
                                        )}
                                    </td>
                                    <td className="text-end fw-bold">
                                        ${compra.total_compra.toLocaleString("es-CL")}
                                    </td>
                                    <td>
                                        {compra.estado_compra === 'registrada' ? (
                                            <>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleDescargarPDF(compra.id_compra)}
                                                    title="Descargar PDF"
                                                >
                                                    <i className="bi bi-file-pdf"></i> PDF
                                                </button>
                                                {canAnularCompra && (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger ms-1"
                                                        onClick={() => handleAnular(compra)}
                                                        title="Anular compra"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-muted">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de anulación */}
            {showDeleteModal && selectedCompra &&
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
                                        Confirmar anulación de compra
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowDeleteModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>¿Estás seguro de que deseas anular esta compra?</p>
                                    <p className="fw-bold text-danger mb-0">
                                        Compra #{selectedCompra.id_compra} - {formatearFecha(selectedCompra.fecha_compra)}
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
                                        Error al anular compra
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
                                            <p className="fw-bold text-danger">El producto no existe en el sistema</p>
                                            <p className="mb-0">No se puede anular porque uno o más productos han sido eliminados.</p>
                                        </>
                                    )}
                                    {errorModal.code === 'STOCK_INSUFICIENTE' && (
                                        <>
                                            <p className="fw-bold text-danger mb-3">Stock insuficiente para revertir</p>
                                            <p className="text-muted mb-2">Los siguientes productos no tienen stock suficiente para revertir la compra:</p>
                                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                <table className="table table-sm table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Producto</th>
                                                            <th>Stock Actual</th>
                                                            <th>A Descontar</th>
                                                            <th>Resultado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {errorModal.problemas?.map((p, idx) => (
                                                            <tr key={idx}>
                                                                <td>{p.producto}</td>
                                                                <td className="text-center">{p.stock_actual}</td>
                                                                <td className="text-center">{p.cantidad_a_descontar}</td>
                                                                <td className="text-center text-danger fw-bold">{p.stock_resultante}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
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