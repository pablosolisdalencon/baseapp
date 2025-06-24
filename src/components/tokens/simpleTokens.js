import React from "react";   
import GWV from '@/utils/GWV';
<<<<<<< HEAD
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
=======
// Ya no se usa useAppContext aquí directamente para obtener la sesión en useTokens,
// ya que el email se pasará como argumento.

>>>>>>> f257cb1c42ba8354c9a78354d4a2a253e59decf3
// fx consumeTokens
// validarSaldo
// ejecutar accion
// rollback tokens
// descontar tokens

// --- DEV TOOL --------------------------------------------
async function devTool(item, price) {
    const bodyData = JSON.stringify({ actionName: item, price: price });
    const response = await fetch(`/api/pricing`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: bodyData,
    });
    console.log(response);
}
// -----------------------------------------------


//-------- ACCIONES --------------
const generatePost = async (post) => {
    console.log("###### generate POST > post");
    console.log(post);
    try {
        let bodyData = JSON.stringify({ item: 'post-final', post: post });
        let bodyData_img = JSON.stringify({ item: 'post-final-img', post: post });
        const response = await fetch(`/api/willi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: bodyData,
        });

        const response_imagen = await fetch(`/api/willi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: bodyData_img,
        });

        if (response.ok) {
            const res = await response.json();
            const texto_final = res[0].texto;

            if (response_imagen.ok) {
                const res_img = await response_imagen.json();
                const imagen_final = res_img[0].data;
                const response_final = {
                    texto: texto_final,
                    imagen: imagen_final,
                };
                return response_final;
            } else if (response_imagen.status === 404) {
                // Si la imagen no se encuentra o no se genera, devolvemos solo el texto.
                console.warn("generatePost: Imagen no generada o no encontrada (404). Devolviendo solo texto.");
                return { texto: texto_final, imagen: null };
            } else {
                const errorData = await response_imagen.json();
                console.error(`generatePost: Error al generar imagen. Status: ${response_imagen.status}, Mensaje: ${errorData.message}`);
                // Devolver solo el texto si la imagen falla por otra razón
                return { texto: texto_final, imagen: null };
            }
        } else if (response.status === 404) {
            console.warn("generatePost: Texto no generado o no encontrado (404).");
            return null;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || `generatePost: Error al crear texto. Status: ${response.status}, StatusText: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`generatePost: Fallo al crear.`, error);
        throw new Error(`generatePost: No se pudo crear el contenido del post.`);
    }
};

const GeneratePost = async ({ week, day, post }) => {
    const getKey = (week, day) => `${week}_${day}`;
    const key = getKey(week, day);

    try {
        const generated = await generatePost(post);
        return { key, generated }; // `generated` puede ser `{texto, imagen}` o `null`
    } catch (err) {
        console.error(`Error generating content for ${key}:`, err);
        // Retornar una estructura consistente incluso en error para que `ejecutarAccion` no falle
        return { key, generated: { texto: `Error al generar: ${err.message}`, imagen: null } };
    }
};
//----------------------


async function ejecutarAccion(action, objectAction) {
    if (action === "generate-post") { // Usar === para comparación estricta
        // GeneratePost ahora siempre devuelve un objeto { key, generated }
        return await GeneratePost(objectAction);
    }

    // Para otras acciones, asegurarse que GWV también devuelve una estructura consistente
    // o manejar los errores de forma similar.
    if (action === "generate-estudio") {
        const { mode, projectId, item } = objectAction;
        try {
            const result = await GWV(mode, projectId, item); // Asumir que GWV puede lanzar error o devolver null/estructura
            return result; // o { key: "estudio_key", generated: result } si es necesario adaptar
        } catch (error) {
            console.error("Error en ejecutarAccion (generate-estudio):", error);
            return { key: "estudio_error", generated: { texto: `Error: ${error.message}` } }; // Ejemplo
        }
    }
    if (action === "generate-estrategia") {
        const { mode, projectId, item, estudio } = objectAction;
        try {
            const result = await GWV(mode, projectId, item, estudio);
            return result;
        } catch (error) {
            console.error("Error en ejecutarAccion (generate-estrategia):", error);
            return { key: "estrategia_error", generated: { texto: `Error: ${error.message}` } };
        }
    }
    if (action === "generate-campania") {
        const { mode, projectId, item, estudio, estrategia } = objectAction;
        try {
            const result = await GWV(mode, projectId, item, estudio, estrategia);
            return result;
        } catch (error) {
            console.error("Error en ejecutarAccion (generate-campania):", error);
            return { key: "campania_error", generated: { texto: `Error: ${error.message}` } };
        }
    }
    console.warn(`ejecutarAccion: Acción desconocida '${action}'`);
    return null; // O una estructura de error por defecto
}

// displayTokensModal no se usa actualmente, se podría eliminar o implementar si es necesario.

// -----------------------------------------------
async function getPrice(action) {
    if (!action) {
        console.error("getPrice: Acción no proporcionada.");
        return null;
    }
    try {
        const response = await fetch(`/api/pricing?a=${action}`); // No necesita headers ni method GET por defecto
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Intenta parsear JSON, si falla, objeto vacío
            console.error(`getPrice: Error al obtener precio para '${action}'. Status: ${response.status}, Mensaje: ${errorData.message || response.statusText}`);
            // No usar alert aquí, mejor propagar el error o null.
            return null;
        }
        const jsonPrice = await response.json();
        return jsonPrice.price; // Asume que la API devuelve { price: X }
    } catch (e) {
        console.error(`getPrice: Excepción al obtener precio para '${action}'.`, e);
        return null;
    }
}
// -----------------------------------------------

async function validarSaldo(currentUserEmail) {
    if (!currentUserEmail) {
        console.error("validarSaldo: Email no proporcionado.");
        return null;
    }
    try {
        // El endpoint es /api/user-tokens/[email], no necesita query param 'e=' si se ajusta la API
        // Asumiendo que la API está en /api/user-tokens/[email]
        const response = await fetch(`/api/user-tokens/${currentUserEmail}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`validarSaldo: Error al obtener saldo. Status: ${response.status}, Mensaje: ${errorData.message || response.statusText}`);
            return null;
        }
        const jsonData = await response.json();
        return jsonData.tokens; // Asume { tokens: Y }
    } catch (e) {
        console.error("validarSaldo: Excepción al obtener saldo.", e);
        return null;
    }
}
// -----------------------------------------------

