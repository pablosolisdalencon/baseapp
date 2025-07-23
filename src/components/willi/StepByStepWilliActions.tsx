'use server';

// Importaciones necesarias (asegúrate de que estas utilidades sean seguras para el servidor,
// es decir, que no expongan secretos si se usan directamente en el cliente).
import GWV from "@/utils/GWV"; // Si GWV es una utilidad de servidor para llamadas internas
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth"; // Para obtener la sesión en el servidor

interface GeneratedContent {
  texto: string | null;
  imagen: string | null;
}

// Funciones de utilidad que hacen las llamadas a tus APIs internas (estas también se ejecutarían en el servidor)
// Idealmente, estas funciones vivirían en un archivo separado para reutilización.

// === Funciones de Lógica de Servidor ===

// NOTA: Estas funciones ahora se ejecutarán enteramente en el servidor.
// No necesitarán 'fetch' a '/api/willi' sino que podrían llamar directamente a la lógica que esa API Route ejecuta,
// o si /api/willi es una API Route separada, la Server Action puede hacer fetch a ella, pero desde el servidor.

async function serverGeneratePost(post: any): Promise<GeneratedContent | null> {
    try {
        // En un Server Action, podrías llamar directamente a la lógica que antes estaba en `/api/willi`
        // O si `/api/willi` sigue siendo una API Route separada, la Server Action la llamaría internamente.
        // Aquí simulamos la lógica de fetch, pero recuerda que es una llamada de servidor a servidor.
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/willi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item: 'post-final', post: post }),
        });

        const response_imagen = await fetch(`${process.env.NEXTAUTH_URL}/api/willi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item: 'post-final-img', post: post }),
        });

        if (response.ok) {
            const res = await response.json();
            const texto_final = res[0].texto;

            if (response_imagen.ok) {
                const res_img = await response_imagen.json();
                const imagen_final = res_img[0].data;
                return { texto: texto_final, imagen: imagen_final };
            } else {
                console.warn("serverGeneratePost: Imagen no generada o no encontrada.");
                return { texto: texto_final, imagen: null };
            }
        } else {
            console.error(`serverGeneratePost: Fallo al generar texto. Estado: ${response.status}`);
            return null;
        }
    } catch (error: any) {
        console.error("serverGeneratePost: Error en la generación del post:", error);
        return null;
    }
}

async function serverGetPrice(action: string): Promise<number | null> {
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/pricing?a=${action}`);
        if (!response.ok) {
            console.error(`serverGetPrice: Fallo al obtener precio. Estado: ${response.status}`);
            return null;
        }
        const jsonPrice = await response.json();
        return jsonPrice.price;
    } catch (e) {
        console.error("serverGetPrice: Error al obtener precio:", e);
        return null;
    }
}

async function serverValidarSaldo(email: string): Promise<number | null> {
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user-tokens/?e=${email}`);
        if (!response.ok) {
            console.error(`serverValidarSaldo: Fallo al validar saldo. Estado: ${response.status}`);
            return null;
        }
        const jsonData = await response.json();
        return jsonData.tokens;
    } catch (e) {
        console.error("serverValidarSaldo: Error al validar saldo:", e);
        return null;
    }
}

async function serverDescontarTokens(amountToLeave: number, email: string): Promise<any | null> {
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user-tokens`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokens: amountToLeave, email: email }),
        });
        if (!response.ok) {
            console.error(`serverDescontarTokens: Fallo al descontar tokens. Estado: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (e) {
        console.error("serverDescontarTokens: Error al descontar tokens:", e);
        return null;
    }
}

// === La Server Action Principal ===
export async function executeMarketingAction(action: string, objectAction: any): Promise<{ key: string; generated: GeneratedContent | null } | { key: string; error: string }> {
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email;

    if (!currentUserEmail) {
        return { key: action, error: "No autenticado. Debes iniciar sesión." };
    }

    // Adaptar la clave para el manejo de posts
    const key = (action === "generate-post" && objectAction.week != null && objectAction.day != null)
        ? `${objectAction.week}_${objectAction.day}`
        : action; // Usar la acción como clave para otras operaciones

    try {
        const saldoActual = await serverValidarSaldo(currentUserEmail);
        if (saldoActual === null) {
            return { key: key, error: "Error: No se pudo verificar el saldo." };
        }

        const price = await serverGetPrice(action);
        if (price === null) {
            return { key: key, error: "Error: No se pudo determinar el costo de la acción." };
        }

        if (saldoActual < price) {
            return { key: key, error: "Saldo insuficiente." };
        }

        const saldoDespuesDelDescuento = saldoActual - price;
        const descuentoExitoso = await serverDescontarTokens(saldoDespuesDelDescuento, currentUserEmail);

        if (!descuentoExitoso) {
            return { key: key, error: `Error: No se pudieron descontar los tokens.` };
        }

        let resultadoAccion: GeneratedContent | any; // Puede ser GeneratedContent o el resultado de GWV
        if (action === "generate-post") {
            resultadoAccion = await serverGeneratePost(objectAction.post);
        } else if (action === "generate-estudio") {
            const { mode, projectId, item } = objectAction;
            resultadoAccion = await GWV(mode, projectId, item);
        } else if (action === "generate-estrategia") {
            const { mode, projectId, item, estudio } = objectAction;
            resultadoAccion = await GWV(mode, projectId, item, estudio);
        } else if (action === "generate-campania") {
            const { mode, projectId, item, estudio, estrategia } = objectAction;
            resultadoAccion = await GWV(mode, projectId, item, estudio, estrategia);
        } else {
            return { key: key, error: `Acción desconocida: ${action}` };
        }

        // Si la acción falló, revertir tokens
        if (!resultadoAccion || (resultadoAccion.texto && resultadoAccion.texto.startsWith("Error:"))) {
            await serverDescontarTokens(saldoActual, currentUserEmail); // Rollback
            return { key: key, error: resultadoAccion?.texto || "Error desconocido en la generación de contenido. Tokens restaurados." };
        }

        return { key: key, generated: resultadoAccion };

    } catch (error: any) {
        console.error("Error en executeMarketingAction:", error);
        return { key: key, error: error.message || "Error inesperado en la Server Action." };
    }
}