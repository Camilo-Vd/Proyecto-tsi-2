import Express from "express"
import { db } from "./config/db"
import router from "./router"
import cors, { CorsOptions } from 'cors'

const server = Express()

server.get('/', (request, response) => {
    response.send('Hola Mundo Cuyeyo')
})

export async function conectarDB() {
    try {
        await db.authenticate();
        await db.sync({ alter: false })
        console.log('Conexión a la base de datos establecida correctamente.')

    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    }
}

//CORS
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (!origin || origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'), false)
        }
    }
};

server.use(cors(corsOptions));

server.use(Express.json())
server.use('/api', router)
export default server