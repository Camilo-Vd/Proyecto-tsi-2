import { Link, useLoaderData } from "react-router-dom";
import { useState } from "react";
import { Inventario } from "../types/inventario";
import InventarioFila from "../components/InventarioFila";
import { getInventarios, eliminarInventario } from "../service/InventarioService";
import { useRoleAccess } from "../hooks/useRoleAccess";

interface InventarioAgrupado {
    id_producto: number;
    nombre_producto: string;
    nombre_categoria: string;
    items: Inventario[];
}

export async function loader() {
    const result = await getInventarios();
    if (result.success && result.data) {
        return agruparPorProducto(result.data);
    }
    return [];
}

export async function action({ request }: { request: Request }) {
    if (request.method !== "DELETE") return null;
    
    const formData = Object.fromEntries(await request.formData());
    const id_producto = parseInt(String(formData.id_producto || ""));
    const id_talla = parseInt(String(formData.id_talla || ""));
    
    try {
        const result = await eliminarInventario(id_producto, id_talla);
        if (result.success) {
            return { success: true };
        }
        return { error: true, message: result.error };
    } catch (error) {
        console.error("Error al eliminar inventario:", error);
        return { error: true, message: "No se pudo eliminar el producto" };
    }
}

function agruparPorProducto(datos: Inventario[]): InventarioAgrupado[] {
    const mapa = new Map<number, InventarioAgrupado>();

    datos.forEach((item) => {
        if (!mapa.has(item.id_producto)) {
            mapa.set(item.id_producto, {
                id_producto: item.id_producto,
                nombre_producto: item.nombre_producto,
                nombre_categoria: item.nombre_categoria,
                items: [],
            });
        }

        const grupo = mapa.get(item.id_producto)!;
        grupo.items.push(item);
    });

    return Array.from(mapa.values());
}

export default function Inventario() {
    const inventarios = (useLoaderData() as InventarioAgrupado[]) || [];
    const { canAddInventario } = useRoleAccess();
    const [searchTerm, setSearchTerm] = useState("");

    const productosFiltrados = inventarios.filter(
        (p) =>
            p.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.nombre_categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-box-seam me-2"></i>
                    Inventario
                </h1>
                {canAddInventario && (
                    <Link to="/inventario/agregar" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-2"></i>
                        Agregar producto
                    </Link>
                )}
            </div>
            <p>Consulta y gestiona tus productos y stock.</p>

            {/* Barra de búsqueda */}
            <div className="card p-3 mb-3">
                <div className="row g-2">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar producto por nombre o categoría"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Lista de productos */}
            {productosFiltrados.length === 0 && (
                <div className="alert alert-warning" role="alert">
                    <i className="bi bi-inbox me-2"></i>No se encontraron productos en el inventario
                </div>
            )}

            {productosFiltrados.length > 0 && (
                <div className="accordion" id="inventarioAccordion">
                    {productosFiltrados.map((producto) => (
                        <InventarioFila
                            key={producto.id_producto}
                            id_producto={producto.id_producto}
                            nombre_producto={producto.nombre_producto}
                            nombre_categoria={producto.nombre_categoria}
                            items={producto.items}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}