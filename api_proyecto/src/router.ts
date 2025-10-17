import { Router } from 'express';

import {
    login,
    crearUsuario,
    cambiarContraseña,
    logout
} from "./handlers/usuarios"
import { actualizarContactoCliente, crearCliente, elimnarCliente, obtenerClientePorRut, obtenerClientes } from './handlers/clientes';
import { actualizarProveedor, crearProveedor, eliminarProveedor, obtenerProveedores, obtenerProveedoresPorRut } from './handlers/proveedores';


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


export default router 