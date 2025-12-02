export default function Reportes() {
    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center mb-4">
                <i className="bi bi-bar-chart-line-fill me-2" style={{ fontSize: "2rem", color: "#212529" }}></i>
                <h1 className="mb-0">Reportes</h1>
            </div>
            <p>Aquí puedes ver reportes y estadísticas del sistema.</p>

            {/* Reporte de Inventario */}
            <div className="mb-5">
                <h3>
                    <i className="bi bi-box-seam me-2"></i>
                    Reporte de Inventario
                </h3>
                <div className="mb-3">
                    <h5>Productos disponibles actualmente</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Código</th>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Stock total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>001</td>
                                    <td>Camiseta Básica</td>
                                    <td>Ropa</td>
                                    <td>25</td>
                                </tr>
                                {/* Más filas de ejemplo */}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mb-3">
                    <h5>Productos con bajo stock</h5>
                    <div className="table-responsive">
                        <table className="table table-warning table-bordered table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Producto</th>
                                    <th>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>002</td>
                                    <td>Pantalón Jeans</td>
                                    <td>3</td>
                                </tr>
                                {/* Más filas de ejemplo */}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <h5>Productos agotados</h5>
                    <div className="table-responsive">
                        <table className="table table-danger table-bordered table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Producto</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>003</td>
                                    <td>Blusa Estampada</td>
                                </tr>
                                {/* Más filas de ejemplo */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Reporte de Ventas */}
            <div className="mb-5">
                <h3>
                    <i className="bi bi-cash-stack me-2"></i>
                    Reporte de Ventas
                </h3>
                <div className="mb-3">
                    <h5>Ventas diarias, semanales y mensuales</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card text-center mb-2 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title">Hoy</h6>
                                    <p className="card-text fw-bold">$120.000</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-center mb-2 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title">Esta semana</h6>
                                    <p className="card-text fw-bold">$540.000</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-center mb-2 shadow-sm">
                                <div className="card-body">
                                    <h6 className="card-title">Este mes</h6>
                                    <p className="card-text fw-bold">$2.100.000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-3">
                    <h5>Detalle de ventas por producto</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad vendida</th>
                                    <th>Total ingresos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Camiseta Básica</td>
                                    <td>30</td>
                                    <td>$450.000</td>
                                </tr>
                                {/* Más filas de ejemplo */}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <h5>Totales de ingresos por período</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <label>Desde</label>
                            <input type="date" className="form-control mb-2" />
                        </div>
                        <div className="col-md-6">
                            <label>Hasta</label>
                            <input type="date" className="form-control mb-2" />
                        </div>
                    </div>
                    <div className="alert alert-info mt-2">
                        <i className="bi bi-currency-dollar me-2"></i>
                        Total ingresos en el período seleccionado: <b>$1.200.000</b>
                    </div>
                </div>
            </div>

            {/* Reporte de Compras */}
            <div>
                <h3>
                    <i className="bi bi-cart4 me-2"></i>
                    Reporte de Compras
                </h3>
                <div className="mb-3">
                    <h5>Compras realizadas a proveedores</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID Compra</th>
                                    <th>Proveedor</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>5001</td>
                                    <td>Proveedor S.A.</td>
                                    <td>20/09/2025</td>
                                    <td>$80.000</td>
                                </tr>
                                {/* Más filas de ejemplo */}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mb-3">
                    <h5>Total gastado en un período</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <label>Desde</label>
                            <input type="date" className="form-control mb-2" />
                        </div>
                        <div className="col-md-6">
                            <label>Hasta</label>
                            <input type="date" className="form-control mb-2" />
                        </div>
                    </div>
                    <div className="alert alert-info mt-2">
                        <i className="bi bi-currency-dollar me-2"></i>
                        Total gastado en el período seleccionado: <b>$320.000</b>
                    </div>
                </div>
                <div>
                    <h5>Historial de productos ingresados por compras</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Proveedor</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Pantalón Jeans</td>
                                    <td>20</td>
                                    <td>Proveedor S.A.</td>
                                    <td>20/09/2025</td>
                                </tr>
                                {/* Más filas de ejemplo */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}