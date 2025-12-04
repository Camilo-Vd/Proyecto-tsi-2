import { useState } from "react";
import { useUsuario } from "../context/UsuarioContext";
import { cambiarContraseña } from "../service/UsuarioService";
import { formatearRUTFlexible } from "../utils/rutUtils";
import Loader from "../components/Loader";

export default function Configuraciones() {
    const { usuario, loading: usuarioLoading } = useUsuario();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Estados para cambiar contraseña
    const [contraseñaActual, setContraseñaActual] = useState("");
    const [nuevaContraseña, setNuevaContraseña] = useState("");
    const [repetirContraseña, setRepetirContraseña] = useState("");

    const handleCambiarContraseña = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Validaciones
        if (!contraseñaActual.trim()) {
            setError("La contraseña actual es obligatoria");
            return;
        }

        if (!nuevaContraseña.trim()) {
            setError("La nueva contraseña es obligatoria");
            return;
        }

        if (nuevaContraseña.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (nuevaContraseña !== repetirContraseña) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (contraseñaActual === nuevaContraseña) {
            setError("La nueva contraseña debe ser diferente a la actual");
            return;
        }

        if (!usuario?.rut_usuario) {
            setError("No se pudo obtener el RUT del usuario");
            return;
        }

        setLoading(true);
        try {
            const resultado = await cambiarContraseña(
                usuario.rut_usuario,
                contraseñaActual,
                nuevaContraseña
            );

            if (resultado.success) {
                setSuccessMessage("Contraseña cambiada exitosamente");
                setContraseñaActual("");
                setNuevaContraseña("");
                setRepetirContraseña("");
            } else {
                setError(resultado.error || "Error al cambiar contraseña");
            }
        } catch (err) {
            setError("Error inesperado al cambiar contraseña");
        } finally {
            setLoading(false);
        }
    };

    if (usuarioLoading) {
        return <Loader />;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex align-items-center mb-4">
                <i className="bi bi-gear-fill me-2" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
                <h1 className="mb-0">Configuraciones</h1>
            </div>
            <p>Gestión de configuraciones del sistema.</p>

            {/* 1. Perfil de usuario */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white">
                    <i className="bi bi-person-circle me-2"></i>
                    Perfil de usuario
                </div>
                <div className="card-body">
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
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setSuccessMessage(null)}
                            ></button>
                        </div>
                    )}

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label fw-bold">RUT</label>
                            <input
                                type="text"
                                className="form-control"
                                value={usuario?.rut_usuario ? formatearRUTFlexible(usuario.rut_usuario) : "Cargando..."}
                                disabled
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                value={usuario?.nombre_usuario || "Cargando..."}
                                disabled
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Rol</label>
                            <input
                                type="text"
                                className="form-control"
                                value={usuario?.rol_usuario || "Cargando..."}
                                disabled
                            />
                        </div>
                    </div>

                    <hr />

                    {/* Cambiar contraseña */}
                    <h5 className="mb-3">
                        <i className="bi bi-lock me-2"></i>
                        Cambiar contraseña
                    </h5>
                    <form onSubmit={handleCambiarContraseña}>
                        <div className="row g-3 mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Contraseña actual</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Ingresa tu contraseña actual"
                                    value={contraseñaActual}
                                    onChange={(e) => setContraseñaActual(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Nueva contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Ingresa tu nueva contraseña"
                                    value={nuevaContraseña}
                                    onChange={(e) => setNuevaContraseña(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Repetir nueva contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Repite tu nueva contraseña"
                                    value={repetirContraseña}
                                    onChange={(e) => setRepetirContraseña(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading ? (
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
                                        <i className="bi bi-save me-2"></i>
                                        Guardar cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}