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
            {/* Tabla de inventario */}
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Código / ID</th>
                            <th>Nombre del producto</th>
                            <th>Categoría</th>
                            <th>Tallas disponibles</th>
                            <th>Precio unitario</th>
                            <th>Proveedor</th>
                            <th>Stock total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>001</td>
                            <td>Camiseta Básica</td>
                            <td>Ropa</td>
                            <td>S=10, M=4, L=0</td>
                            <td>$15.990</td>
                            <td>Proveedor A</td>
                            <td>14</td>
                            <td>
                                <button className="btn btn-sm btn-warning me-1" title="Editar">
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-sm btn-danger me-1" title="Eliminar">
                                    <i className="bi bi-trash"></i>
                                </button>
                                <button className="btn btn-sm btn-success" title="Ingresar stock">
                                    <i className="bi bi-box-arrow-in-down"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>002</td>
                            <td>Pantalón Jeans</td>
                            <td>Ropa</td>
                            <td>S=5, M=8, L=2, XL=1</td>
                            <td>$29.990</td>
                            <td>Proveedor B</td>
                            <td>16</td>
                            <td>
                                <button className="btn btn-sm btn-warning me-1" title="Editar">
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-sm btn-danger me-1" title="Eliminar">
                                    <i className="bi bi-trash"></i>
                                </button>
                                <button className="btn btn-sm btn-success" title="Ingresar stock">
                                    <i className="bi bi-box-arrow-in-down"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>003</td>
                            <td>Chaqueta de Cuero</td>
                            <td>Abrigos</td>
                            <td>M=3, L=2, XL=0</td>
                            <td>$89.990</td>
                            <td>Proveedor C</td>
                            <td>5</td>
                            <td>
                                <button className="btn btn-sm btn-warning me-1" title="Editar">
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-sm btn-danger me-1" title="Eliminar">
                                    <i className="bi bi-trash"></i>
                                </button>
                                <button className="btn btn-sm btn-success" title="Ingresar stock">
                                    <i className="bi bi-box-arrow-in-down"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}