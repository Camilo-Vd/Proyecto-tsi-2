import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUsuario } from "../context/UsuarioContext";

export default function PrivateRoute(){
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const { usuario, loading } = useUsuario();

    useEffect(() => {
        if(!token){
            navigate("/login");
            return;
        }

        // Validar que el usuario tenga un rol válido
        if (!loading && usuario && !["Administrador", "Vendedor"].includes(usuario.rol_usuario)) {
            navigate("/login");
        }
    }, [token, usuario, loading, navigate]);

    // Mientras se valida el usuario, no renderizar nada
    if (loading) {
        return null;
    }

    // Si tiene token y rol válido, renderizar las rutas protegidas
    return token && usuario ? <Outlet context={{ usuario }} /> : null;
}