import { useMemo } from "react";
import { Talla } from "../types/talla";
import { Inventario } from "../types/inventario";

/**
 * Hook personalizado para obtener las tallas disponibles de un producto
 * @param id_producto - ID del producto seleccionado
 * @param tallas - Lista completa de tallas
 * @param inventarios - Lista de inventarios
 * @returns Array de tallas disponibles para el producto
 */
export function useTallasDisponibles(
    id_producto: string | number,
    tallas: Talla[],
    inventarios: Inventario[]
): Talla[] {
    return useMemo(() => {
        if (!id_producto) return [];
        
        const idProductoNum = parseInt(String(id_producto));
        
        // Filtrar inventarios del producto y extraer IDs de talla únicos
        const tallaIds = inventarios
            .filter((inv) => inv.id_producto === idProductoNum)
            .map((inv) => inv.id_talla);
        
        // Retornar las tallas que existen para este producto
        return tallas.filter((t) => tallaIds.includes(t.id_talla));
    }, [id_producto, tallas, inventarios]);
}
