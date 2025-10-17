import { Link, useLoaderData } from "react-router-dom";
import { useState } from "react";
import type { Cliente } from "../types/cliente";
import ClienteFila from "../components/ClienteFila";
import { clienteEliminar, getClientes } from "../service/ClienteService";

export async function loader() {
    // Aquí puedes llamar a una función para obtener los datos de los clientes
    const clientes = await getClientes();
    return clientes; // Cambia esto para devolver los datos reales
}

export async function action({ request }: { request: Request }) {
    const formData = Object.fromEntries(await request.formData());
    const rut = String(formData.rut_cliente || "");
    try {
        await clienteEliminar(rut);
        return null;
    } catch (error) {
        console.error("Error en action eliminar cliente:", error);
        return { error: true, message: "No se pudo eliminar el cliente" };
    }
}

export default function Clientes() {
    const clientes = useLoaderData() as Cliente[];
    const [busqueda, setBusqueda] = useState("");

    // Filtra los clientes por RUT o nombre si hay búsqueda
    const clientesFiltrados = busqueda.trim()
        ? clientes.filter(cliente =>
            cliente.rut_cliente.toLowerCase().includes(busqueda.trim().toLowerCase()) ||
            cliente.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
        )
        : clientes;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-person-lines-fill me-2"></i>
                    Clientes
                </h1>
                <Link to="/clientes/registrar" className="btn btn-primary" state={{ from: "/clientes" }}>
                    <i className="bi bi-person-plus me-2"></i>
                    Registrar nuevo cliente
                </Link>
            </div>
            <p>Aquí puedes gestionar los clientes.</p>
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
            {/* Tabla de clientes */}
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>RUT / ID cliente</th>
                            <th>Nombre completo</th>
                            <th>Contacto</th>
                            <th>N° compras</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientesFiltrados.map((cliente) => (
                            <ClienteFila key={cliente.rut_cliente} cliente={cliente} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}