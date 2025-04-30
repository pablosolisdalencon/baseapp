import {Schema, model, models} from 'mongoose';

const itemSchema = new Schema({
    id_proyecto: {
        type: String,
        required: [true,'El id del proyecto es requerido'],
      },
  nombre: {
    type: String,
    required: [true,'El nombre del proyecto es requerido'],
  },
  descripcion: {
    type: String,
    required: [true,'El descripcion del proyecto es requerido'],
  },
  precio: {
    type: String,
    required: [true,'El precio del proyecto es requerido'],
  },
  foto: {
    type: String,
    required: [true,'El foto del proyecto es requerido'],
  },
});

export default models.ItemCatalogo || model('ItemCatalogo', itemSchema)