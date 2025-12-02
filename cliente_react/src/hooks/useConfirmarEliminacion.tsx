import { useState, FC } from 'react';
import { createPortal } from 'react-dom';

interface PropsModal {
    nombreElemento: string;
    idElemento: string;
    cargando?: boolean;
    onConfirmar: (id: string) => void | Promise<void>;
}

interface UseConfirmarEliminacionReturn {
    abrirModal: () => void;
    cerrarModal: () => void;
    Modal: FC<PropsModal>;
}


export function useConfirmarEliminacion(): UseConfirmarEliminacionReturn {
    const [mostrar, setMostrar] = useState(false);
    const [cargando, setCargando] = useState(false);

    const abrirModal = () => setMostrar(true);
    const cerrarModal = () => !cargando && setMostrar(false);

    const Modal: FC<PropsModal> = ({ nombreElemento, idElemento, cargando: cargandoProp = false, onConfirmar }) => {
        if (!mostrar) return null;

        const handleConfirmar = async (id: string) => {
            setCargando(true);
            try {
                await onConfirmar(id);
                setMostrar(false);
            } finally {
                setCargando(false);
            }
        };

        return createPortal(
            <div
                className="modal d-block fade show"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
                onClick={cerrarModal}
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
                                onClick={cerrarModal}
                                disabled={cargando || cargandoProp}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p className="mb-0">
                                ¿Estás seguro de que deseas eliminar a <strong>{nombreElemento}</strong>?
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
                                onClick={cerrarModal}
                                disabled={cargando || cargandoProp}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleConfirmar(idElemento)}
                                disabled={cargando || cargandoProp}
                            >
                                {cargando || cargandoProp ? (
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
            </div>,
            document.body
        );
    };

    return {
        abrirModal,
        cerrarModal,
        Modal,
    };
}
