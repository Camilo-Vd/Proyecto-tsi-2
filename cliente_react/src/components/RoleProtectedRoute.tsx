import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUsuarioAutenticado } from "../hooks/useUsuarioAutenticado";

interface RoleProtectedRouteProps {
    allowedRoles: string[];
}

export default function RoleProtectedRoute({ allowedRoles }: RoleProtectedRouteProps) {
    const navigate = useNavigate();
    const { usuario, loading } = useUsuarioAutenticado();

    useEffect(() => {
        if (!loading && usuario) {
            if (!allowedRoles.includes(usuario.rol_usuario)) {
                // Usuario no tiene permiso, redirige a home
                navigate("/");
            }
        }
    }, [usuario, loading, allowedRoles, navigate]);

    if (loading) {
        return null;
    }

    if (usuario && allowedRoles.includes(usuario.rol_usuario)) {
        return <Outlet />;
    }

    return null;
}
