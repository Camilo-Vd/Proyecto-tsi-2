import { Outlet, useNavigation } from "react-router-dom";
import NavBar from "../components/NavBar";
import Loader from "../components/Loader";
import { useTokenValidation } from "../hooks/useTokenValidation";

export default function Layout(){
    const navigation = useNavigation();
    
    // Validar token periódicamente
    useTokenValidation();
    
    return(
        <>
            {/* NAVBAR */}
            <NavBar />
            {/* Contenido principal */}
            <main>
                <Outlet />
            </main>
            {/* Loader global durante navegación - FUERA del flujo normal */}
            {navigation.state === "loading" && (
                <div style={{ 
                    position: "fixed", 
                    top: 0, 
                    left: 0, 
                    width: "100%", 
                    height: "100%", 
                    backgroundColor: "rgba(255, 255, 255, 0.8)", 
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Loader />
                </div>
            )}
        </>
    )
}