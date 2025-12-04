import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getInventarios } from "../service/InventarioService";
import { editarInventario } from "../service/InventarioService";
import { Inventario } from "../types/inventario";
import Loader from "../components/Loader";

interface EditingItem extends Inventario {
    nuevo_stock: number;
    nuevo_precio: number;
    nuevo_stock_critico: number;
}

export default function InventarioEditar() {
    const { id_producto } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [inventarioItems, setInventarioItems] = useState<EditingItem[]>([]);

    useEffect(() => {
        cargarInventario();
    }, [id_producto]);

    const cargarInventario = async () => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await getInventarios();
            if (resultado.success && resultado.data) {
                // Filtrar solo los items del producto actual
                const items = resultado.data
                    .filter((item) => item.id_producto === parseInt(id_producto || "0"))
                    .map((item) => ({
                        ...item,
                        nuevo_stock: item.stock_actual,
                        nuevo_precio: item.precio_unitario,
                        nuevo_stock_critico: item.stock_critico,
                    }));
                setInventarioItems(items);
            } else if (!resultado.success) {
                setError((resultado as any).error || "Error al cargar el inventario");
            }
        } catch (err) {
            setError("Error inesperado al cargar el inventario");
        } finally {
            setLoading(false);
        }
    };

    const handleStockChange = (index: number, value: number) => {
        const items = [...inventarioItems];
        items[index].nuevo_stock = Math.max(0, value);
        setInventarioItems(items);
    };

    const handlePrecioChange = (index: number, value: number) => {
        const items = [...inventarioItems];
        items[index].nuevo_precio = Math.max(0, value);
        setInventarioItems(items);
    };

    const handleStockCriticoChange = (index: number, value: number) => {
        const items = [...inventarioItems];
        items[index].nuevo_stock_critico = Math.max(0, value);
        setInventarioItems(items);
    };

    const calcularStockTotal = () => {
        return inventarioItems.reduce((sum, item) => sum + item.nuevo_stock, 0);
    };

    const calcularCambiosTotales = () => {
        const cambios = inventarioItems.map((item) => ({
            stock: item.nuevo_stock - item.stock_actual,
            precio: item.nuevo_precio - item.precio_unitario,
            stock_critico: item.nuevo_stock_critico - item.stock_critico,
        }));
        return cambios;
    };

    const validarFormulario = (): string | null => {
        // Validar que no haya valores negativos
        for (const item of inventarioItems) {
            if (item.nuevo_stock < 0) {
                return `Stock no puede ser negativo para ${item.nombre_talla}`;
            }
            if (item.nuevo_precio < 0) {
                return `Precio no puede ser negativo para ${item.nombre_talla}`;
            }
        }
        // Validar que al menos haya un cambio
        const cambios = calcularCambiosTotales();
        const haycambios = cambios.some((c) => c.stock !== 0 || c.precio !== 0 || c.stock_critico !== 0);
        if (!haycambios) {
            return "No hay cambios para guardar";
        }
        return null;
    };

    const handleGuardarCambios = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Validar formulario
        const validationError = validarFormulario();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);

        try {
            // Guardar todos los cambios
            const resultados = await Promise.all(
                inventarioItems.map((item) =>
                    editarInventario(
                        item.id_producto,
                        item.id_talla,
                        item.nuevo_stock,
                        item.nuevo_precio,
                        item.nuevo_stock_critico
                    )
                )
            );

            // Verificar si todos fueron exitosos
            const todoExitoso = resultados.every((r) => r.success);
            if (todoExitoso) {
                setSuccessMessage("✅ Inventario actualizado exitosamente");
                setTimeout(() => {
                    navigate("/inventario");
                }, 2000);
            } else {
                const errorMsg = resultados.find((r) => !r.success)?.error || "Error al actualizar";
                setError(errorMsg);
            }
        } catch (err) {
            setError("Error inesperado al guardar los cambios");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (inventarioItems.length === 0) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1>
                        <i className="bi bi-pencil-square me-2"></i>
                        Editar Inventario
                    </h1>
                    <Link to="/inventario" className="btn btn-secondary">
                        <i className="bi bi-arrow-left"></i> Volver
                    </Link>
                </div>
                <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    No hay registros de inventario para este producto.
                </div>
            </div>
        );
    }

    const nombreProducto = inventarioItems[0]?.nombre_producto || "Producto";
    const nombreCategoria = inventarioItems[0]?.nombre_categoria || "-";

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Inventario
                </h1>
                <Link to="/inventario" className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Volver
                </Link>
            </div>
            <p>Ajusta el stock y precio de los productos por talla.</p>

            {/* Mostrar error general */}
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

            {/* Mostrar mensaje de éxito */}
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleGuardarCambios} className="card p-4 shadow-lg">
                {/* Información del producto */}
                <div className="card mb-4 bg-light">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <p className="mb-1">
                                    <strong>Producto:</strong> {nombreProducto}
                                </p>
                                <p className="mb-0">
                                    <strong>Categoría:</strong> {nombreCategoria}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="mb-1">
                                    <strong>ID Producto:</strong> {id_producto}
                                </p>
                                <p className="mb-0">
                                    <strong>Tallas a editar:</strong> {inventarioItems.length} | <strong>Stock Total:</strong>{" "}
                                    <span className="badge bg-primary fs-6">{calcularStockTotal()} unidades</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de edición - Solo input y cambio */}
                <div className="table-responsive mb-4">
                    <table className="table table-sm table-bordered table-hover">
                        <thead className="table-light">
                            <tr>
                                <th className="text-center" style={{width: '15%'}}>Talla</th>
                                <th className="text-center" style={{width: '25%'}}>Stock</th>
                                <th className="text-center" style={{width: '25%'}}>Precio</th>
                                <th className="text-center" style={{width: '25%'}}>Crítico</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventarioItems.map((item, index) => {
                                const cambioStock = item.nuevo_stock - item.stock_actual;
                                const cambioPrecio = item.nuevo_precio - item.precio_unitario;
                                const cambioStockCritico = item.nuevo_stock_critico - item.stock_critico;
                                const stockColor =
                                    cambioStock > 0 ? "text-success" : cambioStock < 0 ? "text-danger" : "text-muted";
                                const precioColor =
                                    cambioPrecio > 0 ? "text-danger" : cambioPrecio < 0 ? "text-success" : "text-muted";
                                const criticoColor =
                                    cambioStockCritico > 0 ? "text-warning" : cambioStockCritico < 0 ? "text-info" : "text-muted";

                                return (
                                    <tr key={`${item.id_producto}-${item.id_talla}`}>
                                        <td className="text-center align-middle">
                                            <span className="badge bg-secondary">{item.nombre_talla}</span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    min="0"
                                                    value={item.nuevo_stock}
                                                    onChange={(e) => handleStockChange(index, parseInt(e.target.value) || 0)}
                                                    disabled={submitting}
                                                    placeholder={item.stock_actual.toString()}
                                                />
                                                <span className={`fw-bold small text-nowrap ${stockColor}`}>
                                                    {cambioStock > 0 ? "+" : ""}
                                                    {cambioStock}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    min="0"
                                                    step="100"
                                                    value={item.nuevo_precio}
                                                    onChange={(e) =>
                                                        handlePrecioChange(index, parseInt(e.target.value) || 0)
                                                    }
                                                    disabled={submitting}
                                                    placeholder={item.precio_unitario.toString()}
                                                />
                                                <span className={`fw-bold small text-nowrap ${precioColor}`}>
                                                    {cambioPrecio > 0 ? "+" : ""}${cambioPrecio.toLocaleString("es-CL")}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    min="0"
                                                    value={item.nuevo_stock_critico}
                                                    onChange={(e) =>
                                                        handleStockCriticoChange(index, parseInt(e.target.value) || 0)
                                                    }
                                                    disabled={submitting}
                                                    placeholder={item.stock_critico.toString()}
                                                />
                                                <span className={`fw-bold small text-nowrap ${criticoColor}`}>
                                                    {cambioStockCritico > 0 ? "+" : ""}
                                                    {cambioStockCritico}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Resumen de cambios */}
                {calcularCambiosTotales().some((c) => c.stock !== 0 || c.precio !== 0 || c.stock_critico !== 0) && (
                    <div className="alert alert-info mb-4">
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>Cambios detectados:</strong>
                        <ul className="mb-0 mt-2">
                            {calcularCambiosTotales().map((cambio, idx) => {
                                const item = inventarioItems[idx];
                                const hay_cambios = cambio.stock !== 0 || cambio.precio !== 0 || cambio.stock_critico !== 0;
                                if (!hay_cambios) return null;
                                return (
                                    <li key={idx}>
                                        {item.nombre_talla}: Stock {cambio.stock > 0 ? "+" : ""}{cambio.stock} | Precio{" "}
                                        {cambio.precio > 0 ? "+" : ""}${cambio.precio.toLocaleString("es-CL")} | Crítico {cambio.stock_critico > 0 ? "+" : ""}{cambio.stock_critico}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="d-flex justify-content-end gap-2">
                    <Link to="/inventario" className="btn btn-danger">
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
                                Guardar cambios
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
