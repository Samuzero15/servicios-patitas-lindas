const mongoose = require('mongoose');

const adopcionSchema = mongoose.Schema({
    fecha: {
        type: "Date",
        required: true,
        default: Date.now()
    },
    mascota: { // mascota
        type: "ObjectId",
        required: true,
        default: null
    },
    cedula:{
        type: "String",
        required: true
    },
    nombres:{
        type: "String",
        required: true
    },
    apellidos:{
        type: "String",
        required: true
    },
    supervisadoPor:{ // empleado
        type: "ObjectId",
        default: null
    },
    estado:{
        type: "String",
        required: true
    }
});

module.exports = mongoose.model("Adopciones", mascotaSchema);