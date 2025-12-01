import { Router } from 'express';

import { login, crearUsuario, cambiarContraseña, logout } from "./handlers/usuarios"
import { actualizarContactoCliente, crearCliente, elimnarCliente, obtenerClientePorRut, obtenerClientes } from './handlers/clientes';
import { actualizarProveedor, crearProveedor, eliminarProveedor, obtenerProveedores, obtenerProveedoresPorRut } from './handlers/proveedores';
import { agregarInventario, editarInventario, eliminarInventario, obtenerInventarios } from './handlers/inventarios';
import { agregarVenta, imprimirVenta, obtenerVentas } from './handlers/ventas';
import { productosAgotados, productosBajoStock, productosDisponibles } from './handlers/reportes';
import { cambiarContrasenaConfiguracion } from './handlers/configuraciones';
import { authMiddleware } from './middleware/authMiddleware';


const router = Router();

router.post('/usuarios/login',login)//para el iniciar sesion



router.post('/usuarios', crearUsuario) // para crear un usuario
router.post('/usuarios/salir', logout) // para cerrar sesion
router.put('/usuarios/cambiar-contrasena', cambiarContraseña) // para cambiar la contraseña

router.get('/clientes', obtenerClientes) //para obtener todos los clientes
router.get('/clientes/:rut_cliente',obtenerClientePorRut) //para obtener clientes por el rut
router.post('/clientes/crear', crearCliente) //para crear un cliente
router.put('/clientes/actualizar', actualizarContactoCliente) //para actualizar el contacto de un cliente
router.delete('/clientes/eliminar/:rut_cliente', elimnarCliente) //para eliminar un cliente


router.get('/proveedores', obtenerProveedores) //para obtener todos los proveedores
router.get('/proveedores/:rut', obtenerProveedoresPorRut) //para obtener proveedores por el rut
router.post('/proveedores/crear', crearProveedor) //para crear un proveedor
router.put('/proveedores/actualizar', actualizarProveedor) //para modificar el proveedor
router.delete('/proveedores/eliminar/:rut_proveedor', eliminarProveedor) //para eliminar un provedor


router.get('/inventario', obtenerInventarios) //para obtener el inventario
router.post('/inventario/crear', agregarInventario) //para agregar al inventario
router.put('/inventario/:id_producto/:id_talla', editarInventario) //para editar el inventario
router.delete('/inventario/:id_producto/:id_talla', eliminarInventario) //para eliminar del inventario


router.get('/ventas', obtenerVentas) //para obtener las ventas
router.post('/ventas/crear', agregarVenta) //para agregar una venta
router.get('/ventas/imprimir/:id_venta', imprimirVenta) //para imprimir una venta


router.get('/reportes/inventario/productos-disponibles', productosDisponibles) //para obtener los productos disponibles
router.get('/reportes/inventario/productos-bajo-stock', productosBajoStock) //para obtener los productos bajo stock
router.get('/reportes/inventario/productos/agotados', productosAgotados) //para obtener los productos agotados

router.put('/configuracion/cambiar-contrasena',authMiddleware ,cambiarContrasenaConfiguracion) // para cambiar la contraseña

export default router 