import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { crearCompra } from "../service/ComprasService";
import { getProveedores } from "../service/ProveedorService";
import { getApiData } from "../utils/apiErrorHandler";
import { getProductos } from "../service/ProductoService";
import { getTallas } from "../service/TallaService";
import { getInventarios } from "../service/InventarioService";
import { Proveedor } from "../types/proveedor";
import { Producto } from "../types/producto";
import { Talla } from "../types/talla";
import { Inventario } from "../types/inventario";
import Loader from "../components/Loader";
import { useUsuario } from "../context/UsuarioContext";
import { useUsuarioAutenticado } from "../hooks/useUsuarioAutenticado";
import { useTallasDisponibles } from "../hooks/useTallasDisponibles";

interface DetalleCompra {
    id_producto: number;
    id_talla: number;
    cantidad_adquirida: number;
    precio_unitario_compra: number;
    nombre_producto?: string;
    nombre_talla?: string;
}

export default function ComprasRegistrar() {
    const navigate = useNavigate();
    const { loading: usuarioLoading } = useUsuario();
    const { usuario } = useUsuarioAutenticado();

    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [tallas, setTallas] = useState<Talla[]>([]);
    const [inventarios, setInventarios] = useState<Inventario[]>([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [rut_proveedor, setRutProveedor] = useState("");
    const [detalles, setDetalles] = useState<DetalleCompra[]>([]);

    // Campos para agregar producto
    const [id_producto, setIdProducto] = useState("");
    const [id_talla, setIdTalla] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [precio, setPrecio] = useState("");

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        const [proveedoresResult, productosResult, tallasResult, inventariosResult] = await Promise.all([
            getProveedores(),
            getProductos(),
            getTallas(),
            getInventarios(),
        ]);

        const proveedoresData = getApiData(proveedoresResult, []);
        setProveedores(proveedoresData);
        
        if (productosResult.success && productosResult.data) {
            setProductos(productosResult.data);
        }
        if (tallasResult.success && tallasResult.data) {
            setTallas(tallasResult.data);
        }
        if (inventariosResult.success && inventariosResult.data) {
            setInventarios(inventariosResult.data);
        }
        setLoading(false);
    };

    const obtenerNombreProducto = () => {
        return productos.find((p) => p.id_producto === parseInt(id_producto))?.nombre_producto || "";
    };

    const obtenerNombreTalla = () => {
        return tallas.find((t) => t.id_talla === parseInt(id_talla))?.nombre_talla || "";
    };

    const tallasDisponibles = useTallasDisponibles(id_producto, tallas, inventarios);

    const handleAgregarProducto = () => {
        setError(null);

        if (!id_producto) {
            setError("Selecciona un producto");
            return;
        }
        if (!id_talla) {
            setError("Selecciona una talla");
            return;
        }
        if (!cantidad || parseInt(cantidad) <= 0) {
            setError("La cantidad debe ser mayor a 0");
            return;
        }
        if (!precio || parseInt(precio) <= 0) {
            setError("El precio debe ser mayor a 0");
            return;
        }

        // Validar que no esté duplicado
        if (detalles.some((d) => d.id_producto === parseInt(id_producto) && d.id_talla === parseInt(id_talla))) {
            setError("Este producto con talla ya existe en la compra");
            return;
        }

        const nuevoDetalle: DetalleCompra = {
            id_producto: parseInt(id_producto),
            id_talla: parseInt(id_talla),
            cantidad_adquirida: parseInt(cantidad),
            precio_unitario_compra: parseInt(precio),
            nombre_producto: obtenerNombreProducto(),
            nombre_talla: obtenerNombreTalla(),
        };

        setDetalles([...detalles, nuevoDetalle]);
        setIdProducto("");
        setIdTalla("");
        setCantidad("");
        setPrecio("");
    };

    const handleEliminarDetalle = (index: number) => {
        setDetalles(detalles.filter((_, i) => i !== index));
    };

    const calcularTotal = () => {
        return detalles.reduce((sum, d) => sum + d.cantidad_adquirida * d.precio_unitario_compra, 0);
    };

    const handleGuardar = async () => {
        setError(null);
        setSuccessMessage(null);

        if (!rut_proveedor) {
            setError("Selecciona un proveedor");
            return;
        }

        if (detalles.length === 0) {
            setError("Agrega al menos un producto a la compra");
            return;
        }

        setSubmitting(true);

        const payload = {
            rut_proveedor,
            detalles: detalles.map((d) => ({
                id_producto: d.id_producto,
                id_talla: d.id_talla,
                cantidad_adquirida: d.cantidad_adquirida,
                precio_unitario_compra: d.precio_unitario_compra,
            })),
        };

        const resultado = await crearCompra(payload);

        if (resultado.success) {
            setSuccessMessage("✅ Compra registrada correctamente");
            setTimeout(() => {
                navigate("/compras");
            }, 2000);
        } else {
            setError(resultado.error || "Error al registrar la compra");
        }

        setSubmitting(false);
    };

    if (loading || usuarioLoading) {
        return <Loader />;
    }

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-plus-circle me-2"></i>
                    Registrar Compra
                </h1>
                <Link to="/compras" className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Volver
                </Link>
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <strong>Error:</strong> {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
            )}

            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    {successMessage}
                </div>
            )}

            <div className="row">
                {/* Formulario de entrada */}
                <div className="col-lg-5">
                    <div className="card p-4 shadow-sm mb-4">
                        <h5 className="mb-3">
                            <i className="bi bi-info-circle me-2"></i>
                            Información de la Compra
                        </h5>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Proveedor *</label>
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select"
                                    value={rut_proveedor}
                                    onChange={(e) => setRutProveedor(e.target.value)}
                                    disabled={submitting}
                                >
                                    <option value="">Selecciona un proveedor</option>
                                    {proveedores.map((p) => (
                                        <option key={p.rut_proveedor} value={p.rut_proveedor}>
                                            {p.nombre_proveedor} ({p.rut_proveedor})
                                        </option>
                                    ))}
                                </select>
                                {!submitting ? (
                                    <Link to="/proveedores/registrar?from=/compras/registrar" className="btn btn-outline-primary">
                                        <i className="bi bi-plus-lg"></i>
                                    </Link>
                                ) : (
                                    <button type="button" className="btn btn-outline-primary" disabled>
                                        <i className="bi bi-plus-lg"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        <hr />

                        <h5 className="mb-3">
                            <i className="bi bi-bag-plus me-2"></i>
                            Agregar Productos
                        </h5>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Producto *</label>
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select"
                                    value={id_producto}
                                    onChange={(e) => {
                                        setIdProducto(e.target.value);
                                        // Limpiar talla cuando cambia el producto
                                        setIdTalla("");
                                    }}
                                    disabled={submitting}
                                >
                                    <option value="">Selecciona un producto</option>
                                    {productos.map((p) => (
                                        <option key={p.id_producto} value={p.id_producto}>
                                            {p.nombre_producto}
                                        </option>
                                    ))}
                                </select>
                                {usuario?.rol_usuario !== "VENDEDOR" && !submitting ? (
                                    <Link to="/inventario/agregar?from=/compras/registrar" className="btn btn-outline-primary">
                                        <i className="bi bi-plus-lg"></i>
                                    </Link>
                                ) : null}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Talla *</label>
                            <select
                                className="form-select"
                                value={id_talla}
                                onChange={(e) => setIdTalla(e.target.value)}
                                disabled={submitting || !id_producto}
                            >
                                <option value="">
                                    {id_producto ? "Selecciona una talla" : "Selecciona un producto primero"}
                                </option>
                                {tallasDisponibles.map((t) => (
                                    <option key={t.id_talla} value={t.id_talla}>
                                        {t.nombre_talla}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Cantidad *</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="50"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                min="1"
                                disabled={submitting}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Precio Unitario de Compra *</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Ej: 5000"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                                min="1"
                                disabled={submitting}
                            />
                        </div>

                        <button
                            className="btn btn-primary w-100"
                            onClick={handleAgregarProducto}
                            disabled={submitting}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            Agregar Producto
                        </button>
                    </div>
                </div>

                {/* Resumen de compra */}
                <div className="col-lg-7">
                    <div className="card p-4 shadow-sm">
                        <h5 className="mb-3">
                            <i className="bi bi-list-check me-2"></i>
                            Resumen de Compra ({detalles.length} productos)
                        </h5>

                        {detalles.length === 0 ? (
                            <div className="alert alert-info">
                                <i className="bi bi-info-circle me-2"></i>
                                No hay productos agregados. Agrega al menos uno.
                            </div>
                        ) : (
                            <div className="table-responsive mb-3">
                                <table className="table table-sm table-bordered">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Producto</th>
                                            <th>Talla</th>
                                            <th className="text-center">Cantidad</th>
                                            <th className="text-end">Precio Unit.</th>
                                            <th className="text-end">Subtotal</th>
                                            <th className="text-center">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detalles.map((detalle, index) => (
                                            <tr key={index}>
                                                <td>{detalle.nombre_producto}</td>
                                                <td>
                                                    <span className="badge bg-secondary">{detalle.nombre_talla}</span>
                                                </td>
                                                <td className="text-center fw-bold">{detalle.cantidad_adquirida}</td>
                                                <td className="text-end">${detalle.precio_unitario_compra.toLocaleString("es-CL")}</td>
                                                <td className="text-end fw-bold">
                                                    ${(detalle.cantidad_adquirida * detalle.precio_unitario_compra).toLocaleString("es-CL")}
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleEliminarDetalle(index)}
                                                        disabled={submitting}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="table-light">
                                        <tr>
                                            <th colSpan={4} className="text-end">
                                                TOTAL COMPRA:
                                            </th>
                                            <th colSpan={2} className="text-end fs-5">
                                                ${calcularTotal().toLocaleString("es-CL")}
                                            </th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}

                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/compras" className="btn btn-danger">
                                <i className="bi bi-x-lg me-2"></i>
                                Cancelar
                            </Link>
                            <button
                                className="btn btn-success"
                                onClick={handleGuardar}
                                disabled={submitting || detalles.length === 0}
                            >
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
                                        Registrar Compra
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}