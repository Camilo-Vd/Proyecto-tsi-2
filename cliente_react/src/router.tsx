import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./views/Home";
import Ventas, { loader as loaderVentas } from "./views/Ventas";
import InventarioAgregar from "./views/InventarioAgregar";
import InventarioEditar from "./views/InventarioEditar";
import VentasRegistrar from "./views/VentasRegistrar";
import ClienteAñadir, { action as actionClienteAñadir } from "./views/ClienteAñadir";
import Compras from "./views/Compras";
import ComprasRegistrar from "./views/ComprasRegistrar";
import ProveedorAñadir, { action as actionProveedorAñadir } from "./views/ProveedorAñadir";
import Clientes, { loader as loaderClientes } from "./views/Clientes";
import Proveedores, { loader as loaderProveedor } from "./views/Proveedores";
import Inventario, { loader as loaderInventario, action as actionInventario } from "./views/Inventario";
import Reportes from "./views/Reportes";
import InicioSesion, { action as acciónInicioSesion } from "./views/InicioSesion";
import Usuarios, { loader as loaderUsuarios } from "./views/Usuarios";
import UsuariosRegistrar, { action as actionUsuarioRegistrar } from "./views/UsuariosRegistrar";
import Configuraciones from "./views/Configuraciones";
import ClientesEditar from "./views/ClientesEditar";
import ProveedorEditar from "./views/ProveedorEditar";
import PrivateRoute from "./components/PrivateRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";



export const router = createBrowserRouter([
    {
        path: "/login",
        element: <InicioSesion />,
        action: acciónInicioSesion,
    },
    {
        path: "/",
        element: <Layout />,
        HydrateFallback: () => <div></div>,
        children: [
            {
                element: <PrivateRoute />,
                children: [
                    {
                        index: true,
                        element: <Home />,
                    },
                    // ============ INVENTARIO - Acceso a Admin y Vendedor ============
                    {
                        path: "inventario",
                        element: <Inventario />,
                        loader: loaderInventario,
                        action: actionInventario,
                    },
                    // Agregar y Editar solo para Admin
                    {
                        element: <RoleProtectedRoute allowedRoles={["Administrador"]} />,
                        children: [
                            {
                                path: "inventario/agregar",
                                element: <InventarioAgregar />,
                            },
                            {
                                path: "inventario/editar/:id_producto",
                                element: <InventarioEditar />,
                            },
                        ],
                    },

                    // ============ VENTAS - Acceso a Admin y Vendedor ============
                    {
                        path: "ventas",
                        element: <Ventas />,
                        loader: loaderVentas,
                    },
                    {
                        path: "ventas/registrar",
                        element: <VentasRegistrar />,
                    },
                    {
                        path: "ventas/añadir-cliente",
                        element: <ClienteAñadir />,
                        action: actionClienteAñadir,
                    },

                    // ============ COMPRAS - Solo Admin ============
                    {
                        element: <RoleProtectedRoute allowedRoles={["Administrador"]} />,
                        children: [
                            {
                                path: "compras",
                                element: <Compras />,
                            },
                            {
                                path: "compras/registrar",
                                element: <ComprasRegistrar />,
                            },
                            {
                                path: "compras/añadir-proveedor",
                                element: <ProveedorAñadir />,
                                action: actionProveedorAñadir,
                            },
                        ],
                    },

                    // ============ CLIENTES - Acceso a Admin y Vendedor ============
                    {
                        path: "clientes",
                        element: <Clientes />,
                        loader: loaderClientes,
                    },
                    {
                        element: <RoleProtectedRoute allowedRoles={["Administrador"]} />,
                        children: [
                            {
                                path: "clientes/registrar",
                                element: <ClienteAñadir />,
                                action: actionClienteAñadir,
                            },
                            {
                                path: "clientes/editar/:rut_cliente",
                                element: <ClientesEditar />,
                            },
                        ],
                    },

                    // ============ PROVEEDORES - Admin y Vendedor (ver), Admin (editar) ============
                    {
                        path: "proveedores",
                        element: <Proveedores />,
                        loader: loaderProveedor,
                    },
                    {
                        element: <RoleProtectedRoute allowedRoles={["Administrador"]} />,
                        children: [
                            {
                                path: "proveedores/registrar",
                                element: <ProveedorAñadir />,
                                action: actionProveedorAñadir,
                            },
                            {
                                path: "proveedores/editar/:rut_proveedor",
                                element: <ProveedorEditar />,
                            },
                        ],
                    },

                    // ============ REPORTES - Solo Admin ============
                    {
                        element: <RoleProtectedRoute allowedRoles={["Administrador"]} />,
                        children: [
                            {
                                path: "reportes",
                                element: <Reportes />,
                            },
                        ],
                    },

                    // ============ USUARIOS - Solo Admin ============
                    {
                        element: <RoleProtectedRoute allowedRoles={["Administrador"]} />,
                        children: [
                            {
                                path: "usuarios",
                                element: <Usuarios />,
                                loader: loaderUsuarios,
                            },
                            {
                                path: "usuarios/registrar",
                                element: <UsuariosRegistrar />,
                                action: actionUsuarioRegistrar,
                            },
                        ],
                    },

                    // ============ CONFIGURACIONES - Acceso a Admin y Vendedor ============
                    {
                        path: "configuraciones",
                        element: <Configuraciones />,
                    },
                ],
            },
        ],
    },
])