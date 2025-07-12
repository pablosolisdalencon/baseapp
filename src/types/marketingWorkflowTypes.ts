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
  id_proyecto: string,
  nombre_estrategia: string;
  objetivos_generales: ObjetivoGeneral[];
  analisis_mercado_target: AnalisisMercadoTarget;
  pilares_estrategicos: PilarEstrategico[];
  canales_y_tacticas_iniciales: CanalYTacticaInicial[];
  plan_de_accion_fase_1: PlanDeAccionFase1Item[];
  consideraciones_adicionales: string[];
}


   //////////  fin estructura estrategia marketing

// Definición para la estructura de 'definicion_arte'
export interface DefinicionArte {
  estilo_narracion: string;
  colores: string;
  grafica_representativa_campania: string;
}

// Definición para la estructura de un 'post'
export interface Post {
  objetivo: string;
  definicion_arte: string;
  titulo: string;
  tema: string;
  texto: string;
  cta: string;
  imagen: string; // Descripción de la imagen representativa propuesta para el post
  hora: string;   // Formato HH:MM
  canal: string;
  estado: string;
  fundamento: string;
  recomendacion_creacion: string;
  recomendacion_publicacion_seguimiento: string;
}

// Definición para la estructura de un 'dia'
export interface Dia {
  nombre: string; // Nombre del día de la semana (ej. 'Lunes')
  fecha: string;  // Formato YYYY-MM-DD
  post: Post;     // Un objeto de tipo Post
}

// Definición para la estructura de una 'semana'
export interface Semana {
  numero: number;
  dias: Dia[]; // Un array de objetos de tipo Dia
}

// Definición del esquema principal 'JsonFinalCampania'
export interface CampaniaMarketingData {
  id_proyecto: string,
  nombre: string;
  objetivo: string;
  target: string;
  tematica: string;
  definicion_arte: DefinicionArte;
  duracion: number; // Duración total en días
  fecha_inicio: string; // Formato YYYY-MM-DD
  fecha_fin: string;    // Formato YYYY-MM-DD
  contenido: Semana[]; // Un array de objetos de tipo Semana
}

export interface CampaniaMarketingPageProps {
    params:{
      p: any; // El dato genérico puede ser de cualquier tipo definido arriba o null
    } 
  }
  
export interface MarketingContentManagerProps {
  CampaniaMarketingData: CampaniaMarketingData | null;
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

