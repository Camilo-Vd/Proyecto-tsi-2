import { AxiosError } from "axios";

/**
 * Respuesta estándar de error de API
 */
export interface ApiErrorResponse {
    success: false;
    error: string;
    code?: string;
    detalles?: any;
    problemas?: any[];
}

/**
 * Respuesta estándar exitosa de API
 */
export interface ApiSuccessResponse<T> {
    success: true;
    data?: T;
}

/**
 * Tipo genérico para respuestas de API
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Manejador centralizado de errores de Axios
 * @param error Error de Axios
 * @param defaultMessage Mensaje por defecto si no hay información del error
 * @returns Objeto con error y código de error
 */
export function handleAxiosError(
    error: unknown,
    defaultMessage: string = "Error en la solicitud"
): ApiErrorResponse {
    if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data as any;

        // Mensajes específicos por código HTTP
        switch (status) {
            case 400:
                return {
                    success: false,
                    error: errorData?.message || "Datos inválidos",
                    code: "BAD_REQUEST",
                    detalles: errorData?.detalles,
                    problemas: errorData?.problemas,
                };

            case 401:
                return {
                    success: false,
                    error: errorData?.message || "No autorizado. Inicia sesión nuevamente",
                    code: "UNAUTHORIZED",
                };

            case 403:
                return {
                    success: false,
                    error: errorData?.message || "No tienes permisos para realizar esta acción",
                    code: "FORBIDDEN",
                };

            case 404:
                return {
                    success: false,
                    error: errorData?.message || "Recurso no encontrado",
                    code: "NOT_FOUND",
                };

            case 409:
                return {
                    success: false,
                    error: errorData?.message || "Conflicto: El recurso ya existe o hay un conflicto",
                    code: errorData?.code || "CONFLICT",
                    detalles: errorData?.detalles,
                    problemas: errorData?.detalles,
                };

            case 500:
                return {
                    success: false,
                    error: errorData?.message || "Error en el servidor",
                    code: "INTERNAL_SERVER_ERROR",
                };

            default:
                return {
                    success: false,
                    error: errorData?.message || defaultMessage,
                    code: `HTTP_${status}`,
                };
        }
    }

    // Si no es un error de Axios, retornar mensaje genérico
    console.error("Error no controlado:", error);
    return {
        success: false,
        error: defaultMessage,
        code: "UNKNOWN_ERROR",
    };
}

/**
 * Valida que una respuesta sea un array y lo retorna
 * @param response Respuesta a validar
 * @returns Array validado o array vacío
 */
export function extractArrayResponse(response: any): any[] {
    if (Array.isArray(response)) {
        return response;
    }

    if (response?.data && Array.isArray(response.data)) {
        return response.data;
    }

    if (response?.items && Array.isArray(response.items)) {
        return response.items;
    }

    if (response?.records && Array.isArray(response.records)) {
        return response.records;
    }

    // Intenta usar la primera propiedad que sea un array
    for (const key of Object.keys(response || {})) {
        if (Array.isArray(response[key])) {
            return response[key];
        }
    }

    return [];
}

/**
 * Extrae los datos de una respuesta de API exitosa o devuelve un valor por defecto
 * @param response Respuesta de API
 * @param defaultValue Valor por defecto si la respuesta no es exitosa
 * @returns Datos extraídos o valor por defecto
 */
export function getApiData<T>(response: ApiResponse<T>, defaultValue: T): T {
    if (response.success && response.data !== undefined) {
        return response.data;
    }
    return defaultValue;
}
