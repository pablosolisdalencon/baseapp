import {model, models} from 'mongoose';
// models/CampaniaMarketing.js
const mongoose = require('mongoose');


// Sub-esquema para definicion_arte
const DefinicionArteSchema = new mongoose.Schema({
  estilo_narracion: {
    type: String,
    required: true,
    trim: true
  },
  colores: {
    type: String,
    required: true,
    trim: true
  },
  grafica_representativa_campania: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false }); // _id: false para subdocumentos si no necesitan un ID propio en la base de datos

// Sub-esquema para post
const PostSchema = new mongoose.Schema({
  objetivo: {
    type: String,
    required: true,
    trim: true
  },
  definicion_arte: {
    type: String,
    required: true,
    trim: true
  },
   titulo: {
    type: String,
    required: true,
    trim: true
  },
  tema: {
    type: String,
    required: true,
    trim: true
  },
  texto: {
    type: String,
    required: true,
    trim: true
  },
  cta: {
    type: String,
    required: true,
    trim: true
  },
  imagen: {
    type: String,
    required: true,
    trim: true
  },
  hora: {
    type: String, // Podrías usar String para HH:MM o Date para almacenar la hora completa
    required: true,
    trim: true
  },
  canal: {
    type: String,
    required: true,
    trim: true
  },
  estado: {
    type: String,
    required: true,
    trim: true
  },
  fundamento: {
    type: String,
    required: true,
    trim: true
  },
  recomendacion_creacion: {
    type: String,
    required: true,
    trim: true
  },
  recomendacion_publicacion_seguimiento: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Sub-esquema para dia
const DiaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date, // Usamos Date para el formato de fecha
    required: true
  },
  post: { // post es un objeto, no un array de objetos
    type: PostSchema,
    required: true
  }
}, { _id: false });

// Sub-esquema para semana
const SemanaSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true
  },
  dias: {
    type: [DiaSchema], // Array de objetos DiaSchema
    required: true
  }
}, { _id: false });

// Esquema principal para JsonFinalCampania
const CampaniaMarketingSchema = new mongoose.Schema({
  id_proyecto: {
    type: String,
    required: true
    },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  objetivo: {
    type: String,
    required: true,
    trim: true
  },
  target: {
    type: String,
    required: true,
    trim: true
  },
  tematica: {
    type: String,
    required: true,
    trim: true
  },
  definicion_arte: {
    type: DefinicionArteSchema,
    required: true
  },
  duracion: {
    type: Number,
    required: true
  },
  fecha_inicio: {
    type: Date,
    required: true
  },
  fecha_fin: {
    type: Date,
    required: true
  },
  contenido: {
    type: [SemanaSchema], // Array de objetos SemanaSchema
    required: true
  }
});

// Exporta el modelo

export default models.CampaniaMarketing || model('CampaniaMarketing', CampaniaMarketingSchema)