// src/app/models/UserToken.js
import mongoose from 'mongoose';

const UserTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    tokens: {
        type: Number,
        required: true,
        default: 100 // Tokens iniciales por defecto
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const UserToken = mongoose.models.UserToken || mongoose.model('UserToken', UserTokenSchema);
export default UserToken;