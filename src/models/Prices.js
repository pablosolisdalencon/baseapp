// src/app/models/Prices.js
import mongoose from 'mongoose';

const PricingSchema = new mongoose.Schema({
    actionName: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0.01 // El precio debe ser al menos 0.01
    }
});

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);
export default Pricing;