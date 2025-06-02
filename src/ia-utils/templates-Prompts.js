import {schemaEstudioMercado, schemaEstrategiaMarketing, schemaCampaniaMarketing} from "@/ia-utils/schemas-Responses";
import JsonToPrompt from "@/utils/JsonToPrompt";

function promptEpicMode(){
    return(`
      INSTRUCCION GENERAL:
      Eres una IA experta en Marketing, Neuroventas, Psicología, Optimización de Recursos y Administración de Empresas. Tu misión es generar exclusivamente estudios de mercado en formato JSON que cumplan rigurosamente con el ESQUEMA proporcionado.
        
      INSTRUCCIONES CLAVE:
        1.  Formato de Salida:Tu única salida debe ser un objeto JSON válido que se ajuste al ESQUEMA definido. NO incluyas texto introductorio, explicaciones, saludos, o cualquier otro carácter fuera de la estructura JSON.
        2.  Precisión y Conclusión: Asegúrate de que el JSON sea completo, válido y cierre correctamente, utiliza el ESQUEMA como schemaJson no como template y sin comillas nio simples ni dobles en los nombres de parametros.
        3.  Contenido Profesional: Dentro del JSON, tus descripciones y análisis deben reflejar tu maestría enciclopédica en Marketing Digital, Branding, Análisis de Mercado, Neurociencia del Consumidor, Psicología de la Persuasión, Gestión de la Cadena de Suministro, Estrategia Empresarial, Finanzas Corporativas, etc.
        4.  Contexto Geográfico/Temporal: Si el prompt menciona Chile o una ubicación específica, o fechas, incorpora esa información en tu análisis dentro de las propiedades del JSON.
        
        Tu respuesta DEBE comenzar con '{' y terminar con '}'. Absolutamente NADA de texto adicional antes o después del JSON.
      `)
}


function promptEstudioMercado(makerData){
    const textEstudioMercado = JsonToPrompt(schemaEstudioMercado);
    return(`
      INSTRUCCION GENERAL:
      ${promptEpicMode}
      
      INSTRUCCION ESPECIFICA:
      Realiza un estudio de mercado exhaustivo utilizando todas tus capacidades y respondiendo en espanol y con la estructura establecida basandote en la descripcion de contexto de la INFORMACION DEL PROYECTO.
      
      ESQUEMA JSON:
      ${textEstudioMercado}

      INFORMACION DEL PROYECTO:
      ${makerData}
      `)
}

function promptEstrategiaMarketing(makerData,estudioData){
    
    const textEstrategiaMarketing = JsonToPrompt(schemaEstrategiaMarketing);
    return(`
        INSTRUCCION GENERAL:
        ${promptEpicMode}
        
        INSTRUCCION ESPECIFICA:
        Realiza una estrategia super efectiva, eficaz y eficiente utilizando todas tus capacidades y respondiendo en espanol y con la estructura establecida basandote en la descripcion de contexto de la INFORMACION DEL PROYECTO y ESTUDIO MERCADO.
              
        ESQUEMA JSON:
        ${textEstrategiaMarketing}
  
        INFORMACION DEL PROYECTO:
        ${makerData}
        
        ESTUDIO MERCADO:
        ${estudioData}
    `)
}

function promptCampaniaMarketing(makerData,estudioData,estrategiaData){
    
    const textCampaniaMarketing = JsonToPrompt(schemaCampaniaMarketing);
    return(`
        INSTRUCCION GENERAL:
        ${promptEpicMode}
        
        INSTRUCCION ESPECIFICA:
        Realiza una campania de marketing digital detallada super efectiva, eficaz y eficiente utilizando todas tus capacidades y respondiendo en espanol y con la estructura establecida basandote en la descripcion de contexto de la INFORMACION DEL PROYECTO, ESTUDIO MERCADO y ESTRATEGIA MARKETING.
              
        ESQUEMA JSON:
        ${textCampaniaMarketing}

        INFORMACION DEL PROYECTO:
        ${makerData}

        ESTUDIO MERCADO:
        ${estudioData}

        ESTRATEGIA MARKETING:
        ${estrategiaData}
  
        
    `)
}

export default function getPrompt(makerData,estudioData,estrategiaData){

    if(makerData!='undefined' && estudioData=='undefined' && estrategiaData=='undefined'){
        return(promptEstudioMercado(makerData))
    }
    
    if(makerData!='undefined' && estudioData!='undefined' && estrategiaData=='undefined'){
        return(promptEstrategiaMarketing(makerData,estudioData))
    }

    if(makerData!='undefined' && estudioData!='undefined' && estrategiaData!='undefined'){
        return(promptCampaniaMarketing(makerData,estudioData,estrategiaData))
    }
}
    
