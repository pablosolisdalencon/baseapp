import mongoose from 'mongoose';

const ProyectoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
});

export default mongoose.models.Item || mongoose.model('Proyecto', ItemSchema);