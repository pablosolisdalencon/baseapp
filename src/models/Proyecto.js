import {Schema, model, models} from 'mongoose';

const proyectoSchema = new Schema({
  nombre: {
    type: String,
    required: [true,'El nombre del proyecto es requerido'],
  },
  descripcion: {
    type: String,
    required: [true,'El nombre del proyecto es requerido'],
  },
  mision: {
    type: String,
    required: [true,'El nombre del proyecto es requerido'],
  },
  vision: {
    type: String,
    required: [true,'El nombre del proyecto es requerido'],
  },
  logo: {
    type: String,
    required: [true,'El nombre del proyecto es requerido'],
  },
});

export default models.Proyecto || model('Proyecto', proyectoSchema)