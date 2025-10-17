import { Link, useLoaderData } from "react-router-dom";
import { useState } from "react";
import type { Proveedor } from "../types/proveedor";
import ProveedorFila from "../components/ProveedorFila";
import { getProveedores, proveedorEliminar } from "../service/ProveedorService";

export async function loader() {
    const proveedores = await getProveedores(); 
    return proveedores;
}

export async function action({ request }: { request: Request }) {
    const formData = Object.fromEntries(await request.formData());
    const rut = String(formData.rut_proveedor || "");
    try {
        await proveedorEliminar(rut);
        return null;
    } catch (error) {
        console.error("Error en action eliminar proveedor:", error);
        return { error: true, message: "No se pudo eliminar el proveedor" };
    }
}


export default function Proveedores() {
    const proveedores = useLoaderData() as Proveedor[];
    const [busqueda, setBusqueda] = useState("");

    // Filtra los proveedores por RUT o nombre si hay búsqueda
    const proveedoresFiltrados = busqueda.trim()
        ? proveedores.filter(proveedor =>
            proveedor.rut_proveedor.toLowerCase().includes(busqueda.trim().toLowerCase()) ||
            proveedor.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
        )
        : proveedores;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-building me-2"></i>
                    Proveedores
                </h1>
                <Link to="/proveedores/registrar" className="btn btn-primary" state={{ from: "/proveedores" }}>
                    <i className="bi bi-person-plus me-2"></i>
                    Registrar nuevo proveedor
                </Link>
            </div>
            <p>Aquí puedes gestionar los proveedores de productos.</p>
            {/* Barra de búsqueda */}
            <div className="card p-3 mb-3">
                <div className="row g-2">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por RUT o nombre"
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            {/* Tabla de proveedores */}
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>RUT / ID proveedor</th>
                            <th>Nombre o razón social</th>
                            <th>Contacto</th>
                            <th>Dirección</th>
                            <th>Nº compras</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proveedoresFiltrados.map(proveedor => (
                            <ProveedorFila key={proveedor.rut_proveedor} proveedor={proveedor} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}