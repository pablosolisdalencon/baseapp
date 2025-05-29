import GET from "../../utils/GET"
import williConsole from 
const idProyecto="";
const url = `api/estudio-mercado?${idProyecto}`


 function williViewer(data:string){
    return(
        <div>
            <{data}/>
        </div>
    )
 }

export default function Work({step}){

    const [ apiData, setApiData]
    const url = step.url;
    
    const getData = GET(url);
    if (getData){
        // esto existe
        // esto se muestra
        williViewer();
    }else{
        //esto no existe
        // debe crearse
        makeData();
    }




}

