const mongoose = require('mongoose');

const adopcionSchema = mongoose.Schema({
    fecha: {
        type: "Date",
        required: true,
        default: Date.now()
    },
    mascotaAdoptada: {
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
    supervisadoPor:{
        type: "ObjectId",
        default: null
    }   
});

module.exports = mongoose.model("Adopciones", mascotaSchema);