async function descontarTokens(montoADejar, currentUserEmail) {
    // El 'monto' aquí es el saldo final después del descuento, no la cantidad a descontar.
    // La API /api/user-tokens (PUT) debe estar diseñada para SETear el saldo.
    if (typeof montoADejar !== 'number' || montoADejar < 0) {
        console.error("descontarTokens: Monto inválido.", montoADejar);
        return null; // O false para indicar fallo
    }
    if (!currentUserEmail) {
        console.error("descontarTokens: Email no proporcionado.");
        return null;
    }

    const bodyData = JSON.stringify({ tokens: montoADejar }); // La API debe interpretar esto como el nuevo saldo
    try {
        const response = await fetch(`/api/user-tokens/${currentUserEmail}`, { // Asumiendo API RESTful
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: bodyData,
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`descontarTokens: Error al actualizar tokens. Status: ${response.status}, Mensaje: ${errorData.message || response.statusText}`);
            return null; // O false
        }
        return await response.json(); // O true si la API devuelve el usuario actualizado o un success
    } catch (e) {
        console.error("descontarTokens: Excepción al actualizar tokens.", e);
        return null; // O false
    }
}
// -----------------------------------------------

// historyTokens no se usa, se podría eliminar.

// -----------------------------------------------

async function rollBackTokens(saldoOriginal, currentUserEmail) {
    // Esta función es esencialmente la misma que descontarTokens si la API SETea el saldo.
    console.log(`rollBackTokens: Restaurando saldo a ${saldoOriginal} para ${currentUserEmail}`);
    return await descontarTokens(saldoOriginal, currentUserEmail); // Reutilizar descontarTokens
}

// main?
<<<<<<< HEAD
async function useTokens(action, objectAction) {
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email;

    if (!currentUserEmail) {
        throw new Error("El usuario no está autenticado.");
=======
async function useTokens(action, objectAction, email) { // email ahora es un parámetro obligatorio
    if (!email) {
        console.error("useTokens: Email del usuario no proporcionado.");
        // Considerar lanzar un error o devolver una estructura de error estándar.
        // No usar alert, ya que este código puede correr en contextos no UI.
        return { key: action, generated: { texto: "Error: Usuario no identificado.", imagen: null } };
>>>>>>> f257cb1c42ba8354c9a78354d4a2a253e59decf3
    }

    const price = await getPrice(action);
    if (price === null) { // getPrice ahora devuelve null en error
        console.error(`useTokens: No se pudo obtener el precio para la acción '${action}'.`);
        return { key: action, generated: { texto: `Error: No se pudo determinar el costo de la acción.`, imagen: null } };
    }

    const saldoActual = await validarSaldo(email);
    if (saldoActual === null) {
        console.error(`useTokens: No se pudo validar el saldo para el usuario '${email}'.`);
        return { key: action, generated: { texto: `Error: No se pudo verificar el saldo.`, imagen: null } };
    }

    if (saldoActual >= price) {
        const saldoDespuesDelDescuento = saldoActual - price;
        const descuentoExitoso = await descontarTokens(saldoDespuesDelDescuento, email);

        if (descuentoExitoso) { // Asumiendo que descontarTokens devuelve algo truthy en éxito
            const resultadoAccion = await ejecutarAccion(action, objectAction);

            // Verificar si la acción falló (ej. resultadoAccion.generated.texto contiene "Error:")
            if (resultadoAccion && resultadoAccion.generated && typeof resultadoAccion.generated.texto === 'string' && resultadoAccion.generated.texto.startsWith("Error:")) {
                console.warn(`useTokens: La acción '${action}' se ejecutó pero resultó en un error. Intentando rollback.`);
                await rollBackTokens(saldoActual, email); // Devolver tokens al saldo original
                return resultadoAccion; // Devolver el error de la acción
            }

            if (resultadoAccion && resultadoAccion.key != null) { // Chequeo más robusto
                return resultadoAccion;
            } else {
                console.error(`useTokens: Fallo en la ejecución de la acción '${action}' después del descuento. Intentando rollback.`);
                await rollBackTokens(saldoActual, email); // Devolver tokens al saldo original
                return {
                    key: action,
                    generated: {
                        texto: "Oops! Fallo en la generación de contenido. Tus tokens han sido restaurados. Inténtalo de nuevo.",
                        imagen: null
                    }
                };
            }
        } else {
            console.error(`useTokens: Error al descontar tokens para la acción '${action}'.`);
            return { key: action, generated: { texto: "Error: No se pudieron descontar los tokens.", imagen: null } };
        }
    } else {
        console.warn(`useTokens: Saldo insuficiente para la acción '${action}'. Saldo: ${saldoActual}, Precio: ${price}`);
        return { key: action, generated: { texto: "Saldo Insuficiente.", imagen: null } }; // Estructura consistente
    }
}

export { useTokens, validarSaldo, getPrice, devTool };