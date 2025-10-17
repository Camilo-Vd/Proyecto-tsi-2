import { Form, Link } from "react-router-dom";
import type { Cliente } from "../types/cliente";

export default function ClienteFila({ cliente }: { cliente: Cliente }) {
    return (
        <tr>
            <td>{cliente.rut_cliente}</td>
            <td>{cliente.nombre}</td>
            <td>{cliente.contacto}</td>
            <td>8</td>
            <td>
                <Form method="POST">
                    <input type="hidden" name="rut_cliente" value={cliente.rut_cliente} />
                    <Link to={`/clientes/editar/${cliente.rut_cliente}`} type="button" className="btn btn-sm btn-warning me-2" title="Editar">
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