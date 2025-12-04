import dotenv from 'dotenv';
dotenv.config();

import server, { conectarDB } from "./server";
import { seedDatabase } from "./seeds/seedDatabase";

const PORT = process.env.PORT || 3000;
console.log('DEBUG: process.env.PORT =', process.env.PORT);

// Función async para iniciar el servidor
async function iniciarServidor() {
    try {
        // Esperar a que se conecte y sincronice la BD
        await conectarDB();
        
        // Ejecutar seed si está habilitado en .env
        if (process.env.RUN_SEED === 'true') {
            console.log('\n🌱 Ejecutando seed de base de datos...\n');
            await seedDatabase();
            console.log('\n✨ Seed completado. Puedes cambiar RUN_SEED=false en .env para no ejecutarlo nuevamente.\n');
        }
        
        // Iniciar el servidor y manejar errores de arranque (p.ej. EADDRINUSE)
        const appServer = server.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
            console.log(`API disponible en: http://localhost:${PORT}`);
        });

        appServer.on('error', (error: any) => {
            if (error && (error.code === 'EADDRINUSE' || error.errno === 'EADDRINUSE')) {
                console.error(`Error: el puerto ${PORT} ya está en uso. Detén la otra instancia o cambia PORT en el archivo .env.`);
                process.exit(1);
            } else {
                console.error('Error al iniciar el servidor:', error);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Error durante la inicialización:', error);
        process.exit(1);
    }
}

iniciarServidor();
