 //////////  ESTRUCTURA MAKER DATA
// Tipos para los datos simulados de la API de Willi
export interface MakerData {
    id_proyecto: string;
    producto: string;
    mercadoObjetivo: string;
    propuestaValor: string;
    fecha: string; // ISO string
  }
  

  //////////  ESTRUCTURA ESTUDIO MERCADO
  export interface Tendencia {
    nombre: string;
    descripcion: string;
    relevancia: string;
  }
  
  export interface Oportunidad {
    nombre: string;
    descripcion: string;
    alineacion: string;
  }
  
 export interface Desafio {
    nombre: string;
    descripcion: string;
  }
  
  // Estructura completa del objeto EstudioMercado
  export interface EstudioMercadoData {
    id_proyecto: string,
    nombre_del_estudio: string;
    resumen_competitivo: string;
    tendencias_clave_mercado: Tendencia[];
    oportunidades_principales: Oportunidad[];
    desafios_clave: Desafio[];
    recomendaciones_iniciales: string;
  }

/////////////// fin estructura estudio mercado
  
  
  


 //////////  ESTRUCTURA ESTRATEGIA MARKETING
  export interface EstrategiaMarketingData {
    id?: string;
    id_proyecto?: string;
    objetivosPrincipales?: string;
    publicoObjetivo?: string;
    propuestaValor?: string;
    canalesdistribucion?: string;
    metricas?: string;
    generadoPor?: string;
    fecha?: string; // ISO string
    // Propiedades simuladas para la BD:
    objetivos?: string;
    tacticas?: string;
  }
   //////////  fin estructura estrategia marketing



  export interface CampaniaMarketingData {
    id?: string;
    id_proyecto?: string;
    nombreCampania?: string;
    fasesEjecucion?: string;
    creatividad?: string;
    presupuestoDetalle?: string;
    cronograma?: string;
    generadoPor?: string;
    fecha?: string; // ISO string
    // Propiedades simuladas para la BD:
    nombre?: string;
    canales?: string;
    presupuesto?: string;
  }
  
  // Tipos para las props de los componentes Display
  export interface DisplayProps<T> {
    Input: T | null; // El dato genérico puede ser de cualquier tipo definido arriba o null
    onSave?: (data: T) => Promise<void>; // onSave es una función asíncrona que toma el dato T
    showSaveButton?: boolean;
  }
  
  // Tipos para la respuesta general de callWilliAPI
  export type WilliAPIResponse = EstudioMercadoData | EstrategiaMarketingData | CampaniaMarketingData;
  
  // Tipos para los pasos del workflow
  export interface WorkflowStep {
    number: number;
    title: string;
    completed: boolean;
  }

