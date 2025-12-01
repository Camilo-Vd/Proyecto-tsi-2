import server from "./server";
import "express-serve-static-core";

server.listen(3000,()=>{
    console.log('Inicio API Express')
})



declare module "express-serve-static-core" {
    interface Request {
        user?: {
            rut_usuario: string;
            rol?: string;
        };
    }
}
