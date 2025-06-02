import jsonToPrompt from "./JsonToPrompt";
import jsonPure from "./jsonPure";

async function getDataItem(projectId,item){
    try 
    {
        const response = await fetch(`/api/${item}?p=${projectId}`, {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          // Si la respuesta es 200 OK, asumimos que el item fue encontrado.
          // La API debería devolver los datos del item directamente.
          const res  = await response.json();
          const data = res.data;
          console.log(`verifyDataItem verify OK =======================`)
          console.log(data)
          //-------------------------/
          //  FIN OK
          //-------------------------/
          return data;
          //-------------------------/

        } else if (response.status === 404) {
          // Si la API devuelve 404 Not Found, significa que no existe el estudio para ese proyecto.
          console.log(`verifyDataItem verify 404 ${item}: idProyecto(${projectId} Not Found =======================`)
          return null
        } else {
          // Manejo de otros posibles errores de la API
          const errorData = await response.json();
          throw new Error(errorData.message || `verifyDataItem Error al verificar ${item}: idProyecto(${projectId}) = status[${response.status}] StatusText [${response.statusText}]`);
        }

    } catch (error) {
        console.error(` verifyDataItem Fallo al verificar ${item}: idProyecto(${projectId})`, error);
        // Relanza el error para que el componente lo maneje en el estado `error`
        throw new Error(`verifyDataItem No se pudo verificar ${item}: idProyecto(${projectId}) ${error.message}`);
    }
}

async function useWilli(projectId,item,maker,estudio,estrategia){
    
    let bodyData;
    if(item=='estudio-mercado'){
        bodyData = JSON.stringify({  maker: maker });
    }else if(item=='estrategia-marketing'){
        bodyData = JSON.stringify({  maker: maker, estudio: estudio });
    }else if(item=='campania-marketing'){
        bodyData = JSON.stringify({  maker: maker, estudio: estudio, estrategia: estrategia });
    }else{
        // SERA UN POST?
        console.log("LLEGAMOS AL POST!!! bodyData");
        console.log(bodyData);
        
    }
    
    try 
    {
        const response = await fetch(`/api/willi`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: bodyData,
        });
    
        if (response.ok) {
          // Si la respuesta es 200 OK, asumimos que el item fue encontrado.
          // La API debería devolver los datos del item directamente.
          const res  = await response.json();

          const data = res.data;
          console.log(`useWilli ${item} generado OK =======================`)
          console.log(res)
          //-------------------------/
          //  FIN OK
          //-------------------------/
          return data;
          //-------------------------/

        } else if (response.status === 404) {
          // Si la API devuelve 404 Not Found, significa que no existe el estudio para ese proyecto.
          console.log(`useWilli ${item}   404 Not Found =======================`)
          return null
        } else {
          // Manejo de otros posibles errores de la API
          const errorData = await response.json();
          throw new Error(errorData.message || `useWilli ${item}  Error al crear ${item}: idProyecto(${projectId}) = status[${response.status}] StatusText [${response.statusText}]`);
        }

    } catch (error) {
        console.error(` useWilli ${item}  Fallo al crear ${item}: idProyecto(${projectId})`, error);
        // Relanza el error para que el componente lo maneje en el estado `error`
        throw new Error(`useWilli ${item}  No se pudo crear ${item}: idProyecto(${projectId}) ${error.message}`);
    }
}

export default async function GWV(projectId,item,estudio,estrategia){
    console.log(`============  GWV  ===============`)
    console.log(`GWV.${item} id: !${projectId}! `)
    console.log(`GWV. estudio:!${estudio}!`)
    console.log(`GWV. estrategia !!${estudio}!!`)


    console.log(`=======  GWV  > getDataItem(${projectId},${item})=======`)
    const verifyData = await getDataItem(projectId,item)

    console.log(`=======  GWV  > if(${verifyData}==null))=======`)
    if(verifyData==null){

        console.log(`=======  GWV  > is null?????))=======`)
        const data = await useWilli(projectId,item,estudio[0],estrategia[0]);
        if(data){
            // estudio creado
            console.log(`GWV.${item} OK!! generado !!`)
            return jsonPure(data);

        }else{
            console.log(`GWV.${item} ERROR generando etsudio:${estudio} estrategia:${estrategia}`)
            return null
        }            
        // si : save JOSN in Response
    }else{
        // show JSON Response
        return verifyData;
    }
    

}