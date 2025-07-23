// src/app/lib/marketingWorkflowTypes.ts

////////// ESTRUCTURA MAKER DATA
export interface ProyectoData {
  _id: string;
  nombre: string;
  texto: string;
  frase: string;
  descripcion: string;
  mision: string;
  vision: string;
  logo: string;
  fondo: string;
  __v: number;
}

export interface ProductoServicio {
  _id: string;
  id_proyecto: string;
  nombre: string;
  descripcion: string;
  precio: string;
  foto: string;
  __v: number;
}

export interface MakerData {
  proyecto: ProyectoData;
  catalogo: ProductoServicio[];
}

////////// ESTRUCTURA ESTUDIO MERCADO
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
  id_proyecto: string;
  nombre_del_estudio: string;
  resumen_competitivo: string;
  tendencias_clave_mercado: Tendencia[];
  oportunidades_principales: Oportunidad[];
  desafios_clave: Desafio[];
  recomendaciones_iniciales: string;
}

/////////////// fin estructura estudio mercado

////////// ESTRUCTURA ESTRATEGIA MARKETING
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
  id_proyecto: string;
  nombre_estrategia: string;
  objetivos_generales: ObjetivoGeneral[];
  analisis_mercado_target: AnalisisMercadoTarget;
  pilares_estrategicos: PilarEstrategico[];
  canales_y_tacticas_iniciales: CanalYTacticaInicial[];
  plan_de_accion_fase_1: PlanDeAccionFase1Item[];
  consideraciones_adicionales: string[];
}

////////// fin estructura estrategia marketing

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

// Definición del esquema principal 'CampaniaMarketingData'
export interface CampaniaMarketingData {
  id_proyecto: string;
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

// Tipos para las props de los componentes Display
export interface DisplayProps<T> {
  Input: T | null; // El dato genérico puede ser de cualquier tipo definido arriba o null
  onSave?: (data: T) => Promise<void> | void; // onSave es una función asíncrona que toma el dato T
  onOptimize?: (data: T) => Promise<void> | void; // onOptimize para el botón "Willi, Optimizalo!"
  onRetry?: (data: T) => Promise<void> | void; // onRetry para el botón "Reintentar"
  showSaveButton?: boolean;
  showOptimizeButton?: boolean;
  showRetryButton?: boolean;
  isRetryDisabled?: boolean;
}

// Tipos para un Post ya generado con texto e imagen
export interface GeneratedPost {
  id: string;
  originalPostData: Post; // Referencia a los datos originales del Post
  text: string;
  image: string | null; // Base64 string
}

// Tipos para la respuesta de la Server Action de generación completa
export interface EwavePackGenerationResult {
  makerData: MakerData | null;
  estudioMercado: EstudioMercadoData | null;
  estrategiaMarketing: EstrategiaMarketingData | null;
  campaniaMarketing: CampaniaMarketingData | null;
  generatedPosts: GeneratedPost[];
  error: string | null;
}
export interface WilliEwavePackGeneratorProps {
  idProyecto:string | null | any; // El dato genérico puede ser de cualquier tipo definido arriba o null
}

export interface EwaveMakerPageProps {
  params:Promise<{
      p: string; // El dato genérico puede ser de cualquier tipo definido arriba o null
    }>
}
export interface PageProps {
  params:Promise<{
      p: string|null|any; // El dato genérico puede ser de cualquier tipo definido arriba o null
    }>
}
export interface ClientProps {
  idProyecto:string | null | any; // El dato genérico puede ser de cualquier tipo definido arriba o null
}

// Tipos para los pasos del workflow en la UI
export type GenerationStatus =
  'idle' | 'generating_maker_data' | 'generating_estudio' | 'generating_estrategia' |
  'generating_campania' | 'generating_posts' | 'complete' | 'error';

export interface eWaveWorkflowStep {
  key: GenerationStatus;
  title: string;
  description: string;
}


  // Tipos para la respuesta general de callWilliAPI
  export type WilliAPIResponse = EstudioMercadoData | EstrategiaMarketingData | CampaniaMarketingData;
  
  // Tipos para los pasos del workflow
  export interface WorkflowStep {
    number: number;
    title: string;
    completed: boolean;
  }

export interface CampaniaMarketingPageProps {
    params:Promise<{
      p: string; // El dato genérico puede ser de cualquier tipo definido arriba o null
    }>
  }
  
export interface MarketingContentManagerProps {
  CampaniaMarketingData: CampaniaMarketingData | null;
}