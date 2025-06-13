// types/campaniaMarketingTypes.ts

export interface ObjetivoEspecifico {
    descripcion: string;
    metrica: string; // e.g., 'IMPRESIONES', 'CLICKS', 'VENTAS'
    valor_objetivo: number;
    unidad?: string; // e.g., '%', 'USD', 'unidades'
}

export interface Objetivos {
    objetivo_general: string;
    objetivos_especificos: ObjetivoEspecifico[];
}

export interface Fechas {
    fecha_inicio: string; // ISO date string
    fecha_fin: string; // ISO date string
    duracion_semanas?: number;
}

export interface Demografia {
    edad_min?: number;
    edad_max?: number;
    genero?: string[]; // e.g., ['MASCULINO', 'FEMENINO', 'NO_BINARIO']
    ubicacion?: string[]; // e.g., ['Santiago, Chile', 'Buenos Aires, Argentina']
    idiomas?: string[]; // e.g., ['ESPAÑOL', 'INGLES']
}

export interface AudienciaObjetivo {
    descripcion_general: string;
    demografia?: Demografia;
    intereses?: string[]; // e.g., ['TECNOLOGIA', 'DEPORTES']
    comportamientos?: string[]; // e.g., ['COMPRADORES_ONLINE', 'USUARIOS_MOVILES']
}

export interface Publicacion {
    hora: string; // e.g., '10:00 AM'
    formato: string; // e.g., 'IMAGEN', 'VIDEO_CORTO', 'CARRUSEL', 'TEXTO_IMAGEN'
    plataforma: string[]; // e.g., ['INSTAGRAM', 'FACEBOOK', 'BLOG']
    tematica: string;
    contenido_detallado: string;
    objetivo: string;
    fundamento?: string;
    cta: string; // Call To Action
    hashtags?: string[];
    recursos_necesarios?: string[]; // e.g., ['FOTOS_PRODUCTO', 'VIDEO_ANIMACION']
}

export interface DiaCampania {
    dia_semana: string; // e.g., 'LUNES', 'MARTES'
    publicaciones: Publicacion[];
}

export interface SemanaCampania {
    numero_semana: number;
    objetivo_semanal: string;
    tema_central?: string;
    dias: DiaCampania[];
}

export interface DistribucionPresupuesto {
    contenido_organico?: number;
    publicidad_pagada?: number;
    herramientas?: number;
    personal?: number;
}

export interface Presupuesto {
    total?: number;
    moneda?: string; // e.g., 'USD', 'CLP', 'EUR'
    distribucion?: DistribucionPresupuesto;
}

export interface MetricaPrincipal {
    nombre: string; // e.g., 'IMPRESIONES', 'TASA_DE_CONVERSION', 'ENGAGEMENT_RATE'
    objetivo_valor: number;
    unidad?: string; // e.g., '%', 'unidades', 'ratio'
    frecuencia_medicion?: 'DIARIA' | 'SEMANAL' | 'MENSUAL';
}

export interface MetricaSecundaria {
    nombre: string;
    objetivo_valor: number;
    unidad?: string;
}

export interface Metricas {
    metricas_primarias?: MetricaPrincipal[];
    metricas_secundarias?: MetricaSecundaria[];
}

export interface Herramientas {
    programacion?: string[]; // e.g., 'HOOTSUITE', 'BUFFER'
    analytics?: string[]; // e.g., 'GOOGLE_ANALYTICS', 'FACEBOOK_INSIGHTS'
    diseño?: string[]; // e.g., 'CANVA', 'PHOTOSHOP'
}

export interface EquipoCampania {
    rol: string; // e.g., 'COMMUNITY_MANAGER', 'DISEÑADOR', 'ANALISTA'
    nombre?: string;
    responsabilidades?: string[];
}

export interface RiesgoIdentificado {
    descripcion: string;
    probabilidad: 'baja' | 'media' | 'alta';
    impacto: 'bajo' | 'medio' | 'alto';
    plan_mitigacion?: string;
}

export interface RiesgosContingencias {
    riesgos_identificados?: RiesgoIdentificado[];
    contenido_respaldo?: boolean;
}

export interface ConfiguracionSeguimiento {
    frecuencia_revision?: 'DIARIA' | 'SEMANAL' | 'MENSUAL';
    ab_testing?: boolean;
    optimizacion_tiempo_real?: boolean;
}

export interface KpiEsperado {
    kpi: string; // e.g., 'TRAFICO_WEB', 'LEADS', 'VENTAS'
    valor_actual: number;
    valor_esperado: number;
    incremento_esperado?: number; // percentage
}

export interface ResultadosEsperados {
    kpis_principales?: KpiEsperado[];
}

export interface Metadatos {
    fecha_creacion?: string; // ISO date string
    creado_por?: string;
    version?: string;
    estado?: 'planificada' | 'activa' | 'pausada' | 'finalizada' | 'cancelada';
}

export interface CampaniaMarketingData {
    _id?: string; // Optional, for database ID
    id_proyecto?: string; // Optional
    nombre: string;
    descripcion: string;
    objetivos?: Objetivos;
    fechas?: Fechas;
    audiencia_objetivo?: AudienciaObjetivo;
    plataformas?: string[];
    semanas: SemanaCampania[]; // Array de semanas de planificación
    presupuesto?: Presupuesto;
    metricas?: Metricas;
    herramientas?: Herramientas;
    equipo?: EquipoCampania[];
    riesgos_contingencias?: RiesgosContingencias;
    configuracion_seguimiento?: ConfiguracionSeguimiento;
    resultados_esperados?: ResultadosEsperados;
    metadatos?: Metadatos;
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
}

export interface CampaniaDisplayProps {
    data: CampaniaMarketingData | null;
}