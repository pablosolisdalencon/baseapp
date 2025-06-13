import {Schema, model, models} from 'mongoose';
const EstudioMercadoSchema = new Schema({
  id_proyecto: {
    type: String,
    required: true,
    trim: false,
    description: "valor de _id en INFORMACION PROYECTO"
  },
  resumen_competitivo: {
    type: String,
    required: true,
    trim: true,
    description: "Resumen de las principales tendencias y la intensidad de la competencia."
  },
  tendencias_clave_mercado: [{
    nombre: {
      type: String,
      required: true,
      trim: true,
      description: "Nombre de la tendencia."
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
      description: "Descripción de la tendencia."
    },
    relevancia: {
      type: String,
      required: true,
      trim: true,
      description: "Relevancia para el proyecto."
    }
  }],
  oportunidades_principales: [{
    nombre: {
      type: String,
      required: true,
      trim: true,
      description: "Nombre de la oportunidad."
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
      description: "Descripción de la oportunidad."
    },
    alineacion: {
      type: String,
      required: true,
      trim: true,
      description: "Cómo se alinea con el proyecto."
    }
  }],
  desafios_clave: [{
    nombre: {
      type: String,
      required: true,
      trim: true,
      description: "Nombre del desafío."
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
      description: "Descripción del desafío."
    }
  }],
  target_objetivo: {
    type: String,
    required: true,
    trim: true,
    description: "Definicion de targets principales basados en el análisis."
  },
  recomendaciones_iniciales: {
    type: String,
    required: true,
    trim: true,
    description: "Recomendaciones iniciales basadas en el análisis."
  }
}, { timestamps: true }); // `timestamps` añade `createdAt` y `updatedAt` automáticamente

export default models.EstudioMercado || model('EstudioMercado', EstudioMercadoSchema)