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

          if(data[0]){
            console.log(`getDataItem verify OK =======================`)
            console.log(data)

            //-------------------------/
            //  FIN OK
            //-------------------------/
            return data[0];
            //-------------------------/
          }else{
            console.log(`getDataItem ${item}: idProyecto(${projectId} Not Found =======================`)
          return null
          }
          

        } else if (response.status === 404) {
          // Si la API devuelve 404 Not Found, significa que no existe el estudio para ese proyecto.
          console.log(`getDataItem verify 404 ${item}: idProyecto(${projectId} Not Found =======================`)
          return null
        } else {
          // Manejo de otros posibles errores de la API
          const errorData = await response.json();
          throw new Error(errorData.message || `getDataItem Error al verificar ${item}: idProyecto(${projectId}) = status[${response.status}] StatusText [${response.statusText}]`);
        }

    } catch (error) {
        console.error(` getDataItem Fallo al verificar ${item}: idProyecto(${projectId})`, error);
        // Relanza el error para que el componente lo maneje en el estado `error`
        throw new Error(`getDataItem No se pudo verificar ${item}: idProyecto(${projectId}) ${error.message}`);
    }
}
async function getDataMaker(projectId,item){
    try 
    {
        const response = await fetch(`/api/maker?p=${projectId}`, {
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

          if(data){
            console.log(`getDataItem verify OK =======================`)
            console.log(data)

            //-------------------------/
            //  FIN OK
            //-------------------------/
            return data[0];
            //-------------------------/
          }else{
            console.log(`getDataItem ${item}: idProyecto(${projectId} Not Found =======================`)
          return null
          }
          

        } else if (response.status === 404) {
          // Si la API devuelve 404 Not Found, significa que no existe el estudio para ese proyecto.
          console.log(`getDataItem verify 404 ${item}: idProyecto(${projectId} Not Found =======================`)
          return null
        } else {
          // Manejo de otros posibles errores de la API
          const errorData = await response.json();
          throw new Error(errorData.message || `getDataItem Error al verificar ${item}: idProyecto(${projectId}) = status[${response.status}] StatusText [${response.statusText}]`);
        }

    } catch (error) {
        console.error(` getDataItem Fallo al verificar ${item}: idProyecto(${projectId})`, error);
        // Relanza el error para que el componente lo maneje en el estado `error`
        throw new Error(`getDataItem No se pudo verificar ${item}: idProyecto(${projectId}) ${error.message}`);
    }
}

async function useWilli(projectId,item,maker,estudio,estrategia){
  let bodyData = JSON.stringify({  item: item, maker: maker, estudio: estudio, estrategia: estrategia });
  /*  
  let bodyData;
    if(item=='estudio-mercado'){
        bodyData = JSON.stringify({  item: item,maker: maker });
    }else if(item=='estrategia-marketing'){
        bodyData = JSON.stringify({  item: item,maker: maker, estudio: estudio });
    }else if(item=='campania-marketing'){
        bodyData = JSON.stringify({  item: item, maker: maker, estudio: estudio, estrategia: estrategia });
    }else{
        // SERA UN POST?
        console.log("LLEGAMOS AL POST!!! bodyData");
        console.log(bodyData);
        
    }
  */

 console.log("===============  useWilli Say   bodyData   ===============")
 console.log(bodyData)
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

          console.log(`useWilli ${item} generado OK ? =======================`)
          console.log(res)
          //-------------------------/
          //  FIN OK
          //-------------------------/
          return res;
          //-------------------------/

        } else if (response.status === 404) {
          // Si la API devuelve 404 Not Found, significa que no existe La api o seting para este artefacto?.
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

export default async function GWV(mode,projectId,item,estudio,estrategia){
   


    


    
    if(mode=='check'){
      console.log(`=======  GWV  > getDataItem(${projectId},${item})=======`)
      if(item=="maker"){
        var verifyData = await getDataMaker(projectId,item)
      }else{
        var verifyData = await getDataItem(projectId,item)
      }
      

      console.log(`=======  GWV  > if(${verifyData}==null))=======`)
      if(verifyData==null){
          return null
      }else{
        // show JSON Response
        return verifyData;
      }
    }else if(mode=='generate'){
      const maker = await getDataMaker(projectId,'maker')
      if(maker){  
        const data = await useWilli(projectId,item,maker,estudio,estrategia);
        if(data){
          console.log(`GWV.${item} UseWilli data:`)
          console.log(data)
          return data
        }else{
          console.log(`GWV.${item} UseWilli else... no hay data:`)
          console.log(data)
          return null
        }
        
      }else{
        console.log(`GWV.${item} ERROR making for generate `)
        return null
      }  
    }
    

}