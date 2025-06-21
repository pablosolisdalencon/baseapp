import { useSession } from "next-auth/react";
import React from "react";   


// fx consumeTokens
// validarSaldo
// ejecutar accion
// rollback tokens
// descontar tokens

// --- DEV TOOL --------------------------------------------
async function devTool(objectAction){
    console.log("##@@ DEV TOOLS")
    console.log(objectAction)
    /*
      
    
    

    // PRICING : const bodyData =  JSON.stringify({ actionName: 'generate-post', price: 1})
    const bodyData =  JSON.stringify({ tokens: 110, email: currentUserEmail})
    const response = await fetch(`/api/user-tokens`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: bodyData,
    });
    console.log(response)
    //return response.data.price
    */
}
// -----------------------------------------------


//-------- ACCIONES --------------
const generatePost = async (post) => {
    console.log("###### generate POST > post")
    console.log(post)
    try 
    {
      let bodyData = JSON.stringify({  item: 'post-final', post: post });
      let bodyData_img = JSON.stringify({  item: 'post-final-img', post: post });
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
          // Si la respuesta es 200 OK, asumimos que el item fue encontrado.
          // La API debería devolver los datos del item directamente.
          const res  = await response.json();
          //  FIN OK
          //-------------------------/
          const texto_final = res[0].texto;
          
          if (response_imagen.ok) {
            // Si la respuesta es 200 OK, asumimos que el item fue encontrado.
            // La API debería devolver los datos del item directamente.
            const res_img  = await response_imagen.json();
            //  FIN OK
            //-------------------------/
            const imagen_final = res_img[0].data;
            const response_final = {
              texto: texto_final,
              imagen: imagen_final
            }
            //-------------------------/
            return response_final
  
          } else if (response_imagen.status === 404) {
            // Si la API devuelve 404 Not Found, significa que no existe La api o seting para este artefacto?.
            return null
          } else {
            // Manejo de otros posibles errores de la API
            const errorData = await response_imagen.json();
            throw new Error(errorData.message || `generatePostImagen Error al crear ) = status[${response.status}] StatusText [${response.statusText}]`);
          }
          //-------------------------/
          

        } else if (response.status === 404) {
          // Si la API devuelve 404 Not Found, significa que no existe La api o seting para este artefacto?.
          return null
        } else {
          // Manejo de otros posibles errores de la API
          const errorData = await response.json();
          throw new Error(errorData.message || `generatePost Error al crear) = status[${response.status}] StatusText [${response.statusText}]`);
        }

    } catch (error) {
        console.error(` generatePost    Fallo al crear )`, error);
        // Relanza el error para que el componente lo maneje en el estado `error`
        throw new Error(`generatePost   No se pudo crear)`);
    }
  };

  const GeneratePost = async ({week, day, post}) => {
    const getKey = (week, day) =>
        `${week}_${day}`;

      const key = getKey(week, day);
      
      try {
        //  AI API call for content generation
       
        const generated=  await generatePost(post);

        console.log("##$$## generated ##$$##")
        console.log(generated)
           return {key, generated}
      } catch (err) {
        console.error(`Error generating content for ${key}:`, err);
        return null
        // Handle generation error (e.g., display error message to user)
      } finally {
        
      }
    };
//----------------------


async function ejecutarAccion(action,objectAction){
    
    if(action=="generate-post"){
        const {key, generated} = await GeneratePost(objectAction)
        console.log("888 generated 888")
        console.log(generated)
        if(key!=null){
            return {key, generated}
        }else{
            return null
        }
    }
    
}

function displayTokensModal(data){
    return(
        <>
            <div>
                <h1>{data.action}</h1>
                <p>{data.mensaje}</p>
                <button>Cerrar</button>
            </div>


        </>
    )
}
// -----------------------------------------------
async function getPrice(action){
    try{
    const price = await fetch(`/api/pricing?a=${action}`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if(!price.ok){
        alert("PRECIO ERROR GETING:")
      }else{
        const jsonPrice = await price.json();
        const precio = jsonPrice.price  
        //alert("PRECIO:"+precio)
        return precio
      }
      
    }catch(e){
        //alert("errorazo in getPrice:"+e)
    }
}
// -----------------------------------------------





// -----------------------------------------------
async function validarSaldo(currentUserEmail){    
    const bodyData =  JSON.stringify({ email: currentUserEmail})
    try{
        const saldo = await fetch(`/api/user-tokens?e=${currentUserEmail}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                }
            });
          if(!saldo.ok){
            //alert("SALDO ERROR:")
          }else{         
            const jsonData= await saldo.json();
            return jsonData.tokens;
          }
          
        return null

    }catch(e){
        //alert("SALDO ERROR PRINCIPAL:"+e)
    }
    
}
// -----------------------------------------------




// -----------------------------------------------
async function descontarTokens(monto,currentUserEmail){
    const bodyData =  JSON.stringify({ tokens: monto, email: currentUserEmail})
    const response = await fetch(`/api/user-tokens`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: bodyData,
    });

    return response
}
// -----------------------------------------------





// -----------------------------------------------
function historyTokens(){
    alert("historyTokens")
}
// -----------------------------------------------





function rollBackTokens(){
    alert("rollBackTokens")
    return null
}


// main?
async function useTokens(action,objectAction,currentUserEmail){
    devTool(objectAction);

    // flow

        // 1 - getPrice
    let price = await getPrice(action)
    if(price!=null){
        // 2 - validarSaldo
        let saldo = await validarSaldo(currentUserEmail)

        //alert(`SALDO ${saldo}  PRICE ${price}`)
        if(saldo >= price){
            // SALDO SUFICIENTE: Continuar el flow
            //alert("SALDO SUFICIENTE")
            // 3 - Descuento
            let montofinal = saldo - price
            //alert("Monto Final: "+montofinal)
            let descuento = descontarTokens(montofinal,currentUserEmail)
            if(descuento!=null){
                // descuento OK
                //alert("DESCONTADO OK!")
                // 4 - ejecutar Accion
                let {key, generated} = await ejecutarAccion(action,objectAction)
                console.log("##$$## generated (main)##$$##")
                console.log(key)
                if(key!=null){
                    // accion Done! FIN
                    return {key, generated} 
                }else{
                    // 5! -  Error en accion : roll back tokens
                    let rollback = rollBackTokens(descuento)
                    if(rollback!=null){
                        // rollback ok
                        return rollback
                    }else{
                        // error en rollback. CRITICO.
                        // ?
                        return {key, generated}
                    }
                }

            }else{
                //error descontando
                alert("error descontando")
                return null
            }







        }else{
            // SALDO NO ALCANZA: Fin y mensaje
            alert("Saldo Insuficiente")
            return null
        }
    }else{
        // error consultando precio
        //error descontando
        alert("error descontando")
        return null

    }


}

export default useTokens 