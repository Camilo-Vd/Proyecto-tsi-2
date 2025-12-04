// Decodificar JWT sin verificar firma (solo para lectura de datos)
export function decodificarToken(token: string): any {
    try {
        const partes = token.split('.');
        if (partes.length !== 3) {
            console.error("Token inválido: no tiene 3 partes");
            return null;
        }

        // Decodificar la segunda parte (payload)
        const payload = partes[1];
        
        // Convertir base64url a base64 (reemplazar caracteres)
        const base64 = payload
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        // Agregar padding si es necesario
        const padding = base64.length % 4;
        let base64Padded = base64;
        if (padding) {
            base64Padded = base64 + '='.repeat(4 - padding);
        }

        // Decodificar base64
        let decoded: string;
        try {
            decoded = atob(base64Padded);
        } catch (e) {
            console.error('Error decodificando token:', e);
            // Fallback usando método manual si atob falla
            decoded = Buffer.from(base64Padded, 'base64').toString('utf-8');
        }
        
        const datos = JSON.parse(decoded);
        return datos;
    } catch (error) {
        console.error('❌ Error decodificando token:', error);
        return null;
    }
}
