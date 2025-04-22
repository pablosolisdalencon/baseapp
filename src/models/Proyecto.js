import {Schema, model, models} from 'mongoose';

const proyectoSchema = new Schema({
  nombre: {
    type: String,
    required: [true,'El nombre del proyecto es requerido'],
  },
  descripcion: {
    type: String,
    required: [true,'La descripcion del proyecto es requerido'],
  },
  mision: {
    type: String,
    required: [true,'La mision del proyecto es requerido'],
  },
  vision: {
    type: String,
    required: [true,'El vision del proyecto es requerido'],
  },
  logo: {
    type: String,
    required: [true,'El logo del proyecto es requerido'],
  },
  texto: {
    type: String,
    required: [true,'El texto del proyecto es requerido'],
  },
  frase: {
    type: String,
    required: [true,'La frase del proyecto es requerido'],
  },
  fondo: {
    type: String,
    required: [true,'El fondo de la eWaveApp del proyecto es requerido'],
  },
  user: {
    type: String,
    required: [true,'El dueño del proyecto es requerido'],
  },
  fono: {
    type: String,
    required: [true, 'El fono del proyecto es requerido'],
  },
  mail: {
    type: String,
    required: [true,'El mail de contacto del proyecto es requerido'],
  },
});

export default models.Proyecto || model('Proyecto', proyectoSchema)