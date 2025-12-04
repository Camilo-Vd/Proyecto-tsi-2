import { Router } from 'express';
import { authMiddleware, requireAdmin } from './middleware/authMiddleware';

import {
    login,
    crearUsuario,
    cambiarContraseña,
    logout,
    obtenerUsuarios,
    obtenerUsuarioPorRUT,
    deshabilitarUsuario,
    reactivarUsuario
} from "./handlers/usuarios"
import { actualizarContactoCliente, crearCliente, eliminarCliente, deshabilitarCliente, obtenerClientePorRut, obtenerClientes, reactivarCliente } from './handlers/clientes';
import { actualizarProveedor, crearProveedor, eliminarProveedor, deshabilitarProveedor, obtenerProveedores, obtenerProveedoresPorRut, reactivarProveedor } from './handlers/proveedores';
import { agregarInventario, editarInventario, eliminarInventario, obtenerInventarios } from './handlers/inventarios';
import { agregarVenta, imprimirVenta, obtenerVentas, eliminarVenta, obtenerVentasAnuladas, obtenerTodasLasVentas } from './handlers/ventas';
import { productosDisponibles, productosBajoStock, productosAgotados } from './handlers/reportes';
import { obtenerProductos, obtenerTallas, crearProducto } from './handlers/productos';
import { obtenerCompras, crearCompra, editarCompra, eliminarCompra, imprimirCompra, obtenerComprasAnuladas, obtenerTodasLasCompras } from './handlers/compras';
import { cambiarContrasenaConfiguracion, inicializarStockCritico } from './handlers/configuraciones';


const router = Router();

// RUTAS PÚBLICAS (sin autenticación)
router.post('/usuarios/login', login)
router.post('/configuraciones/inicializar-stock-critico', inicializarStockCritico)

// RUTAS PROTEGIDAS (requieren autenticación)

// Usuarios - Solo Admin puede crear/ver/eliminar usuarios
router.get('/usuarios', obtenerUsuarios)
router.get('/usuarios/:rut_usuario', authMiddleware, obtenerUsuarioPorRUT)  // Cambiar a authMiddleware para que cualquier usuario autenticado pueda obtener su propio perfil
router.post('/usuarios', requireAdmin, crearUsuario)
router.post('/usuarios/salir', authMiddleware, logout)
router.put('/usuarios/cambiar-contrasena', authMiddleware, cambiarContraseña)
router.put('/usuarios/:rut_usuario/deshabilitar', requireAdmin, deshabilitarUsuario)
router.put('/usuarios/:rut_usuario/reactivar', requireAdmin, reactivarUsuario)


// Clientes
router.get('/clientes', authMiddleware, obtenerClientes)
router.get('/clientes/:rut_cliente', authMiddleware, obtenerClientePorRut)
router.post('/clientes/crear', authMiddleware, crearCliente)
router.put('/clientes/actualizar', authMiddleware, actualizarContactoCliente)
router.delete('/clientes/eliminar/:rut_cliente', requireAdmin, eliminarCliente)
router.put('/clientes/:rut_cliente/deshabilitar', requireAdmin, deshabilitarCliente)
router.put('/clientes/:rut_cliente/reactivar', requireAdmin, reactivarCliente)


// Proveedores - Admin puede crear/editar/eliminar, Vendedor solo lee
router.get('/proveedores', authMiddleware, obtenerProveedores)
router.get('/proveedores/:rut', authMiddleware, obtenerProveedoresPorRut)
router.post('/proveedores/crear', requireAdmin, crearProveedor)
router.put('/proveedores/actualizar', requireAdmin, actualizarProveedor)
router.delete('/proveedores/eliminar/:rut_proveedor', requireAdmin, eliminarProveedor)
router.put('/proveedores/:rut_proveedor/deshabilitar', requireAdmin, deshabilitarProveedor)
router.put('/proveedores/:rut_proveedor/reactivar', requireAdmin, reactivarProveedor)


// Inventario - Admin puede crear/editar/eliminar, Vendedor solo lee
router.get('/inventario', authMiddleware, obtenerInventarios)
router.post('/inventario/crear', requireAdmin, agregarInventario)
router.put('/inventario/:id_producto/:id_talla', requireAdmin, editarInventario)
router.delete('/inventario/:id_producto/:id_talla', requireAdmin, eliminarInventario)


// Ventas
router.get('/ventas', authMiddleware, obtenerVentas)
router.get('/ventas/anuladas', authMiddleware, obtenerVentasAnuladas)
router.get('/ventas/todas', requireAdmin, obtenerTodasLasVentas)
router.post('/ventas/crear', authMiddleware, agregarVenta)
router.get('/ventas/imprimir/:id_venta', authMiddleware, imprimirVenta)
router.put('/ventas/:id_venta/anular', authMiddleware, eliminarVenta)


// Compras - Solo Admin
router.get('/compras', requireAdmin, obtenerCompras)
router.get('/compras/anuladas', requireAdmin, obtenerComprasAnuladas)
router.get('/compras/todas', requireAdmin, obtenerTodasLasCompras)
router.post('/compras/crear', requireAdmin, crearCompra)
router.get('/compras/imprimir/:id_compra', requireAdmin, imprimirCompra)
router.put('/compras/:id', requireAdmin, editarCompra)
router.put('/compras/:id_compra/anular', requireAdmin, eliminarCompra)


// Productos y Tallas (públicas, no necesitan autenticación)
router.get('/productos', obtenerProductos)
router.post('/productos', requireAdmin, crearProducto)
router.get('/tallas', obtenerTallas)

// Reportes - Solo Admin
router.get('/reportes/disponibles', requireAdmin, productosDisponibles)
router.get('/reportes/bajo-stock', requireAdmin, productosBajoStock)
router.get('/reportes/agotados', requireAdmin, productosAgotados);

export default router


