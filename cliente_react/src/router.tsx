import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./views/Home";
import Inventario from "./views/Inventario";
import Ventas from "./views/Ventas";
import InventarioAgregar from "./views/InventarioAgregar";
import VentasRegistrar from "./views/VentasRegistrar";
import ClienteAñadir, { action as actionClienteAñadir } from "./views/ClienteAñadir";
import Compras from "./views/Compras";
import ComprasRegistrar from "./views/ComprasRegistrar";
import ProveedorAñadir, { action as actionProveedorAñadir } from "./views/ProveedorAñadir";
import Clientes, { loader as loaderClientes, action as actionClientes } from "./views/Clientes";
import Proveedores, { loader as loaderProveedor, action as actionProveedor } from "./views/Proveedores";
import Reportes from "./views/Reportes";
import InicioSesion, { action as acciónInicioSesion } from "./views/InicioSesion";
import Usuarios from "./views/Usuarios";
import UsuariosRegistrar, { action as actionUsuarioRegistrar } from "./views/UsuariosRegistrar";
import Configuraciones from "./views/Configuraciones";
import ClientesEditar, { action as actionClientesEditar } from "./views/ClientesEditar";
import ProveedorEditar, { action as actionProveedorEditar } from "./views/ProveedorEditar";
import PrivateRoute from "./components/PrivateRoute";



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
                    {
                        path: "inventario",
                        element: <Inventario />,
                    },
                    {
                        path: "inventario/agregar",
                        element: <InventarioAgregar />,
                    },
                    {
                        path: "ventas",
                        element: <Ventas />,
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
                    {
                        path: "clientes",
                        element: <Clientes />,
                        loader: loaderClientes,
                        action: actionClientes,
                    },
                    {
                        path: "clientes/registrar",
                        element: <ClienteAñadir />,
                        action: actionClienteAñadir,
                    },
                    {
                        path: "clientes/editar/:rut_cliente",
                        element: <ClientesEditar />,
                        action: actionClientesEditar,
                    },
                    {
                        path: "proveedores",
                        element: <Proveedores />,
                        loader: loaderProveedor,
                        action: actionProveedor,
                    },
                    {
                        path: "proveedores/registrar",
                        element: <ProveedorAñadir />,
                        action: actionProveedorAñadir,
                    },
                    {
                        path: "proveedores/editar/:rut_proveedor",
                        element: <ProveedorEditar />,
                        action: actionProveedorEditar,
                    },
                    {
                        path: "reportes",
                        element: <Reportes />,
                    },
                    {
                        path: "usuarios",
                        element: <Usuarios />,
                    },
                    {
                        path: "usuarios/registrar",
                        element: <UsuariosRegistrar />,
                        action: actionUsuarioRegistrar,
                    },
                    {
                        path: "configuraciones",
                        element: <Configuraciones />,
                    },
                ],
            },
        ],
    },
])