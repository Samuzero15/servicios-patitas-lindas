const mongoose = require('mongoose');

const mascotaSchema = new mongoose.Schema({
    tipo: {
        type: "String",
        required: true
    },
    raza: {
        type: "String",
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    fecha_encontrado:{
        type: Date,
        required: true,
        default: Date.now()
    },
    sexo: {
        type: String,
        required: true
    },
    estatura: {
        type: Number,
        required: true
    },
    ubicacion: {
        type: Array,
        required: true,
        default: [30.0, 32.2]
    },
    encontrado_por: {
        type: String,
        required: true
    },
    historial: {
        type: Array,
        default: []
    },posiblesDuenos: {
        type: Array,
        default: []
    },duenoActual: {
        type: mongoose.ObjectId,
        default: null
    }
});

module.exports = mongoose.model("Mascotas", mascotaSchema);