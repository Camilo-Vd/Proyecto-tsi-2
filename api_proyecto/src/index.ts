import dotenv from 'dotenv';
dotenv.config();

import server from "./server";

const PORT = process.env.PORT || 3000;
console.log('DEBUG: process.env.PORT =', process.env.PORT);

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
