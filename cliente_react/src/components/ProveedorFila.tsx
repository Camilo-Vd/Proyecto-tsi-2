import { Form, Link } from "react-router-dom";
import type { Proveedor } from "../types/proveedor";

export default function ProveedorFila({ proveedor }: { proveedor: Proveedor }) {
    return (
        <tr>
            <td>{proveedor.rut_proveedor}</td>
            <td>{proveedor.nombre}</td>
            <td>{proveedor.contacto}</td>
            <td>{proveedor.direccion}</td>
            <td>13</td>
            <td>
                <Form method="POST">
                    <input type="hidden" name="rut_proveedor" value={proveedor.rut_proveedor} />
                    <Link to={`/proveedores/editar/${proveedor.rut_proveedor}`} type="button" className="btn btn-sm btn-warning me-2" title="Editar">
                        <i className="bi bi-pencil"></i>
                    </Link>
                    <button type="submit" className="btn btn-sm btn-danger" title="Eliminar">
                        <i className="bi bi-trash"></i>
                    </button>
                </Form>
            </td>

        </tr>
    );
}