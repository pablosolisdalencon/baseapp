import {Schema, model, models} from 'mongoose';


// --- Sub-esquemas para los tipos anidados ---

// Esquema para ObjetivoGeneral
const ObjetivoGeneralSchema = new Schema({
  
  nombre: {
    type: String,
    required: [true, "El nombre del objetivo es requerido."],
    trim: true,
    maxlength: [100, "El nombre del objetivo no puede exceder los 100 caracteres."]
  },
  descripcion: {
    type: String,
    required: [true, "La descripción del objetivo es requerida."],
    trim: true,
    maxlength: [500, "La descripción del objetivo no puede exceder los 500 caracteres."]
  },
  metricas_clave: {
    type: [String], // Array de strings
    default: [],
    // Puedes añadir validación para cada string si es necesario, ej.
    // validate: {
    //   validator: (v) => Array.isArray(v) && v.every(item => typeof item === 'string' && item.length > 0),
    //   message: 'Las métricas clave deben ser un array de strings no vacíos.'
    // }
  }
}, { _id: false }); // _id: false si estos subdocumentos no necesitan un ID propio en la base de datos

// Esquema para AnalisisMercadoTarget
const AnalisisMercadoTargetSchema = new Schema({
  base_estudio_mercado: {
    type: String,
    required: [true, "La referencia al estudio de mercado es requerida."],
    trim: true,
    maxlength: [250, "La referencia al estudio de mercado no puede exceder los 250 caracteres."]
  },
  identificacion_target: {
    type: String,
    required: [true, "La identificación del target es requerida."],
    trim: true,
    maxlength: [250, "La identificación del target no puede exceder los 250 caracteres."]
  }
}, { _id: false });

// Esquema para PilarEstrategico
const PilarEstrategicoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre del pilar es requerido."],
    trim: true,
    maxlength: [100, "El nombre del pilar no puede exceder los 100 caracteres."]
  },
  descripcion: {
    type: String,
    required: [true, "La descripción del pilar es requerida."],
    trim: true,
    maxlength: [500, "La descripción del pilar no puede exceder los 500 caracteres."]
  },
  canales_principales: {
    type: [String], // Array de strings
    default: []
  }
}, { _id: false });

// Esquema para CanalYTacticaInicial
const CanalYTacticaInicialSchema = new Schema({
  canal: {
    type: String,
    required: [true, "El nombre del canal es requerido."],
    trim: true,
    maxlength: [100, "El nombre del canal no puede exceder los 100 caracteres."]
  },
  tacticas: {
    type: [String], // Array de strings
    default: []
  }
}, { _id: false });

// Esquema para PlanDeAccionFase1Item
const PlanDeAccionFase1ItemSchema = new Schema({
  dia: {
    type: String,
    required: [true, "El día y semana de la acción es requerido."],
    trim: true,
    maxlength: [50, "El día no puede exceder los 50 caracteres."]
  },
  descripcion: {
    type: String,
    required: [true, "La descripción de la acción es requerida."],
    trim: true,
    maxlength: [500, "La descripción de la acción no puede exceder los 500 caracteres."]
  },
  responsable: {
    type: String,
    required: [true, "El responsable de la acción es requerido."],
    trim: true,
    maxlength: [100, "El responsable no puede exceder los 100 caracteres."]
  }
}, { _id: false });

// --- Esquema Principal para EstrategiaMarketing ---

const EstrategiaMarketingSchema = new Schema({
  id_proyecto: {
    type: String,
    required: true,
    description: "valor de _id en INFORMACION PROYECTO"
  },
  nombre_estrategia: {
    type: String,
    required: [true, "El nombre de la estrategia es requerido."],
    trim: true,
    minlength: [3, "El nombre de la estrategia debe tener al menos 3 caracteres."],
    maxlength: [200, "El nombre de la estrategia no puede exceder los 200 caracteres."]
  },
  objetivos_generales: {
    type: [ObjetivoGeneralSchema], // Array de subdocumentos
    default: [],
    required: [true, "Los objetivos generales son requeridos."]
  },
  analisis_mercado_target: {
    type: AnalisisMercadoTargetSchema, // Subdocumento único
    required: [true, "El análisis de mercado y target es requerido."]
  },
  pilares_estrategicos: {
    type: [PilarEstrategicoSchema], // Array de subdocumentos
    default: [],
    required: [true, "Los pilares estratégicos son requeridos."]
  },
  canales_y_tacticas_iniciales: {
    type: [CanalYTacticaInicialSchema], // Array de subdocumentos
    default: [],
    required: [true, "Los canales y tácticas iniciales son requeridos."]
  },
  plan_de_accion_fase_1: {
    type: [PlanDeAccionFase1ItemSchema], // Array de subdocumentos
    default: [],
    required: [true, "El plan de acción de la fase 1 es requerido."]
  },
  consideraciones_adicionales: {
    type: [String], // Array de strings
    default: [],
    required: [true, "Las consideraciones adicionales son requeridas."]
  }
}, {
  timestamps: true // Añade campos `createdAt` y `updatedAt` automáticamente
});

export default models.EstrategiaMarketing || model('EstrategiaMarketing', EstrategiaMarketingSchema)