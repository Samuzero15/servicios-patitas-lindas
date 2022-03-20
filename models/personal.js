const mongoose = require('mongoose');

const personalSchema = mongoose.Schema({
    cedula: {
        type: "String",
        required: true
    },nombres: {
        type: "String",
        required: true
    },apellidos: {
        type: "String",
        required: true
    },cargo: {
        type: "String",
        required: true
    }
});

module.exports = mongoose.model("Personal", personalSchema);