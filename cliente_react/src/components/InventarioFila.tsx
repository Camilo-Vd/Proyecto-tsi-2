import { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useFetcher } from "react-router-dom";
import { Inventario } from "../types/inventario";
import { useRoleAccess } from "../hooks/useRoleAccess";

interface InventarioFilaProps {
    id_producto: number;
    nombre_producto: string;
    nombre_categoria: string;
    items: Inventario[];
}

export default function InventarioFila({
    id_producto,
    nombre_producto,
    nombre_categoria,
    items,
}: InventarioFilaProps) {
    const fetcher = useFetcher();
    const { canDeleteInventario, canEditInventario, isAdmin } = useRoleAccess();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState<{ id_producto: number; id_talla: number; nombre: string } | null>(null);

    const stock_total = items.reduce((sum, item) => sum + item.stock_actual, 0);

    const getEstadoStock = (stock: number, stock_critico: number) => {
        if (stock === 0) return { badge: "bg-danger", text: "Sin stock" };
        if (stock <= stock_critico) return { badge: "bg-warning", text: "Bajo stock" };
        return { badge: "bg-success", text: "Disponible" };
    };

    const handleEliminar = (id_talla: number, nombre_talla: string) => {
        setDeleteData({
            id_producto,
            id_talla,
            nombre: `${nombre_producto} - ${nombre_talla}`,
        });
        setShowDeleteModal(true);
    };

    const confirmarEliminar = () => {
        if (!deleteData) return;

        const formData = new FormData();
        formData.append("id_producto", String(deleteData.id_producto));
        formData.append("id_talla", String(deleteData.id_talla));

        fetcher.submit(formData, { method: "DELETE" });
        setShowDeleteModal(false);
        setDeleteData(null);
    };

    return (
        <>
            <div className="accordion-item">
                <h2 className="accordion-header" id={`producto${id_producto}`}>
                    <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${id_producto}`}
                        aria-expanded="false"
                        aria-controls={`collapse${id_producto}`}
                    >
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <div className="d-flex align-items-center flex-grow-1">
                                <div className="me-3">
                                    <span className="badge bg-secondary fs-6">#{id_producto}</span>
                                </div>
                                <div className="me-4">
                                    <strong>{nombre_producto}</strong>
                                    <br />
                                    <small className="text-muted">{nombre_categoria}</small>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="me-4 text-center">
                                    <strong>Stock Total</strong>
                                    <br />
                                    <span className={`badge ${getEstadoStock(stock_total, Math.min(...items.map(i => i.stock_critico), Infinity)).badge} fs-6`}>
                                        {stock_total} unids
                                    </span>
                                </div>
                                <div className="text-center">
                                    <strong>Tallas</strong>
                                    <br />
                                    <span className="badge bg-secondary fs-6">{items.length} tallas</span>
                                </div>
                            </div>
                        </div>
                    </button>
                </h2>
                <div
                    id={`collapse${id_producto}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`producto${id_producto}`}
                    data-bs-parent="#inventarioAccordion"
                >
                    <div className="accordion-body">
                        <div className="row">
                            <div className="col-md-9">
                                <h6 className="mb-3">
                                    <i className="bi bi-tags me-2"></i>
                                    Todas las Tallas Disponibles
                                    <small className="text-muted ms-2">({items.length} tallas)</small>
                                </h6>
                                <div className="table-responsive">
                                    <table className="table table-sm table-bordered table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="text-center">Talla</th>
                                                <th className="text-center">Stock</th>
                                                <th className="text-center">Crítico</th>
                                                <th className="text-end">Precio Unit.</th>
                                                <th className="text-center">Estado</th>
                                                {isAdmin && <th className="text-center">Acciones</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item) => {
                                                const estado = getEstadoStock(item.stock_actual, item.stock_critico);
                                                return (
                                                    <tr key={`${id_producto}-${item.id_talla}`}>
                                                        <td className="text-center">
                                                            <span className="badge bg-secondary">{item.nombre_talla}</span>
                                                        </td>
                                                        <td className="text-center fw-bold">{item.stock_actual}</td>
                                                        <td className="text-center">
                                                            <span className="badge bg-warning-subtle text-warning-emphasis">{item.stock_critico}</span>
                                                        </td>
                                                        <td className="text-end">${item.precio_unitario.toLocaleString('es-CL')}</td>
                                                        <td className="text-center">
                                                            <span className={`badge ${estado.badge}`}>{estado.text}</span>
                                                        </td>
                                                        {isAdmin && (
                                                        <td className="text-center">
                                                            {canDeleteInventario && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() =>
                                                                        handleEliminar(item.id_talla, item.nombre_talla)
                                                                    }
                                                                    title="Eliminar este talla/producto"
                                                                    disabled={fetcher.state === "submitting"}
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            )}
                                                        </td>
                                                        )}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-md-3">
                                {canEditInventario && (
                                    <div className="card border-warning bg-light">
                                        <div className="card-body">
                                            <h6 className="card-title text-warning mb-3">
                                                <i className="bi bi-pencil-square me-2"></i>
                                                Editar
                                            </h6>
                                            <p className="card-text small text-muted mb-3">
                                                Ajusta el stock y precio de todas las tallas.
                                            </p>
                                            <div className="d-grid">
                                                <Link
                                                    to={`/inventario/editar/${id_producto}`}
                                                    className="btn btn-warning"
                                                >
                                                    <i className="bi bi-pencil-square me-2"></i>
                                                    Abrir Editor
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showDeleteModal &&
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
                                        <i className="bi bi-exclamation-triangle me-2"></i>Confirmar eliminación
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={fetcher.state === "submitting"}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>¿Estás seguro de que deseas eliminar este registro del inventario?</p>
                                    <p className="fw-bold text-danger mb-0">{deleteData?.nombre}</p>
                                    <div className="alert alert-warning mt-3 mb-0">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Esta acción no se puede deshacer.
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={fetcher.state === "submitting"}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={confirmarEliminar}
                                        disabled={fetcher.state === "submitting"}
                                    >
                                        {fetcher.state === "submitting" ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Eliminando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-trash me-2"></i>Eliminar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
