import { useState, useEffect, useMemo } from "react";
import { getProductosDisponibles, getProductosBajoStock, getProductosAgotados, ProductoReporte } from "../service/ReporteService";
import Loader from "../components/Loader";

export default function Reportes() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [productosDisponibles, setProductosDisponibles] = useState<ProductoReporte[]>([]);
    const [productosBajoStock, setProductosBajoStock] = useState<ProductoReporte[]>([]);
    const [productosAgotados, setProductosAgotados] = useState<ProductoReporte[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

    useEffect(() => {
        cargarReportes();
    }, []);

    const cargarReportes = async () => {
        setLoading(true);
        setError(null);
        const [disponibles, bajo, agotados] = await Promise.all([
            getProductosDisponibles(),
            getProductosBajoStock(),
            getProductosAgotados()
        ]);

        // Verificar si hay errores de autenticación
        if (!disponibles.success || !bajo.success || !agotados.success) {
            const errorMsg = disponibles.error || bajo.error || agotados.error;
            setError(errorMsg || "Error al cargar los reportes");
        }

        if (disponibles.success && disponibles.data) {
            setProductosDisponibles(disponibles.data);
        }
        if (bajo.success && bajo.data) {
            setProductosBajoStock(bajo.data);
        }
        if (agotados.success && agotados.data) {
            setProductosAgotados(agotados.data);
        }
        setLoading(false);
    };

    // Obtener todas las categorías únicas
    const todasLasCategorias = useMemo(() => {
        const categorias = new Set<string>();
        [productosDisponibles, productosBajoStock, productosAgotados].forEach(arr => {
            arr.forEach(producto => {
                if (producto.categoria) {
                    categorias.add(producto.categoria);
                }
            });
        });
        return Array.from(categorias).sort();
    }, [productosDisponibles, productosBajoStock, productosAgotados]);

    // Función para filtrar productos
    const filtrarProductos = (productos: ProductoReporte[]) => {
        return productos.filter(producto => {
            const coincideNombre = (producto.nombre || producto.nombre_producto || "").toLowerCase().includes(busqueda.toLowerCase());
            const coincideID = (producto.codigo || producto.id_producto || "").toString().includes(busqueda);
            const coincideCategoria = !categoriaSeleccionada || (producto.categoria === categoriaSeleccionada);
            return (coincideNombre || coincideID) && coincideCategoria;
        });
    };

    const productosDisponiblesFiltrados = useMemo(() => filtrarProductos(productosDisponibles), [productosDisponibles, busqueda, categoriaSeleccionada]);
    const productosBajoStockFiltrados = useMemo(() => filtrarProductos(productosBajoStock), [productosBajoStock, busqueda, categoriaSeleccionada]);
    const productosAgotadosFiltrados = useMemo(() => filtrarProductos(productosAgotados), [productosAgotados, busqueda, categoriaSeleccionada]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="container-fluid mt-4">
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <strong>Error:</strong> {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
                <button className="btn btn-primary" onClick={cargarReportes}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex align-items-center mb-4">
                <i className="bi bi-bar-chart-line-fill me-2" style={{ fontSize: "2rem", color: "#212529" }}></i>
                <h1 className="mb-0">Reportes de Productos</h1>
            </div>
            <p>Aquí puedes ver reportes del inventario de productos.</p>

            {/* Controles de filtro */}
            <div className="card p-3 mb-4 shadow-sm">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="busqueda" className="form-label">
                            <i className="bi bi-search me-2"></i>
                            Buscar por nombre o ID
                        </label>
                        <input
                            id="busqueda"
                            type="text"
                            className="form-control"
                            placeholder="Camiseta o ID 5..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="categoria" className="form-label">
                            <i className="bi bi-tag me-2"></i>
                            Filtrar por categoría
                        </label>
                        <select
                            id="categoria"
                            className="form-select"
                            value={categoriaSeleccionada}
                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                        >
                            <option value="">Todas las categorías</option>
                            {todasLasCategorias.map(categoria => (
                                <option key={categoria} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                setBusqueda("");
                                setCategoriaSeleccionada("");
                            }}
                        >
                            <i className="bi bi-x-circle me-2"></i>
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </div>

            {/* Reporte de Productos Disponibles */}
            <div className="mb-5">
                <div className="card shadow-sm">
                    <div className="card-header bg-success text-white">
                        <h5 className="mb-0">
                            <i className="bi bi-check-circle me-2"></i>
                            Productos Disponibles ({productosDisponiblesFiltrados.length})
                        </h5>
                    </div>
                    <div className="card-body p-0">
                        {productosDisponiblesFiltrados.length > 0 ? (
                            <div className="accordion" id="accordionDisponibles">
                                {productosDisponiblesFiltrados.map((producto, index) => (
                                    <div className="accordion-item" key={`disp-${producto.codigo || producto.id_producto}`}>
                                        <h2 className="accordion-header">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#collapseDisp${index}`}
                                                aria-expanded="false"
                                                aria-controls={`collapseDisp${index}`}
                                            >
                                                <div className="d-flex w-100 align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center flex-grow-1">
                                                        <span className="badge bg-secondary me-3">#{producto.codigo || producto.id_producto}</span>
                                                        <strong>{producto.nombre || producto.nombre_producto}</strong>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <span className="badge bg-info">{producto.categoria || "-"}</span>
                                                        <span className="badge bg-success">Stock: {producto.stock || producto.stock_total || 0}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        </h2>
                                        <div
                                            id={`collapseDisp${index}`}
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionDisponibles"
                                        >
                                            <div className="accordion-body">
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <p><strong>ID Producto:</strong> {producto.codigo || producto.id_producto}</p>
                                                        <p><strong>Nombre:</strong> {producto.nombre || producto.nombre_producto}</p>
                                                        <p><strong>Categoría:</strong> {producto.categoria || "-"}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p><strong>Stock Total:</strong> <span className="badge bg-success fs-6">{producto.stock || producto.stock_total || 0} unidades</span></p>
                                                        <p className="text-muted mb-0">Producto disponible para la venta</p>
                                                    </div>
                                                </div>
                                                {producto.tallas && producto.tallas.length > 0 && (
                                                    <>
                                                        <hr />
                                                        <p className="fw-bold mb-2">Desglose por Talla (Disponible):</p>
                                                        <div className="table-responsive">
                                                            <table className="table table-sm table-bordered">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th>Talla</th>
                                                                        <th>Stock</th>
                                                                        <th>Estado</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {producto.tallas?.map((talla, idx: number) => (
                                                                        <tr key={idx}>
                                                                            <td>{talla.nombre_talla}</td>
                                                                            <td className="fw-bold">{talla.stock} unidades</td>
                                                                            <td>
                                                                                <span className="badge bg-success">
                                                                                    <i className="bi bi-check-circle me-1"></i>
                                                                                    Disponible
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="alert alert-info mb-0 p-3">
                                <i className="bi bi-info-circle me-2"></i>
                                No hay productos disponibles
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reporte de Productos con Bajo Stock */}
            <div className="mb-5">
                <div className="card shadow-sm">
                    <div className="card-header bg-warning text-dark">
                        <h5 className="mb-0">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            Productos con Bajo Stock ({productosBajoStockFiltrados.length})
                        </h5>
                    </div>
                    <div className="card-body p-0">
                        {productosBajoStockFiltrados.length > 0 ? (
                            <div className="accordion" id="accordionBajoStock">
                                {productosBajoStockFiltrados.map((producto, index) => (
                                    <div className="accordion-item" key={`bajo-${producto.codigo || producto.id_producto}`}>
                                        <h2 className="accordion-header">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#collapseBajo${index}`}
                                                aria-expanded="false"
                                                aria-controls={`collapseBajo${index}`}
                                            >
                                                <div className="d-flex w-100 align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center flex-grow-1">
                                                        <span className="badge bg-secondary me-3">#{producto.codigo || producto.id_producto}</span>
                                                        <strong>{producto.nombre || producto.nombre_producto || producto.nomnbre}</strong>
                                                    </div>
                                                    <span className="badge bg-warning">Stock: {producto.stock || producto.stock_total || 0}</span>
                                                </div>
                                            </button>
                                        </h2>
                                        <div
                                            id={`collapseBajo${index}`}
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionBajoStock"
                                        >
                                            <div className="accordion-body">
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <p><strong>ID Producto:</strong> {producto.codigo || producto.id_producto}</p>
                                                        <p><strong>Nombre:</strong> {producto.nombre || producto.nombre_producto || producto.nomnbre}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p><strong>Stock Actual:</strong> <span className="badge bg-warning fs-6">{producto.stock || producto.stock_total || 0} unidades</span></p>
                                                        <p className="text-muted mb-0">⚠️ Stock bajo - Considere reabastecer</p>
                                                    </div>
                                                </div>
                                                {producto.tallas && producto.tallas.length > 0 && (
                                                    <>
                                                        <hr />
                                                        <p className="fw-bold mb-2">Desglose por Talla (Bajo Stock):</p>
                                                        <div className="table-responsive">
                                                            <table className="table table-sm table-bordered">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th>Talla</th>
                                                                        <th>Stock</th>
                                                                        <th>Estado</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {producto.tallas?.map((talla, idx: number) => (
                                                                        <tr key={idx}>
                                                                            <td>{talla.nombre_talla}</td>
                                                                            <td className="fw-bold">{talla.stock} unidades</td>
                                                                            <td>
                                                                                <span className="badge bg-warning text-dark">
                                                                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                                                                    Bajo Stock
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="alert alert-info mb-0 p-3">
                                <i className="bi bi-info-circle me-2"></i>
                                No hay productos con bajo stock
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reporte de Productos Agotados */}
            <div className="mb-5">
                <div className="card shadow-sm">
                    <div className="card-header bg-danger text-white">
                        <h5 className="mb-0">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            Productos Agotados ({productosAgotadosFiltrados.length})
                        </h5>
                    </div>
                    <div className="card-body p-0">
                        {productosAgotadosFiltrados.length > 0 ? (
                            <div className="accordion" id="accordionAgotados">
                                {productosAgotadosFiltrados.map((producto, index) => (
                                    <div className="accordion-item" key={`agot-${producto.codigo || producto.id_producto}`}>
                                        <h2 className="accordion-header">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#collapseAgot${index}`}
                                                aria-expanded="false"
                                                aria-controls={`collapseAgot${index}`}
                                            >
                                                <div className="d-flex w-100 align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center flex-grow-1">
                                                        <span className="badge bg-secondary me-3">#{producto.codigo || producto.id_producto}</span>
                                                        <strong>{producto.nombre || producto.nombre_producto}</strong>
                                                    </div>
                                                    <span className="badge bg-danger">Sin Stock</span>
                                                </div>
                                            </button>
                                        </h2>
                                        <div
                                            id={`collapseAgot${index}`}
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionAgotados"
                                        >
                                            <div className="accordion-body">
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <p><strong>ID Producto:</strong> {producto.codigo || producto.id_producto}</p>
                                                        <p><strong>Nombre:</strong> {producto.nombre || producto.nombre_producto}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p><strong>Stock Actual:</strong> <span className="badge bg-danger fs-6">0 unidades</span></p>
                                                        <p className="text-muted mb-0">🚨 Producto sin stock - Necesita reorden urgente</p>
                                                    </div>
                                                </div>
                                                {producto.tallas && producto.tallas.length > 0 && (
                                                    <>
                                                        <hr />
                                                        <p className="fw-bold mb-2">Desglose por Talla (Agotado):</p>
                                                        <div className="table-responsive">
                                                            <table className="table table-sm table-bordered">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th>Talla</th>
                                                                        <th>Stock</th>
                                                                        <th>Estado</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {producto.tallas?.map((talla, idx: number) => (
                                                                        <tr key={idx}>
                                                                            <td>{talla.nombre_talla}</td>
                                                                            <td className="fw-bold text-danger">{talla.stock} unidades</td>
                                                                            <td>
                                                                                <span className="badge bg-danger">
                                                                                    <i className="bi bi-x-circle me-1"></i>
                                                                                    Agotado
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="alert alert-info mb-0 p-3">
                                <i className="bi bi-info-circle me-2"></i>
                                No hay productos agotados
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Botón para recargar reportes */}
            <div className="mb-5">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={cargarReportes}
                >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Recargar Reportes
                </button>
            </div>
        </div>
    );
}