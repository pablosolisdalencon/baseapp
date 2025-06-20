// src/app/models/TokenOperation.js
import mongoose from 'mongoose';

const TokenOperationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    action: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    operationType: { // 'use' o 'revert'
        type: String,
        required: true,
        enum: ['use', 'revert']
    },
    status: { // 'completed', 'reverted', 'pending'
        type: String,
        required: true,
        enum: ['completed', 'reverted', 'pending'],
        default: 'completed'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const TokenOperation = mongoose.models.TokenOperation || mongoose.model('TokenOperation', TokenOperationSchema);
export default TokenOperation;