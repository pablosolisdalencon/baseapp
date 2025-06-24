import React from "react";   
import GWV from '@/utils/GWV';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
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
                return null;
            } else {
                const errorData = await response_imagen.json();
                throw new Error(errorData.message || `generatePostImagen Error al crear ) = status[${response.status}] StatusText [${response.statusText}]`);
            }
        } else if (response.status === 404) {
            return null;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || `generatePost Error al crear) = status[${response.status}] StatusText [${response.statusText}]`);
        }
    } catch (error) {
        console.error(` generatePost    Fallo al crear )`, error);
        throw new Error(`generatePost   No se pudo crear)`);
    }
};

const GeneratePost = async ({ week, day, post }) => {
    const getKey = (week, day) => `${week}_${day}`;
    const key = getKey(week, day);

    try {
        const generated = await generatePost(post);
        return { key, generated };
    } catch (err) {
        console.error(`Error generating content for ${key}:`, err);
        return null;
    }
};
//----------------------


async function ejecutarAccion(action, objectAction) {
    if (action == "generate-post") {
        const { key, generated } = await GeneratePost(objectAction);
        if (key != null) {
            return { key, generated };
        } else {
            return null;
        }
    }

    if (action == "generate-estudio") {
        const { mode, projectId, item } = objectAction;
        const { key, generated } = await GWV(mode, projectId, item);
        if (key != null) {
            return { key, generated };
        } else {
            return null;
        }
    }
    if (action == "generate-estrategia") {
        const { mode, projectId, item, estudio } = objectAction;
        const { key, generated } = await GWV(mode, projectId, item, estudio);
        if (key != null) {
            return { key, generated };
        } else {
            return null;
        }
    }
    if (action == "generate-campania") {
        const { mode, projectId, item, estudio, estrategia } = objectAction;
        const { key, generated } = await GWV(mode, projectId, item, estudio, estrategia);
        if (key != null) {
            return { key, generated };
        } else {
            return null;
        }
    }
}

function displayTokensModal(data) {
    return (
        <>
            <div>
                <h1>{data.action}</h1>
                <p>{data.mensaje}</p>
                <button>Cerrar</button>
            </div>
        </>
    );
}
// -----------------------------------------------
async function getPrice(action) {
    try {
        const price = await fetch(`/api/pricing?a=${action}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!price.ok) {
            alert("PRECIO ERROR GETING:");
        } else {
            const jsonPrice = await price.json();
            const precio = jsonPrice.price;
            return precio;
        }
    } catch (e) {
        console.error("Error en getPrice:", e);
    }
}
// -----------------------------------------------


async function validarSaldo(currentUserEmail) {
    const bodyData = JSON.stringify({ email: currentUserEmail });
    try {
        const saldo = await fetch(`/api/user-tokens?e=${currentUserEmail}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!saldo.ok) {
            console.error("SALDO ERROR:");
        } else {
            const jsonData = await saldo.json();
            return jsonData.tokens;
        }
        return null;
    } catch (e) {
        console.error("SALDO ERROR PRINCIPAL:", e);
    }
}
// -----------------------------------------------


async function descontarTokens(monto, currentUserEmail) {
    const bodyData = JSON.stringify({ tokens: monto, email: currentUserEmail });
    const response = await fetch(`/api/user-tokens`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: bodyData,
    });

    return response;
}
// -----------------------------------------------


function historyTokens() {
    alert("historyTokens");
}
// -----------------------------------------------


async function rollBackTokens(monto, currentUserEmail) {
    const bodyData = JSON.stringify({ tokens: monto, email: currentUserEmail });
    const response = await fetch(`/api/user-tokens`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: bodyData,
    });

    return response;
}

// main?
async function useTokens(action, objectAction) {
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email;

    if (!currentUserEmail) {
        throw new Error("El usuario no está autenticado.");
    }

    let price = await getPrice(action);
    if (price != null) {
        let saldo = await validarSaldo(currentUserEmail);

        if (saldo >= price) {
            let montofinal = saldo - price;
            let descuento = descontarTokens(montofinal, currentUserEmail);
            if (descuento != null) {
                let { key, generated } = await ejecutarAccion(action, objectAction);
                if (key != null) {
                    return { key, generated };
                } else {
                    let rollback = rollBackTokens(saldo, currentUserEmail);
                    if (rollback != null) {
                        let generated = {
                            text: "Oops! Fallo en la generacion de contenido, tranquilo, de restauraron tus tokens y puedes volver a intentarlo.",
                            image: "error",
                        };
                        return { key, generated };
                    } else {
                        return { key, generated };
                    }
                }
            } else {
                alert("error descontando");
                return null;
            }
        } else {
            alert("Saldo Insuficiente");
            return null;
        }
    } else {
        alert("error descontando");
        return null;
    }
}

export { useTokens, validarSaldo, getPrice, devTool };