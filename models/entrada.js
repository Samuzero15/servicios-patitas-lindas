const mongoose = require('mongoose');

const entradaHistorialMedicoSchema = mongoose.Schema({
    mascota: {
        type: "ObjectId",
        required: true
    },fecha: {
        type: "Date",
        default: Date.now()
    },descripcion:{
        type: "String",
        required: true
    },evento: {
        type: "String",
        required: true
    },medico: {
        type: "ObjectId",
        default: null
    }
});

module.exports = mongoose.model("Historiales", entradaHistorialMedicoSchema);