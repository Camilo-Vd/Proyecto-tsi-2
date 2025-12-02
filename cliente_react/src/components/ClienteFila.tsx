import { Link } from "react-router-dom";
import { useState } from "react";
import type { Cliente } from "../types/cliente";
import { clienteEliminar } from "../service/ClienteService";

export default function ClienteFila({ cliente }: { cliente: Cliente }) {
    const [showModal, setShowModal] = useState(false);
    const [cargando, setCargando] = useState(false);

    const handleEliminar = async () => {
        setCargando(true);
        try {
            const resultado = await clienteEliminar(cliente.rut_cliente);
            if (resultado.success) {
                window.location.reload();
            } else {
                alert(`Error: ${resultado.error}`);
            }
        } catch (error) {
            alert("Error al eliminar el cliente");
        } finally {
            setCargando(false);
            setShowModal(false);
        }
    };

    return (
        <>
            <tr>
                <td>{cliente.rut_cliente}</td>
                <td>{cliente.nombre_cliente}</td>
                <td>{cliente.contacto_cliente}</td>
                <td>8</td>
                <td>
                    <Link to={`/clientes/editar/${cliente.rut_cliente}`} className="btn btn-sm btn-warning me-2" title="Editar">
                        <i className="bi bi-pencil"></i>
                    </Link>
                    <button 
                        type="button" 
                        className="btn btn-sm btn-danger" 
                        title="Eliminar"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </td>
            </tr>

            {showModal && (
                <div
                    className="modal d-block fade show"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'block' }}
                    onClick={() => !cargando && setShowModal(false)}
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white border-0">
                                <h5 className="modal-title">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    Confirmar eliminación
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => !cargando && setShowModal(false)}
                                    disabled={cargando}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p className="mb-0">
                                    ¿Estás seguro de que deseas eliminar a <strong>{cliente.nombre_cliente}</strong>?
                                </p>
                                <div className="alert alert-warning mt-3 mb-0">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Esta acción no se puede deshacer.
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                    disabled={cargando}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleEliminar}
                                    disabled={cargando}
                                >
                                    {cargando ? (
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
                                            <i className="bi bi-trash me-2"></i>
                                            Eliminar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}