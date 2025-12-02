import { Link } from "react-router-dom";

export default function Inventario() {
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-box-seam me-2"></i>
                    Inventario
                </h1>
                <Link to="/inventario/agregar" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>
                    Agregar producto
                </Link>
            </div>
            <p>Consulta y gestiona tus productos y stock.</p>
            {/* Barra de búsqueda */}
            <div className="card p-3 mb-3">
                <div className="row g-2">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar producto por nombre o código"
                        />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-outline-secondary w-100">
                            <i className="bi bi-search"></i> Buscar
                        </button>
                    </div>
                </div>
            </div>
            {/* Lista de productos con acordeones */}
            <div className="accordion" id="inventarioAccordion">
                
                {/* PRODUCTO 1 - Camiseta con tallas mixtas */}
                <div className="accordion-item">
                    <h2 className="accordion-header" id="producto001">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                data-bs-target="#collapse001" aria-expanded="false" aria-controls="collapse001">
                            <div className="d-flex w-100 align-items-center justify-content-between">
                                <div className="d-flex align-items-center flex-grow-1">
                                    <div className="me-3">
                                        <span className="badge bg-secondary fs-6">#001</span>
                                    </div>
                                    <div className="me-4">
                                        <strong>Camiseta Básica</strong><br/>
                                        <small className="text-muted">Ropa</small>
                                    </div>
                                    <div className="me-4">
                                        <span className="badge bg-info">Proveedor A</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="me-4 text-center">
                                        <strong>Stock Total</strong><br/>
                                        <span className="badge bg-success fs-6">24 unids</span>
                                    </div>
                                    <div className="text-center">
                                        <strong>Tallas</strong><br/>
                                        <span className="badge bg-secondary fs-6">5 tallas</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </h2>
                    <div id="collapse001" className="accordion-collapse collapse" aria-labelledby="producto001" 
                         data-bs-parent="#inventarioAccordion">
                        <div className="accordion-body">
                            <div className="row">
                                <div className="col-md-9">
                                    <h6 className="mb-3">
                                        <i className="bi bi-tags me-2"></i>
                                        Todas las Tallas Disponibles
                                        <small className="text-muted ms-2">(Tallas numéricas y de letras mezcladas)</small>
                                    </h6>
                                    <div className="table-responsive">
                                        <table className="table table-sm table-bordered">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Talla</th>
                                                    <th>Tipo</th>
                                                    <th>Stock</th>
                                                    <th>Precio Unit.</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><span className="badge bg-info">2</span></td>
                                                    <td><small className="text-muted">Niño</small></td>
                                                    <td>3</td>
                                                    <td>$12.990</td>
                                                    <td><span className="badge bg-warning">Bajo stock</span></td>
                                                </tr>
                                                <tr>
                                                    <td><span className="badge bg-info">4</span></td>
                                                    <td><small className="text-muted">Niño</small></td>
                                                    <td>7</td>
                                                    <td>$12.990</td>
                                                    <td><span className="badge bg-success">Disponible</span></td>
                                                </tr>
                                                <tr>
                                                    <td><span className="badge bg-secondary">S</span></td>
                                                    <td><small className="text-muted">Adulto</small></td>
                                                    <td>10</td>
                                                    <td>$15.990</td>
                                                    <td><span className="badge bg-success">Disponible</span></td>
                                                </tr>
                                                <tr>
                                                    <td><span className="badge bg-secondary">M</span></td>
                                                    <td><small className="text-muted">Adulto</small></td>
                                                    <td>4</td>
                                                    <td>$15.990</td>
                                                    <td><span className="badge bg-warning">Bajo stock</span></td>
                                                </tr>
                                                <tr>
                                                    <td><span className="badge bg-secondary">L</span></td>
                                                    <td><small className="text-muted">Adulto</small></td>
                                                    <td>0</td>
                                                    <td>$15.990</td>
                                                    <td><span className="badge bg-danger">Sin stock</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="d-grid gap-2">
                                        <button className="btn btn-warning">
                                            <i className="bi bi-pencil me-2"></i>Editar
                                        </button>
                                        <button className="btn btn-success">
                                            <i className="bi bi-box-arrow-in-down me-2"></i>Stock
                                        </button>
                                        <button className="btn btn-danger">
                                            <i className="bi bi-trash me-2"></i>Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PRODUCTO 2 - Pantalón con muchas tallas */}
                <div className="accordion-item">
                    <h2 className="accordion-header" id="producto002">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                data-bs-target="#collapse002" aria-expanded="false" aria-controls="collapse002">
                            <div className="d-flex w-100 align-items-center justify-content-between">
                                <div className="d-flex align-items-center flex-grow-1">
                                    <div className="me-3">
                                        <span className="badge bg-secondary fs-6">#002</span>
                                    </div>
                                    <div className="me-4">
                                        <strong>Pantalón Jeans</strong><br/>
                                        <small className="text-muted">Ropa</small>
                                    </div>
                                    <div className="me-4">
                                        <span className="badge bg-info">Proveedor B</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="me-4 text-center">
                                        <strong>Stock Total</strong><br/>
                                        <span className="badge bg-success fs-6">52 unids</span>
                                    </div>
                                    <div className="text-center">
                                        <strong>Tallas</strong><br/>
                                        <span className="badge bg-secondary fs-6">13 tallas</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </h2>
                    <div id="collapse002" className="accordion-collapse collapse" aria-labelledby="producto002" 
                         data-bs-parent="#inventarioAccordion">
                        <div className="accordion-body">
                            <div className="row">
                                <div className="col-md-9">
                                    <h6 className="mb-3">
                                        <i className="bi bi-tags me-2"></i>
                                        Todas las Tallas Disponibles
                                        <small className="text-muted ms-2">(Tallas numéricas y de letras mezcladas)</small>
                                    </h6>
                                    <div className="table-responsive">
                                        <table className="table table-sm table-bordered">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Talla</th>
                                                    <th>Tipo</th>
                                                    <th>Stock</th>
                                                    <th>Precio Unit.</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr><td><span className="badge bg-info">2</span></td><td><small className="text-muted">Niño</small></td><td>2</td><td>$18.990</td><td><span className="badge bg-warning">Bajo stock</span></td></tr>
                                                <tr><td><span className="badge bg-info">4</span></td><td><small className="text-muted">Niño</small></td><td>4</td><td>$18.990</td><td><span className="badge bg-warning">Bajo stock</span></td></tr>
                                                <tr><td><span className="badge bg-info">6</span></td><td><small className="text-muted">Niño</small></td><td>6</td><td>$19.990</td><td><span className="badge bg-success">Disponible</span></td></tr>
                                                <tr><td><span className="badge bg-info">8</span></td><td><small className="text-muted">Niño</small></td><td>5</td><td>$19.990</td><td><span className="badge bg-success">Disponible</span></td></tr>
                                                <tr><td><span className="badge bg-info">10</span></td><td><small className="text-muted">Niño</small></td><td>3</td><td>$20.990</td><td><span className="badge bg-warning">Bajo stock</span></td></tr>
                                                <tr><td><span className="badge bg-info">12</span></td><td><small className="text-muted">Niño</small></td><td>4</td><td>$20.990</td><td><span className="badge bg-warning">Bajo stock</span></td></tr>
                                                <tr><td><span className="badge bg-info">14</span></td><td><small className="text-muted">Niño</small></td><td>2</td><td>$21.990</td><td><span className="badge bg-warning">Bajo stock</span></td></tr>
                                                <tr><td><span className="badge bg-info">16</span></td><td><small className="text-muted">Niño</small></td><td>1</td><td>$21.990</td><td><span className="badge bg-danger">Sin stock</span></td></tr>
                                                <tr><td><span className="badge bg-secondary">S</span></td><td><small className="text-muted">Adulto</small></td><td>8</td><td>$24.990</td><td><span className="badge bg-success">Disponible</span></td></tr>
                                                <tr><td><span className="badge bg-secondary">M</span></td><td><small className="text-muted">Adulto</small></td><td>10</td><td>$24.990</td><td><span className="badge bg-success">Disponible</span></td></tr>
                                                <tr><td><span className="badge bg-secondary">L</span></td><td><small className="text-muted">Adulto</small></td><td>6</td><td>$25.990</td><td><span className="badge bg-success">Disponible</span></td></tr>
                                                <tr><td><span className="badge bg-secondary">XL</span></td><td><small className="text-muted">Adulto</small></td><td>3</td><td>$25.990</td><td><span className="badge bg-warning">Bajo stock</span></td></tr>
                                                <tr><td><span className="badge bg-secondary">XXL</span></td><td><small className="text-muted">Adulto</small></td><td>1</td><td>$26.990</td><td><span className="badge bg-danger">Sin stock</span></td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="d-grid gap-2">
                                        <button className="btn btn-warning">
                                            <i className="bi bi-pencil me-2"></i>Editar
                                        </button>
                                        <button className="btn btn-success">
                                            <i className="bi bi-box-arrow-in-down me-2"></i>Stock
                                        </button>
                                        <button className="btn btn-danger">
                                            <i className="bi bi-trash me-2"></i>Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PRODUCTO 3 - Polera con algunas tallas */}
                <div className="accordion-item">
                    <h2 className="accordion-header" id="producto003">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                data-bs-target="#collapse003" aria-expanded="false" aria-controls="collapse003">
                            <div className="d-flex w-100 align-items-center justify-content-between">
                                <div className="d-flex align-items-center flex-grow-1">
                                    <div className="me-3">
                                        <span className="badge bg-secondary fs-6">#003</span>
                                    </div>
                                    <div className="me-4">
                                        <strong>Polera Deportiva</strong><br/>
                                        <small className="text-muted">Ropa</small>
                                    </div>
                                    <div className="me-4">
                                        <span className="badge bg-info">Proveedor C</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="me-4 text-center">
                                        <strong>Stock Total</strong><br/>
                                        <span className="badge bg-warning fs-6">15 unids</span>
                                    </div>
                                    <div className="text-center">
                                        <strong>Tallas</strong><br/>
                                        <span className="badge bg-secondary fs-6">4 tallas</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </h2>
                    <div id="collapse003" className="accordion-collapse collapse" aria-labelledby="producto003" 
                         data-bs-parent="#inventarioAccordion">
                        <div className="accordion-body">
                            <div className="row">
                                <div className="col-md-9">
                                    <h6 className="mb-3">
                                        <i className="bi bi-tags me-2"></i>
                                        Todas las Tallas Disponibles
                                        <small className="text-muted ms-2">(Tallas numéricas y de letras mezcladas)</small>
                                    </h6>
                                    <div className="table-responsive">
                                        <table className="table table-sm table-bordered">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Talla</th>
                                                    <th>Tipo</th>
                                                    <th>Stock</th>
                                                    <th>Precio Unit.</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><span className="badge bg-info">6</span></td>
                                                    <td><small className="text-muted">Niño</small></td>
                                                    <td>7</td>
                                                    <td>$19.990</td>
                                                    <td><span className="badge bg-success">Disponible</span></td>
                                                </tr>
                                                <tr>
                                                    <td><span className="badge bg-secondary">S</span></td>
                                                    <td><small className="text-muted">Adulto</small></td>
                                                    <td>3</td>
                                                    <td>$22.990</td>
                                                    <td><span className="badge bg-warning">Bajo stock</span></td>
                                                </tr>
                                                <tr>
                                                    <td><span className="badge bg-secondary">M</span></td>
                                                    <td><small className="text-muted">Adulto</small></td>
                                                    <td>2</td>
                                                    <td>$22.990</td>
                                                    <td><span className="badge bg-warning">Bajo stock</span></td>
                                                </tr>
                                                <tr>
                                                    <td><span className="badge bg-secondary">L</span></td>
                                                    <td><small className="text-muted">Adulto</small></td>
                                                    <td>3</td>
                                                    <td>$22.990</td>
                                                    <td><span className="badge bg-warning">Bajo stock</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="d-grid gap-2">
                                        <button className="btn btn-warning">
                                            <i className="bi bi-pencil me-2"></i>Editar
                                        </button>
                                        <button className="btn btn-success">
                                            <i className="bi bi-box-arrow-in-down me-2"></i>Stock
                                        </button>
                                        <button className="btn btn-danger">
                                            <i className="bi bi-trash me-2"></i>Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Leyenda de colores */}
            <div className="card p-2 mt-3">
                <div className="d-flex flex-wrap gap-3 align-items-center">
                    <small className="fw-bold">Leyenda:</small>
                    <small><span className="badge bg-success me-1">Verde</span> Stock alto (&gt;5)</small>
                    <small><span className="badge bg-warning me-1">Amarillo</span> Stock bajo (1-5)</small>
                    <small><span className="badge bg-danger me-1">Rojo</span> Sin stock (0)</small>
                </div>
            </div>
        </div>
    );
}