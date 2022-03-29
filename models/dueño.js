const mongoose = require('mongoose');

const duenoSchema = mongoose.Schema({
    fecha: {
        type: "Date",
        default: Date.now()
    },cedula: {
        type: "String",
        required: true
    },nombres: {
        type: "String",
        required: true
    },apellidos: {
        type: "String",
        required: true
    },telefono: {
        type: "String",
        required: true
    },mascota: { // Para la mascota con la que se asocie el dueño.
        type: "ObjectID",
        default: null
    }
});

module.exports = mongoose.model("Duenos", duenoSchema);