import {Schema, model, models} from 'mongoose';

const estudioMercadoSchema = new Schema({
  id_proyecto: {
    type: String,
    required: [true,'El id_proyecto es requerido'],
  },
  nombre_del_estudio: String,
  fecha_de_realizacion: Date,
  analisis_de_la_competencia: {
    descripcion_general: String,
    competidores: [
      {
        nombre: String,
        descripcion_oferta: String,
        fortalezas: [String],
        debilidades: [String],
        presencia_online: {
          sitio_web: String,
          redes_sociales: [String],
          estrategias_digitales_observadas: [String]
        },
        presencia_offline: String,
        cuota_de_mercado_estimada: String
      }
     
    ],
    resumen_competitivo: String
  },
  tendencias_del_mercado_de_renovacion_de_fachadas: {
    descripcion_general: String,
    tendencias: [
      {
        nombre: String,
        descripcion: String,
        relevancia_para_el_proyecto: String
      }
      
    ],
    proyecciones_futuras: String
  },
  oportunidades_para_el_proyecto: {
    descripcion_general: String, 
    oportunidades: [
      {
        nombre: String, 
        descripcion: String, 
        alineacion_con_el_proyecto: String 
      }
    
    ],
    priorizacion_de_oportunidades: String 
  },
  posibles_desafios_para_el_proyecto: {
    descripcion_general: String, 
    desafios: [
      {
        nombre: String,
        descripcion: String, 
        estrategias_de_mitigacion_sugeridas: [String]
      }
      
    ],
    evaluacion_de_la_severidad_de_los_desafios: String 
  },
  resumen_general_del_mercado: String,
  recomendaciones_iniciales: String
});
export default models.EstudioMercado || model('EstudioMercado', estudioMercadoSchema)