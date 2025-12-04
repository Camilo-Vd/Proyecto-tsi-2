import { useUsuario } from "../context/UsuarioContext";

/**
 * Hook para verificar permisos del usuario basado en su rol
 * @returns Objeto con funciones para verificar acceso a diferentes funcionalidades
 */
export function useRoleAccess() {
    const { usuario } = useUsuario();

    const isAdmin = usuario?.rol_usuario === "Administrador";
    const isVendedor = usuario?.rol_usuario === "Vendedor";

    return {
        // Información del usuario
        isAdmin,
        isVendedor,
        userRole: usuario?.rol_usuario,

        // Permisos por módulo
        
        // INVENTARIO - Solo Admin puede editar/eliminar
        canViewInventario: isAdmin || isVendedor,
        canEditInventario: isAdmin,
        canDeleteInventario: isAdmin,
        canAddInventario: isAdmin,

        // VENTAS - Ambos pueden registrar, solo Admin puede eliminar/anular
        canViewVentas: isAdmin || isVendedor,
        canRegisterVenta: isAdmin || isVendedor,
        canDeleteVenta: isAdmin,
        canAnularVenta: isAdmin,
        canExportVenta: isAdmin || isVendedor,

        // COMPRAS - Solo Admin
        canViewCompras: isAdmin,
        canRegisterCompra: isAdmin,
        canDeleteCompra: isAdmin,
        canAnularCompra: isAdmin,
        canExportCompra: isAdmin,

        // CLIENTES - Ambos pueden ver, solo Admin puede deshabilitar/reactivar
        canViewClientes: isAdmin || isVendedor,
        canRegisterCliente: isAdmin || isVendedor,
        canEditCliente: isAdmin || isVendedor,
        canDeleteCliente: isAdmin,
        canDeshabilitarCliente: isAdmin,

        // PROVEEDORES - Solo Admin puede editar/eliminar/deshabilitar
        canViewProveedores: isAdmin || isVendedor,
        canRegisterProveedor: isAdmin,
        canEditProveedor: isAdmin,
        canDeleteProveedor: isAdmin,
        canDeshabilitarProveedor: isAdmin,
        canAddProveedorFromCompra: isAdmin,

        // REPORTES - Solo Admin
        canViewReportes: isAdmin,
        canGenerateReports: isAdmin,

        // USUARIOS - Solo Admin
        canViewUsuarios: isAdmin,
        canRegisterUsuario: isAdmin,
        canEditUsuario: isAdmin,
        canDeleteUsuario: isAdmin,

        // CONFIGURACIONES - Ambos pueden cambiar su contraseña
        canViewConfigurations: isAdmin || isVendedor,
        canChangeOwnPassword: isAdmin || isVendedor,
        canViewAllUsers: isAdmin,
    };
}
