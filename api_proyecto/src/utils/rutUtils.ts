/**
 * Utilidades para validación y formateo de RUT chilenos - Backend
 * Implementa el algoritmo oficial chileno de dígito verificador
 */

/**
 * Calcula el dígito verificador de un RUT chileno
 * @param rut - Número del RUT sin dígito verificador (ej: 12345678)
 * @returns El dígito verificador como string ("0"-"9" o "K")
 */
export function calcularDigitoVerificador(rut: number): string {
    if (rut <= 0 || rut > 99999999) {
        throw new Error('RUT debe estar entre 1 y 99.999.999');
    }

    let suma = 0;
    let multiplicador = 2;
    const rutStr = rut.toString();

    // Recorrer de derecha a izquierda
    for (let i = rutStr.length - 1; i >= 0; i--) {
        suma += parseInt(rutStr[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    const dv = 11 - resto;

    if (dv === 11) return '0';
    if (dv === 10) return 'K';
    return dv.toString();
}

/**
 * Valida si un RUT completo es válido
 * @param rutCompleto - RUT en cualquier formato (ej: "12.345.678-9", "12345678-9", "123456789")
 * @returns true si el RUT es válido
 */
export function validarRUT(rutCompleto: string): boolean {
    try {
        const { rut, dv } = parsearRUT(rutCompleto);
        const dvCalculado = calcularDigitoVerificador(rut);
        return dv.toUpperCase() === dvCalculado.toUpperCase();
    } catch {
        return false;
    }
}

/**
 * Parsea un RUT desde string y extrae el número y dígito verificador
 * @param rutCompleto - RUT en cualquier formato
 * @returns Objeto con rut (number) y dv (string)
 */
export function parsearRUT(rutCompleto: string): { rut: number; dv: string } {
    if (!rutCompleto || typeof rutCompleto !== 'string') {
        throw new Error('RUT no puede estar vacío');
    }

    // Limpiar el RUT: quitar espacios, puntos y guiones
    const rutLimpio = rutCompleto.replace(/[\s.-]/g, '');

    if (rutLimpio.length < 2) {
        throw new Error('RUT debe tener al menos 2 caracteres');
    }

    // Separar cuerpo y dígito verificador
    const dv = rutLimpio.slice(-1).toUpperCase();
    const cuerpo = rutLimpio.slice(0, -1);

    // Validar que el cuerpo sea solo números
    if (!/^\d+$/.test(cuerpo)) {
        throw new Error('El cuerpo del RUT debe contener solo números');
    }

    // Validar que el DV sea válido
    if (!/^[0-9K]$/.test(dv)) {
        throw new Error('El dígito verificador debe ser un número del 0-9 o K');
    }

    const rutNumero = parseInt(cuerpo);

    if (rutNumero <= 0 || rutNumero > 99999999) {
        throw new Error('RUT debe estar entre 1 y 99.999.999');
    }

    return { rut: rutNumero, dv };
}

/**
 * Formatea un RUT numérico para mostrar al usuario
 * @param rut - Número del RUT sin dígito verificador
 * @returns RUT formateado con puntos y guión (ej: "12.345.678-9")
 */
export function formatearRUT(rut: number): string {
    if (rut <= 0 || rut > 99999999) {
        throw new Error('RUT debe estar entre 1 y 99.999.999');
    }

    const dv = calcularDigitoVerificador(rut);
    const rutFormateado = rut.toLocaleString('es-CL');
    return `${rutFormateado}-${dv}`;
}

/**
 * Valida y procesa un RUT desde el frontend
 * @param rutInput - RUT recibido del frontend
 * @returns Objeto con resultado de validación
 */
export function procesarRUTBackend(rutInput: string | number): { valido: boolean; rut?: number; error?: string } {
    try {
        // Si ya es número, validar directamente
        if (typeof rutInput === 'number') {
            if (rutInput <= 0 || rutInput > 99999999) {
                return { valido: false, error: 'RUT debe estar entre 1 y 99.999.999' };
            }
            return { valido: true, rut: rutInput };
        }

        // Si es string, validar formato completo
        if (!rutInput || rutInput.toString().trim().length === 0) {
            return { valido: false, error: 'El RUT es obligatorio' };
        }

        const rutString = rutInput.toString().trim();
        const esValido = validarRUT(rutString);
        
        if (!esValido) {
            return { valido: false, error: 'El RUT ingresado no es válido' };
        }

        const { rut } = parsearRUT(rutString);
        return { valido: true, rut };

    } catch (error) {
        return { 
            valido: false, 
            error: error instanceof Error ? error.message : 'RUT inválido' 
        };
    }
}

/**
 * Middleware para validar RUT en requests
 */
export function validarRUTMiddleware(campo: string) {
    return (req: any, res: any, next: any) => {
        const rutValue = req.body[campo];
        
        if (!rutValue) {
            return res.status(400).json({ message: `${campo} es obligatorio` });
        }

        const resultado = procesarRUTBackend(rutValue);
        
        if (!resultado.valido) {
            return res.status(400).json({ message: resultado.error });
        }

        // Reemplazar el valor en el request con el RUT numérico validado
        req.body[campo] = resultado.rut;
        next();
    };
}