import { Form, Link, redirect, useLocation, useActionData, type ActionFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { clienteAñadir } from "../service/ClienteService";

export async function action({ request }: ActionFunctionArgs) {
    const formData = Object.fromEntries(await request.formData());
    const resultado = await clienteAñadir(formData);
    if (!resultado?.success) {
        return resultado;
    }
    // Obtén el backUrl del formData
    const backUrl = String(formData.backUrl || "/clientes");
    return redirect(backUrl);
}

export default function ClienteAñadir() {
    const location = useLocation();
    const backUrl = location.state?.from || "/clientes";
    const actionData = useActionData() as { success: boolean; errors?: string[] } | undefined;
    const [rutFormateado, setRutFormateado] = useState("");

    // Función para formatear el RUT automáticamente
    const formatearRut = (valor: string) => {
        // Remover todos los caracteres que no sean números o K/k
        const rutLimpio = valor.replace(/[^0-9kK]/g, '');
        
        if (rutLimpio.length === 0) return '';
        
        // Separar el dígito verificador
        const cuerpo = rutLimpio.slice(0, -1);
        const dv = rutLimpio.slice(-1);
        
        if (cuerpo.length === 0) return dv;
        
        // Formatear el cuerpo con puntos
        let cuerpoFormateado = '';
        for (let i = cuerpo.length - 1, j = 0; i >= 0; i--, j++) {
            if (j > 0 && j % 3 === 0) {
                cuerpoFormateado = '.' + cuerpoFormateado;
            }
            cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
        }
        
        // Si hay dígito verificador, agregarlo con guión
        if (dv) {
            return cuerpoFormateado + '-' + dv.toUpperCase();
        }
        
        return cuerpoFormateado;
    };

    const manejarCambioRut = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        const rutFormateadoNuevo = formatearRut(valor);
        setRutFormateado(rutFormateadoNuevo);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>
                    <i className="bi bi-person-plus me-2"></i>
                    Registrar Cliente
                </h1>
                <Link to={backUrl} className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Volver
                </Link>
            </div>
            <p>Formulario para registrar un nuevo cliente.</p>
            
           
            
            <Form method="POST" className="card p-4 shadow-lg" style={{ maxWidth: 500, margin: "0 auto" }}>
                 {/* Mostrar errores si existen */}
                {actionData && !actionData.success && (
                    <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {actionData.errors?.map((error, index) => (
                            <span key={index}>{error}</span>
                        ))}
                    </div>
                )}
                <input type="hidden" name="backUrl" value={backUrl} />
                <div className="mb-3">
                    <label className="form-label">RUT del cliente</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="rut_cliente" 
                        placeholder="12.345.678-9" 
                        value={rutFormateado}
                        onChange={manejarCambioRut}
                        maxLength={12}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input type="text" className="form-control" name="nombre_cliente" placeholder="Juan Pérez" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contacto</label>
                    <input type="text" className="form-control" name="contacto_cliente" placeholder="+56 9 1234 5678" required />
                </div>
                <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-success">
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar cliente
                    </button>
                    <Link to={backUrl} className="btn btn-danger">
                        <i className="bi bi-x-lg me-2"></i>
                        Cancelar
                    </Link>
                </div>
            </Form>
        </div>
    );
}