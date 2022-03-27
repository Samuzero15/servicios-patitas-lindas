const express = require('express');
const router = express.Router();
const Entrada = require('../../models/entrada');
const Mascota = require('../../models/mascota');

// Obten todas las entradas del todos los historiales.
router.get("/", async (req, res) => {
    try {
        res.json(await Entrada.find());
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Todo el historial de la mascota.
router.get("/:mascota", getMascota, async (req, res) => {
    try {
        res.json(await Entrada.find({mascota: res.mascota}));
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Insertar una entrada al historial.
router.post("/:mascota", getMascota, async (req, res) => {
    datosEntrada = new Entrada({
        mascota:        req.params.mascota,
        descripcion:    req.body.descripcion,
        evento:         req.body.evento,
        medico:         req.body.medico
    });
    res.mascota.historial.push(datosEntrada._id);
    try {
        await res.mascota.save();
        res.status(201).json(await datosEmpleado.save());
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Lee la entrada del historial de la mascota
router.get("/:mascota/:id", getMascota, getEntrada, (req, res) => {
    res.send(res.entrada);
});

// Editar la entrada del historial.
router.patch("/:mascota/:id", getMascota, getEntrada, (req, res) => {
    const cambiosEntrada = editar(res.entrada, req.body);
    try {
        res.status(202).json(await  cambiosEntrada.save());
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Eliminar la entrada del historial.
router.delete("/:mascota/:id", getMascota, getEntrada, async (req, res) => {
    try {
        res.mascota.historial.filter((v) => {v != res.entrada._id});
        await res.entrada.remove();
        res.json({message: "Entrada eliminada."});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

function editar(actual, edicion){
    // (Si existe, usa este) ?? (Si es nulo, usa este)
    actual.descripcion  = edicion.descripcion ?? actual.descripcion;
    actual.evento       = edicion.evento      ?? actual.evento;
    actual.medico       = edicion.medico      ?? actual.medico;
    return actual;
}

async function getMascota(req, res, proceed) {
    let mascota;
    if(req.params.id == "*") {proceed(); return;}
    try {
        mascota = await Mascota.findById(req.params.id);
        if(mascota == null){
            return res.status(404).json({message: "La mascota no existe en la base de datos."});
        }
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
    res.mascota = mascota;
    proceed();
}

async function getEntrada(req, res, proceed) {
    let entrada;
    if(req.params.id == "*") {proceed(); return;}
    try {
        entrada = await Entrada.findById(req.params.id);
        if(entrada == null){
            return res.status(404).json({message: "La entrada del historial no existe en la base de datos."});
        }
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
    res.entrada = entrada;
    proceed();
}

module.exports = router;