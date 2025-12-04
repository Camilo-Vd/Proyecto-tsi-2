/**
 * Script para inicializar stock_critico en todos los registros de inventario existentes
 * Uso: node scripts/inicializar-stock-critico.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Importar la configuración de Sequelize
const { sequelize } = require('../src/config/db');

async function inicializarStockCritico() {
    try {
        console.log('🔄 Inicializando stock crítico en inventarios...');
        
        const [affectedRows] = await sequelize.query(
            `UPDATE inventario SET stock_critico = 5 WHERE stock_critico IS NULL OR stock_critico = 0`
        );
        
        console.log(`✅ ${affectedRows} registros actualizados con stock_critico = 5`);
        console.log('✨ Inicialización completada exitosamente');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error durante la inicialización:', error);
        process.exit(1);
    }
}

inicializarStockCritico();
