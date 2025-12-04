import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { agregarInventario, getInventarios } from "../service/InventarioService";
import { getProductos, crearProducto } from "../service/ProductoService";
import { getTallas } from "../service/TallaService";
import { Producto } from "../types/producto";
import { Talla } from "../types/talla";
import { Inventario } from "../types/inventario";

interface Categoria {
    id_categoria: number;
    nombre_categoria: string;
}

export default function InventarioAgregar() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fromPage = searchParams.get("from") || "/inventario";
    const [productos, setProductos] = useState<Producto[]>([]);
    const [tallas, setTallas] = useState<Talla[]>([]);
    const [inventarios, setInventarios] = useState<Inventario[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [showModalProducto, setShowModalProducto] = useState(false);
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        id_categoria: "",
    });
    const [creandoProducto, setCreandoProducto] = useState(false);

    const [formData, setFormData] = useState({
        id_producto: "",
        id_talla: "",
        precio_unitario: "",
        stock_actual: "",
        stock_critico: "",
    });

    const [errors, setErrors] = useState({
        id_producto: "",
        id_talla: "",
        precio_unitario: "",
        stock_actual: "",
        stock_critico: "",
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        const [productosResult, tallasResult, inventariosResult] = await Promise.all([
            getProductos(),
            getTallas(),
            getInventarios()
        ]);

        if (productosResult.success && productosResult.data) {
            setProductos(productosResult.data);
            // Extraer categorías únicas
            const categoriasUnicas = Array.from(
                new Map(productosResult.data.map((p) => [p.categoria.id_categoria, p.categoria])).values()
            );
            setCategorias(categoriasUnicas);
        }
        if (tallasResult.success && tallasResult.data) {
            setTallas(tallasResult.data);
        }
        if (inventariosResult.success && inventariosResult.data) {
            setInventarios(inventariosResult.data);
        }
        setLoading(false);
    };

    const obtenerTallasDisponibles = () => {
        if (!formData.id_producto) return tallas;
        const tallasEnInventario = inventarios
            .filter((inv) => inv.id_producto === parseInt(formData.id_producto))
            .map((inv) => inv.id_talla);
        return tallas.filter((t) => !tallasEnInventario.includes(t.id_talla));
    };

    const handleCrearProducto = async () => {
        if (!nuevoProducto.nombre.trim()) {
            setError("Ingresa el nombre del producto");
            return;
        }
        if (!nuevoProducto.id_categoria) {
            setError("Selecciona una categoría");
            return;
        }

        setCreandoProducto(true);
        setError(null);

        const result = await crearProducto(nuevoProducto.nombre, parseInt(nuevoProducto.id_categoria));

        setCreandoProducto(false);

        if (result.success && result.data) {
            // Agregar el nuevo producto a la lista
            setProductos([...productos, result.data]);
            setFormData({ ...formData, id_producto: result.data.id_producto.toString() });
            setShowModalProducto(false);
            setNuevoProducto({ nombre: "", id_categoria: "" });
            setSuccessMessage("Producto creado exitosamente");
            setTimeout(() => setSuccessMessage(null), 2000);
        } else if (!result.success) {
            setError((result as any).error || "Error al crear el producto");
        }
    };

    const validateForm = () => {
        const newErrors = {
            id_producto: "",
            id_talla: "",
            precio_unitario: "",
            stock_actual: "",
            stock_critico: "",
        };

        if (!formData.id_producto) newErrors.id_producto = "Selecciona un producto";
        if (!formData.id_talla) newErrors.id_talla = "Selecciona una talla";
        if (!formData.precio_unitario || parseInt(formData.precio_unitario) < 0)
            newErrors.precio_unitario = "El precio debe ser mayor o igual a 0";
        if (!formData.stock_actual || parseInt(formData.stock_actual) < 0)
            newErrors.stock_actual = "El stock debe ser mayor o igual a 0";
        if (!formData.stock_critico || parseInt(formData.stock_critico) < 0)
            newErrors.stock_critico = "El stock crítico debe ser mayor o igual a 0";

        setErrors(newErrors);
        return !Object.values(newErrors).some((err) => err);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!validateForm()) return;

        setSubmitting(true);
        const result = await agregarInventario({
            id_producto: parseInt(formData.id_producto),
            id_talla: parseInt(formData.id_talla),
            precio_unitario: parseInt(formData.precio_unitario),
            stock_actual: parseInt(formData.stock_actual),
            stock_critico: parseInt(formData.stock_critico),
        });

        setSubmitting(false);

        if (result.success) {
            setSuccessMessage("Producto agregado exitosamente");
            setTimeout(() => {
                navigate(fromPage);
            }, 1500);
        } else {
            setError(result.error || "Error al agregar el producto");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-plus-circle me-2"></i>
                    Agregar Producto
                </h1>
                <Link to={fromPage} className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Volver
                </Link>
            </div>
            <p>Formulario para agregar un nuevo producto con talla al inventario.</p>

            <div className="card p-4 shadow-lg" style={{ maxWidth: 600, margin: "0 auto" }}>
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

                {successMessage && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <i className="bi bi-check-circle me-2"></i>
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">
                            Producto <span className="text-danger">*</span>
                        </label>
                        {loading ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        ) : (
                            <>
                                <div className="d-flex gap-2">
                                    <select
                                        className={`form-select ${errors.id_producto ? "is-invalid" : ""}`}
                                        value={formData.id_producto}
                                        onChange={(e) => {
                                            const valor = e.target.value;
                                            if (valor === "nuevo") {
                                                setShowModalProducto(true);
                                            } else {
                                                setFormData({ ...formData, id_producto: valor });
                                            }
                                        }}
                                        disabled={loading || submitting}
                                    >
                                        <option value="">-- Selecciona un producto --</option>
                                        <option value="nuevo" style={{ fontStyle: "italic", backgroundColor: "#f0f0f0" }}>
                                            Crear nuevo producto
                                        </option>
                                        {productos.map((p) => (
                                            <option key={p.id_producto} value={p.id_producto}>
                                                {p.nombre_producto} ({p.categoria.nombre_categoria})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.id_producto && (
                                    <div className="invalid-feedback d-block">{errors.id_producto}</div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">
                            Talla <span className="text-danger">*</span>
                        </label>
                        {loading ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        ) : (
                            <>
                                <select
                                    className={`form-select ${errors.id_talla ? "is-invalid" : ""}`}
                                    value={formData.id_talla}
                                    onChange={(e) => setFormData({ ...formData, id_talla: e.target.value })}
                                    disabled={loading || submitting || !formData.id_producto}
                                >
                                    <option value="">
                                        {!formData.id_producto
                                            ? "-- Selecciona un producto primero --"
                                            : obtenerTallasDisponibles().length === 0
                                            ? "-- Todas las tallas de este producto ya están en inventario --"
                                            : "-- Selecciona una talla --"}
                                    </option>
                                    {obtenerTallasDisponibles().map((t) => (
                                        <option key={t.id_talla} value={t.id_talla}>
                                            {t.nombre_talla}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_talla && (
                                    <div className="invalid-feedback d-block">{errors.id_talla}</div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">
                            Precio Unitario <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className={`form-control ${errors.precio_unitario ? "is-invalid" : ""}`}
                            placeholder="25000"
                            value={formData.precio_unitario}
                            onChange={(e) =>
                                setFormData({ ...formData, precio_unitario: e.target.value })
                            }
                            disabled={submitting}
                            min="0"
                        />
                        {errors.precio_unitario && (
                            <div className="invalid-feedback d-block">{errors.precio_unitario}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">
                            Stock Actual <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className={`form-control ${errors.stock_actual ? "is-invalid" : ""}`}
                            placeholder="25"
                            value={formData.stock_actual}
                            onChange={(e) =>
                                setFormData({ ...formData, stock_actual: e.target.value })
                            }
                            disabled={submitting}
                            min="0"
                        />
                        {errors.stock_actual && (
                            <div className="invalid-feedback d-block">{errors.stock_actual}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">
                            Stock Crítico <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className={`form-control ${errors.stock_critico ? "is-invalid" : ""}`}
                            placeholder="5"
                            value={formData.stock_critico}
                            onChange={(e) =>
                                setFormData({ ...formData, stock_critico: e.target.value })
                            }
                            disabled={submitting}
                            min="0"
                        />
                        {errors.stock_critico && (
                            <div className="invalid-feedback d-block">{errors.stock_critico}</div>
                        )}
                        <small className="text-muted d-block mt-1">
                            <i className="bi bi-info-circle me-1"></i>
                            Nivel mínimo de stock antes de generar alerta de reorden
                        </small>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <Link to={fromPage} className="btn btn-danger">
                            <i className="bi bi-x-lg me-2"></i>
                            Cancelar
                        </Link>
                        <button type="submit" className="btn btn-success" disabled={submitting}>
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
                                    Guardar producto
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal para crear nuevo producto */}
            {showModalProducto && (
                <div
                    className="modal d-block"
                    tabIndex={-1}
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !creandoProducto) {
                            setShowModalProducto(false);
                            setNuevoProducto({ nombre: "", id_categoria: "" });
                            setFormData({ ...formData, id_producto: "" });
                        }
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Crear Nuevo Producto
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModalProducto(false);
                                        setNuevoProducto({ nombre: "", id_categoria: "" });
                                        setFormData({ ...formData, id_producto: "" });
                                    }}
                                    disabled={creandoProducto}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nombre del Producto *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Camiseta deportiva"
                                        value={nuevoProducto.nombre}
                                        onChange={(e) =>
                                            setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
                                        }
                                        disabled={creandoProducto}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Categoría *</label>
                                    <select
                                        className="form-select"
                                        value={nuevoProducto.id_categoria}
                                        onChange={(e) =>
                                            setNuevoProducto({ ...nuevoProducto, id_categoria: e.target.value })
                                        }
                                        disabled={creandoProducto}
                                    >
                                        <option value="">-- Selecciona una categoría --</option>
                                        {categorias.map((c) => (
                                            <option key={c.id_categoria} value={c.id_categoria}>
                                                {c.nombre_categoria}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowModalProducto(false);
                                        setNuevoProducto({ nombre: "", id_categoria: "" });
                                        setFormData({ ...formData, id_producto: "" });
                                    }}
                                    disabled={creandoProducto}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleCrearProducto}
                                    disabled={creandoProducto}
                                >
                                    {creandoProducto ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                            Creando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg me-2"></i>
                                            Crear Producto
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}