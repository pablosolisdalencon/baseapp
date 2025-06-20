




// fx consumeTokens
// validarSaldo
// ejecutar accion
// rollback tokens
// descontar tokens

// --- DEV TOOL --------------------------------------------
async function devTool(){
    

    const bodyData = { actionName: 'generate-post', price: 1}
    const response = await fetch(`/api/pricing`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: bodyData,
    });

    //return response.data.price
}
// -----------------------------------------------



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
    alert("getPrice")

    const price = await fetch(`/api/price?a=${action}`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
      });

    return price.data.price
}
// -----------------------------------------------





// -----------------------------------------------
function validarSaldo(){
    alert("validarSaldo")
}
// -----------------------------------------------




// -----------------------------------------------
function descontarTokens(price){
    alert("descontarTokens:"+price)
    let transaction = "transactionCode" // esto lo retorna el Update Tokens
    if (transaction!=null){
        let saveTransaction = historyTokens(price)
    }
}
// -----------------------------------------------





// -----------------------------------------------
function historyTokens(){
    alert("historyTokens")
}
// -----------------------------------------------



function ejecutarAccion(action){
    alert("ejecutarAccion: "+action)
}



function rollBackTokens(){
    alert("rollBackTokens")
}


// main?
export default function useTokens(action,objectAction){
    devTool();
    alert("useTokens")

    // flow

        // 1 - getPrice
    let price = getPrice(action)
    if(price!=null){
        // 2 - validarSaldo
        let saldo = validarSaldo(price)

        if(saldo >= price){
            // SALDO SUFICIENTE: Continuar el flow

            // 3 - Descuento
            let descuento = descontarTokens(price)
            if(descuento!=null){
                // descuento OK
                // 4 - ejecutar Accion
                let exec = ejecutarAccion(action,objectAction)
                if(exec!=null){
                    // accion Done! FIN
                    return exec
                }else{
                    // 5! -  Error en accion : roll back tokens
                    let rollback = rollBackTokens(descuento)
                    if(rollback!=null){
                        // rollback ok
                        return rollback
                    }else{
                        // error en rollback. CRITICO.
                        // ?
                        return "ERROR ACTION Y EN ROLLBACK"
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

 