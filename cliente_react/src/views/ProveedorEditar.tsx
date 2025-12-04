import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { proveedorEditar, getProveedores } from "../service/ProveedorService";
import { validarRUTFormulario, rutANumero } from "../utils/rutUtils";
import Loader from "../components/Loader";

interface ProveedorEditando {
    rut_proveedor: string;
    nombre_proveedor: string;
    contacto_proveedor: string;
    direccion_proveedor: string;
    nuevo_nombre?: string;
    nuevo_contacto?: string;
    nuevo_direccion?: string;
}

export default function ProveedorEditar() {
    const { rut_proveedor } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [proveedor, setProveedor] = useState<ProveedorEditando | null>(null);

    useEffect(() => {
        cargarProveedor();
    }, [rut_proveedor]);

    const cargarProveedor = async () => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await getProveedores('todos');
            if (resultado.success && resultado.data && Array.isArray(resultado.data) && resultado.data.length > 0) {
                // Extraer el RUT numérico del parámetro
                let rutParamNumerico: number | null = null;
                try {
                    rutParamNumerico = rutANumero(rut_proveedor || '');
                } catch {
                    setError("RUT inválido");
                    setLoading(false);
                    return;
                }
                
                // Buscar el proveedor comparando RUT numérico
                const proveedorEncontrado = resultado.data.find((p: any) => {
                    // Extraer el RUT numérico del proveedor
                    try {
                        const rutProveedorNumerico = rutANumero(p.rut_proveedor);
                        return rutProveedorNumerico === rutParamNumerico;
                    } catch {
                        return false;
                    }
                });
                
                if (proveedorEncontrado) {
                    setProveedor({
                        ...proveedorEncontrado,
                        nuevo_nombre: proveedorEncontrado.nombre_proveedor,
                        nuevo_contacto: proveedorEncontrado.contacto_proveedor,
                        nuevo_direccion: proveedorEncontrado.direccion_proveedor,
                    });
                } else {
                    setError("Proveedor no encontrado");
                }
            } else {
                setError("Error al cargar el proveedor");
            }
        } catch (err) {
            setError("Error inesperado al cargar el proveedor");
        } finally {
            setLoading(false);
        }
    };

    const handleNombreChange = (value: string) => {
        if (proveedor) {
            setProveedor({ ...proveedor, nuevo_nombre: value });
        }
    };

    const handleContactoChange = (value: string) => {
        if (proveedor) {
            setProveedor({ ...proveedor, nuevo_contacto: value });
        }
    };

    const handleDireccionChange = (value: string) => {
        if (proveedor) {
            setProveedor({ ...proveedor, nuevo_direccion: value });
        }
    };

    const hayChanges = proveedor && (
        proveedor.nuevo_nombre !== proveedor.nombre_proveedor ||
        proveedor.nuevo_contacto !== proveedor.contacto_proveedor ||
        proveedor.nuevo_direccion !== proveedor.direccion_proveedor
    );

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!proveedor || !hayChanges) {
            setError("No hay cambios para guardar");
            return;
        }

        setSubmitting(true);
        try {
            const resultado = await proveedorEditar({
                rut_proveedor: proveedor.rut_proveedor,
                nombre_proveedor: proveedor.nuevo_nombre,
                contacto_proveedor: proveedor.nuevo_contacto,
                direccion_proveedor: proveedor.nuevo_direccion,
            });

            if (resultado.success) {
                setSuccessMessage("✅ Proveedor actualizado exitosamente");
                setTimeout(() => navigate("/proveedores"), 2000);
            } else {
                setError(resultado.error || "Error al actualizar el proveedor");
            }
        } catch (err) {
            setError("Error inesperado al guardar");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (!proveedor) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Proveedor no encontrado
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Proveedor
                </h1>
                <Link to="/proveedores" className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Volver
                </Link>
            </div>
            <p>Modifica los datos de contacto del proveedor.</p>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <strong>Error:</strong> {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError(null)}
                    ></button>
                </div>
            )}

            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleGuardar} className="card p-4 shadow-lg" style={{ maxWidth: 500, margin: "0 auto" }}>
                <div className="mb-3">
                    <label className="form-label fw-bold">RUT del proveedor</label>
                    <input type="text" className="form-control" value={rut_proveedor} disabled />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Nombre del proveedor</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={proveedor.nuevo_nombre || ""}
                            onChange={(e) => handleNombreChange(e.target.value)}
                            disabled={submitting}
                        />
                        {proveedor.nuevo_nombre !== proveedor.nombre_proveedor && (
                            <span className="input-group-text text-muted">
                                {proveedor.nuevo_nombre ? "✏️ Modificado" : ""}
                            </span>
                        )}
                    </div>
                    {proveedor.nuevo_nombre !== proveedor.nombre_proveedor && (
                        <small className="text-muted">Anterior: {proveedor.nombre_proveedor}</small>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Teléfono</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={proveedor.nuevo_contacto || ""}
                            onChange={(e) => handleContactoChange(e.target.value)}
                            disabled={submitting}
                        />
                        {proveedor.nuevo_contacto !== proveedor.contacto_proveedor && (
                            <span className="input-group-text text-muted">
                                {proveedor.nuevo_contacto ? "✏️ Modificado" : ""}
                            </span>
                        )}
                    </div>
                    {proveedor.nuevo_contacto !== proveedor.contacto_proveedor && (
                        <small className="text-muted">Anterior: {proveedor.contacto_proveedor}</small>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Dirección</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={proveedor.nuevo_direccion || ""}
                            onChange={(e) => handleDireccionChange(e.target.value)}
                            disabled={submitting}
                        />
                        {proveedor.nuevo_direccion !== proveedor.direccion_proveedor && (
                            <span className="input-group-text text-muted">
                                {proveedor.nuevo_direccion ? "✏️ Modificado" : ""}
                            </span>
                        )}
                    </div>
                    {proveedor.nuevo_direccion !== proveedor.direccion_proveedor && (
                        <small className="text-muted">Anterior: {proveedor.direccion_proveedor}</small>
                    )}
                </div>

                {hayChanges && (
                    <div className="alert alert-info mb-4">
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>Cambios detectados:</strong>
                        <ul className="mb-0 mt-2">
                            {proveedor.nuevo_nombre !== proveedor.nombre_proveedor && (
                                <li>Nombre: {proveedor.nombre_proveedor} → {proveedor.nuevo_nombre}</li>
                            )}
                            {proveedor.nuevo_contacto !== proveedor.contacto_proveedor && (
                                <li>Teléfono: {proveedor.contacto_proveedor} → {proveedor.nuevo_contacto}</li>
                            )}
                            {proveedor.nuevo_direccion !== proveedor.direccion_proveedor && (
                                <li>Dirección: {proveedor.direccion_proveedor} → {proveedor.nuevo_direccion}</li>
                            )}
                        </ul>
                    </div>
                )}

                <div className="d-flex justify-content-end gap-2">
                    <Link to="/proveedores" className="btn btn-danger">
                        <i className="bi bi-x-lg me-2"></i>
                        Cancelar
                    </Link>
                    <button type="submit" className="btn btn-success" disabled={submitting || !hayChanges}>
                        {submitting ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg me-2"></i>
                                Guardar cambios
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}