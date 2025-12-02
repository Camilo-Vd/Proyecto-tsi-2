/**
 * Utilidades para validación y formateo de RUT chilenos
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
    let rutStr = rut.toString();

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

export function validarRUT(rutCompleto: string): boolean {
    try {
        const { rut, dv } = parsearRUT(rutCompleto);
        const dvCalculado = calcularDigitoVerificador(rut);
        return dv.toUpperCase() === dvCalculado.toUpperCase();
    } catch {
        return false;
    }
}

export function parsearRUT(rutCompleto: string): { rut: number; dv: string } {
    if (!rutCompleto || typeof rutCompleto !== 'string') {
        throw new Error('RUT no puede estar vacío');
    }

    // Limpiar el RUT: quitar espacios, puntos y guiones
    let rutLimpio = rutCompleto.replace(/[\s.-]/g, '');

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

export function formatearRUT(rut: number): string {
    if (rut <= 0 || rut > 99999999) {
        throw new Error('RUT debe estar entre 1 y 99.999.999');
    }

    const dv = calcularDigitoVerificador(rut);
    const rutFormateado = rut.toLocaleString('es-CL');
    return `${rutFormateado}-${dv}`;
}

export function formatearRUTInput(valor: string): string {
    if (!valor) return '';

    // Remover todos los caracteres que no sean números o K/k
    const rutLimpio = valor.replace(/[^0-9kK]/g, '');
    
    if (rutLimpio.length === 0) return '';
    
    // Separar el dígito verificador
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);
    
    if (cuerpo.length === 0) return dv;
    
    // Formatear el cuerpo con puntos
    let cuerpoFormateado = '';
    for (let i = cuerpo.length - 1, j = 0; i >= 0; i--, j++) {
        if (j > 0 && j % 3 === 0) {
            cuerpoFormateado = '.' + cuerpoFormateado;
        }
        cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
    }
    
    // Si hay dígito verificador, agregarlo con guión
    if (dv) {
        return cuerpoFormateado + '-' + dv.toUpperCase();
    }
    
    return cuerpoFormateado;
}


export function rutANumero(rutFormateado: string): number {
    const { rut } = parsearRUT(rutFormateado);
    return rut;
}

export function validarRUTFormulario(rutInput: string): { valido: boolean; rut?: number; error?: string } {
    try {
        if (!rutInput || rutInput.trim().length === 0) {
            return { valido: false, error: 'El RUT es obligatorio' };
        }

        const esValido = validarRUT(rutInput);
        if (!esValido) {
            return { valido: false, error: 'El RUT ingresado no es válido' };
        }

        const { rut } = parsearRUT(rutInput);
        return { valido: true, rut };

    } catch (error) {
        return { 
            valido: false, 
            error: error instanceof Error ? error.message : 'RUT inválido' 
        };
    }
}