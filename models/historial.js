const mongoose = require('mongoose');

const entradaHistorialMedicoSchema = mongoose.Schema({
    fecha: {
        type: "Date",
        default: Date.now()
    },mascota: {
        type: "ObjectId",
        default: {}
    },titulo_evento: {
        type: "String",
        required: true
    },desc_evento:{
        type: "String",
        required: true
    },medico_tratante: {
        type: "ObjectId",
        default: null
    }
});

module.exports = mongoose.model("Historiales", entradaHistorialMedicoSchema);