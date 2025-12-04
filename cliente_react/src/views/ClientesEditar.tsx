import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { clienteEditar, getClientes } from "../service/ClienteService";
import { validarRUTFormulario, rutANumero } from "../utils/rutUtils";
import Loader from "../components/Loader";

interface ClienteEditando {
    rut_cliente: string;
    nombre_cliente: string;
    contacto_cliente: string;
    nuevo_nombre?: string;
    nuevo_contacto?: string;
}

export default function ClientesEditar() {
    const { rut_cliente } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [cliente, setCliente] = useState<ClienteEditando | null>(null);

    useEffect(() => {
        cargarCliente();
    }, [rut_cliente]);

    const cargarCliente = async () => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await getClientes('todos');
            if (resultado.success && resultado.data && Array.isArray(resultado.data) && resultado.data.length > 0) {
                // Extraer el RUT numérico del parámetro
                let rutParamNumerico: number | null = null;
                try {
                    rutParamNumerico = rutANumero(rut_cliente || '');
                } catch {
                    setError("RUT inválido");
                    setLoading(false);
                    return;
                }
                
                // Buscar el cliente comparando RUT numérico
                const clienteEncontrado = resultado.data.find((c: any) => {
                    // Extraer el RUT numérico del cliente
                    try {
                        const rutClienteNumerico = rutANumero(c.rut_cliente);
                        return rutClienteNumerico === rutParamNumerico;
                    } catch {
                        return false;
                    }
                });
                
                if (clienteEncontrado) {
                    setCliente({
                        ...clienteEncontrado,
                        nuevo_nombre: clienteEncontrado.nombre_cliente,
                        nuevo_contacto: clienteEncontrado.contacto_cliente,
                    });
                } else {
                    setError("Cliente no encontrado");
                }
            } else {
                setError("Error al cargar el cliente");
            }
        } catch (err) {
            setError("Error inesperado al cargar el cliente");
        } finally {
            setLoading(false);
        }
    };

    const handleNombreChange = (value: string) => {
        if (cliente) {
            setCliente({ ...cliente, nuevo_nombre: value });
        }
    };

    const handleContactoChange = (value: string) => {
        if (cliente) {
            setCliente({ ...cliente, nuevo_contacto: value });
        }
    };

    const hayChanges = cliente && (
        cliente.nuevo_nombre !== cliente.nombre_cliente ||
        cliente.nuevo_contacto !== cliente.contacto_cliente
    );

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!cliente || !hayChanges) {
            setError("No hay cambios para guardar");
            return;
        }

        setSubmitting(true);
        try {
            const resultado = await clienteEditar({
                rut_cliente: cliente.rut_cliente,
                nombre_cliente: cliente.nuevo_nombre,
                contacto_cliente: cliente.nuevo_contacto,
            });

            if (resultado.success) {
                setSuccessMessage("✅ Cliente actualizado exitosamente");
                setTimeout(() => navigate("/clientes"), 2000);
            } else {
                setError(resultado.error || "Error al actualizar el cliente");
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

    if (!cliente) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Cliente no encontrado
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Cliente
                </h1>
                <Link to="/clientes" className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Volver
                </Link>
            </div>
            <p>Modifica los datos de contacto del cliente.</p>

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
                    <label className="form-label fw-bold">RUT del cliente</label>
                    <input type="text" className="form-control" value={rut_cliente} disabled />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Nombre del cliente</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={cliente.nuevo_nombre || ""}
                            onChange={(e) => handleNombreChange(e.target.value)}
                            disabled={submitting}
                        />
                        {cliente.nuevo_nombre !== cliente.nombre_cliente && (
                            <span className="input-group-text text-muted">
                                {cliente.nuevo_nombre ? "✏️ Modificado" : ""}
                            </span>
                        )}
                    </div>
                    {cliente.nuevo_nombre !== cliente.nombre_cliente && (
                        <small className="text-muted">Anterior: {cliente.nombre_cliente}</small>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Teléfono</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={cliente.nuevo_contacto || ""}
                            onChange={(e) => handleContactoChange(e.target.value)}
                            disabled={submitting}
                        />
                        {cliente.nuevo_contacto !== cliente.contacto_cliente && (
                            <span className="input-group-text text-muted">
                                {cliente.nuevo_contacto ? "✏️ Modificado" : ""}
                            </span>
                        )}
                    </div>
                    {cliente.nuevo_contacto !== cliente.contacto_cliente && (
                        <small className="text-muted">Anterior: {cliente.contacto_cliente}</small>
                    )}
                </div>

                {hayChanges && (
                    <div className="alert alert-info mb-4">
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>Cambios detectados:</strong>
                        <ul className="mb-0 mt-2">
                            {cliente.nuevo_nombre !== cliente.nombre_cliente && (
                                <li>Nombre: {cliente.nombre_cliente} → {cliente.nuevo_nombre}</li>
                            )}
                            {cliente.nuevo_contacto !== cliente.contacto_cliente && (
                                <li>Teléfono: {cliente.contacto_cliente} → {cliente.nuevo_contacto}</li>
                            )}
                        </ul>
                    </div>
                )}

                <div className="d-flex justify-content-end gap-2">
                    <Link to="/clientes" className="btn btn-danger">
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