import { db } from '../config/db';
import Usuario from '../models/Usuario';
import Cliente from '../models/Cliente';
import Proveedor from '../models/Proveedor';
import Categoria from '../models/Categoria';
import Talla from '../models/Talla';
import Producto from '../models/Producto';
import Inventario from '../models/Inventario';
import Venta from '../models/Venta';
import DetalleVenta from '../models/Detalle_venta';
import Compra from '../models/Compra';
import DetalleCompra from '../models/Detalle_compra';
import bcrypt from 'bcrypt';

export async function seedDatabase() {
    try {
        console.log('🔄 Iniciando seed de datos...');

        // Limpiar tablas en orden inverso de dependencias
        console.log('🗑️  Limpiando base de datos...');
        
        // Ejecutar queries directamente para limpiar sin problemas de FK
        await db.query('SET FOREIGN_KEY_CHECKS=0');
        
        // Eliminar datos de tablas dependientes primero
        await db.query('DELETE FROM detalle_venta');
        await db.query('DELETE FROM detalle_compra');
        await db.query('DELETE FROM ventas');
        await db.query('DELETE FROM compras');
        await db.query('DELETE FROM inventario');
        await db.query('DELETE FROM productos');
        await db.query('DELETE FROM usuarios');
        await db.query('DELETE FROM clientes');
        await db.query('DELETE FROM proveedores');
        await db.query('DELETE FROM tallas');
        await db.query('DELETE FROM categorias');
        
        // Resetear auto-increment
        await db.query('ALTER TABLE detalle_venta AUTO_INCREMENT = 1');
        await db.query('ALTER TABLE detalle_compra AUTO_INCREMENT = 1');
        await db.query('ALTER TABLE ventas AUTO_INCREMENT = 1');
        await db.query('ALTER TABLE compras AUTO_INCREMENT = 1');
        await db.query('ALTER TABLE productos AUTO_INCREMENT = 1');
        await db.query('ALTER TABLE tallas AUTO_INCREMENT = 1');
        await db.query('ALTER TABLE categorias AUTO_INCREMENT = 1');
        
        await db.query('SET FOREIGN_KEY_CHECKS=1');

        // 1. Crear Categorías
        console.log('📦 Creando categorías...');
        const categorias = await Categoria.bulkCreate([
            { nombre_categoria: 'Poleras' },
            { nombre_categoria: 'Pantalones' },
            { nombre_categoria: 'Accesorios' },
            { nombre_categoria: 'Calzado' },
            { nombre_categoria: 'Exteriores' },
            { nombre_categoria: 'Básicos' }
        ]);

        // 2. Crear Tallas
        console.log('📏 Creando tallas...');
        const tallas = await Talla.bulkCreate([
            { nombre_talla: 'XS' },
            { nombre_talla: 'S' },
            { nombre_talla: 'M' },
            { nombre_talla: 'L' },
            { nombre_talla: 'XL' },
            { nombre_talla: 'XXL' }
        ]);

        // 3. Crear Usuarios
        console.log('👤 Creando usuarios...');
        const hashedAdminPassword = await bcrypt.hash('lala123', 10);
        const hashedVendedorPassword = await bcrypt.hash('vendedor123', 10);

        const usuarios = await Usuario.bulkCreate([
            {
                rut_usuario: 22092187,
                nombre_usuario: 'admin',
                contraseña: hashedAdminPassword,
                rol_usuario: 'Administrador',
                estado_usuario: 'activo'
            },
            {
                rut_usuario: 11987654,
                nombre_usuario: 'vendedor1',
                contraseña: hashedVendedorPassword,
                rol_usuario: 'Vendedor',
                estado_usuario: 'activo'
            },
            {
                rut_usuario: 21543287,
                nombre_usuario: 'vendedor2',
                contraseña: hashedVendedorPassword,
                rol_usuario: 'Vendedor',
                estado_usuario: 'activo'
            }
        ]);

        // 4. Crear Clientes
        console.log('👥 Creando clientes...');
        const clientes = await Cliente.bulkCreate([
            {
                rut_cliente: 12345678,
                nombre_cliente: 'Juan Pérez',
                contacto_cliente: '912345678',
                estado_cliente: 'activo'
            },
            {
                rut_cliente: 87654321,
                nombre_cliente: 'María García',
                contacto_cliente: '987654321',
                estado_cliente: 'activo'
            },
            {
                rut_cliente: 11223344,
                nombre_cliente: 'Carlos López',
                contacto_cliente: 'carlos@email.com',
                estado_cliente: 'activo'
            },
            {
                rut_cliente: 55667788,
                nombre_cliente: 'Ana Martínez',
                contacto_cliente: 'ana@email.com',
                estado_cliente: 'activo'
            },
            {
                rut_cliente: 99887766,
                nombre_cliente: 'Roberto Sánchez',
                contacto_cliente: '998765432',
                estado_cliente: 'activo'
            }
        ]);

        // 5. Crear Proveedores
        console.log('🏭 Creando proveedores...');
        const proveedores = await Proveedor.bulkCreate([
            {
                rut_proveedor: 76543210,
                nombre_proveedor: 'Textiles del Sur',
                contacto_proveedor: '223456789',
                direccion_proveedor: 'Avenida Principal 123, Santiago',
                estado_proveedor: 'activo'
            },
            {
                rut_proveedor: 65432109,
                nombre_proveedor: 'Importaciones Asia',
                contacto_proveedor: '229876543',
                direccion_proveedor: 'Calle Industrial 456, Valparaíso',
                estado_proveedor: 'activo'
            },
            {
                rut_proveedor: 54321098,
                nombre_proveedor: 'Manufactura Local',
                contacto_proveedor: 'contacto@manufactura.cl',
                direccion_proveedor: 'Pasaje Artesanos 789, Concepción',
                estado_proveedor: 'activo'
            },
            {
                rut_proveedor: 43210987,
                nombre_proveedor: 'Distribuidora Premium',
                contacto_proveedor: '224567890',
                direccion_proveedor: 'Boulevard Comercial 101, Santiago',
                estado_proveedor: 'activo'
            },
            {
                rut_proveedor: 32109876,
                nombre_proveedor: 'Calzado Global',
                contacto_proveedor: 'ventas@calzadoglobal.cl',
                direccion_proveedor: 'Zona Franca 202, Iquique',
                estado_proveedor: 'activo'
            }
        ]);

        // 6. Crear Productos
        console.log('🛍️  Creando productos...');
        const productos = await Producto.bulkCreate([
            {
                nombre_producto: 'Polera Básica Algodón',
                id_categoria: categorias[0].id_categoria
            },
            {
                nombre_producto: 'Polera Deportiva',
                id_categoria: categorias[0].id_categoria
            },
            {
                nombre_producto: 'Polera Estampada',
                id_categoria: categorias[0].id_categoria
            },
            {
                nombre_producto: 'Pantalón Jeans',
                id_categoria: categorias[1].id_categoria
            },
            {
                nombre_producto: 'Pantalón Chino',
                id_categoria: categorias[1].id_categoria
            },
            {
                nombre_producto: 'Gorro Lana',
                id_categoria: categorias[2].id_categoria
            },
            {
                nombre_producto: 'Bufanda Tejida',
                id_categoria: categorias[2].id_categoria
            },
            {
                nombre_producto: 'Zapatilla Running',
                id_categoria: categorias[3].id_categoria
            },
            {
                nombre_producto: 'Zapatilla Casual',
                id_categoria: categorias[3].id_categoria
            },
            {
                nombre_producto: 'Chaqueta Invierno',
                id_categoria: categorias[4].id_categoria
            },
            {
                nombre_producto: 'Abrigo Lana',
                id_categoria: categorias[4].id_categoria
            },
            {
                nombre_producto: 'Calcetines Pack',
                id_categoria: categorias[5].id_categoria
            },
            {
                nombre_producto: 'Camiseta Blanca',
                id_categoria: categorias[5].id_categoria
            },
            {
                nombre_producto: 'Cinturón Cuero',
                id_categoria: categorias[2].id_categoria
            },
            {
                nombre_producto: 'Mochila Urbana',
                id_categoria: categorias[2].id_categoria
            }
        ]);

        // 7. Crear Inventario con precios
        console.log('📊 Creando inventario...');
        const inventarios = [];

        // Poleras y productos básicos - precios más bajos
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 6; j++) {
                inventarios.push({
                    id_producto: productos[i].id_producto,
                    id_talla: tallas[j].id_talla,
                    precio_unitario: 15000 + (j * 500), // Variar precio por talla
                    stock_actual: 20 + (Math.random() * 30),
                    stock_critico: 5
                });
            }
        }

        // Pantalones - precios medianos
        for (let i = 3; i < 5; i++) {
            for (let j = 0; j < 6; j++) {
                inventarios.push({
                    id_producto: productos[i].id_producto,
                    id_talla: tallas[j].id_talla,
                    precio_unitario: 45000 + (j * 1000),
                    stock_actual: 15 + (Math.random() * 25),
                    stock_critico: 3
                });
            }
        }

        // Accesorios - precios variados
        for (let i = 5; i < 7; i++) {
            for (let j = 0; j < 6; j++) {
                inventarios.push({
                    id_producto: productos[i].id_producto,
                    id_talla: tallas[j].id_talla,
                    precio_unitario: 12000 + (Math.random() * 8000),
                    stock_actual: 25 + (Math.random() * 35),
                    stock_critico: 5
                });
            }
        }

        // Calzado - precios altos
        for (let i = 7; i < 9; i++) {
            for (let j = 0; j < 6; j++) {
                inventarios.push({
                    id_producto: productos[i].id_producto,
                    id_talla: tallas[j].id_talla,
                    precio_unitario: 65000 + (j * 2000),
                    stock_actual: 12 + (Math.random() * 20),
                    stock_critico: 3
                });
            }
        }

        // Exteriores - precios premium
        for (let i = 9; i < 11; i++) {
            for (let j = 0; j < 6; j++) {
                inventarios.push({
                    id_producto: productos[i].id_producto,
                    id_talla: tallas[j].id_talla,
                    precio_unitario: 85000 + (j * 2500),
                    stock_actual: 8 + (Math.random() * 15),
                    stock_critico: 2
                });
            }
        }

        // Básicos - precios bajos
        for (let i = 11; i < 15; i++) {
            for (let j = 0; j < 6; j++) {
                inventarios.push({
                    id_producto: productos[i].id_producto,
                    id_talla: tallas[j].id_talla,
                    precio_unitario: 10000 + (Math.random() * 5000),
                    stock_actual: 30 + (Math.random() * 40),
                    stock_critico: 8
                });
            }
        }

        await Inventario.bulkCreate(inventarios);

        // 8. Crear Compras con detalles
        console.log('📝 Creando compras...');

        // Compra 1
        const compra1 = await Compra.create({
            fecha_compra: new Date('2025-11-15'),
            total_compra: 0, // Se actualizará
            rut_proveedor: proveedores[0].rut_proveedor,
            estado_compra: 'registrada'
        });

        const detallesCompra1 = [
            {
                id_compra: compra1.id_compra,
                id_producto: productos[0].id_producto, // Polera Básica
                id_talla: tallas[2].id_talla, // M
                cantidad_adquirida: 50,
                precio_unitario_compra: 8000
            },
            {
                id_compra: compra1.id_compra,
                id_producto: productos[1].id_producto, // Polera Deportiva
                id_talla: tallas[2].id_talla, // M
                cantidad_adquirida: 30,
                precio_unitario_compra: 9500
            },
            {
                id_compra: compra1.id_compra,
                id_producto: productos[12].id_producto, // Camiseta Blanca
                id_talla: tallas[1].id_talla, // S
                cantidad_adquirida: 100,
                precio_unitario_compra: 5000
            }
        ];

        await DetalleCompra.bulkCreate(detallesCompra1);

        // Calcular total de compra 1
        const totalCompra1 = detallesCompra1.reduce((sum, det) => sum + (det.cantidad_adquirida * det.precio_unitario_compra), 0);
        compra1.total_compra = totalCompra1;
        await compra1.save();

        // Compra 2
        const compra2 = await Compra.create({
            fecha_compra: new Date('2025-11-10'),
            total_compra: 0,
            rut_proveedor: proveedores[2].rut_proveedor,
            estado_compra: 'registrada'
        });

        const detallesCompra2 = [
            {
                id_compra: compra2.id_compra,
                id_producto: productos[3].id_producto, // Pantalón Jeans
                id_talla: tallas[2].id_talla, // M
                cantidad_adquirida: 40,
                precio_unitario_compra: 25000
            },
            {
                id_compra: compra2.id_compra,
                id_producto: productos[3].id_producto, // Pantalón Jeans
                id_talla: tallas[3].id_talla, // L
                cantidad_adquirida: 35,
                precio_unitario_compra: 25000
            }
        ];

        await DetalleCompra.bulkCreate(detallesCompra2);

        const totalCompra2 = detallesCompra2.reduce((sum, det) => sum + (det.cantidad_adquirida * det.precio_unitario_compra), 0);
        compra2.total_compra = totalCompra2;
        await compra2.save();

        // Compra 3
        const compra3 = await Compra.create({
            fecha_compra: new Date('2025-11-05'),
            total_compra: 0,
            rut_proveedor: proveedores[4].rut_proveedor,
            estado_compra: 'registrada'
        });

        const detallesCompra3 = [
            {
                id_compra: compra3.id_compra,
                id_producto: productos[7].id_producto, // Zapatilla Running
                id_talla: tallas[2].id_talla, // M
                cantidad_adquirida: 25,
                precio_unitario_compra: 35000
            },
            {
                id_compra: compra3.id_compra,
                id_producto: productos[8].id_producto, // Zapatilla Casual
                id_talla: tallas[2].id_talla, // M
                cantidad_adquirida: 30,
                precio_unitario_compra: 32000
            }
        ];

        await DetalleCompra.bulkCreate(detallesCompra3);

        const totalCompra3 = detallesCompra3.reduce((sum, det) => sum + (det.cantidad_adquirida * det.precio_unitario_compra), 0);
        compra3.total_compra = totalCompra3;
        await compra3.save();

        // 9. Crear Ventas con detalles
        console.log('🛒 Creando ventas...');

        // Venta 1 - Juan Pérez
        const venta1 = await Venta.create({
            fecha_hora_venta: new Date('2025-11-20 10:30:00'),
            total_venta: 0,
            rut_cliente: clientes[0].rut_cliente,
            rut_usuario: usuarios[1].rut_usuario,
            estado_venta: 'completada'
        });

        const detallesVenta1 = [
            {
                id_venta: venta1.id_venta,
                id_producto: productos[0].id_producto, // Polera Básica
                id_talla: tallas[2].id_talla, // M
                cantidad_vendida: 2,
                precio_unitario_venta: 15000
            },
            {
                id_venta: venta1.id_venta,
                id_producto: productos[12].id_producto, // Camiseta Blanca
                id_talla: tallas[1].id_talla, // S
                cantidad_vendida: 3,
                precio_unitario_venta: 10000
            }
        ];

        await DetalleVenta.bulkCreate(detallesVenta1);

        const subtotal1 = detallesVenta1.reduce((sum, det) => sum + (det.cantidad_vendida * det.precio_unitario_venta), 0);
        const total1 = Math.round(subtotal1 * 1.19); // IVA 19%
        venta1.total_venta = total1;
        await venta1.save();

        // Venta 2 - María García
        const venta2 = await Venta.create({
            fecha_hora_venta: new Date('2025-11-21 14:45:00'),
            total_venta: 0,
            rut_cliente: clientes[1].rut_cliente,
            rut_usuario: usuarios[2].rut_usuario,
            estado_venta: 'completada'
        });

        const detallesVenta2 = [
            {
                id_venta: venta2.id_venta,
                id_producto: productos[3].id_producto, // Pantalón Jeans
                id_talla: tallas[3].id_talla, // L
                cantidad_vendida: 1,
                precio_unitario_venta: 45000
            },
            {
                id_venta: venta2.id_venta,
                id_producto: productos[5].id_producto, // Gorro Lana
                id_talla: tallas[0].id_talla, // XS (one size)
                cantidad_vendida: 2,
                precio_unitario_venta: 12000
            }
        ];

        await DetalleVenta.bulkCreate(detallesVenta2);

        const subtotal2 = detallesVenta2.reduce((sum, det) => sum + (det.cantidad_vendida * det.precio_unitario_venta), 0);
        const total2 = Math.round(subtotal2 * 1.19);
        venta2.total_venta = total2;
        await venta2.save();

        // Venta 3 - Carlos López
        const venta3 = await Venta.create({
            fecha_hora_venta: new Date('2025-11-22 09:15:00'),
            total_venta: 0,
            rut_cliente: clientes[2].rut_cliente,
            rut_usuario: usuarios[1].rut_usuario,
            estado_venta: 'completada'
        });

        const detallesVenta3 = [
            {
                id_venta: venta3.id_venta,
                id_producto: productos[7].id_producto, // Zapatilla Running
                id_talla: tallas[3].id_talla, // L
                cantidad_vendida: 1,
                precio_unitario_venta: 65000
            },
            {
                id_venta: venta3.id_venta,
                id_producto: productos[2].id_producto, // Polera Estampada
                id_talla: tallas[2].id_talla, // M
                cantidad_vendida: 1,
                precio_unitario_venta: 16000
            },
            {
                id_venta: venta3.id_venta,
                id_producto: productos[6].id_producto, // Bufanda Tejida
                id_talla: tallas[0].id_talla, // One size
                cantidad_vendida: 1,
                precio_unitario_venta: 14000
            }
        ];

        await DetalleVenta.bulkCreate(detallesVenta3);

        const subtotal3 = detallesVenta3.reduce((sum, det) => sum + (det.cantidad_vendida * det.precio_unitario_venta), 0);
        const total3 = Math.round(subtotal3 * 1.19);
        venta3.total_venta = total3;
        await venta3.save();

        // Venta 4 - Ana Martínez
        const venta4 = await Venta.create({
            fecha_hora_venta: new Date('2025-11-23 16:20:00'),
            total_venta: 0,
            rut_cliente: clientes[3].rut_cliente,
            rut_usuario: usuarios[2].rut_usuario,
            estado_venta: 'completada'
        });

        const detallesVenta4 = [
            {
                id_venta: venta4.id_venta,
                id_producto: productos[9].id_producto, // Chaqueta Invierno
                id_talla: tallas[2].id_talla, // M
                cantidad_vendida: 1,
                precio_unitario_venta: 85000
            },
            {
                id_venta: venta4.id_venta,
                id_producto: productos[11].id_producto, // Calcetines Pack
                id_talla: tallas[0].id_talla, // One size
                cantidad_vendida: 5,
                precio_unitario_venta: 8000
            }
        ];

        await DetalleVenta.bulkCreate(detallesVenta4);

        const subtotal4 = detallesVenta4.reduce((sum, det) => sum + (det.cantidad_vendida * det.precio_unitario_venta), 0);
        const total4 = Math.round(subtotal4 * 1.19);
        venta4.total_venta = total4;
        await venta4.save();

        // Venta 5 - Roberto Sánchez
        const venta5 = await Venta.create({
            fecha_hora_venta: new Date('2025-11-24 11:50:00'),
            total_venta: 0,
            rut_cliente: clientes[4].rut_cliente,
            rut_usuario: usuarios[1].rut_usuario,
            estado_venta: 'completada'
        });

        const detallesVenta5 = [
            {
                id_venta: venta5.id_venta,
                id_producto: productos[4].id_producto, // Pantalón Chino
                id_talla: tallas[3].id_talla, // L
                cantidad_vendida: 2,
                precio_unitario_venta: 42000
            },
            {
                id_venta: venta5.id_venta,
                id_producto: productos[1].id_producto, // Polera Deportiva
                id_talla: tallas[2].id_talla, // M
                cantidad_vendida: 3,
                precio_unitario_venta: 16000
            },
            {
                id_venta: venta5.id_venta,
                id_producto: productos[13].id_producto, // Cinturón Cuero
                id_talla: tallas[0].id_talla, // One size
                cantidad_vendida: 1,
                precio_unitario_venta: 18000
            }
        ];

        await DetalleVenta.bulkCreate(detallesVenta5);

        const subtotal5 = detallesVenta5.reduce((sum, det) => sum + (det.cantidad_vendida * det.precio_unitario_venta), 0);
        const total5 = Math.round(subtotal5 * 1.19);
        venta5.total_venta = total5;
        await venta5.save();

        console.log('✅ Seed completado exitosamente!');
        console.log('\n📊 Resumen de datos creados:');
        console.log(`   - Usuarios: 3 (1 Admin + 2 Vendedores)`);
        console.log(`   - Clientes: 5`);
        console.log(`   - Proveedores: 5`);
        console.log(`   - Categorías: 6`);
        console.log(`   - Tallas: 6`);
        console.log(`   - Productos: 15`);
        console.log(`   - Inventario: ${inventarios.length} registros`);
        console.log(`   - Compras: 3 transacciones`);
        console.log(`   - Ventas: 5 transacciones`);
        console.log('\n👤 Credenciales Admin:');
        console.log(`   - RUT: 22.092.187-5`);
        console.log(`   - Usuario: admin`);
        console.log(`   - Contraseña: lala123`);

    } catch (error) {
        console.error('❌ Error en seed:', error);
        throw error;
    }
}
