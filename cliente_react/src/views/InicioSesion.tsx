import { Form, redirect, useActionData, type ActionFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { loginUsuario } from "../service/UsuarioServise";

export async function action({ request }: ActionFunctionArgs) {
    const formData = Object.fromEntries(await request.formData());
    const resultado = await loginUsuario(formData);
    if (!resultado.success) {
        return resultado
    }
    return redirect("/");
}

export default function InicioSesion() {
    const actionData = useActionData() as {
        success?: boolean;
        error?: string;
        detalleErrores?: { [key: string]: string[] };
    };
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
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="card p-4 shadow-lg" style={{ maxWidth: 400, width: "100%", borderRadius: "16px" }}>
                <div className="text-center mb-4">
                    <i className="bi bi-person-circle" style={{ fontSize: "3rem", color: "#0d6efd" }}></i>
                    <h2 className="fw-bold mt-2" style={{ color: "#2d3748" }}>Iniciar Sesión</h2>
                </div>
                {actionData?.error && (
                    <div className="alert alert-danger text-center">{actionData.error}</div>
                )}
                <Form method="POST">
                    <div className="mb-3">
                        <label className="form-label">RUT</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="rut_usuario" 
                            placeholder="12.345.678-9" 
                            value={rutFormateado}
                            onChange={manejarCambioRut}
                            maxLength={12}
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input type="password" className="form-control" name="contraseña" placeholder="Contraseña" required />
                    </div>
                    <div className="d-grid mt-4">
                        <button type="submit" className="btn btn-primary btn-lg">
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Iniciar sesión
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}