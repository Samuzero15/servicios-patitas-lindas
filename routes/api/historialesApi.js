const express = require('express');
const router = express.Router();
const Entrada = require('../../models/entrada');
const mids = require('./middlewares');

// Obten todas las entradas del todos los historiales.

router.get("/eventos", async (req, res) => {
    try {
        res.json({
            "D": "Diagnostico",
            "T": "Tratamiento",
            "C": "Cuidado",
            "V": "Vacuna",
            "E": "Entrenamiento"
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get("/", async (req, res) => {
    try {
        res.json(await Entrada.find());
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Todo el historial de la mascota.
router.get("/:mascota", mids.getMascota, async (req, res) => {
    try {
        res.json(await Entrada.find({mascota: res.mascota}));
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Insertar una entrada al historial.
router.post("/:mascota", mids.getMascota, async (req, res) => {
    datosEntrada = new Entrada({
        mascota:        req.params.mascota,
        descripcion:    req.body.descripcion,
        evento:         req.body.evento,
        medico:         req.body.medico
    });
    res.mascota.historial.push(datosEntrada._id);
    try {
        await res.mascota.save();
        res.status(201).json(await datosEntrada.save());
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Lee la entrada del historial de la mascota
router.get("/:mascota/:id", mids.getMascota, mids.getEntrada, (req, res) => {
    res.send(res.entrada);
});

// Editar la entrada del historial.
router.patch("/:mascota/:id", mids.getMascota, mids.getEntrada, async (req, res) => {
    const cambiosEntrada = editar(res.entrada, req.body);
    try {
        console.log(cambiosEntrada);
        res.status(202).json(await cambiosEntrada.save());
    } catch (error) {
        console.log("sex");
        res.status(400).json({message: error.message});
    }
});

// Eliminar la entrada del historial.
router.delete("/:mascota/:id", mids.getMascota, mids.getEntrada, async (req, res) => {
    try {
        if(req.params.mascota == "*"){
            await Entrada.deleteMany();
            res.json({message: "Entradas de todos los historiales eliminados."});
        }else{
            let historial_nuevo = res.mascota.historial.filter(v => {
                return !v.equals(res.entrada._id);
            });
            res.mascota.historial = historial_nuevo;
            await res.mascota.save();
            await res.entrada.remove();
            res.json({message: "Entrada eliminada."});
        }
        
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

module.exports = router;