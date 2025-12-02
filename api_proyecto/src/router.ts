import { Router } from 'express';

import {
    login,
    crearUsuario,
    cambiarContraseña,
    logout
} from "./handlers/usuarios"
import { actualizarContactoCliente, crearCliente, eliminarCliente, obtenerClientePorRut, obtenerClientes } from './handlers/clientes';
import { actualizarProveedor, crearProveedor, eliminarProveedor, obtenerProveedores, obtenerProveedoresPorRut } from './handlers/proveedores';
import { agregarInventario, editarInventario, eliminarInventario, obtenerInventarios } from './handlers/inventarios';
import { agregarVenta, imprimirVenta, obtenerVentas } from './handlers/ventas';
import { productosDisponibles, productosBajoStock, productosAgotados } from './handlers/reportes';
import { obtenerProductos, obtenerTallas } from './handlers/productos';
import { obtenerCompras, crearCompra, editarCompra, eliminarCompra } from './handlers/compras';


const router = Router();

// Usuarios
router.post('/usuarios/login', login)
router.post('/usuarios', crearUsuario)
router.post('/usuarios/salir', logout)
router.put('/usuarios/cambiar-contrasena', cambiarContraseña)


// Clientes
router.get('/clientes', obtenerClientes)
router.get('/clientes/:rut_cliente', obtenerClientePorRut)
router.post('/clientes/crear', crearCliente)
router.put('/clientes/actualizar', actualizarContactoCliente)
router.delete('/clientes/eliminar/:rut_cliente', eliminarCliente)


// Proveedores
router.get('/proveedores', obtenerProveedores)
router.get('/proveedores/:rut', obtenerProveedoresPorRut)
router.post('/proveedores/crear', crearProveedor)
router.put('/proveedores/actualizar', actualizarProveedor)
router.delete('/proveedores/eliminar/:rut_proveedor', eliminarProveedor)


// Inventario
router.get('/inventario', obtenerInventarios)
router.post('/inventario/crear', agregarInventario)
router.put('/inventario/:id_producto/:id_talla', editarInventario)
router.delete('/inventario/:id_producto/:id_talla', eliminarInventario)


// Ventas
router.get('/ventas', obtenerVentas)
router.post('/ventas/crear', agregarVenta)
router.get('/ventas/imprimir/:id_venta', imprimirVenta)


// Compras
router.get('/compras', obtenerCompras)
router.post('/compras/crear', crearCompra)
router.put('/compras/:id', editarCompra)
router.delete('/compras/:id', eliminarCompra)


// Productos y Tallas
router.get('/productos', obtenerProductos)
router.get('/tallas', obtenerTallas)


// Reportes
router.get('/reportes/disponibles', productosDisponibles)
router.get('/reportes/bajo-stock', productosBajoStock)
router.get('/reportes/agotados', productosAgotados)

export default router
