import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { crearVenta } from "../service/VentasService";
import { getClientes } from "../service/ClienteService";
import { getProductos } from "../service/ProductoService";
import { getTallas } from "../service/TallaService";
import { getInventarios } from "../service/InventarioService";
import { Cliente } from "../types/cliente";
import { Producto } from "../types/producto";
import { Talla } from "../types/talla";
import { Inventario } from "../types/inventario";
import Loader from "../components/Loader";
import { useUsuarioAutenticado } from "../hooks/useUsuarioAutenticado";
import { useTallasDisponibles } from "../hooks/useTallasDisponibles";
import { getApiData } from "../utils/apiErrorHandler";

interface DetalleVenta {
    id_producto: number;
    id_talla: number;
    cantidad_vendida: number;
    precio_unitario_venta: number;
    nombre_producto?: string;
    nombre_talla?: string;
}

export default function VentasRegistrar() {
    const navigate = useNavigate();
    const { usuario, loading: usuarioLoading } = useUsuarioAutenticado();

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [tallas, setTallas] = useState<Talla[]>([]);
    const [inventarios, setInventarios] = useState<Inventario[]>([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [rut_cliente, setRutCliente] = useState("");
    const [detalles, setDetalles] = useState<DetalleVenta[]>([]);

    const [id_producto, setIdProducto] = useState("");
    const [id_talla, setIdTalla] = useState("");
    const [cantidad, setCantidad] = useState("");

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        const [clientesResult, productosResult, tallasResult, inventariosResult] = await Promise.all([
            getClientes(),
            getProductos(),
            getTallas(),
            getInventarios(),
        ]);

        const clientesData = getApiData(clientesResult, []);
        setClientes(clientesData);
        
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

    const obtenerStockDisponible = () => {
        if (!id_producto || !id_talla) return 0;
        const inv = inventarios.find(
            (i) => i.id_producto === parseInt(id_producto) && i.id_talla === parseInt(id_talla)
        );
        const enVenta = detalles
            .filter((d) => d.id_producto === parseInt(id_producto) && d.id_talla === parseInt(id_talla))
            .reduce((sum, d) => sum + d.cantidad_vendida, 0);
        return (inv?.stock_actual || 0) - enVenta;
    };

    const obtenerPrecio = () => {
        if (!id_producto || !id_talla) return 0;
        const inv = inventarios.find(
            (i) => i.id_producto === parseInt(id_producto) && i.id_talla === parseInt(id_talla)
        );
        return inv?.precio_unitario || 0;
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

        const stock = obtenerStockDisponible();
        if (parseInt(cantidad) > stock) {
            setError(`Stock insuficiente. Disponible: ${stock}`);
            return;
        }

        const precio = obtenerPrecio();
        if (precio <= 0) {
            setError("No hay precio establecido para este producto");
            return;
        }

        const producto = productos.find((p) => p.id_producto === parseInt(id_producto));
        const talla = tallas.find((t) => t.id_talla === parseInt(id_talla));

        const detalle: DetalleVenta = {
            id_producto: parseInt(id_producto),
            id_talla: parseInt(id_talla),
            cantidad_vendida: parseInt(cantidad),
            precio_unitario_venta: precio,
            nombre_producto: producto?.nombre_producto || "Producto",
            nombre_talla: talla?.nombre_talla || "Talla",
        };

        const existe = detalles.findIndex(
            (d) => d.id_producto === detalle.id_producto && d.id_talla === detalle.id_talla
        );

        if (existe !== -1) {
            const nuevosDetalles = [...detalles];
            nuevosDetalles[existe].cantidad_vendida += detalle.cantidad_vendida;
            setDetalles(nuevosDetalles);
        } else {
            setDetalles([...detalles, detalle]);
        }

        setIdProducto("");
        setIdTalla("");
        setCantidad("");
    };

    const handleEliminarDetalle = (index: number) => {
        setDetalles(detalles.filter((_, i) => i !== index));
    };

    const handleModificarCantidad = (index: number, cantidad: number) => {
        const stock = inventarios.find(
            (i) =>
                i.id_producto === detalles[index].id_producto && i.id_talla === detalles[index].id_talla
        )?.stock_actual || 0;

        const enVenta = detalles
            .filter(
                (d, i) =>
                    i !== index &&
                    d.id_producto === detalles[index].id_producto &&
                    d.id_talla === detalles[index].id_talla
            )
            .reduce((sum, d) => sum + d.cantidad_vendida, 0);

        if (cantidad > stock - enVenta) {
            setError(`Stock insuficiente. Máximo disponible: ${stock - enVenta}`);
            return;
        }

        if (cantidad <= 0) {
            handleEliminarDetalle(index);
            return;
        }

        const nuevosDetalles = [...detalles];
        nuevosDetalles[index].cantidad_vendida = cantidad;
        setDetalles(nuevosDetalles);
    };

    const calcularTotal = () => {
        return detalles.reduce((sum, d) => sum + d.cantidad_vendida * d.precio_unitario_venta, 0);
    };

    const formatearDinero = (cantidad: number) => {
        return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
        }).format(cantidad);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (detalles.length === 0) {
            setError("Agrega al menos un producto a la venta");
            return;
        }

        if (!rut_cliente) {
            setError("Selecciona un cliente");
            return;
        }

        if (!usuario?.rut_usuario) {
            setError("No se pudo obtener el usuario actual");
            return;
        }

        setSubmitting(true);
        const result = await crearVenta({
            rut_cliente,
            rut_usuario: usuario.rut_usuario,
            detalles: detalles.map((d) => ({
                id_producto: d.id_producto,
                id_talla: d.id_talla,
                cantidad_vendida: d.cantidad_vendida,
                precio_unitario_venta: d.precio_unitario_venta,
            })),
        });

        setSubmitting(false);

        if (result.success) {
            setSuccessMessage("Venta registrada exitosamente");
            setTimeout(() => {
                navigate("/ventas");
            }, 1500);
        } else {
            setError(result.error || "Error al crear la venta");
        }
    };

    if (loading || usuarioLoading) {
        return <Loader />;
    }

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-plus-circle me-2"></i>
                    Registrar Venta
                </h1>
                <Link to="/ventas" className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Volver
                </Link>
            </div>

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

            <div className="row">
                {/* Formulario de entrada */}
                <div className="col-lg-5">
                    <div className="card p-4 shadow-sm mb-4">
                        <h5 className="mb-3">
                            <i className="bi bi-info-circle me-2"></i>
                            Información de la Venta
                        </h5>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Cliente *</label>
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select"
                                    value={rut_cliente}
                                    onChange={(e) => setRutCliente(e.target.value)}
                                    disabled={submitting}
                                >
                                    <option value="">Selecciona un cliente</option>
                                    {clientes.map((c) => (
                                        <option key={c.rut_cliente} value={c.rut_cliente}>
                                            {c.nombre_cliente} ({c.rut_cliente})
                                        </option>
                                    ))}
                                </select>
                                {!submitting ? (
                                    <Link to="/clientes/registrar?from=/ventas/registrar" className="btn btn-outline-primary">
                                        <i className="bi bi-plus-lg"></i>
                                    </Link>
                                ) : (
                                    <button type="button" className="btn btn-outline-primary" disabled>
                                        <i className="bi bi-plus-lg"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Vendedor</label>
                            <input
                                type="text"
                                className="form-control"
                                value={usuario?.nombre_usuario ? `${usuario.nombre_usuario} (${usuario.rut_usuario})` : "Cargando..."}
                                disabled
                            />
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
                                    <Link to="/inventario/agregar?from=/ventas/registrar" className="btn btn-outline-primary">
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
                                placeholder="2"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                min="1"
                                disabled={submitting}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Stock Disponible</label>
                            <input
                                type="text"
                                className="form-control"
                                value={obtenerStockDisponible()}
                                disabled
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Precio Unitario</label>
                            <input
                                type="text"
                                className="form-control"
                                value={obtenerPrecio() > 0 ? formatearDinero(obtenerPrecio()) : "-"}
                                disabled
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

                {/* Resumen de venta */}
                <div className="col-lg-7">
                    <div className="card p-4 shadow-sm">
                        <h5 className="mb-3">
                            <i className="bi bi-list-check me-2"></i>
                            Resumen de Venta ({detalles.length} productos)
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
                                                <td className="text-center">
                                                    <div className="d-flex align-items-center justify-content-center gap-1">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() =>
                                                                handleModificarCantidad(index, detalle.cantidad_vendida - 1)
                                                            }
                                                            disabled={submitting}
                                                        >
                                                            -
                                                        </button>
                                                        <span style={{ minWidth: "30px", textAlign: "center" }}>
                                                            {detalle.cantidad_vendida}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() =>
                                                                handleModificarCantidad(index, detalle.cantidad_vendida + 1)
                                                            }
                                                            disabled={submitting}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="text-end">{formatearDinero(detalle.precio_unitario_venta)}</td>
                                                <td className="text-end fw-bold">
                                                    {formatearDinero(detalle.cantidad_vendida * detalle.precio_unitario_venta)}
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
                                                TOTAL VENTA:
                                            </th>
                                            <th colSpan={2} className="text-end fs-5">
                                                {formatearDinero(calcularTotal())}
                                            </th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}

                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/ventas" className="btn btn-danger">
                                <i className="bi bi-x-lg me-2"></i>
                                Cancelar
                            </Link>
                            <button
                                className="btn btn-success"
                                onClick={handleSubmit}
                                disabled={submitting || detalles.length === 0}
                            >
                                {submitting ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Registrando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg me-2"></i>
                                        Confirmar Venta
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
