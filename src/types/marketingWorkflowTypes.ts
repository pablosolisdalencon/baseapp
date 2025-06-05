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
// Define los tipos para los objetos anidados
export interface ObjetivoGeneral {
  nombre: string;
  descripcion: string;
  metricas_clave: string[];
}

export interface AnalisisMercadoTarget {
  base_estudio_mercado: string;
  identificacion_target: string;
}

export interface PilarEstrategico {
  nombre: string;
  descripcion: string;
  canales_principales: string[];
}

export interface CanalYTacticaInicial {
  canal: string;
  tacticas: string[];
}

export interface PlanDeAccionFase1Item {
  dia: string;
  descripcion: string;
  responsable: string;
}

// Define el tipo principal para la Estrategia de Marketing
export interface EstrategiaMarketingData {
  nombre_estrategia: string;
  objetivos_generales: ObjetivoGeneral[];
  analisis_mercado_target: AnalisisMercadoTarget;
  pilares_estrategicos: PilarEstrategico[];
  canales_y_tacticas_iniciales: CanalYTacticaInicial[];
  plan_de_accion_fase_1: PlanDeAccionFase1Item[];
  consideraciones_adicionales: string[];
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
    onSave?: (data: T) => Promise<void> | void;// onSave es una función asíncrona que toma el dato T
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

